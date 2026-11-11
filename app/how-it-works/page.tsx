import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft, Cpu, Globe, Scale, RefreshCw, Zap, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#6366F1]/30">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex-1 space-y-12 sm:space-y-16">
        {/* Header Hero */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to FreshCheck Cowork</span>
          </Link>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How FreshCheck Works
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed font-normal">
            LLMs expire silently. FreshCheck operates as a real-time temporal verification layer, combining <strong className="text-white font-semibold">Bifrost AI gateway</strong> orchestration with <strong className="text-white font-semibold">Tavily live web intelligence</strong>.
          </p>
        </div>

        {/* Dual Mandatory Tech Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Bifrost Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0C0D10] border border-[#222630] space-y-5 shadow-xl hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Mandatory Tech 1
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Bifrost by Maxim AI</h2>
              <p className="text-xs font-mono text-indigo-300 mt-1">Centralized AI Gateway & Routing Layer</p>
            </div>

            <ul className="text-xs sm:text-sm text-slate-200 space-y-3.5 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span><strong className="text-white font-semibold">Atomic Claim Extraction:</strong> Decomposes arbitrary paragraphs into checkable factual statements with start/end character offsets and volatility tags.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span><strong className="text-white font-semibold">Evidence Judging:</strong> Arbitrates factual alignment between assertions and live web snippets using structured Zod validation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span><strong className="text-white font-semibold">Automatic Gateway Failover:</strong> Seamlessly fails over from primary model (<code className="text-indigo-200 bg-white/10 px-1 py-0.5 rounded font-mono text-xs">gemini-1.5-flash</code>) to fallback (<code className="text-indigo-200 bg-white/10 px-1 py-0.5 rounded font-mono text-xs">llama-3.1-8b-instant</code>) with zero interruption.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span><strong className="text-white font-semibold">Telemetry & Governance:</strong> Unified dashboard tracking request latency, token counts, and error telemetry.</span>
              </li>
            </ul>
          </div>

          {/* Tavily Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0C0D10] border border-[#222630] space-y-5 shadow-xl hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Mandatory Tech 2
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Tavily Web Intelligence</h2>
              <p className="text-xs font-mono text-emerald-300 mt-1">Real-Time Ground-Truth Retrieval</p>
            </div>

            <ul className="text-xs sm:text-sm text-slate-200 space-y-3.5 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span><strong className="text-white font-semibold">Live Web Retrieval:</strong> Dispatches precision search queries for current facts, extracting dates, domains, and authoritative snippets.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span><strong className="text-white font-semibold">Intelligent Topic Routing:</strong> Routes executive tenure and announcements to the <code className="text-emerald-200 bg-white/10 px-1 py-0.5 rounded font-mono text-xs">news</code> topic; technical docs to <code className="text-emerald-200 bg-white/10 px-1 py-0.5 rounded font-mono text-xs">general</code>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span><strong className="text-white font-semibold">Strict Honesty Rule:</strong> A claim cannot receive a verified verdict unless backed by a real Tavily source URL. Zero fabricated citations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span><strong className="text-white font-semibold">24-Hour Quota Cache:</strong> Queries are hashed and cached for 24h to strictly protect monthly API quotas.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4-Step Verification Pipeline */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0C0D10] border border-[#222630] space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#222630] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">The 4-Step Verification Engine</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">Streamed in real-time to the UI via Server-Sent Events (SSE)</p>
            </div>
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="p-5 rounded-xl bg-black border border-[#222630] space-y-2.5">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Step 1</span>
              <h3 className="text-base font-bold text-white">1. Extract & Classify</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Input text is analyzed via Bifrost into discrete atomic claims with character offsets. Stable historical facts are skipped to preserve search quota.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-black border border-[#222630] space-y-2.5">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Step 2</span>
              <h3 className="text-base font-bold text-white">2. Real-Time Search</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Targeted queries are synthesized using <code className="text-indigo-200 bg-white/10 px-1 py-0.5 rounded font-mono text-xs">{"{entity} {attribute} latest {current year}"}</code> and dispatched to Tavily Search with 24-hr caching.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-black border border-[#222630] space-y-2.5">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Step 3</span>
              <h3 className="text-base font-bold text-white">3. Evidence Evaluation</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Bifrost compares each claim against the retrieved evidence to assign a verdict: <code className="text-emerald-300 font-mono text-xs">SUPPORTED</code>, <code className="text-amber-300 font-mono text-xs">PARTIAL</code>, <code className="text-rose-300 font-mono text-xs">OUTDATED</code>, or <code className="text-slate-300 font-mono text-xs">UNVERIFIABLE</code>.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-black border border-[#222630] space-y-2.5">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Step 4</span>
              <h3 className="text-base font-bold text-white">4. Deterministic Scoring</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                A calibrated mathematical formula in plain code (<code className="text-indigo-200 font-mono text-xs">lib/score.ts</code>) computes the 0–100 Freshness Index. The LLM never hallucinates the score.
              </p>
            </div>
          </div>
        </div>

        {/* Scoring Calibration Table */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0C0D10] border border-[#222630] space-y-5 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-[#222630] pb-4">
            <Scale className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Deterministic Scoring Matrix (lib/score.ts)</h2>
              <p className="text-xs text-slate-300 mt-0.5">Objective mathematical formula with zero LLM score hallucinations</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead>
                <tr className="border-b border-[#222630] text-slate-300 font-bold uppercase tracking-wider text-xs">
                  <th className="py-3 px-2">Factor</th>
                  <th className="py-3 px-2">Condition</th>
                  <th className="py-3 px-2">Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222630]/70 text-slate-200">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-semibold text-white">Base Verdict</td>
                  <td className="font-mono text-xs">SUPPORTED / PARTIAL / UNVERIFIABLE / OUTDATED</td>
                  <td className="font-mono font-bold text-white">90 / 60 / 40 / 10</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-semibold text-emerald-400">Official Source Bonus</td>
                  <td>Originates from entity docs, .gov, or verified domains</td>
                  <td className="font-mono font-bold text-emerald-400">+5</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-semibold text-emerald-400">Multi-Domain Consensus</td>
                  <td>Two or more independent domains corroborate the claim</td>
                  <td className="font-mono font-bold text-emerald-400">+5</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-semibold text-rose-400">Stale Evidence Penalty</td>
                  <td>Supporting evidence &gt; 12 months old on high volatility facts</td>
                  <td className="font-mono font-bold text-rose-400">-10</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-semibold text-rose-400">Conflict Penalty</td>
                  <td>Discrepancy among retrieved sources</td>
                  <td className="font-mono font-bold text-rose-400">-10</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-semibold text-white">Volatility Weighting</td>
                  <td>High volatility (3x weight), Medium volatility (2x weight)</td>
                  <td className="font-mono font-bold text-indigo-300">Weighted Average</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-black to-emerald-950/60 border border-white/15 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl font-bold text-white">Ready to Audit Your AI Answers?</h3>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Test our live benchmarks across API deprecations, executive leadership, SaaS pricing, and regulatory standards.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Launch FreshCheck Cowork</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
