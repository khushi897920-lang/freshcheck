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
  PanelLeft,
  PanelRight,
  MessageSquare,
  Paperclip,
  BarChart2,
  FileEdit,
  SlidersHorizontal,
} from "lucide-react";
import { ProgressSteps, PipelineStep } from "./ProgressSteps";
import { AnnotatedAnswer } from "./AnnotatedAnswer";
import { ClaimCard } from "./ClaimCard";
import { ScoreBadge } from "./ScoreBadge";
import { DrawerClaimData } from "./EvidenceDrawer";
import { CodexBlobPet } from "./CodexBlobPet";
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
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
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
  onToggleLeftSidebar,
  onToggleRightSidebar,
  isLeftSidebarOpen,
  isRightSidebarOpen,
}: CenterWorkspaceProps) {
  const [inputTab, setInputTab] = useState<"chat" | "verify">("chat");
  const [showCorrected, setShowCorrected] = useState(false);
  const [correctedResult, setCorrectedResult] = useState<CorrectedAnswerResult | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [petSpeechQuote, setPetSpeechQuote] = useState<string | null>(null);

  const handlePetSpeech = (quote: string) => {
    setPetSpeechQuote(quote);
    setTimeout(() => {
      setPetSpeechQuote(null);
    }, 4500);
  };

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
    <main className="flex-1 bg-white rounded-2xl shadow-window m-1.5 sm:m-2.5 flex flex-col justify-between overflow-hidden border border-[#E2E8F0] relative font-sans min-w-0">
      {/* Top Header Bar with Sidebar Toggle Buttons */}
      <header className="h-14 border-b border-[#E2E8F0] px-3 sm:px-6 flex items-center justify-between text-xs text-[#475569] flex-shrink-0 bg-white gap-2">
        {/* Left Controls: Toggle Sidebar Button + Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleLeftSidebar}
            className={`px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
              isLeftSidebarOpen
                ? "bg-indigo-50 border-indigo-200 text-[#4F46E5]"
                : "bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
            }`}
            title="Toggle Menu"
            aria-label="Toggle Navigation Menu"
          >
            <PanelLeft className="w-4 h-4 text-[#6366F1]" />
            <span className="font-semibold text-xs hidden sm:inline">Menu</span>
          </button>

          <span className="font-bold text-xs sm:text-sm tracking-tight text-[#0F172A] truncate">
            FreshCheck Cowork
          </span>

          {fallbackUsed && (
            <span className="hidden sm:inline-flex text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-mono font-medium">
              Fallback
            </span>
          )}
        </div>

        {/* Right Controls: Model indicator + Right Sidebar Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F8FAFD] border border-[#E2E8F0] text-[#0F172A] font-medium text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" />
            <span className="truncate max-w-[130px]">Gemini 1.5 · Tavily</span>
          </div>

          <button
            type="button"
            onClick={onToggleRightSidebar}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors cursor-pointer font-semibold text-xs ${
              isRightSidebarOpen
                ? "bg-indigo-50 border-indigo-200 text-[#4F46E5]"
                : "bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
            }`}
            title="Toggle Reports & Evidence"
            aria-label="Toggle Reports"
          >
            <PanelRight className="w-4 h-4 text-[#6366F1]" />
            <span>Reports</span>
            {claims.length > 0 && (
              <span className="bg-[#6366F1] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {claims.length}
              </span>
            )}
          </button>

          <button
            type="button"
            className="hidden md:flex p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Scrollable Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 flex flex-col justify-start">
        {/* Welcome Hero (Shown when idle) */}
        {claims.length === 0 && !isChecking && (
          <div className="text-center my-auto pt-6 pb-2 space-y-3 select-none">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A] leading-tight">
              Good afternoon, <span className="text-[#0F172A] font-extrabold">Researcher</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[#475569] max-w-xl mx-auto leading-relaxed font-normal">
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
              <div className="p-4 sm:p-6 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
                <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white border-2 border-[#E2E8F0] shadow-xs flex items-center justify-center flex-shrink-0">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[#0F172A]">
                      {overallScore}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                        Freshness Score
                      </h3>
                      <ScoreBadge score={overallScore} size="md" />
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Calibrated score calculated from claim recency, official sources, and domain consensus.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                  <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white border border-[#E2E8F0] text-center flex-1 sm:flex-initial min-w-[65px]">
                    <span className="text-xs sm:text-sm font-bold text-[#059669] font-mono block">
                      {summaryCounts.fresh}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium">Fresh</span>
                  </div>
                  <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white border border-[#E2E8F0] text-center flex-1 sm:flex-initial min-w-[65px]">
                    <span className="text-xs sm:text-sm font-bold text-[#D97706] font-mono block">
                      {summaryCounts.uncertain}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium">Uncertain</span>
                  </div>
                  <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white border border-[#E2E8F0] text-center flex-1 sm:flex-initial min-w-[65px]">
                    <span className="text-xs sm:text-sm font-bold text-[#DC2626] font-mono block">
                      {summaryCounts.stale}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium">Stale</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile & Tablet Quick Action Banner to Open Full Report Drawer */}
            <div className="xl:hidden">
              <button
                type="button"
                onClick={onToggleRightSidebar}
                className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-indigo-50/90 to-blue-50/90 border border-indigo-200/80 text-[#4F46E5] text-xs font-semibold flex items-center justify-between cursor-pointer hover:bg-indigo-100/80 transition-colors shadow-2xs"
              >
                <span className="flex items-center gap-2">
                  <PanelRight className="w-4 h-4 text-[#6366F1]" />
                  <span>View Full Report &amp; Evidence ({claims.length} claims)</span>
                </span>
                <span className="font-bold">Open Report →</span>
              </button>
            </div>

            {/* Empty State: All stable facts */}
            {allClaimsSkipped && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-center font-medium">
                No time-sensitive claims found. This answer looks stable.
              </div>
            )}

            {/* Annotated Answer Highlights */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#6366F1]" />
                  Annotated Answer (Click any claim to inspect live sources)
                </h4>
                <button
                  type="button"
                  onClick={handleToggleCorrected}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{showCorrected ? "Show Original" : "Auto-Correct Stale Claims"}</span>
                </button>
              </div>

              {showCorrected && correctedResult ? (
                <div className="p-4 sm:p-5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs sm:text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap font-sans">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] mb-2 font-mono">
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
              <h4 className="text-xs sm:text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#6366F1]" />
                Extracted Claims &amp; Live Status ({claims.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
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
      <div className="p-3 sm:p-5 md:p-6 bg-gradient-to-t from-white via-white/95 to-transparent flex-shrink-0 max-w-3xl mx-auto w-full space-y-2">
        {/* Heads Up Speech Bubble + Blob Mascot (Exact match to reference image) */}
        <div className="flex items-center gap-2.5 sm:gap-3 relative z-10 self-start sm:ml-2">
          {/* Mint Teal Feral Blob Mascot */}
          <CodexBlobPet
            isChecking={isChecking}
            isTyping={isTyping}
            overallScore={overallScore}
            staleCount={summaryCounts?.stale ?? 0}
            size="md"
            onSpeech={handlePetSpeech}
          />

          {/* Speech Bubble with Pointer Tail */}
          <div className="relative bg-white/95 backdrop-blur-xs rounded-2xl py-2 px-3.5 sm:px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#E2E8F0] flex items-center gap-2 text-xs text-[#475569] leading-snug">
            {/* Left triangular tail pointing to the blob mascot */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-white border-l border-b border-[#E2E8F0] rotate-45" />

            <span className="font-bold text-[#0F172A] relative z-10">Heads up</span>
            <span className="relative z-10 text-[#334155]">
              {petSpeechQuote || "Your newest emissions data is 84 days old."}
            </span>
            <button
              type="button"
              onClick={() => onSelectSample({
                id: "emissions-scope",
                title: "Scope 1 & 2 Emissions Audit",
                category: "pricing_and_models",
                text: "Under the SEBI BRSR Core guidelines for FY2026, assurance is voluntary for top 1000 listed entities, and Scope 1 and Scope 2 greenhouse gas reporting standards have been indefinitely delayed.",
                answerDate: "2023-01-01",
              })}
              className="font-bold text-[#059669] hover:text-[#047857] hover:underline cursor-pointer inline-flex items-center gap-0.5 relative z-10 transition-colors whitespace-nowrap"
            >
              Find bills →
            </button>

            {/* Carousel dots indicator on far right */}
            <div className="hidden xs:flex items-center gap-1 ml-1.5 relative z-10 opacity-70">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="w-3.5 h-1.5 rounded-full bg-[#059669]" />
            </div>
          </div>
        </div>

        {/* Clean Glowing Gradient Border Input Box */}
        <div className="p-[1.5px] rounded-[22px] bg-gradient-to-r from-[#67E8F9]/40 via-[#A5B4FC]/30 to-[#DDD6FE]/50 shadow-[0_12px_32px_-8px_rgba(203,213,225,0.45)]">
          <div className="bg-white rounded-[20.5px] p-4 sm:p-5 space-y-3">
            {/* Top row tabs: Chat vs Task */}
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setInputTab("chat")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer text-xs ${
                  inputTab === "chat"
                    ? "bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-semibold shadow-2xs"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#0F172A]" />
                <span>Chat</span>
              </button>
              <button
                type="button"
                onClick={() => setInputTab("verify")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer text-xs ${
                  inputTab === "verify"
                    ? "bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-semibold shadow-2xs"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Task</span>
              </button>
            </div>

            {/* Clean Input Textarea */}
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              disabled={isChecking}
              placeholder="Type your query, ask to audit emissions, or attach a bill/invoice..."
              className="w-full text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none resize-none leading-relaxed bg-transparent font-sans min-h-[64px] sm:min-h-[72px]"
            />

            {/* Error Message if any */}
            {errorMessage && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-center justify-between">
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

            {/* Bottom Toolbar with 4 Exact Pills and Squircle Send Button */}
            <div className="flex items-center justify-between pt-2.5 border-t border-[#F1F5F9] gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 scrollbar-none flex-1">
                {/* 1. Attach Bill / PDF (Pink) */}
                <button
                  type="button"
                  onClick={() => onSelectSample(SAMPLE_ANSWERS[0])}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#FFF1F2] text-[#E11D48] border border-[#FFE4E6] hover:bg-[#FFE4E6] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 min-h-[34px] shadow-2xs"
                >
                  <Paperclip className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>Attach Bill / PDF</span>
                </button>

                {/* 2. Scope 1 & 2 Audit (Mint) */}
                <button
                  type="button"
                  onClick={() => onSelectSample({
                    id: "emissions-scope",
                    title: "Scope 1 & 2 Emissions Audit",
                    category: "pricing_and_models",
                    text: "Under the SEBI BRSR Core guidelines for FY2026, assurance is voluntary for top 1000 listed entities, and Scope 1 and Scope 2 greenhouse gas reporting standards have been indefinitely delayed.",
                    answerDate: "2023-01-01",
                  })}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1] hover:bg-[#CCFBF1] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 min-h-[34px] shadow-2xs"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>Scope 1 &amp; 2 Audit</span>
                </button>

                {/* 3. Write a report (Sky Blue) */}
                <button
                  type="button"
                  onClick={() => onSelectSample(SAMPLE_ANSWERS[1])}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F0F9FF] text-[#0284C7] border border-[#E0F2FE] hover:bg-[#E0F2FE] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 min-h-[34px] shadow-2xs"
                >
                  <FileEdit className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Write a report</span>
                </button>

                {/* 4. Simulate Levers (Amber) */}
                <button
                  type="button"
                  onClick={() => onSelectSample(SAMPLE_ANSWERS[2])}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7] hover:bg-[#FEF3C7] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 min-h-[34px] shadow-2xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Simulate Levers</span>
                </button>
              </div>

              {/* Squircle Send Button (rounded-xl with soft cool-slate styling) */}
              <button
                type="button"
                onClick={onCheckFreshness}
                disabled={isChecking || !text.trim()}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EEF2F6] hover:bg-[#E2E8F0] active:scale-95 disabled:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-[#334155] flex items-center justify-center transition-all flex-shrink-0 cursor-pointer shadow-2xs"
                title="Send / Verify Freshness (⌘+Enter)"
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
