"use client";

import { DrawerClaimData } from "./EvidenceDrawer";

interface AnnotatedAnswerProps {
  originalText: string;
  claims: DrawerClaimData[];
  onSelectClaim: (claim: DrawerClaimData) => void;
  selectedClaimId?: string;
}

export function AnnotatedAnswer({
  originalText,
  claims,
  onSelectClaim,
  selectedClaimId,
}: AnnotatedAnswerProps) {
  if (!originalText) return null;

  if (!claims || claims.length === 0) {
    return (
      <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#1E293B] leading-7 whitespace-pre-wrap shadow-xs">
        {originalText}
      </div>
    );
  }

  const sortedClaims = [...claims].sort((a, b) => {
    const startA = (a as any).start ?? (a as any).start_offset ?? 0;
    const startB = (b as any).start ?? (b as any).start_offset ?? 0;
    return startA - startB;
  });

  const segments: React.ReactNode[] = [];
  let lastIndex = 0;

  sortedClaims.forEach((claim, idx) => {
    const start = (claim as any).start ?? (claim as any).start_offset;
    const end = (claim as any).end ?? (claim as any).end_offset;

    if (typeof start !== "number" || typeof end !== "number" || start < lastIndex || end > originalText.length) {
      return;
    }

    if (start > lastIndex) {
      segments.push(
        <span key={`text-${lastIndex}`}>{originalText.slice(lastIndex, start)}</span>
      );
    }

    const isSelected = claim.id === selectedClaimId;
    let highlightClasses = "bg-slate-100 border-b-2 border-slate-400 text-slate-900";

    if (!claim.skipped) {
      const score = claim.scoreBreakdown?.finalScore;
      if (typeof score === "number") {
        if (score >= 75) {
          highlightClasses = "bg-emerald-100/90 border-b-[3px] border-emerald-600 text-emerald-950 font-semibold";
        } else if (score < 40) {
          highlightClasses = "bg-rose-100/95 border-b-[3px] border-rose-600 text-rose-950 font-semibold";
        } else {
          highlightClasses = "bg-amber-100/90 border-b-[3px] border-amber-600 text-amber-950 font-semibold";
        }
      } else if (claim.verdict === "SUPPORTED") {
        highlightClasses = "bg-emerald-100/90 border-b-[3px] border-emerald-600 text-emerald-950 font-semibold";
      } else if (claim.verdict === "OUTDATED") {
        highlightClasses = "bg-rose-100/95 border-b-[3px] border-rose-600 text-rose-950 font-semibold";
      } else {
        highlightClasses = "bg-amber-100/90 border-b-[3px] border-amber-600 text-amber-950 font-semibold";
      }
    }

    const claimSnippet = originalText.slice(start, end);

    segments.push(
      <button
        key={`claim-${claim.id || idx}`}
        type="button"
        onClick={() => onSelectClaim(claim)}
        title={claim.explanation || "Click to inspect evidence"}
        className={`inline cursor-pointer px-2 py-1 mx-0.5 rounded-lg transition-all text-left ${highlightClasses} ${
          isSelected ? "ring-2 ring-[#6366F1] shadow-xs" : "hover:brightness-95"
        }`}
      >
        {claimSnippet}
      </button>
    );

    lastIndex = end;
  });

  if (lastIndex < originalText.length) {
    segments.push(
      <span key={`text-end`}>{originalText.slice(lastIndex)}</span>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#CBD5E1] text-[15px] sm:text-base md:text-[17px] text-slate-900 leading-8 sm:leading-9 whitespace-pre-wrap font-sans shadow-xs">
      {segments}
    </div>
  );
}
