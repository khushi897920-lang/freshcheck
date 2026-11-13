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
  const truthLabel =
    claim.verification_mode === "truth"
      ? claim.verdict === "CONTRADICTED"
        ? "False"
        : claim.verdict === "SUPPORTED"
        ? "True"
        : claim.verdict === "UNVERIFIABLE"
        ? "Uncertain"
        : undefined
      : undefined;

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
      className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all cursor-pointer group text-left ${
        isSelected
          ? "border-[#6366F1] ring-2 ring-[#6366F1]/25 shadow-md"
          : "border-[#CBD5E1] hover:border-[#6366F1]/60 shadow-xs hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {typeof claim.idx === "number" && (
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              #{claim.idx + 1}
            </span>
          )}
          <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800 font-bold tracking-wider">
            {claim.claim_type || "fact"}
          </span>
          <span className="text-xs font-semibold text-slate-500 capitalize">
            {claim.volatility} volatility
          </span>
        </div>
        <ScoreBadge
          score={claim.scoreBreakdown?.finalScore}
          label={truthLabel}
          verdict={claim.verdict}
          skipped={claim.skipped}
          size="sm"
        />
      </div>

      <p className="text-[15px] sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug mt-2">
        "{claim.text}"
      </p>

      {claim.explanation && !claim.skipped && (
        <div className="text-xs sm:text-sm text-slate-700 mt-2.5 leading-relaxed font-normal bg-slate-50/90 p-3 rounded-xl border border-slate-200">
          <span className="font-semibold text-slate-900 block mb-0.5">Finding:</span>
          {claim.explanation}
        </div>
      )}

      {claim.current_value && (
        <div className="mt-2 text-xs sm:text-sm font-bold text-emerald-950 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1.5">
          <span className="text-emerald-700 font-bold uppercase text-[10px] tracking-wider px-1.5 py-0.5 bg-emerald-100 rounded">Truth</span>
          <span>{claim.current_value}</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200 text-xs text-slate-600 font-medium">
        <span className="font-semibold text-slate-700">
          {claim.skipped
            ? "Stable fact · Not time-sensitive"
            : `${claim.evidence?.length ?? 0} Tavily web sources`}
        </span>
        <span className="flex items-center gap-1 text-indigo-600 font-bold group-hover:translate-x-1 transition-transform">
          Inspect Evidence <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </span>
      </div>
    </div>
  );
}
