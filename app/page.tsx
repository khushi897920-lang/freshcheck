"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { SampleChips } from "@/components/SampleChips";
import { ProgressSteps, PipelineStep } from "@/components/ProgressSteps";
import { ClaimCard } from "@/components/ClaimCard";
import { AnnotatedAnswer } from "@/components/AnnotatedAnswer";
import { EvidenceDrawer, DrawerClaimData } from "@/components/EvidenceDrawer";
import { ScoreBadge } from "@/components/ScoreBadge";
import { SampleAnswer } from "@/data/samples";
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";

export default function FreshCheckHomePage() {
  const router = useRouter();
  const [text, setText] = useState("");
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
  const [selectedClaim, setSelectedClaim] = useState<DrawerClaimData | null>(null);
  const [checkId, setCheckId] = useState<string | null>(null);

  const handleSelectSample = (sample: SampleAnswer) => {
    setText(sample.text);
    if (sample.answerDate) {
      setAnswerDate(sample.answerDate);
    }
    setErrorMessage(null);
    setOverallScore(null);
    setSummaryCounts(null);
    setClaims([]);
  };

  const handleCheckFreshness = async () => {
    if (!text.trim()) {
      setErrorMessage("Please paste an AI answer to check.");
      return;
    }
    if (text.length > 4000) {
      setErrorMessage("Input exceeds 4,000 characters limit.");
      return;
    }

    setIsChecking(true);
    setStep("extracting");
    setErrorMessage(null);
    setOverallScore(null);
    setSummaryCounts(null);
    setClaims([]);

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          answerDate: answerDate || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start freshness verification");
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

          if (eventName === "claims_extracted") {
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
            setStep("done");

            // Core journey 1 rule 4:
            // "When done, the URL updates to /check/[id] (replace, not push)"
            if (parsed.checkId) {
              window.history.replaceState(null, "", `/check/${parsed.checkId}`);
            }
          } else if (eventName === "error") {
            throw new Error(parsed.message || "An error occurred in the pipeline");
          }
        }
      }
    } catch (err: any) {
      console.error("Verification failed:", err);
      setErrorMessage(err.message || "An unexpected error occurred during check.");
      setStep("idle");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#E6E8EE] flex flex-col font-sans">
      <Navbar fallbackBanner={fallbackUsed} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 space-y-8 w-full">
        {/* Hero Section */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#12151C] border border-[#1F2430] text-[#6366F1]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse" />
            Problem Statement 06 · Tavily × Bifrost
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#E6E8EE]">
            Spell-check for facts that expire.
          </h1>
          <p className="text-sm sm:text-base text-[#8A91A3] max-w-2xl leading-relaxed">
            Paste any AI answer to detect stale facts, outdated APIs, old pricing tiers, and former leadership. Verified with live web evidence.
          </p>
        </div>

        {/* Input Card */}
        <div className="p-5 rounded-2xl bg-[#12151C] border border-[#1F2430] space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <SampleChips onSelectSample={handleSelectSample} disabled={isChecking} />
            <div className="flex items-center gap-2 text-xs text-[#8A91A3]">
              <Clock className="w-3.5 h-3.5" />
              <span>Generated on:</span>
              <input
                type="date"
                value={answerDate}
                onChange={(e) => setAnswerDate(e.target.value)}
                disabled={isChecking}
                className="bg-[#0B0D12] border border-[#1F2430] rounded px-2 py-1 text-xs text-[#E6E8EE] focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={6}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              disabled={isChecking}
              placeholder="Paste an AI answer to check which facts have expired..."
              className="w-full p-4 rounded-xl bg-[#0B0D12] border border-[#1F2430] text-sm text-[#E6E8EE] placeholder:text-[#8A91A3]/60 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all resize-none font-sans leading-relaxed disabled:opacity-60"
            />
            <div className="absolute bottom-3 right-3 text-[11px] font-mono text-[#8A91A3]">
              {text.length} / 4,000
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={handleCheckFreshness}
                className="px-2 py-1 rounded bg-red-900/60 hover:bg-red-800 text-white font-medium flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Retry
              </button>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleCheckFreshness}
              disabled={isChecking || !text.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#6366F1]/90 disabled:bg-[#1F2430] disabled:text-[#8A91A3] disabled:cursor-not-allowed text-white text-xs font-semibold tracking-wide flex items-center gap-2 transition-all shadow-md shadow-[#6366F1]/20 cursor-pointer"
            >
              <span>{isChecking ? "Checking freshness..." : "Check freshness"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-Time Stepper */}
        <ProgressSteps currentStep={step} />

        {/* Verification Summary (When Checked) */}
        {overallScore !== null && summaryCounts && (
          <div className="p-6 rounded-2xl bg-[#12151C] border border-[#1F2430] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-[#0B0D12] border-2 border-[#1F2430] flex items-center justify-center">
                <span className="text-2xl font-bold font-mono text-[#E6E8EE]">
                  {overallScore}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-bold">Overall Answer Score</h2>
                  <ScoreBadge score={overallScore} size="sm" />
                </div>
                <p className="text-xs text-[#8A91A3]">
                  Computed deterministically from claim verdicts and evidence quality.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-2 rounded-xl bg-[#0B0D12] border border-[#1F2430] text-center min-w-[70px]">
                <span className="text-xs font-bold text-[#22C55E] block font-mono">{summaryCounts.fresh}</span>
                <span className="text-[10px] text-[#8A91A3]">Fresh</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#0B0D12] border border-[#1F2430] text-center min-w-[70px]">
                <span className="text-xs font-bold text-[#F59E0B] block font-mono">{summaryCounts.uncertain}</span>
                <span className="text-[10px] text-[#8A91A3]">Uncertain</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#0B0D12] border border-[#1F2430] text-center min-w-[70px]">
                <span className="text-xs font-bold text-[#EF4444] block font-mono">{summaryCounts.stale}</span>
                <span className="text-[10px] text-[#8A91A3]">Stale</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#0B0D12] border border-[#1F2430] text-center min-w-[70px]">
                <span className="text-xs font-bold text-[#8A91A3] block font-mono">{summaryCounts.skipped}</span>
                <span className="text-[10px] text-[#8A91A3]">Skipped</span>
              </div>
            </div>
          </div>
        )}

        {/* Annotated Answer */}
        {claims.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[#E6E8EE] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6366F1]" />
              Annotated Answer (Click any highlighted claim to view sources)
            </h2>
            <AnnotatedAnswer
              originalText={text}
              claims={claims}
              onSelectClaim={setSelectedClaim}
              selectedClaimId={selectedClaim?.id}
            />
          </div>
        )}

        {/* Claim Cards Grid */}
        {claims.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[#E6E8EE] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6366F1]" />
              Factual Claims ({claims.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {claims.map((claim) => (
                <ClaimCard
                  key={claim.id}
                  claim={claim}
                  isLoading={isChecking && claim.verdict === null && !claim.skipped}
                  onSelect={setSelectedClaim}
                  isSelected={claim.id === selectedClaim?.id}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Slide-out Evidence Drawer */}
      <EvidenceDrawer
        claim={selectedClaim}
        isOpen={selectedClaim !== null}
        onClose={() => setSelectedClaim(null)}
      />
    </div>
  );
}
