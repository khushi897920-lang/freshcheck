"use client";

import { useState } from "react";
import {
  Bell,
  Volume2,
  Moon,
  ChevronDown,
  ArrowUp,
  FileCode,
  Users,
  Coins,
  Scale,
  Sparkles,
  Layers,
  Wand2,
  Check,
} from "lucide-react";
import { ProgressSteps, PipelineStep } from "./ProgressSteps";
import { AnnotatedAnswer } from "./AnnotatedAnswer";
import { ClaimCard } from "./ClaimCard";
import { ScoreBadge } from "./ScoreBadge";
import { DrawerClaimData } from "./EvidenceDrawer";
import { SAMPLE_ANSWERS, SampleAnswer } from "@/data/samples";
import { generateCorrectedAnswer, CorrectedAnswerResult } from "@/lib/correct";

interface CenterWorkspaceProps {
  text: string;
  setText: (text: string) => void;
  answerDate: string;
  setAnswerDate: (date: string) => void;
  isChecking: boolean;
  step: PipelineStep;
  claims: DrawerClaimData[];
  overallScore: number | null;
  summaryCounts: {
    fresh: number;
    uncertain: number;
    stale: number;
    skipped: number;
  } | null;
  fallbackUsed: boolean;
  errorMessage: string | null;
  selectedClaim: DrawerClaimData | null;
  onSelectClaim: (claim: DrawerClaimData) => void;
  onCheckFreshness: () => void;
  onSelectSample: (sample: SampleAnswer) => void;
}

export function CenterWorkspace({
  text,
  setText,
  answerDate,
  setAnswerDate,
  isChecking,
  step,
  claims,
  overallScore,
  summaryCounts,
  fallbackUsed,
  errorMessage,
  selectedClaim,
  onSelectClaim,
  onCheckFreshness,
  onSelectSample,
}: CenterWorkspaceProps) {
  const [inputTab, setInputTab] = useState<"chat" | "verify">("verify");
  const [showCorrected, setShowCorrected] = useState(false);
  const [correctedResult, setCorrectedResult] = useState<CorrectedAnswerResult | null>(null);

  const handleToggleCorrected = () => {
    if (!correctedResult && claims.length > 0) {
      const res = generateCorrectedAnswer(text, claims);
      setCorrectedResult(res);
    }
    setShowCorrected(!showCorrected);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onCheckFreshness();
    }
  };

  const activeClaims = claims.filter((c) => !c.skipped);
  const allClaimsSkipped = claims.length > 0 && activeClaims.length === 0;

  return (
    <main className="flex-1 bg-white rounded-2xl shadow-window m-2.5 flex flex-col justify-between overflow-hidden border border-[#E2E8F0] relative font-sans">
      {/* Top Header Bar */}
      <header className="h-13 border-b border-[#E2E8F0] px-6 flex items-center justify-between text-xs text-[#475569] flex-shrink-0 bg-white">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm tracking-tight text-[#0F172A]">
            FreshCheck Cowork
          </span>
          {fallbackUsed && (
            <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-mono font-medium">
              Switched to backup model via Bifrost
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8FAFD] border border-[#E2E8F0] text-[#0F172A] font-medium cursor-pointer hover:bg-[#F1F5F9] transition-colors text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>Bifrost · Gemini 1.5 Flash</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </div>

          <button
            type="button"
            className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            title="Audio feedback"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            title="Theme toggle"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Scrollable Canvas */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 flex flex-col justify-start">
        {/* Welcome Hero (Shown when idle) */}
        {claims.length === 0 && !isChecking && (
          <div className="text-center my-auto pt-6 pb-2 space-y-3 select-none">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A] leading-tight">
              Good afternoon, <span className="text-[#0F172A] font-extrabold">Researcher</span>
            </h1>
            <p className="text-sm md:text-base text-[#475569] max-w-xl mx-auto leading-relaxed font-normal">
              What would you like to analyze, audit, or fact-check?
            </p>
          </div>
        )}

        {/* Real-time Stepper when processing */}
        {isChecking && (
          <div className="max-w-2xl mx-auto w-full">
            <ProgressSteps currentStep={step} />
          </div>
        )}

        {/* Results View when completed */}
        {claims.length > 0 && (
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            {/* Score Summary Card */}
            {overallScore !== null && summaryCounts && (
              <div className="p-6 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
                <div className="flex items-center gap-5">
                  <div className="w-18 h-18 rounded-full bg-white border-2 border-[#E2E8F0] shadow-xs flex items-center justify-center">
                    <span className="text-2xl font-bold font-mono text-[#0F172A]">
                      {overallScore}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="font-bold text-base text-[#0F172A]">
                        Answer Freshness Score
                      </h3>
                      <ScoreBadge score={overallScore} size="md" />
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Deterministic score calculated from claim recency, official domain authority, and source consensus.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-center min-w-[70px]">
                    <span className="text-sm font-bold text-[#059669] font-mono block">
                      {summaryCounts.fresh}
                    </span>
                    <span className="text-xs text-[#64748B] font-medium">Fresh</span>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-center min-w-[70px]">
                    <span className="text-sm font-bold text-[#D97706] font-mono block">
                      {summaryCounts.uncertain}
                    </span>
                    <span className="text-xs text-[#64748B] font-medium">Uncertain</span>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-center min-w-[70px]">
                    <span className="text-sm font-bold text-[#DC2626] font-mono block">
                      {summaryCounts.stale}
                    </span>
                    <span className="text-xs text-[#64748B] font-medium">Stale</span>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State: All stable facts */}
            {allClaimsSkipped && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-center font-medium">
                No time-sensitive claims found. This answer looks stable.
              </div>
            )}

            {/* Annotated Answer Highlights */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#6366F1]" />
                  Annotated Answer (Click any highlighted claim to view live evidence)
                </h4>
                <button
                  type="button"
                  onClick={handleToggleCorrected}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{showCorrected ? "Show Original" : "Auto-Correct Stale Claims"}</span>
                </button>
              </div>

              {showCorrected && correctedResult ? (
                <div className="p-5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap font-sans">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] mb-2.5 font-mono">
                    <Check className="w-4 h-4" /> Corrected Answer with Sources Cited:
                  </div>
                  {correctedResult.correctedText}
                </div>
              ) : (
                <AnnotatedAnswer
                  originalText={text}
                  claims={claims}
                  onSelectClaim={onSelectClaim}
                  selectedClaimId={selectedClaim?.id}
                />
              )}
            </div>

            {/* Claim Cards Grid */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#6366F1]" />
                Extracted Claims &amp; Live Status ({claims.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {claims.map((claim) => (
                  <ClaimCard
                    key={claim.id}
                    claim={claim}
                    onSelect={onSelectClaim}
                    isSelected={claim.id === selectedClaim?.id}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Prompt Bar Container */}
      <div className="p-5 md:p-6 bg-gradient-to-t from-white via-white/95 to-transparent flex-shrink-0 max-w-3xl mx-auto w-full space-y-3">
        {/* Floating Notification / Mascot Pill */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-xs text-xs text-[#334155]">
            <div className="w-5 h-5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-xs">
              🛡️
            </div>
            <span>
              <strong className="font-semibold text-[#0F172A]">Heads up</strong> Your AI answers may contain stale pricing or deprecated APIs.
            </span>
            <span
              onClick={() => onSelectSample(SAMPLE_ANSWERS[0])}
              className="font-semibold text-[#059669] hover:underline cursor-pointer flex items-center gap-0.5 ml-1"
            >
              Check facts →
            </span>
          </div>
        </div>

        {/* Glowing Gradient Border Input Box */}
        <div className="p-[1.5px] rounded-2xl bg-gradient-to-r from-blue-200 via-indigo-100 to-purple-200 shadow-lg shadow-indigo-100/40">
          <div className="bg-white rounded-2xl p-4 space-y-3">
            {/* Top row tabs: Chat vs Verify */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
              <button
                type="button"
                onClick={() => setInputTab("chat")}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  inputTab === "chat" ? "bg-[#F1F5F9] text-[#0F172A] font-semibold" : "hover:text-[#0F172A]"
                }`}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setInputTab("verify")}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  inputTab === "verify" ? "bg-[#F1F5F9] text-[#0F172A] font-semibold" : "hover:text-[#0F172A]"
                }`}
              >
                Fact Check
              </button>
            </div>

            {/* Clean Input Textarea */}
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isChecking}
              placeholder="Paste any AI answer to detect stale facts, deprecated versions, or changed pricing..."
              className="w-full text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none resize-none leading-relaxed bg-transparent font-sans"
            />

            {/* Error Message if any */}
            {errorMessage && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={onCheckFreshness}
                  className="font-semibold underline ml-2 cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Bottom Toolbar with Sample Chips and Send Button */}
            <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                <button
                  type="button"
                  onClick={() => onSelectSample(SAMPLE_ANSWERS[0])}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#FDF2F4] text-[#E11D48] border border-[#FECDD3] hover:bg-[#FCE7EC] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>API Versions</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSample(SAMPLE_ANSWERS[1])}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] hover:bg-[#D1FAE5] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Company Leadership</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSample(SAMPLE_ANSWERS[2])}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] hover:bg-[#DBEAFE] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                >
                  <Coins className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Pricing &amp; Models</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSample({
                    id: "regulations",
                    title: "Regulatory Standards",
                    category: "pricing_and_models",
                    text: "Under the SEBI BRSR Core guidelines for FY2026, assurance is voluntary for top 1000 listed entities, and the global CSRD reporting standard has been indefinitely delayed.",
                    answerDate: "2023-01-01",
                  })}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] hover:bg-[#FEF3C7] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 hidden sm:flex"
                >
                  <Scale className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Regulations</span>
                </button>
              </div>

              {/* Up-arrow Send Button */}
              <button
                type="button"
                onClick={onCheckFreshness}
                disabled={isChecking || !text.trim()}
                className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] disabled:opacity-40 disabled:cursor-not-allowed text-[#0F172A] flex items-center justify-center transition-all flex-shrink-0 cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                title="Verify Freshness (⌘+Enter)"
              >
                <ArrowUp className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
