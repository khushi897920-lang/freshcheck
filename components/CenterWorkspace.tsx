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
  ShieldAlert,
  RotateCcw,
  Clock,
  Layers,
  Wand2,
  Check,
  Download,
} from "lucide-react";
import { ProgressSteps, PipelineStep } from "./ProgressSteps";
import { AnnotatedAnswer } from "./AnnotatedAnswer";
import { ClaimCard } from "./ClaimCard";
import { ScoreBadge } from "./ScoreBadge";
import { DrawerClaimData } from "./EvidenceDrawer";
import { SAMPLE_ANSWERS, SampleAnswer } from "@/data/samples";
import { generateCorrectedAnswer, CorrectedAnswerResult } from "@/lib/correct";
import { generateMarkdownReport, downloadMarkdown } from "@/lib/exportMarkdown";

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
    <main className="flex-1 bg-white rounded-2xl shadow-window m-2.5 flex flex-col justify-between overflow-hidden border border-[#E2E8F0] relative">
      {/* Top Header Bar */}
      <header className="h-12 border-b border-[#E2E8F0] px-5 flex items-center justify-between text-xs text-[#64748B] flex-shrink-0 bg-white">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-[#1E232B]">FreshCheck Cowork</span>
          {fallbackUsed && (
            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-mono">
              Switched to backup model via Bifrost
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8FAFD] border border-[#E2E8F0] text-[#1E232B] font-medium cursor-pointer hover:bg-[#F1F5F9]">
            <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>Bifrost · Gemini 1.5</span>
            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
          </div>

          <button
            type="button"
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E232B] hover:bg-[#F1F5F9] transition-colors"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E232B] hover:bg-[#F1F5F9] transition-colors"
            title="Audio verification"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E232B] hover:bg-[#F1F5F9] transition-colors"
            title="Theme"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Scrollable Canvas */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 flex flex-col justify-start">
        {/* Welcome Hero (Shown always or when idle) */}
        {claims.length === 0 && !isChecking && (
          <div className="text-center my-auto pt-6 pb-2 space-y-2 select-none">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1E232B]">
              Good afternoon, <span className="text-[#1E232B]">Researcher</span>
            </h1>
            <p className="text-sm md:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed">
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
              <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-[#E2E8F0] shadow-xs flex items-center justify-center">
                    <span className="text-2xl font-bold font-mono text-[#1E232B]">
                      {overallScore}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm text-[#1E232B]">
                        Answer Freshness Score
                      </h3>
                      <ScoreBadge score={overallScore} size="sm" />
                    </div>
                    <p className="text-xs text-[#64748B]">
                      Deterministic index weighted by high (3x) and medium (2x) volatility claims.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-center min-w-[65px]">
                    <span className="text-xs font-bold text-[#10B981] font-mono block">
                      {summaryCounts.fresh}
                    </span>
                    <span className="text-[10px] text-[#64748B]">Fresh</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-center min-w-[65px]">
                    <span className="text-xs font-bold text-[#F59E0B] font-mono block">
                      {summaryCounts.uncertain}
                    </span>
                    <span className="text-[10px] text-[#64748B]">Uncertain</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-center min-w-[65px]">
                    <span className="text-xs font-bold text-[#EF4444] font-mono block">
                      {summaryCounts.stale}
                    </span>
                    <span className="text-[10px] text-[#64748B]">Stale</span>
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-[#1E232B] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" />
                  Annotated Answer (Click any claim to inspect live Tavily sources)
                </h4>
                <button
                  type="button"
                  onClick={handleToggleCorrected}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6366F1] hover:text-[#4F46E5] bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>{showCorrected ? "Show Original" : "Auto-Correct Stale Claims"}</span>
                </button>
              </div>

              {showCorrected && correctedResult ? (
                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 text-xs text-[#1E232B] leading-relaxed whitespace-pre-wrap">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] mb-2 font-mono">
                    <Check className="w-3.5 h-3.5" /> Corrected Answer with Sources Cited:
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
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#1E232B] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#6366F1]" />
                Extracted Claims ({claims.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-xs text-xs text-[#2D3139]">
            {/* Cute Little Mascot */}
            <div className="w-5 h-5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[10px]">
              🛡️
            </div>
            <span>
              <strong className="font-semibold text-[#1E232B]">Heads up</strong> Your AI answers may contain stale pricing or deprecated APIs.
            </span>
            <span
              onClick={() => onSelectSample(SAMPLE_ANSWERS[0])}
              className="font-medium text-[#10B981] hover:underline cursor-pointer flex items-center gap-0.5 ml-1"
            >
              Check facts →
            </span>
          </div>
        </div>

        {/* Glowing Gradient Border Input Box */}
        <div className="p-[1.5px] rounded-2xl bg-gradient-to-r from-blue-200 via-indigo-100 to-purple-200 shadow-lg shadow-indigo-100/40">
          <div className="bg-white rounded-2xl p-3.5 space-y-2.5">
            {/* Top row tabs: Chat vs Verify */}
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#64748B]">
              <button
                type="button"
                onClick={() => setInputTab("chat")}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  inputTab === "chat" ? "bg-[#F1F5F9] text-[#1E232B] font-semibold" : "hover:text-[#1E232B]"
                }`}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setInputTab("verify")}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  inputTab === "verify" ? "bg-[#F1F5F9] text-[#1E232B] font-semibold" : "hover:text-[#1E232B]"
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
              placeholder="Type your query, paste an AI answer to audit for expired facts..."
              className="w-full text-xs text-[#1E232B] placeholder:text-[#94A3B8] focus:outline-none resize-none leading-relaxed bg-transparent font-sans"
            />

            {/* Error Message if any */}
            {errorMessage && (
              <div className="text-[11px] text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg flex items-center justify-between">
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
            <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <button
                  type="button"
                  onClick={() => onSelectSample(SAMPLE_ANSWERS[0])}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FDF2F4] text-[#E11D48] border border-[#FECDD3] hover:bg-[#FCE7EC] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
                >
                  <FileCode className="w-3 h-3 text-[#E11D48]" />
                  <span>API Versions</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSample(SAMPLE_ANSWERS[1])}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] hover:bg-[#D1FAE5] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
                >
                  <Users className="w-3 h-3 text-[#059669]" />
                  <span>Company Leadership</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSample(SAMPLE_ANSWERS[2])}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] hover:bg-[#DBEAFE] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
                >
                  <Coins className="w-3 h-3 text-[#2563EB]" />
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
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] hover:bg-[#FEF3C7] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 hidden sm:flex"
                >
                  <Scale className="w-3 h-3 text-[#D97706]" />
                  <span>Regulations</span>
                </button>
              </div>

              {/* Up-arrow Send Button */}
              <button
                type="button"
                onClick={onCheckFreshness}
                disabled={isChecking || !text.trim()}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] disabled:opacity-40 disabled:cursor-not-allowed text-[#1E232B] flex items-center justify-center transition-all flex-shrink-0 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                title="Verify Freshness (⌘+Enter)"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
