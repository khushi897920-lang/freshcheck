"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  RotateCw,
  ShieldCheck,
  Check,
  X,
  PanelRightClose,
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
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarRight({
  checkId,
  overallScore,
  claims,
  inputText,
  onSelectClaim,
  onLoadBenchmark,
  isOpen,
  onClose,
}: SidebarRightProps) {
  const [activeTab, setActiveTab] = useState<"Reports" | "Evidence" | "Usage">("Reports");
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

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
    <>
      {/* Mobile & Tablet Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 xl:hidden transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="fixed xl:static inset-y-0 right-0 z-50 w-80 max-w-[88vw] flex-shrink-0 bg-[#F8FAFD] border-l border-[#E2E8F0] flex flex-col justify-between select-none text-[#2D3139] text-xs font-sans overflow-y-auto scrollbar-none shadow-2xl xl:shadow-none transition-transform duration-200 ease-in-out">
        <div className="p-4 space-y-4">
          {/* Top Tab Bar & Close Button */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5 text-xs font-medium text-[#64748B]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("Reports")}
                className={`pb-1 transition-colors cursor-pointer text-xs ${
                  activeTab === "Reports"
                    ? "text-[#0F172A] font-bold border-b-2 border-[#6366F1]"
                    : "hover:text-[#0F172A]"
                }`}
              >
                Reports
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("Evidence")}
                className={`pb-1 transition-colors cursor-pointer text-xs ${
                  activeTab === "Evidence"
                    ? "text-[#0F172A] font-bold border-b-2 border-[#6366F1]"
                    : "hover:text-[#0F172A]"
                }`}
              >
                Evidence
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("Usage")}
                className={`pb-1 transition-colors cursor-pointer text-xs ${
                  activeTab === "Usage"
                    ? "text-[#0F172A] font-bold border-b-2 border-[#6366F1]"
                    : "hover:text-[#0F172A]"
                }`}
              >
                Quotas
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1.5 rounded text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                title="Refresh"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/50 transition-colors cursor-pointer"
                title="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-Pills */}
          <div className="flex items-center gap-1.5 bg-[#EDF2F7] p-1 rounded-lg text-xs font-medium text-[#64748B]">
            <button
              type="button"
              className="flex-1 py-1 rounded-md text-center bg-white text-[#0F172A] shadow-xs cursor-pointer font-bold"
            >
              Audits &amp; Proofs
            </button>
            <button
              type="button"
              className="flex-1 py-1 rounded-md text-center hover:text-[#0F172A] cursor-pointer"
            >
              Live Logs
            </button>
          </div>

          {/* Status Card */}
          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/favicon.svg"
                  alt="FreshCheck Logo"
                  className="w-5 h-5 max-w-[20px] max-h-[20px] object-contain rounded-md shadow-2xs flex-shrink-0"
                />
                <span className="font-bold text-xs text-[#0F172A]">
                  Verification &amp; Disclosures
                </span>
              </div>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Every score is anchored to live Tavily search snippets and arbitrated by Bifrost.
            </p>
          </div>

          {/* Tab 1: Reports Section */}
          {activeTab === "Reports" && (
            <>
              {/* YOUR REPORTS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-1">
                  <span>Your Reports</span>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    {claims.length > 0 ? "1 ACTIVE" : "0"}
                  </span>
                </div>

                {claims.length > 0 ? (
                  <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-[#0F172A] line-clamp-1">
                          FreshCheck Report #{checkId ? checkId.slice(0, 8) : "Current"}
                        </h4>
                        <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                          Bifrost v1 · Tavily · Score: {overallScore ?? "--"}/100
                        </p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                          (overallScore ?? 0) >= 75
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : (overallScore ?? 0) < 40
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {(overallScore ?? 0) >= 75 ? "fresh" : (overallScore ?? 0) < 40 ? "stale" : "uncertain"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono bg-[#F8FAFD] p-2 rounded-lg border border-[#EDF2F7]">
                      <span className="text-[#059669] font-bold">✓ {freshCount} fresh</span>
                      <span>•</span>
                      <span className="text-[#DC2626] font-bold">✕ {staleCount} stale</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-[#F1F5F9]">
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#EDF2F7] hover:bg-[#E2E8F0] text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {downloaded ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Download className="w-3.5 h-3.5 text-[#64748B]" />}
                        <span>{downloaded ? "Saved" : "Download"}</span>
                      </button>
                      {onSelectClaim && claims.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectClaim(claims[0]);
                            if (typeof window !== "undefined" && window.innerWidth < 768) {
                              onClose();
                            }
                          }}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#EDF2F7] hover:bg-[#E2E8F0] text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                          <span>Evidence</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white border border-dashed border-[#E2E8F0] text-center text-[#64748B] text-xs">
                    No reports generated yet. Run a check to view.
                  </div>
                )}
              </div>

              {/* GENERATE A NEW REPORT / BENCHMARK PRESETS */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-1 block">
                  Benchmark Presets
                </span>

                <div className="space-y-2">
                  {[
                    { id: "api-versions", title: "Node.js & Python Deprecations", desc: "LTS release lifecycle audit" },
                    { id: "company-leadership", title: "Corporate Leadership Audit", desc: "CEO & C-suite tenure verification" },
                    { id: "pricing-and-models", title: "SaaS Pricing & Token Drift", desc: "Model pricing tier updates" },
                    { id: "sebi-regulations", title: "Compliance & Regulations", desc: "Legal & regulatory compliance statements" },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onLoadBenchmark && onLoadBenchmark(item.id);
                        if (typeof window !== "undefined" && window.innerWidth < 768) {
                          onClose();
                        }
                      }}
                      className="p-3 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#6366F1]/50 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <h5 className="font-bold text-xs text-[#0F172A] group-hover:text-[#6366F1] transition-colors">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-[#475569] mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tab 2: Evidence List */}
          {activeTab === "Evidence" && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-1 block">
                Live Sources ({claims.reduce((acc, c) => acc + (c.evidence?.length ?? 0), 0)})
              </span>
              {claims.flatMap((c) => c.evidence || []).length === 0 ? (
                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] text-center text-[#64748B] text-xs">
                  No sources extracted yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto">
                  {claims.flatMap((c) => c.evidence || []).map((ev, i) => (
                    <a
                      key={i}
                      href={ev.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-3 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#6366F1] transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs text-[#4F46E5] font-mono font-medium">
                        <span>{ev.domain}</span>
                        {ev.is_official && (
                          <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            Official
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#0F172A] line-clamp-1">{ev.title}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Usage & Quotas */}
          {activeTab === "Usage" && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-1 block">
                Quota Protection Guard
              </span>
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#475569] font-medium">Tavily Monthly Credits</span>
                  <span className="font-mono font-bold text-[#0F172A]">1,000 / mo</span>
                </div>
                <div className="w-full bg-[#EDF2F7] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#10B981] h-full w-[8%]" />
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Max 8 claims per check · 24-hr query cache enabled to protect free tier.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1.5">
                <span className="text-xs text-[#64748B] block font-mono font-semibold">Bifrost Gateway</span>
                <p className="text-xs font-bold text-[#0F172A]">
                  Active Gateway: Bifrost Container (:8080)
                </p>
                <p className="text-xs text-[#475569]">
                  Provider: Groq High-Speed Inference
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Proof Note */}
        <div className="p-4 border-t border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed">
          Each report is rendered from your input claims and anchored with Tavily web evidence and Bifrost routing logs.
        </div>
      </aside>
    </>
  );
}
