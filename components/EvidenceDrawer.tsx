"use client";

import { useEffect } from "react";
import { X, ExternalLink, ShieldCheck, Calendar, Globe, AlertCircle } from "lucide-react";
import { ScoreBadge } from "./ScoreBadge";

export interface DrawerClaimData {
  id: string;
  idx?: number;
  text: string;
  claim_type?: string;
  volatility?: string;
  entity?: string | null;
  attribute?: string | null;
  verdict?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "OUTDATED" | "UNVERIFIABLE" | null;
  current_value?: string | null;
  explanation?: string | null;
  scoreBreakdown?: {
    baseScore: number;
    officialSourceBonus: number;
    multiDomainBonus: number;
    stalenessPenalty: number;
    conflictPenalty: number;
    finalScore: number;
    label: "Fresh" | "Uncertain" | "Stale";
  };
  evidence?: Array<{
    url: string;
    title: string;
    domain: string;
    published_date?: string | null;
    snippet: string;
    is_official?: boolean;
    rank?: number;
  }>;
  skipped?: boolean;
}

interface EvidenceDrawerProps {
  claim: DrawerClaimData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EvidenceDrawer({ claim, isOpen, onClose }: EvidenceDrawerProps) {
  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !claim) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#0B0D12] border-l border-[#1F2430] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2430]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-[#12151C] border border-[#1F2430] text-[#8A91A3]">
                  {claim.claim_type || "Claim"}
                </span>
                <span className="text-xs font-mono text-[#8A91A3]">
                  volatility: {claim.volatility || "normal"}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-[#8A91A3] hover:text-[#E6E8EE] hover:bg-[#12151C] transition-colors"
                aria-label="Close evidence drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Claim Statement */}
            <div className="p-3.5 rounded-xl bg-[#12151C] border border-[#1F2430]">
              <p className="text-xs text-[#8A91A3] mb-1 font-mono">Asserted Claim:</p>
              <p className="text-sm font-medium text-[#E6E8EE]">"{claim.text}"</p>
            </div>

            {/* Verdict & Current Value */}
            <div className="p-4 rounded-xl bg-[#12151C] border border-[#1F2430] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8A91A3]">Live Verdict</span>
                <ScoreBadge
                  score={claim.scoreBreakdown?.finalScore}
                  verdict={claim.verdict}
                  skipped={claim.skipped}
                  size="md"
                />
              </div>

              {claim.current_value && (
                <div className="pt-2 border-t border-[#1F2430]">
                  <p className="text-xs text-[#8A91A3] mb-1">Current Verified Value</p>
                  <p className="text-sm font-semibold font-mono text-[#22C55E]">
                    {claim.current_value}
                  </p>
                </div>
              )}

              {claim.explanation && (
                <div className="pt-2 border-t border-[#1F2430]">
                  <p className="text-xs text-[#8A91A3] mb-1">Explanation</p>
                  <p className="text-xs text-[#E6E8EE] leading-relaxed">
                    {claim.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Score Breakdown (Deterministic TRD Formula) */}
            {claim.scoreBreakdown && (
              <div className="p-4 rounded-xl bg-[#12151C] border border-[#1F2430] space-y-2">
                <p className="text-xs font-semibold text-[#E6E8EE] flex items-center justify-between">
                  <span>Freshness Score Calculation</span>
                  <span className="font-mono text-[#6366F1]">
                    {claim.scoreBreakdown.finalScore} / 100
                  </span>
                </p>
                <div className="text-[11px] font-mono space-y-1 text-[#8A91A3] pt-1">
                  <div className="flex justify-between">
                    <span>Base Score ({claim.verdict})</span>
                    <span className="text-[#E6E8EE]">{claim.scoreBreakdown.baseScore}</span>
                  </div>
                  {claim.scoreBreakdown.officialSourceBonus > 0 && (
                    <div className="flex justify-between text-[#22C55E]">
                      <span>+ Official source bonus</span>
                      <span>+{claim.scoreBreakdown.officialSourceBonus}</span>
                    </div>
                  )}
                  {claim.scoreBreakdown.multiDomainBonus > 0 && (
                    <div className="flex justify-between text-[#22C55E]">
                      <span>+ Multi-domain consensus</span>
                      <span>+{claim.scoreBreakdown.multiDomainBonus}</span>
                    </div>
                  )}
                  {claim.scoreBreakdown.stalenessPenalty > 0 && (
                    <div className="flex justify-between text-[#EF4444]">
                      <span>- Evidence older than 12m</span>
                      <span>-{claim.scoreBreakdown.stalenessPenalty}</span>
                    </div>
                  )}
                  {claim.scoreBreakdown.conflictPenalty > 0 && (
                    <div className="flex justify-between text-[#EF4444]">
                      <span>- Sources conflict</span>
                      <span>-{claim.scoreBreakdown.conflictPenalty}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tavily Evidence Citations */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#E6E8EE] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#6366F1]" />
                  Tavily Live Evidence ({claim.evidence?.length ?? 0})
                </p>
              </div>

              {(!claim.evidence || claim.evidence.length === 0) ? (
                <div className="p-4 rounded-xl bg-[#12151C] border border-[#1F2430] text-center text-xs text-[#8A91A3]">
                  No external URLs recorded for this claim.
                </div>
              ) : (
                <div className="space-y-2">
                  {claim.evidence.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#12151C] border border-[#1F2430] hover:border-[#6366F1]/40 transition-colors space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {item.is_official && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-mono">
                              Official
                            </span>
                          )}
                          <span className="text-xs font-mono text-[#8A91A3]">
                            {item.domain}
                          </span>
                        </div>
                        {item.published_date && (
                          <span className="text-[10px] font-mono text-[#8A91A3] flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.published_date}
                          </span>
                        )}
                      </div>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-[#E6E8EE] hover:text-[#6366F1] flex items-center gap-1 group line-clamp-1"
                      >
                        <span>{item.title}</span>
                        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                      </a>

                      <p className="text-[11px] text-[#8A91A3] line-clamp-2 leading-relaxed">
                        {item.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 mt-6 border-t border-[#1F2430] text-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-[#12151C] hover:bg-[#1F2430] border border-[#1F2430] text-xs font-medium text-[#E6E8EE] transition-colors"
            >
              Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
