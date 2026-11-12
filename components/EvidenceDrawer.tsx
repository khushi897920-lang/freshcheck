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

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-[#E2E8F0] p-4 sm:p-6 shadow-2xl flex flex-col justify-between overflow-y-auto text-[#1E232B]">
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
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
              <p className="text-xs text-slate-500 mb-1.5 font-mono uppercase font-bold tracking-wider">Asserted Claim:</p>
              <p className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                "{claim.text}"
              </p>
            </div>

            {/* Verdict & Current Value */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 font-bold">Live Verdict:</span>
                <ScoreBadge
                  score={claim.scoreBreakdown?.finalScore}
                  verdict={claim.verdict}
                  skipped={claim.skipped}
                  size="md"
                />
              </div>

              {claim.current_value && (
                <div className="pt-2.5 border-t border-slate-200">
                  <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-1">Current Truth Value:</p>
                  <p className="text-sm sm:text-base font-bold font-mono text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300">
                    {claim.current_value}
                  </p>
                </div>
              )}

              {claim.explanation && (
                <div className="pt-2.5 border-t border-slate-200">
                  <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-1">Audit Explanation:</p>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {claim.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Score Breakdown (Deterministic TRD Formula) */}
            {claim.scoreBreakdown && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900">
                  <span>Freshness Score Calculation</span>
                  <span className="font-mono text-indigo-700 font-extrabold text-sm sm:text-base">
                    {claim.scoreBreakdown.finalScore} / 100
                  </span>
                </div>
                <div className="text-xs font-mono space-y-1.5 text-slate-600 pt-1">
                  <div className="flex justify-between font-semibold">
                    <span>Base Score ({claim.verdict})</span>
                    <span className="text-slate-900">{claim.scoreBreakdown.baseScore}</span>
                  </div>
                  {claim.scoreBreakdown.officialSourceBonus > 0 && (
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>+ Official source bonus</span>
                      <span>+{claim.scoreBreakdown.officialSourceBonus}</span>
                    </div>
                  )}
                  {claim.scoreBreakdown.multiDomainBonus > 0 && (
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>+ Multi-domain consensus</span>
                      <span>+{claim.scoreBreakdown.multiDomainBonus}</span>
                    </div>
                  )}
                  {claim.scoreBreakdown.stalenessPenalty > 0 && (
                    <div className="flex justify-between text-rose-800 font-semibold">
                      <span>- Evidence older than 12m</span>
                      <span>-{claim.scoreBreakdown.stalenessPenalty}</span>
                    </div>
                  )}
                  {claim.scoreBreakdown.conflictPenalty > 0 && (
                    <div className="flex justify-between text-rose-800 font-semibold">
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
                        className="text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 flex items-center gap-1.5 group"
                      >
                        <span className="line-clamp-2">{item.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-500 opacity-80 group-hover:opacity-100 flex-shrink-0" />
                      </a>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-white p-2.5 rounded-lg border border-slate-200">
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
