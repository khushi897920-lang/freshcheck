"use client";

import { useEffect } from "react";
import { X, ExternalLink, ShieldCheck, Calendar, Globe } from "lucide-react";
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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-[#E2E8F0] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto text-[#1E232B]">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B]">
                  {claim.claim_type || "Claim"}
                </span>
                <span className="text-xs font-mono text-[#64748B]">
                  volatility: {claim.volatility || "normal"}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E232B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                aria-label="Close evidence drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Claim Statement */}
            <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0]">
              <p className="text-[11px] text-[#64748B] mb-1 font-mono uppercase">Asserted Claim:</p>
              <p className="text-xs sm:text-sm font-medium text-[#1E232B] leading-relaxed">
                "{claim.text}"
              </p>
            </div>

            {/* Verdict & Current Value */}
            <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B] font-medium">Live Verdict</span>
                <ScoreBadge
                  score={claim.scoreBreakdown?.finalScore}
                  verdict={claim.verdict}
                  skipped={claim.skipped}
                  size="md"
                />
              </div>

              {claim.current_value && (
                <div className="pt-2 border-t border-[#E2E8F0]">
                  <p className="text-[11px] text-[#64748B] mb-1">Current Verified Value</p>
                  <p className="text-xs sm:text-sm font-semibold font-mono text-[#059669]">
                    {claim.current_value}
                  </p>
                </div>
              )}

              {claim.explanation && (
                <div className="pt-2 border-t border-[#E2E8F0]">
                  <p className="text-[11px] text-[#64748B] mb-1">Audit Explanation</p>
                  <p className="text-xs text-[#1E232B] leading-relaxed">
                    {claim.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Score Breakdown (Deterministic TRD Formula) */}
            {claim.scoreBreakdown && (
              <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#1E232B]">
                  <span>Freshness Score Calculation</span>
                  <span className="font-mono text-[#6366F1]">
                    {claim.scoreBreakdown.finalScore} / 100
                  </span>
                </div>
                <div className="text-[11px] font-mono space-y-1.5 text-[#64748B] pt-1">
                  <div className="flex justify-between">
                    <span>Base Score ({claim.verdict})</span>
                    <span className="text-[#1E232B] font-semibold">{claim.scoreBreakdown.baseScore}</span>
                  </div>
                  {claim.scoreBreakdown.officialSourceBonus > 0 && (
                    <div className="flex justify-between text-[#059669]">
                      <span>+ Official source bonus</span>
                      <span>+{claim.scoreBreakdown.officialSourceBonus}</span>
                    </div>
                  )}
                  {claim.scoreBreakdown.multiDomainBonus > 0 && (
                    <div className="flex justify-between text-[#059669]">
                      <span>+ Multi-domain consensus</span>
                      <span>+{claim.scoreBreakdown.multiDomainBonus}</span>
                    </div>
                  )}
                  {claim.scoreBreakdown.stalenessPenalty > 0 && (
                    <div className="flex justify-between text-[#DC2626]">
                      <span>- Evidence older than 12m</span>
                      <span>-{claim.scoreBreakdown.stalenessPenalty}</span>
                    </div>
                  )}
                  {claim.scoreBreakdown.conflictPenalty > 0 && (
                    <div className="flex justify-between text-[#DC2626]">
                      <span>- Sources conflict</span>
                      <span>-{claim.scoreBreakdown.conflictPenalty}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tavily Evidence Citations */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-[#1E232B] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#6366F1]" />
                Tavily Live Web Evidence ({claim.evidence?.length ?? 0})
              </p>

              {(!claim.evidence || claim.evidence.length === 0) ? (
                <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] text-center text-xs text-[#64748B]">
                  No external URLs recorded for this claim.
                </div>
              ) : (
                <div className="space-y-2">
                  {claim.evidence.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] hover:border-[#6366F1]/50 transition-colors space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {item.is_official && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-medium">
                              Official
                            </span>
                          )}
                          <span className="text-xs font-mono text-[#64748B]">
                            {item.domain}
                          </span>
                        </div>
                        {item.published_date && (
                          <span className="text-[10px] font-mono text-[#64748B] flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.published_date}
                          </span>
                        )}
                      </div>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-[#1E232B] hover:text-[#6366F1] flex items-center gap-1 group line-clamp-1"
                      >
                        <span>{item.title}</span>
                        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                      </a>

                      <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                        {item.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 mt-6 border-t border-[#E2E8F0] text-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-medium text-[#1E232B] transition-colors cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
