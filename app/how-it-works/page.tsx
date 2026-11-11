import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft, Cpu, Globe, Scale, RefreshCw, Zap, ShieldAlert } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#E6E8EE] flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12 flex-1 space-y-12">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#8A91A3] hover:text-[#E6E8EE] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to FreshCheck
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            How FreshCheck Works
          </h1>
          <p className="text-base text-[#8A91A3] max-w-2xl leading-relaxed">
            LLMs expire silently. FreshCheck acts as a real-time temporal verification layer, combining Bifrost AI gateway intelligence with Tavily live web retrieval.
          </p>
        </div>

        {/* Dual Mandatory Tech Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bifrost Card */}
          <div className="p-6 rounded-2xl bg-[#12151C] border border-[#1F2430] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1]">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Bifrost by Maxim AI</h2>
            <p className="text-xs font-mono text-[#6366F1]">Centralized AI Gateway & Routing Layer</p>
            <ul className="text-xs text-[#8A91A3] space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">✓</span>
                <span><strong>Atomic Claim Extraction:</strong> Decomposes arbitrary paragraphs into checkable factual statements with volatility tags.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">✓</span>
                <span><strong>Evidence Judging:</strong> Evaluates factual truth alignment between assertions and live web snippets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">✓</span>
                <span><strong>Automatic Failover:</strong> Seamlessly routes from primary model (e.g. Gemini 1.5 Flash) to fallback model (e.g. Llama 3.1) with zero user disruption.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">✓</span>
                <span><strong>Telemetry & Governance:</strong> Unified dashboard tracking token counts, latency, and request costs.</span>
              </li>
            </ul>
          </div>

          {/* Tavily Card */}
          <div className="p-6 rounded-2xl bg-[#12151C] border border-[#1F2430] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Tavily Web Intelligence</h2>
            <p className="text-xs font-mono text-[#22C55E]">Real-Time Ground-Truth Retrieval</p>
            <ul className="text-xs text-[#8A91A3] space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">✓</span>
                <span><strong>Live Search:</strong> Pulls authoritative snippets, published dates, and verified source URLs from the live web.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">✓</span>
                <span><strong>Topic Routing:</strong> Routes leadership and corporate status to <code>news</code> topic, general documentation to <code>general</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">✓</span>
                <span><strong>Strict Honesty Rule:</strong> A claim cannot receive a verified verdict unless backed by a real Tavily result URL. Zero fabricated citations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">✓</span>
                <span><strong>24-Hour Quota Cache:</strong> Search queries are hashed and cached to strictly protect free-tier quotas.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4-Step Verification Pipeline */}
        <div className="p-6 rounded-2xl bg-[#12151C] border border-[#1F2430] space-y-6">
          <h2 className="text-lg font-bold text-[#E6E8EE]">The 4-Step Verification Engine</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#1F2430] space-y-2">
              <span className="text-xs font-mono text-[#6366F1]">Step 1</span>
              <h3 className="text-sm font-semibold text-[#E6E8EE]">1. Extract & Classify</h3>
              <p className="text-xs text-[#8A91A3] leading-relaxed">
                The input answer is parsed via Bifrost into discrete atomic claims with character offsets. Stable historical facts are skipped to preserve search quota.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#1F2430] space-y-2">
              <span className="text-xs font-mono text-[#6366F1]">Step 2</span>
              <h3 className="text-sm font-semibold text-[#E6E8EE]">2. Real-Time Search</h3>
              <p className="text-xs text-[#8A91A3] leading-relaxed">
                Targeted queries are synthesized using <code>{"{entity} {attribute} latest {current year}"}</code> and dispatched to Tavily Search with 24-hr caching.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#1F2430] space-y-2">
              <span className="text-xs font-mono text-[#6366F1]">Step 3</span>
              <h3 className="text-sm font-semibold text-[#E6E8EE]">3. Evidence Evaluation</h3>
              <p className="text-xs text-[#8A91A3] leading-relaxed">
                Bifrost compares each claim against the retrieved evidence to assign a verdict: <code>SUPPORTED</code>, <code>PARTIALLY_SUPPORTED</code>, <code>OUTDATED</code>, or <code>UNVERIFIABLE</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#1F2430] space-y-2">
              <span className="text-xs font-mono text-[#6366F1]">Step 4</span>
              <h3 className="text-sm font-semibold text-[#E6E8EE]">4. Deterministic Scoring</h3>
              <p className="text-xs text-[#8A91A3] leading-relaxed">
                A mathematical formula in plain code computes a calibrated 0–100 Freshness Index. The LLM never hallucinates the score.
              </p>
            </div>
          </div>
        </div>

        {/* Scoring Formula Table */}
        <div className="p-6 rounded-2xl bg-[#12151C] border border-[#1F2430] space-y-4">
          <h2 className="text-lg font-bold text-[#E6E8EE] flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#6366F1]" />
            Deterministic Scoring Calibration (lib/score.ts)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1F2430] text-[#8A91A3]">
                  <th className="py-2">Factor</th>
                  <th className="py-2">Condition</th>
                  <th className="py-2">Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2430]/60 text-[#E6E8EE]">
                <tr>
                  <td className="py-2.5">Base Verdict</td>
                  <td>SUPPORTED / PARTIAL / UNVERIFIABLE / OUTDATED</td>
                  <td>90 / 60 / 40 / 10</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#22C55E]">Official Source</td>
                  <td>Originates from entity docs, .gov, or .edu</td>
                  <td className="text-[#22C55E]">+5</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#22C55E]">Multi-Domain Consensus</td>
                  <td>Two or more independent domains corroborate</td>
                  <td className="text-[#22C55E]">+5</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#EF4444]">Stale Evidence Penalty</td>
                  <td>Supporting evidence &gt; 12 months old &amp; high volatility</td>
                  <td className="text-[#EF4444]">-10</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#EF4444]">Conflict Penalty</td>
                  <td>Discrepancy among retrieved sources</td>
                  <td className="text-[#EF4444]">-10</td>
                </tr>
                <tr>
                  <td className="py-2.5">Volatility Weighting</td>
                  <td>High volatility (3x), Medium volatility (2x)</td>
                  <td>Weighted Average</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
