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

  // If no claims extracted yet, return plain text
  if (!claims || claims.length === 0) {
    return (
      <div className="p-5 rounded-xl bg-[#12151C] border border-[#1F2430] text-sm text-[#E6E8EE] leading-relaxed whitespace-pre-wrap">
        {originalText}
      </div>
    );
  }

  // Sort claims by start offset ascending
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

    // Safety checks
    if (typeof start !== "number" || typeof end !== "number" || start < lastIndex || end > originalText.length) {
      return;
    }

    // Push preceding unhighlighted text
    if (start > lastIndex) {
      segments.push(
        <span key={`text-${lastIndex}`}>{originalText.slice(lastIndex, start)}</span>
      );
    }

    // Determine highlight color based on claim verdict
    const isSelected = claim.id === selectedClaimId;
    let highlightClasses = "bg-zinc-800/40 border-b-2 border-zinc-500 text-zinc-300";

    if (!claim.skipped) {
      const score = claim.scoreBreakdown?.finalScore;
      if (typeof score === "number") {
        if (score >= 75) {
          highlightClasses = "bg-[#22C55E]/15 border-b-2 border-[#22C55E] text-[#22C55E]";
        } else if (score < 40) {
          highlightClasses = "bg-[#EF4444]/15 border-b-2 border-[#EF4444] text-[#EF4444]";
        } else {
          highlightClasses = "bg-[#F59E0B]/15 border-b-2 border-[#F59E0B] text-[#F59E0B]";
        }
      } else if (claim.verdict === "SUPPORTED") {
        highlightClasses = "bg-[#22C55E]/15 border-b-2 border-[#22C55E] text-[#22C55E]";
      } else if (claim.verdict === "OUTDATED") {
        highlightClasses = "bg-[#EF4444]/15 border-b-2 border-[#EF4444] text-[#EF4444]";
      } else {
        highlightClasses = "bg-[#F59E0B]/15 border-b-2 border-[#F59E0B] text-[#F59E0B]";
      }
    }

    const claimSnippet = originalText.slice(start, end);

    segments.push(
      <button
        key={`claim-${claim.id || idx}`}
        type="button"
        onClick={() => onSelectClaim(claim)}
        title={claim.explanation || "Click to inspect evidence"}
        className={`inline cursor-pointer px-1 py-0.5 rounded transition-all font-medium text-left ${highlightClasses} ${
          isSelected ? "ring-2 ring-[#6366F1]" : "hover:opacity-80"
        }`}
      >
        {claimSnippet}
      </button>
    );

    lastIndex = end;
  });

  // Push any remaining text
  if (lastIndex < originalText.length) {
    segments.push(
      <span key={`text-end`}>{originalText.slice(lastIndex)}</span>
    );
  }

  return (
    <div className="p-5 rounded-xl bg-[#12151C] border border-[#1F2430] text-sm text-[#E6E8EE] leading-relaxed whitespace-pre-wrap font-sans">
      {segments}
    </div>
  );
}
