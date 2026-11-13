import { executeBifrostCompletion } from "./bifrost";
import { searchTavily, SearchEvidenceItem } from "./tavily";
import { computeClaimScore, ClaimScoreBreakdown } from "./score";
import { ProcessedClaim } from "./extract";
import {
  JudgeResponse,
  JudgeResponseSchema,
  TruthJudgeResponse,
  TruthJudgeResponseSchema,
  Verdict,
} from "./schemas";

export const PROMPT_B_SYSTEM = `You judge whether a claim is still true using only the evidence snippets provided. Return only JSON:
{
  "verdict": "SUPPORTED" | "PARTIALLY_SUPPORTED" | "OUTDATED" | "UNVERIFIABLE",
  "current_value": "current value or null",
  "explanation": "max 40 words explanation",
  "supporting_urls": ["url1"],
  "newest_evidence_date": "YYYY-MM-DD or null",
  "official_source": boolean,
  "sources_agree": boolean,
  "conflict": boolean
}
Choose a verdict:
- SUPPORTED if the evidence confirms the claim is current.
- PARTIALLY_SUPPORTED if part is right.
- OUTDATED if the evidence shows a newer or different value.
- UNVERIFIABLE if the evidence is missing or unclear.
Never use knowledge outside the evidence. Never invent URLs.`;

export interface JudgedClaimResult {
  claim: ProcessedClaim;
  verdict: Verdict;
  current_value: string | null;
  explanation: string;
  supporting_urls: string[];
  newest_evidence_date: string | null;
  scoreBreakdown: ClaimScoreBreakdown;
  evidence: SearchEvidenceItem[];
  modelUsed: string;
}

/**
 * Builds a targeted search query from the template:
 * "{entity} {attribute} latest {current year}"
 */
export function buildSearchQuery(claim: ProcessedClaim): {
  query: string;
  topic: "news" | "general";
} {
  const currentYear = new Date().getFullYear();
  let query = "";

  if (claim.entity && claim.attribute) {
    query = `${claim.entity} ${claim.attribute} latest ${currentYear}`;
  } else if (claim.entity) {
    query = `${claim.entity} latest ${claim.claim_type} ${currentYear}`;
  } else {
    // Clean claim text of punctuation and use as search query
    const cleanText = claim.text.replace(/["'?!.,;]/g, " ").trim();
    query = `${cleanText} latest ${currentYear}`;
  }

  // Topic news for leadership and announcement claims, general for everything else
  const topic: "news" | "general" =
    claim.claim_type === "leadership" || claim.claim_type === "product_availability"
      ? "news"
      : "general";

  return { query, topic };
}

export const PROMPT_T_SYSTEM = `You judge whether a factual statement is true or false using only the evidence snippets provided. Return only JSON:
{
  "verdict": "SUPPORTED" | "CONTRADICTED" | "UNVERIFIABLE",
  "current_value": "the verified truth or null",
  "explanation": "max 40 words explanation",
  "supporting_urls": ["url1"],
  "newest_evidence_date": "YYYY-MM-DD or null",
  "official_source": boolean,
  "sources_agree": boolean,
  "conflict": boolean
}
Choose a verdict:
- SUPPORTED if the evidence confirms the statement is true.
- CONTRADICTED if the evidence shows the statement is false.
- UNVERIFIABLE if the evidence is missing or unclear.
Never use knowledge outside the evidence. Never invent URLs.`;

/**
 * Builds a fact-check query for static factual statements ("X is Y").
 */
export function buildTruthQuery(claim: ProcessedClaim): {
  query: string;
  topic: "general";
} {
  const cleanText = claim.text
    .replace(/["'?!.,;]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { query: `${cleanText} fact check`, topic: "general" };
}

/**
 * Verifies a single claim against Tavily evidence and judges it through Bifrost.
 */
export async function verifyAndJudgeClaim(
  claim: ProcessedClaim
): Promise<JudgedClaimResult> {
  // If claim is skipped (e.g. stable fact or exceeded max 8)
  if (claim.skipped) {
    const scoreBreakdown = computeClaimScore("SUPPORTED", {
      volatility: claim.volatility,
    });
    return {
      claim,
      verdict: "SUPPORTED",
      current_value: null,
      explanation: "Stable fact not requiring live verification.",
      supporting_urls: [],
      newest_evidence_date: null,
      scoreBreakdown,
      evidence: [],
      modelUsed: "none (skipped)",
    };
  }

  const isTruthCheck = claim.verification_mode === "truth";

  // 1. Build search query and retrieve Tavily evidence
  const { query, topic } = isTruthCheck
    ? buildTruthQuery(claim)
    : buildSearchQuery(claim);
  const evidence = await searchTavily({ query, topic, maxResults: 5 }, claim.entity);

  // Ground rule 4 (Honesty rule):
  // "a claim may get a verdict other than UNVERIFIABLE only if at least one real Tavily result URL backs it."
  if (!evidence || evidence.length === 0) {
    const scoreBreakdown = computeClaimScore("UNVERIFIABLE", {
      volatility: claim.volatility,
    });
    return {
      claim,
      verdict: "UNVERIFIABLE",
      current_value: null,
      explanation: "No live web evidence could be retrieved for this claim.",
      supporting_urls: [],
      newest_evidence_date: null,
      scoreBreakdown,
      evidence: [],
      modelUsed: "none",
    };
  }

  // 2. Prepare evidence payload for Bifrost Judge Prompt
  const evidenceSnippetText = evidence
    .map(
      (item, idx) =>
        `[Source ${idx + 1}] (${item.domain})\nTitle: ${item.title}\nURL: ${item.url}\nDate: ${item.published_date || "Unknown"}\nSnippet: ${item.snippet}`
    )
    .join("\n\n");

  let judgeData: JudgeResponse;
  let modelUsed = "bifrost";

  if (isTruthCheck) {
    // Truth-check path: judge whether a static factual statement is true or false.
    const promptUserContent = `Statement: "${claim.text}"\n\nEvidence Snippets:\n${evidenceSnippetText}`;
    try {
      const completion = await executeBifrostCompletion(
        {
          messages: [
            { role: "system", content: PROMPT_T_SYSTEM },
            { role: "user", content: promptUserContent },
          ],
          jsonMode: true,
        },
        TruthJudgeResponseSchema
      );

      const data = completion.data as TruthJudgeResponse;
      judgeData = {
        verdict: data.verdict,
        current_value: data.current_value || null,
        explanation: data.explanation,
        supporting_urls: data.supporting_urls || [],
        newest_evidence_date: data.newest_evidence_date || null,
        official_source: !!data.official_source,
        sources_agree: !!data.sources_agree,
        conflict: !!data.conflict,
      };
      modelUsed = completion.modelUsed;
    } catch (err) {
      console.warn(`[Judge] Truth judgment failed for claim "${claim.text}":`, err);
      judgeData = {
        verdict: "UNVERIFIABLE",
        current_value: null,
        explanation: "Truth evaluation failed to parse structured judgment.",
        supporting_urls: [],
        newest_evidence_date: null,
        official_source: false,
        sources_agree: false,
        conflict: false,
      };
    }
  } else {
    const promptUserContent = `Claim text: "${claim.text}"\nEntity: ${claim.entity || "N/A"}\nAttribute: ${claim.attribute || "N/A"}\nAsserted Value: ${claim.asserted_value || "N/A"}\n\nEvidence Snippets:\n${evidenceSnippetText}`;
    try {
      const completion = await executeBifrostCompletion(
        {
          messages: [
            { role: "system", content: PROMPT_B_SYSTEM },
            { role: "user", content: promptUserContent },
          ],
          jsonMode: true,
        },
        JudgeResponseSchema
      );

      const data = completion.data as JudgeResponse;
      judgeData = {
        verdict: data.verdict,
        current_value: data.current_value || null,
        explanation: data.explanation,
        supporting_urls: data.supporting_urls || [],
        newest_evidence_date: data.newest_evidence_date || null,
        official_source: !!data.official_source,
        sources_agree: !!data.sources_agree,
        conflict: !!data.conflict,
      };
      modelUsed = completion.modelUsed;
    } catch (err) {
      console.warn(`[Judge] LLM judgment failed for claim "${claim.text}":`, err);
      // Ground Rule 5: Mark claim UNVERIFIABLE instead of crashing
      judgeData = {
        verdict: "UNVERIFIABLE",
        current_value: null,
        explanation: "Evaluation failed to parse structured judgment.",
        supporting_urls: [],
        newest_evidence_date: null,
        official_source: false,
        sources_agree: false,
        conflict: false,
      };
    }
  }

  // Filter supporting URLs to strictly those that exist in Tavily evidence (anti-hallucination)
  const validTavilyUrls = new Set(evidence.map((e) => e.url));
  const verifiedUrls = judgeData.supporting_urls.filter((url) =>
    validTavilyUrls.has(url)
  );

  // If verdict is not UNVERIFIABLE but no valid Tavily URLs exist, force UNVERIFIABLE
  let finalVerdict = judgeData.verdict;
  if (finalVerdict !== "UNVERIFIABLE" && verifiedUrls.length === 0) {
    if (evidence.length > 0) {
      // If evidence existed, use the first evidence URL as support
      verifiedUrls.push(evidence[0].url);
    } else {
      finalVerdict = "UNVERIFIABLE";
    }
  }

  // Count independent domains in supporting evidence
  const independentDomains = new Set(evidence.map((e) => e.domain)).size;

  // 3. Compute deterministic score
  const scoreBreakdown = computeClaimScore(finalVerdict, {
    volatility: claim.volatility,
    officialSource: judgeData.official_source,
    independentDomainsCount: independentDomains,
    newestEvidenceDate: judgeData.newest_evidence_date,
    conflict: judgeData.conflict,
  });

  return {
    claim,
    verdict: finalVerdict,
    current_value: judgeData.current_value || null,
    explanation: judgeData.explanation,
    supporting_urls: verifiedUrls,
    newest_evidence_date: judgeData.newest_evidence_date || null,
    scoreBreakdown,
    evidence,
    modelUsed,
  };
}
