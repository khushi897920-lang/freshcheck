import { ScoreBadge } from "./ScoreBadge";
import { DrawerClaimData } from "./EvidenceDrawer";
import { ChevronRight } from "lucide-react";

interface ClaimCardProps {
  claim: DrawerClaimData;
  isLoading?: boolean;
  onSelect: (claim: DrawerClaimData) => void;
  isSelected?: boolean;
}

export function ClaimCard({
  claim,
  isLoading = false,
  onSelect,
  isSelected = false,
}: ClaimCardProps) {
  if (isLoading) {
    return (
      <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] animate-pulse space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-20 bg-slate-100 rounded" />
          <div className="h-4 w-14 bg-slate-100 rounded-full" />
        </div>
        <div className="h-3.5 w-3/4 bg-slate-100 rounded" />
        <div className="h-3 w-1/2 bg-slate-100 rounded" />
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(claim)}
      className={`p-3.5 rounded-xl bg-white border transition-all cursor-pointer group text-left ${
        isSelected
          ? "border-[#6366F1] ring-2 ring-[#6366F1]/20 shadow-xs"
          : "border-[#E2E8F0] hover:border-[#6366F1]/40 shadow-xs"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          {typeof claim.idx === "number" && (
            <span className="text-[10px] font-mono text-[#94A3B8]">
              #{claim.idx + 1}
            </span>
          )}
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B]">
            {claim.claim_type || "fact"}
          </span>
          <span className="text-[9px] font-mono text-[#94A3B8]">
            {claim.volatility}
          </span>
        </div>
        <ScoreBadge
          score={claim.scoreBreakdown?.finalScore}
          verdict={claim.verdict}
          skipped={claim.skipped}
          size="sm"
        />
      </div>

      <p className="text-xs font-medium text-[#1E232B] group-hover:text-[#6366F1] transition-colors line-clamp-2">
        "{claim.text}"
      </p>

      {claim.explanation && !claim.skipped && (
        <p className="text-[11px] text-[#64748B] mt-1.5 line-clamp-1">
          {claim.explanation}
        </p>
      )}

      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#F1F5F9] text-[10px] text-[#94A3B8]">
        <span>
          {claim.skipped
            ? "Not time-sensitive"
            : `${claim.evidence?.length ?? 0} Tavily sources`}
        </span>
        <span className="flex items-center gap-0.5 text-[#6366F1] font-medium group-hover:translate-x-0.5 transition-transform">
          Evidence <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
