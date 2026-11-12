import { NextRequest, NextResponse } from "next/server";
import { extractClaims } from "@/lib/extract";
import { verifyAndJudgeClaim } from "@/lib/judge";
import { computeOverallScore } from "@/lib/score";
import { createCheck, updateCheck, insertClaims, insertEvidence, listChecks, updateClaim } from "@/lib/db";
import { executeBifrostCompletion } from "@/lib/bifrost";
import { Volatility } from "@/lib/schemas";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

function isQuestionOrQuery(input: string): boolean {
  const trimmed = input.trim();
  if (trimmed.endsWith("?")) return true;
  const lower = trimmed.toLowerCase();
  const interrogatives = [
    "who is", "who was", "who are",
    "what is", "what was", "what are",
    "is ", "are ", "was ", "were ",
    "when was", "when is", "when did",
    "where is", "where was",
    "which is", "which are",
    "how much", "how many",
    "why is", "why did",
    "does ", "did ", "can ", "could "
  ];
  return interrogatives.some((prefix) => lower.startsWith(prefix));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const checks = await listChecks(limit);
    return NextResponse.json({ checks });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch check history" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, answerDate, sessionId } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Pasted text is required." },
        { status: 400 }
      );
    }

    if (text.length > 4000) {
      return NextResponse.json(
        { error: "Text exceeds maximum limit of 4,000 characters." },
        { status: 400 }
      );
    }

    const encoder = new TextEncoder();

    // Create the ReadableStream for Server-Sent Events (SSE)
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        };

        try {
          let targetText = text;
          let generatedAnswer: string | null = null;

          // If the user entered a question, generate an answer via Bifrost first
          if (isQuestionOrQuery(text)) {
            sendEvent("answering_question", { question: text });
            try {
              const answerResult = await executeBifrostCompletion({
                messages: [
                  {
                    role: "system",
                    content:
                      "You are a factual, concise AI assistant. Answer the user's question directly and accurately in 1-2 sentences. Avoid speculation.",
                  },
                  { role: "user", content: text },
                ],
                temperature: 0,
              });
              generatedAnswer = answerResult.rawText.trim();
              targetText = generatedAnswer;

              sendEvent("question_answered", {
                question: text,
                answer: generatedAnswer,
                fullDisplay: `Q: ${text}\n\nAI Answer: ${generatedAnswer}`,
              });
            } catch (err) {
              console.warn("[API Check] Bifrost question answering failed, verifying text directly:", err);
            }
          }

          // 1. Create initial check in database
          const initialCheck = await createCheck({
            session_id: sessionId || null,
            input_text: generatedAnswer ? `Q: ${text}\n\nAI Answer: ${generatedAnswer}` : text,
            answer_date: answerDate || null,
            status: "processing",
            overall_score: null,
            model_used: null,
            fallback_used: false,
            tavily_credits_used: 0,
          });

          // 2. Extract claims via Bifrost
          const extraction = await extractClaims(targetText, answerDate, 8);

          if (extraction.claims.length === 0) {
            // Save final check status
            await updateCheck(initialCheck.id, {
              status: "done",
              overall_score: 100,
              tavily_credits_used: 0,
            });

            sendEvent("done", {
              checkId: initialCheck.id,
              overallScore: 100,
              summaryCounts: { fresh: 0, uncertain: 0, stale: 0, skipped: 0 },
              message: "No time-sensitive claims were detected.",
              modelUsed: extraction.modelUsed,
              fallbackUsed: extraction.fallbackUsed,
              tavilyCreditsUsed: 0,
            });

            controller.close();
            return;
          }

          // Save extracted claims to DB
          const savedClaims = await insertClaims(
            extraction.claims.map((claim, idx) => ({
              check_id: initialCheck.id,
              idx,
              text: claim.text,
              start_offset: claim.start,
              end_offset: claim.end,
              claim_type: claim.claim_type,
              volatility: claim.volatility,
              entity: claim.entity || null,
              attribute: claim.attribute || null,
              asserted_value: claim.asserted_value || null,
              skipped: claim.skipped,
            }))
          );

          // Update check record with model info
          await updateCheck(initialCheck.id, {
            model_used: extraction.modelUsed,
            fallback_used: extraction.fallbackUsed,
          });

          // Stream event: claims_extracted
          sendEvent("claims_extracted", {
            checkId: initialCheck.id,
            claims: savedClaims.map((sc, i) => ({
              ...sc,
              ...extraction.claims[i],
              id: sc.id,
            })),
            modelUsed: extraction.modelUsed,
            fallbackUsed: extraction.fallbackUsed,
          });

          // 3. Verify kept claims with concurrency limit (2) to respect provider token limits
          const concurrencyLimit = 2;
          const claimsToVerify = extraction.claims.map((claim, idx) => ({
            claim,
            dbId: savedClaims[idx]?.id || claim.id,
          }));

          const verifiedResults: Array<{
            score: number;
            volatility: Volatility;
            skipped: boolean;
            verdict: string;
          }> = [];

          let tavilyCreditsUsed = 0;

          // Helper to process a single claim
          const processClaimItem = async (item: (typeof claimsToVerify)[0]) => {
            const judged = await verifyAndJudgeClaim(item.claim);

            if (!item.claim.skipped && judged.evidence.length > 0) {
              tavilyCreditsUsed += 1;
            }

            // Save evidence to DB
            if (judged.evidence.length > 0) {
              await insertEvidence(
                judged.evidence.map((ev) => ({
                  claim_id: item.dbId,
                  url: ev.url,
                  title: ev.title,
                  domain: ev.domain,
                  published_date: ev.published_date,
                  snippet: ev.snippet,
                  is_official: ev.is_official,
                  rank: ev.rank,
                }))
              );
            }

            // Save judged verdicts, scores, and explanations to the claim in DB
            await updateClaim(item.dbId, {
              verdict: item.claim.skipped ? "SUPPORTED" : judged.verdict,
              current_value: judged.current_value,
              explanation: judged.explanation,
              freshness_score: judged.scoreBreakdown.finalScore,
              score_breakdown: judged.scoreBreakdown,
              checked_at: new Date().toISOString(),
            });

            verifiedResults.push({
              score: judged.scoreBreakdown.finalScore,
              volatility: item.claim.volatility,
              skipped: item.claim.skipped,
              verdict: judged.verdict,
            });

            // Stream event: claim_verified (progressive updates)
            sendEvent("claim_verified", {
              claimId: item.dbId,
              verdict: judged.verdict,
              current_value: judged.current_value,
              explanation: judged.explanation,
              supporting_urls: judged.supporting_urls,
              newest_evidence_date: judged.newest_evidence_date,
              scoreBreakdown: judged.scoreBreakdown,
              evidence: judged.evidence,
              skipped: item.claim.skipped,
            });
          };

          // Execute with concurrency batching
          for (let i = 0; i < claimsToVerify.length; i += concurrencyLimit) {
            const batch = claimsToVerify.slice(i, i + concurrencyLimit);
            await Promise.all(batch.map((item) => processClaimItem(item)));
            if (i + concurrencyLimit < claimsToVerify.length) {
              await new Promise((resolve) => setTimeout(resolve, 350));
            }
          }

          // 4. Compute overall answer score and summary counts
          const overallScore = computeOverallScore(verifiedResults);

          const summaryCounts = {
            fresh: verifiedResults.filter((r) => !r.skipped && r.score >= 75).length,
            uncertain: verifiedResults.filter((r) => !r.skipped && r.score >= 40 && r.score < 75).length,
            stale: verifiedResults.filter((r) => !r.skipped && r.score < 40).length,
            skipped: verifiedResults.filter((r) => r.skipped).length,
          };

          // Save final check status
          await updateCheck(initialCheck.id, {
            status: "done",
            overall_score: overallScore,
            tavily_credits_used: tavilyCreditsUsed,
          });

          // Stream event: done
          sendEvent("done", {
            checkId: initialCheck.id,
            overallScore,
            summaryCounts,
            modelUsed: extraction.modelUsed,
            fallbackUsed: extraction.fallbackUsed,
            tavilyCreditsUsed,
          });

          controller.close();
        } catch (err: any) {
          console.error("[API Check] Stream error:", err);
          sendEvent("error", {
            message: err?.message || "An unexpected error occurred during verification.",
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process check request" },
      { status: 500 }
    );
  }
}
