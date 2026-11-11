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
      <div className="p-4 rounded-xl bg-[#12151C] border border-[#1F2430] animate-pulse space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-[#1F2430] rounded" />
          <div className="h-5 w-16 bg-[#1F2430] rounded-full" />
        </div>
        <div className="h-4 w-3/4 bg-[#1F2430] rounded" />
        <div className="h-3 w-1/2 bg-[#1F2430] rounded" />
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(claim)}
      className={`p-4 rounded-xl bg-[#12151C] border transition-all cursor-pointer group text-left ${
        isSelected
          ? "border-[#6366F1] ring-1 ring-[#6366F1]"
          : "border-[#1F2430] hover:border-[#6366F1]/50"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {typeof claim.idx === "number" && (
            <span className="text-[11px] font-mono text-[#8A91A3]">
              #{claim.idx + 1}
            </span>
          )}
          <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#0B0D12] border border-[#1F2430] text-[#8A91A3]">
            {claim.claim_type || "fact"}
          </span>
          <span className="text-[10px] font-mono text-[#8A91A3]">
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

      <p className="text-sm font-medium text-[#E6E8EE] group-hover:text-white transition-colors line-clamp-2">
        "{claim.text}"
      </p>

      {claim.explanation && !claim.skipped && (
        <p className="text-xs text-[#8A91A3] mt-2 line-clamp-1">
          {claim.explanation}
        </p>
      )}

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#1F2430]/60 text-[11px] text-[#8A91A3]">
        <span>
          {claim.skipped
            ? "Not time-sensitive"
            : `${claim.evidence?.length ?? 0} Tavily sources`}
        </span>
        <span className="flex items-center gap-0.5 text-[#6366F1] font-medium group-hover:translate-x-0.5 transition-transform">
          View evidence <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
