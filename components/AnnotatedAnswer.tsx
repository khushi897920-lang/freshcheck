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
      <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#1E232B] leading-relaxed whitespace-pre-wrap">
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
    let highlightClasses = "bg-slate-100 border-b-2 border-slate-400 text-slate-800";

    if (!claim.skipped) {
      const score = claim.scoreBreakdown?.finalScore;
      if (typeof score === "number") {
        if (score >= 75) {
          highlightClasses = "bg-emerald-50 border-b-2 border-emerald-500 text-emerald-950 font-medium";
        } else if (score < 40) {
          highlightClasses = "bg-rose-50 border-b-2 border-rose-500 text-rose-950 font-medium";
        } else {
          highlightClasses = "bg-amber-50 border-b-2 border-amber-500 text-amber-950 font-medium";
        }
      } else if (claim.verdict === "SUPPORTED") {
        highlightClasses = "bg-emerald-50 border-b-2 border-emerald-500 text-emerald-950 font-medium";
      } else if (claim.verdict === "OUTDATED") {
        highlightClasses = "bg-rose-50 border-b-2 border-rose-500 text-rose-950 font-medium";
      } else {
        highlightClasses = "bg-amber-50 border-b-2 border-amber-500 text-amber-950 font-medium";
      }
    }

    const claimSnippet = originalText.slice(start, end);

    segments.push(
      <button
        key={`claim-${claim.id || idx}`}
        type="button"
        onClick={() => onSelectClaim(claim)}
        title={claim.explanation || "Click to inspect evidence"}
        className={`inline cursor-pointer px-1 py-0.5 rounded transition-all text-left ${highlightClasses} ${
          isSelected ? "ring-2 ring-[#6366F1]" : "hover:opacity-90"
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
    <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#1E232B] leading-relaxed whitespace-pre-wrap font-sans shadow-xs">
      {segments}
    </div>
  );
}
