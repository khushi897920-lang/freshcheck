"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  RotateCw,
  Sparkles,
  Layers,
  ShieldCheck,
  Check,
  Cpu,
  BarChart2,
  FileSpreadsheet,
} from "lucide-react";
import { DrawerClaimData } from "./EvidenceDrawer";
import { downloadMarkdown, generateMarkdownReport } from "@/lib/exportMarkdown";

interface SidebarRightProps {
  checkId?: string | null;
  overallScore?: number | null;
  claims: DrawerClaimData[];
  inputText?: string;
  onSelectClaim?: (claim: DrawerClaimData) => void;
  onLoadBenchmark?: (type: string) => void;
}

export function SidebarRight({
  checkId,
  overallScore,
  claims,
  inputText,
  onSelectClaim,
  onLoadBenchmark,
}: SidebarRightProps) {
  const [activeTab, setActiveTab] = useState<"Reports" | "Evidence" | "Usage">("Reports");
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (!inputText) return;
    const md = generateMarkdownReport(inputText, overallScore ?? null, claims, checkId);
    downloadMarkdown(`freshcheck-audit-${checkId || "session"}.md`, md);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const activeClaims = claims.filter((c) => !c.skipped);
  const staleCount = activeClaims.filter((c) => (c.scoreBreakdown?.finalScore ?? 0) < 40).length;
  const freshCount = activeClaims.filter((c) => (c.scoreBreakdown?.finalScore ?? 0) >= 75).length;

  return (
    <aside className="w-80 flex-shrink-0 bg-[#F8FAFD] border-l border-[#E2E8F0] flex flex-col justify-between select-none text-[#2D3139] text-xs overflow-y-auto">
      <div className="p-3.5 space-y-4">
        {/* Top Tab Bar */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2 text-[11px] font-medium text-[#64748B]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("Reports")}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === "Reports"
                  ? "text-[#1E232B] font-semibold border-b-2 border-[#6366F1]"
                  : "hover:text-[#1E232B]"
              }`}
            >
              Reports
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Evidence")}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === "Evidence"
                  ? "text-[#1E232B] font-semibold border-b-2 border-[#6366F1]"
                  : "hover:text-[#1E232B]"
              }`}
            >
              Evidence
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Usage")}
              className={`pb-1 transition-colors cursor-pointer ${
                activeTab === "Usage"
                  ? "text-[#1E232B] font-semibold border-b-2 border-[#6366F1]"
                  : "hover:text-[#1E232B]"
              }`}
            >
              Usage &amp; Quotas
            </button>
          </div>
          <button
            type="button"
            className="p-1 rounded text-[#94A3B8] hover:text-[#1E232B]"
            title="Refresh"
          >
            <RotateCw className="w-3 h-3" />
          </button>
        </div>

        {/* Sub-Pills */}
        <div className="flex items-center gap-1.5 bg-[#EDF2F7] p-1 rounded-lg text-[10px] font-medium text-[#64748B]">
          <button
            type="button"
            className="flex-1 py-1 rounded-md text-center bg-white text-[#1E232B] shadow-xs cursor-pointer font-semibold"
          >
            Audits &amp; Proofs
          </button>
          <button
            type="button"
            className="flex-1 py-1 rounded-md text-center hover:text-[#1E232B] cursor-pointer"
          >
            Live Logs
          </button>
        </div>

        {/* Status Card */}
        <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-[11px] text-[#1E232B]">
                Verification &amp; Disclosures
              </span>
            </div>
            <RotateCw className="w-3 h-3 text-[#94A3B8] hover:text-[#1E232B] cursor-pointer" />
          </div>
          <p className="text-[10px] text-[#64748B] leading-relaxed">
            Every score is anchored to live Tavily search snippets and arbitrated by Bifrost.
          </p>
        </div>

        {/* Tab 1: Reports Section */}
        {activeTab === "Reports" && (
          <>
            {/* YOUR REPORTS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-1">
                <span>Your Reports</span>
                <span className="text-[10px] font-mono text-[#94A3B8]">
                  {claims.length > 0 ? "1 ACTIVE" : "0"}
                </span>
              </div>

              {claims.length > 0 ? (
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-[11px] text-[#1E232B] line-clamp-1">
                        FreshCheck Report #{checkId ? checkId.slice(0, 8) : "Current"}
                      </h4>
                      <p className="text-[10px] text-[#64748B] font-mono">
                        Bifrost v1 · Tavily · Score: {overallScore ?? "--"}/100
                      </p>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                        (overallScore ?? 0) >= 75
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : (overallScore ?? 0) < 40
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {(overallScore ?? 0) >= 75 ? "fresh" : (overallScore ?? 0) < 40 ? "stale" : "uncertain"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#64748B] bg-[#F8FAFD] p-1.5 rounded-lg border border-[#EDF2F7]">
                    <span className="text-[#10B981] font-semibold">✓ {freshCount} fresh</span>
                    <span>•</span>
                    <span className="text-[#EF4444] font-semibold">✕ {staleCount} stale</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-[#F1F5F9]">
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-[#EDF2F7] hover:bg-[#E2E8F0] text-[10px] font-medium text-[#1E232B] flex items-center justify-center gap-1 transition-colors"
                    >
                      {downloaded ? <Check className="w-3 h-3 text-[#10B981]" /> : <Download className="w-3 h-3 text-[#64748B]" />}
                      <span>{downloaded ? "Saved" : "Download"}</span>
                    </button>
                    {onSelectClaim && claims.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onSelectClaim(claims[0])}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-[#EDF2F7] hover:bg-[#E2E8F0] text-[10px] font-medium text-[#1E232B] flex items-center justify-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 text-[#64748B]" />
                        <span>Evidence</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white border border-dashed border-[#E2E8F0] text-center text-[#94A3B8] text-[11px]">
                  No reports generated yet. Run a check to view.
                </div>
              )}
            </div>

            {/* GENERATE A NEW REPORT / BENCHMARK PRESETS */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-1 block">
                Benchmark Presets
              </span>

              <div className="space-y-1.5">
                {[
                  { id: "api-versions", title: "Node.js & Python Deprecations", desc: "LTS release lifecycle audit" },
                  { id: "company-leadership", title: "Corporate Leadership Audit", desc: "CEO & C-suite tenure verification" },
                  { id: "pricing-and-models", title: "SaaS Pricing & Token Drift", desc: "Model pricing tier updates" },
                  { id: "sebi-regulations", title: "Compliance & Regulations", desc: "Legal & regulatory compliance statements" },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onLoadBenchmark && onLoadBenchmark(item.id)}
                    className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#6366F1]/50 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <h5 className="font-semibold text-[11px] text-[#1E232B] group-hover:text-[#6366F1] transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-[#64748B]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Evidence List */}
        {activeTab === "Evidence" && (
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-1 block">
              Live Sources ({claims.reduce((acc, c) => acc + (c.evidence?.length ?? 0), 0)})
            </span>
            {claims.flatMap((c) => c.evidence || []).length === 0 ? (
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] text-center text-[#94A3B8] text-[11px]">
                No sources extracted yet.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto">
                {claims.flatMap((c) => c.evidence || []).map((ev, i) => (
                  <a
                    key={i}
                    href={ev.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-2 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#6366F1] transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#6366F1] font-mono">
                      <span>{ev.domain}</span>
                      {ev.is_official && (
                        <span className="text-emerald-700 bg-emerald-50 px-1 rounded text-[9px]">
                          Official
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-[#1E232B] line-clamp-1">{ev.title}</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Usage & Quotas */}
        {activeTab === "Usage" && (
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-1 block">
              Quota Protection Guard
            </span>
            <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#64748B]">Tavily Monthly Credits</span>
                <span className="font-mono font-semibold text-[#1E232B]">1,000 / mo</span>
              </div>
              <div className="w-full bg-[#EDF2F7] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#10B981] h-full w-[8%]" />
              </div>
              <p className="text-[10px] text-[#64748B]">
                Max 8 claims per check · 24-hr query cache enabled.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
              <span className="text-[10px] text-[#64748B] block font-mono">Bifrost Gateway</span>
              <p className="text-[11px] font-semibold text-[#1E232B]">
                Primary: Gemini 1.5 Flash
              </p>
              <p className="text-[10px] text-[#64748B]">
                Fallback: Llama 3.1 8B Instant
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Proof Note */}
      <div className="p-3.5 border-t border-[#E2E8F0] text-[10px] text-[#94A3B8] leading-relaxed">
        Each report is rendered from your input claims and anchored with Tavily web evidence and Bifrost routing logs.
      </div>
    </aside>
  );
}
