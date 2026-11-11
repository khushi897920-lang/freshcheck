"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ScoreBadge } from "@/components/ScoreBadge";
import { ClaimCard } from "@/components/ClaimCard";
import { AnnotatedAnswer } from "@/components/AnnotatedAnswer";
import { EvidenceDrawer, DrawerClaimData } from "@/components/EvidenceDrawer";
import { CheckRecord } from "@/lib/db";
import {
  Share2,
  Check,
  ArrowLeft,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";

export default function CheckResultPage({ params }: { params: { id: string } }) {
  const [check, setCheck] = useState<CheckRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<DrawerClaimData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchCheck() {
      try {
        const res = await fetch(`/api/check/${params.id}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? "Check not found" : "Failed to load check");
        }
        const data = await res.json();
        setCheck(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchCheck();
  }, [params.id]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D12] text-[#E6E8EE] flex flex-col">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="inline-block animate-spin w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full" />
          <p className="text-xs font-mono text-[#8A91A3]">Loading verification report...</p>
        </main>
      </div>
    );
  }

  if (error || !check) {
    return (
      <div className="min-h-screen bg-[#0B0D12] text-[#E6E8EE] flex flex-col">
        <Navbar />
        <main className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#EF4444] mx-auto opacity-80" />
          <h1 className="text-xl font-bold">Check Not Found</h1>
          <p className="text-xs text-[#8A91A3]">{error || "The requested verification report does not exist."}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12151C] border border-[#1F2430] text-xs font-medium text-[#E6E8EE] hover:bg-[#1F2430]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Checker
          </a>
        </main>
      </div>
    );
  }

  const claimsList: DrawerClaimData[] = (check.claims || []).map((c: any) => ({
    id: c.id,
    idx: c.idx,
    text: c.text,
    claim_type: c.claim_type,
    volatility: c.volatility,
    entity: c.entity,
    attribute: c.attribute,
    verdict: c.verdict,
    current_value: c.current_value,
    explanation: c.explanation,
    scoreBreakdown: c.score_breakdown,
    evidence: c.evidence,
    skipped: c.skipped,
    start: c.start_offset,
    end: c.end_offset,
  }));

  const activeClaims = claimsList.filter((c) => !c.skipped);
  const freshCount = activeClaims.filter((c) => (c.scoreBreakdown?.finalScore ?? 0) >= 75).length;
  const uncertainCount = activeClaims.filter(
    (c) => (c.scoreBreakdown?.finalScore ?? 0) >= 40 && (c.scoreBreakdown?.finalScore ?? 0) < 75
  ).length;
  const staleCount = activeClaims.filter((c) => (c.scoreBreakdown?.finalScore ?? 0) < 40).length;
  const skippedCount = claimsList.filter((c) => c.skipped).length;

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#E6E8EE] flex flex-col">
      <Navbar fallbackBanner={check.fallback_used} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 space-y-8">
        {/* Header Navigation & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2430]">
          <div className="space-y-1">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#8A91A3] hover:text-[#E6E8EE] transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Run another check
            </a>
            <h1 className="text-2xl font-bold tracking-tight text-[#E6E8EE]">
              Verification Report
            </h1>
            <p className="text-xs font-mono text-[#8A91A3] flex items-center gap-2">
              <span>ID: {check.id}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {check.created_at ? new Date(check.created_at).toLocaleString() : "Recent"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#6366F1] hover:bg-[#6366F1]/90 text-white text-xs font-medium shadow-sm transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Link!" : "Copy Share Link"}</span>
          </button>
        </div>

        {/* Aggregate Score Ring & Stat Pills */}
        <div className="p-6 rounded-2xl bg-[#12151C] border border-[#1F2430] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-full bg-[#0B0D12] border-2 border-[#1F2430] flex items-center justify-center">
              <span className="text-2xl font-bold font-mono text-[#E6E8EE]">
                {check.overall_score ?? "--"}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-bold">Overall Freshness Score</h2>
                <ScoreBadge score={check.overall_score} size="sm" />
              </div>
              <p className="text-xs text-[#8A91A3]">
                Weighted mean across {activeClaims.length} active claims (high volatility 3x, medium 2x).
              </p>
            </div>
          </div>

          {/* Breakdown counts */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-xl bg-[#0B0D12] border border-[#1F2430] text-center min-w-[70px]">
              <span className="text-xs font-bold text-[#22C55E] block font-mono">{freshCount}</span>
              <span className="text-[10px] text-[#8A91A3]">Fresh</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-[#0B0D12] border border-[#1F2430] text-center min-w-[70px]">
              <span className="text-xs font-bold text-[#F59E0B] block font-mono">{uncertainCount}</span>
              <span className="text-[10px] text-[#8A91A3]">Uncertain</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-[#0B0D12] border border-[#1F2430] text-center min-w-[70px]">
              <span className="text-xs font-bold text-[#EF4444] block font-mono">{staleCount}</span>
              <span className="text-[10px] text-[#8A91A3]">Stale</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-[#0B0D12] border border-[#1F2430] text-center min-w-[70px]">
              <span className="text-xs font-bold text-[#8A91A3] block font-mono">{skippedCount}</span>
              <span className="text-[10px] text-[#8A91A3]">Skipped</span>
            </div>
          </div>
        </div>

        {/* Annotated Text View */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[#E6E8EE] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#6366F1]" />
            Annotated Answer (Click any claim to inspect live evidence)
          </h2>
          <AnnotatedAnswer
            originalText={check.input_text}
            claims={claimsList}
            onSelectClaim={setSelectedClaim}
            selectedClaimId={selectedClaim?.id}
          />
        </div>

        {/* Claim Cards Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[#E6E8EE] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#6366F1]" />
            Claim Verdicts &amp; Sources ({claimsList.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {claimsList.map((claim) => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                onSelect={setSelectedClaim}
                isSelected={claim.id === selectedClaim?.id}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Slide-out Evidence Drawer */}
      <EvidenceDrawer
        claim={selectedClaim}
        isOpen={selectedClaim !== null}
        onClose={() => setSelectedClaim(null)}
      />
    </div>
  );
}
