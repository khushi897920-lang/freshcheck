"use client";

import { useState, useEffect } from "react";
import { SidebarLeft } from "@/components/SidebarLeft";
import { CenterWorkspace } from "@/components/CenterWorkspace";
import { SidebarRight } from "@/components/SidebarRight";
import { EvidenceDrawer, DrawerClaimData } from "@/components/EvidenceDrawer";
import { PipelineStep } from "@/components/ProgressSteps";
import { SampleAnswer, SAMPLE_ANSWERS } from "@/data/samples";

export default function FreshCheckApp() {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [answerDate, setAnswerDate] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [step, setStep] = useState<PipelineStep>("idle");
  const [claims, setClaims] = useState<DrawerClaimData[]>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [summaryCounts, setSummaryCounts] = useState<{
    fresh: number;
    uncertain: number;
    stale: number;
    skipped: number;
  } | null>(null);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [tavilyCreditsUsed, setTavilyCreditsUsed] = useState<number>(0);
  const [selectedClaim, setSelectedClaim] = useState<DrawerClaimData | null>(null);
  const [checkId, setCheckId] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  // Responsive sidebar visibility state
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const fetchHistory = async (activeSessionId?: string) => {
    const sid = activeSessionId || sessionId;
    try {
      setIsLoadingHistory(true);
      const url = sid ? `/api/check?limit=30&sessionId=${encodeURIComponent(sid)}` : "/api/check?limit=30";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.checks || []);
      }
    } catch (e) {
      console.warn("Failed to load check history", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    let sid = "";
    if (typeof window !== "undefined") {
      setIsLeftSidebarOpen(window.innerWidth >= 1024);
      // Keep right sidebar closed on laptops/tablets by default so workspace remains spacious and rock solid
      setIsRightSidebarOpen(window.innerWidth >= 1536);
      sid = localStorage.getItem("freshcheck_session_id") || "";
      if (!sid) {
        sid = "user_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        localStorage.setItem("freshcheck_session_id", sid);
      }
      setSessionId(sid);
    }
    fetchHistory(sid);
  }, []);

  const handleToggleLeftSidebar = () => setIsLeftSidebarOpen((prev) => !prev);
  const handleToggleRightSidebar = () => setIsRightSidebarOpen((prev) => !prev);

  const handleSelectCheck = async (id: string) => {
    try {
      setIsChecking(true);
      setErrorMessage(null);
      const res = await fetch(`/api/check/${id}`);
      if (!res.ok) {
        throw new Error("Could not load past verification report.");
      }
      const data = await res.json();
      setCheckId(data.id);
      setSubmittedText(data.input_text || "");
      setText("");
      setAnswerDate(data.answer_date || "");
      setOverallScore(data.overall_score ?? null);
      setFallbackUsed(data.fallback_used ?? false);

      const mappedClaims: DrawerClaimData[] = (data.claims || []).map((c: any, idx: number) => {
        const score =
          c.score_breakdown?.finalScore ??
          c.freshness_score ??
          (c.verdict === "OUTDATED" ? 20 : c.verdict === "SUPPORTED" ? 90 : c.verdict === "PARTIALLY_SUPPORTED" ? 50 : 45);

        const scoreBreakdown = c.score_breakdown || {
          baseScore: score,
          officialSourceBonus: c.evidence?.some((e: any) => e.is_official) ? 15 : 0,
          multiDomainBonus: 0,
          stalenessPenalty: c.verdict === "OUTDATED" ? 30 : 0,
          conflictPenalty: 0,
          finalScore: score,
          label: score >= 75 ? "Fresh" : score >= 40 ? "Uncertain" : "Stale",
        };

        return {
          id: c.id,
          idx: c.idx ?? idx,
          text: c.text,
          claim_type: c.claim_type,
          volatility: c.volatility,
          entity: c.entity,
          attribute: c.attribute,
          verification_mode: c.verification_mode ?? "freshness",
          skipped: c.skipped,
          verdict: c.verdict || (c.skipped ? "SUPPORTED" : null),
          current_value: c.current_value,
          explanation: c.explanation,
          supporting_urls: c.evidence?.map((e: any) => e.url) || [],
          scoreBreakdown,
          evidence: c.evidence || [],
          start: c.start_offset ?? c.start,
          end: c.end_offset ?? c.end,
        };
      });
      setClaims(mappedClaims);

      const active = mappedClaims.filter((c) => !c.skipped);
      setSummaryCounts({
        fresh: active.filter((c) => (c.scoreBreakdown?.finalScore ?? 0) >= 75).length,
        uncertain: active.filter(
          (c) => (c.scoreBreakdown?.finalScore ?? 0) >= 40 && (c.scoreBreakdown?.finalScore ?? 0) < 75
        ).length,
        stale: active.filter((c) => (c.scoreBreakdown?.finalScore ?? 0) < 40).length,
        skipped: mappedClaims.filter((c) => c.skipped).length,
      });

      setStep("done");
    } catch (err: any) {
      console.error("Failed to load historical check:", err);
      setErrorMessage(err.message || "Failed to load check.");
      setStep("idle");
    } finally {
      setIsChecking(false);
    }
  };

  const handleDeleteCheck = async (id: string) => {
    try {
      await fetch(`/api/check/${id}`, { method: "DELETE" });
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (checkId === id) {
        handleNewCheck();
      }
    } catch (e) {
      console.warn("Failed to delete check", e);
    }
  };

  const handleNewCheck = () => {
    setText("");
    setSubmittedText("");
    setAnswerDate("");
    setClaims([]);
    setOverallScore(null);
    setSummaryCounts(null);
    setErrorMessage(null);
    setResultMessage(null);
    setModelUsed(null);
    setTavilyCreditsUsed(0);
    setSelectedClaim(null);
    setCheckId(null);
    setStep("idle");
    window.history.replaceState(null, "", "/");
  };

  const handleSelectSample = (sample: SampleAnswer) => {
    setText(sample.text);
    setSubmittedText("");
    if (sample.answerDate) {
      setAnswerDate(sample.answerDate);
    }
    setErrorMessage(null);
    setOverallScore(null);
    setSummaryCounts(null);
    setClaims([]);
  };

  const handleLoadBenchmark = (type: string) => {
    const found = SAMPLE_ANSWERS.find((s) => s.id === type);
    if (found) {
      handleSelectSample(found);
    } else if (type === "sebi-regulations") {
      handleSelectSample({
        id: "sebi-regulations",
        title: "Compliance & Regulations",
        category: "pricing_and_models",
        text: "Under the SEBI BRSR Core guidelines for FY2026, assurance is voluntary for top 1000 listed entities, and the global CSRD reporting standard has been indefinitely delayed.",
        answerDate: "2023-01-01",
      });
    }
  };

  const handleCheckFreshness = async () => {
    const textToSubmit = text.trim() || submittedText.trim();
    if (!textToSubmit) {
      setErrorMessage("Please enter or paste an AI answer to verify.");
      return;
    }
    if (textToSubmit.length > 4000) {
      setErrorMessage("Text exceeds maximum 4,000 characters limit.");
      return;
    }

    // Save submitted text for the main canvas, and clear the input textarea like ChatGPT!
    setSubmittedText(textToSubmit);
    setText("");

    setIsChecking(true);
    setStep("extracting");
    setErrorMessage(null);
    setResultMessage(null);
    setModelUsed(null);
    setTavilyCreditsUsed(0);
    setOverallScore(null);
    setSummaryCounts(null);
    setClaims([]);

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSubmit,
          answerDate: answerDate || null,
          sessionId: sessionId || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initiate verification stream.");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream available.");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const rawEvent of events) {
          if (!rawEvent.trim()) continue;

          let eventName = "message";
          let dataStr = "";

          const lines = rawEvent.split("\n");
          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventName = line.slice(7).trim();
            } else if (line.startsWith("data: ")) {
              dataStr = line.slice(6).trim();
            }
          }

          if (!dataStr) continue;
          const parsed = JSON.parse(dataStr);

          if (eventName === "question_answered") {
            setSubmittedText(parsed.fullDisplay || `Q: ${parsed.question}\n\nAI Answer: ${parsed.answer}`);
          } else if (eventName === "claims_extracted") {
            setCheckId(parsed.checkId);
            setFallbackUsed(parsed.fallbackUsed || false);
            setStep("searching");

            const initialClaims: DrawerClaimData[] = parsed.claims.map(
              (c: any, idx: number) => ({
                id: c.id,
                idx,
                text: c.text,
                claim_type: c.claim_type,
                volatility: c.volatility,
                entity: c.entity,
                attribute: c.attribute,
                verification_mode: c.verification_mode ?? "freshness",
                skipped: c.skipped,
                verdict: c.skipped ? "SUPPORTED" : null,
                scoreBreakdown: null,
                evidence: [],
                start: c.start ?? c.start_offset,
                end: c.end ?? c.end_offset,
              })
            );
            setClaims(initialClaims);
            setStep("judging");
          } else if (eventName === "claim_verified") {
            setClaims((prev) =>
              prev.map((claim) =>
                claim.id === parsed.claimId
                  ? {
                      ...claim,
                      verdict: parsed.verdict,
                      current_value: parsed.current_value,
                      explanation: parsed.explanation,
                      supporting_urls: parsed.supporting_urls,
                      scoreBreakdown: parsed.scoreBreakdown,
                      evidence: parsed.evidence,
                    }
                  : claim
              )
            );
          } else if (eventName === "done") {
            setStep("scoring");
            setOverallScore(parsed.overallScore);
            setSummaryCounts(parsed.summaryCounts);
            setFallbackUsed(parsed.fallbackUsed || false);
            setResultMessage(parsed.message || null);
            setModelUsed(parsed.modelUsed || null);
            setTavilyCreditsUsed(parsed.tavilyCreditsUsed || 0);
            setStep("done");

            if (parsed.checkId) {
              setCheckId(parsed.checkId);
            }
            fetchHistory(sessionId);
          } else if (eventName === "error") {
            throw new Error(parsed.message || "Pipeline error occurred.");
          }
        }
      }
    } catch (err: any) {
      console.error("Verification failed:", err);
      setErrorMessage(err.message || "An unexpected error occurred during verification.");
      setStep("idle");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full max-w-[100vw] flex flex-row overflow-hidden bg-gradient-to-br from-[#DCE6F5] via-[#E7EDF9] to-[#E3EAF7] select-none">
      {/* Left Sidebar (Warm Oat/Sand #EFECE6) */}
      <SidebarLeft
        isOpen={isLeftSidebarOpen}
        onClose={() => setIsLeftSidebarOpen(false)}
        onNewCheck={handleNewCheck}
        isProcessing={isChecking}
        activeTaskId={checkId || undefined}
        onLoadBenchmark={handleLoadBenchmark}
        history={history}
        onSelectCheck={handleSelectCheck}
        onDeleteCheck={handleDeleteCheck}
        isLoadingHistory={isLoadingHistory}
      />

      {/* Center White Rounded Card Workspace */}
      <CenterWorkspace
        text={text}
        setText={setText}
        submittedText={submittedText}
        answerDate={answerDate}
        setAnswerDate={setAnswerDate}
        isChecking={isChecking}
        step={step}
        claims={claims}
        overallScore={overallScore}
        summaryCounts={summaryCounts}
        fallbackUsed={fallbackUsed}
        errorMessage={errorMessage}
        resultMessage={resultMessage}
        modelUsed={modelUsed}
        tavilyCreditsUsed={tavilyCreditsUsed}
        selectedClaim={selectedClaim}
        onSelectClaim={setSelectedClaim}
        onCheckFreshness={handleCheckFreshness}
        onSelectSample={handleSelectSample}
        onToggleLeftSidebar={handleToggleLeftSidebar}
        onToggleRightSidebar={handleToggleRightSidebar}
        isLeftSidebarOpen={isLeftSidebarOpen}
        isRightSidebarOpen={isRightSidebarOpen}
      />

      {/* Right Sidebar (Soft Crisp Blue #F8FAFD) */}
      <SidebarRight
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
        checkId={checkId}
        overallScore={overallScore}
        claims={claims}
        inputText={submittedText || text}
        onSelectClaim={setSelectedClaim}
        onLoadBenchmark={handleLoadBenchmark}
        onRefresh={checkId ? () => handleSelectCheck(checkId) : undefined}
        fallbackUsed={fallbackUsed}
      />

      {/* Slide-out Evidence Drawer */}
      <EvidenceDrawer
        claim={selectedClaim}
        isOpen={selectedClaim !== null}
        onClose={() => setSelectedClaim(null)}
      />
    </div>
  );
}
