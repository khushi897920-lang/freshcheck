"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SidebarLeft } from "@/components/SidebarLeft";
import { SidebarRight } from "@/components/SidebarRight";
import { CenterWorkspace } from "@/components/CenterWorkspace";
import { EvidenceDrawer, DrawerClaimData } from "@/components/EvidenceDrawer";
import { CheckRecord } from "@/lib/db";
import { SampleAnswer, SAMPLE_ANSWERS } from "@/data/samples";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function CheckResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [check, setCheck] = useState<CheckRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<DrawerClaimData | null>(null);
  const [text, setText] = useState("");
  const [answerDate, setAnswerDate] = useState("");
  const [claims, setClaims] = useState<DrawerClaimData[]>([]);

  // Responsive sidebar visibility state
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLeftSidebarOpen(window.innerWidth >= 1024);
      setIsRightSidebarOpen(window.innerWidth >= 1280);
    }
  }, []);

  const handleToggleLeftSidebar = () => setIsLeftSidebarOpen((prev) => !prev);
  const handleToggleRightSidebar = () => setIsRightSidebarOpen((prev) => !prev);

  useEffect(() => {
    async function fetchCheck() {
      if (!id) return;
      try {
        const res = await fetch(`/api/check/${id}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? "Check not found" : "Failed to load check");
        }
        const data: CheckRecord = await res.json();
        setCheck(data);
        setText(data.input_text);
        if (data.answer_date) setAnswerDate(data.answer_date);

        const mappedClaims: DrawerClaimData[] = (data.claims || []).map((c: any) => ({
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
        setClaims(mappedClaims);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchCheck();
  }, [id]);

  const handleNewCheck = () => {
    router.push("/");
  };

  const handleSelectSample = (sample: SampleAnswer) => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#DCE6F5] via-[#E7EDF9] to-[#E3EAF7] font-sans">
        <div className="p-6 rounded-2xl bg-white shadow-window border border-[#E2E8F0] flex items-center gap-3 text-xs text-[#1E232B] font-medium">
          <img src="/favicon.svg" alt="FreshCheck Logo" className="w-5 h-5 rounded-md animate-pulse" />
          <span>Loading verification report...</span>
        </div>
      </div>
    );
  }

  if (error || !check) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#DCE6F5] via-[#E7EDF9] to-[#E3EAF7] font-sans">
        <div className="p-8 rounded-2xl bg-white shadow-window border border-[#E2E8F0] text-center max-w-sm space-y-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[#1E232B]">Report Not Found</h2>
          <p className="text-xs text-[#64748B]">
            {error || "The requested verification report does not exist."}
          </p>
          <button
            type="button"
            onClick={handleNewCheck}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366F1] text-white text-xs font-semibold cursor-pointer hover:bg-[#4F46E5] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Start New Check
          </button>
        </div>
      </div>
    );
  }

  const activeClaims = claims.filter((c) => !c.skipped);
  const summaryCounts = {
    fresh: activeClaims.filter((c) => (c.scoreBreakdown?.finalScore ?? 0) >= 75).length,
    uncertain: activeClaims.filter(
      (c) => (c.scoreBreakdown?.finalScore ?? 0) >= 40 && (c.scoreBreakdown?.finalScore ?? 0) < 75
    ).length,
    stale: activeClaims.filter((c) => (c.scoreBreakdown?.finalScore ?? 0) < 40).length,
    skipped: claims.filter((c) => c.skipped).length,
  };

  return (
    <div className="h-[100dvh] w-screen flex flex-row overflow-hidden bg-gradient-to-br from-[#DCE6F5] via-[#E7EDF9] to-[#E3EAF7]">
      {/* Left Sidebar */}
      <SidebarLeft
        isOpen={isLeftSidebarOpen}
        onClose={() => setIsLeftSidebarOpen(false)}
        onNewCheck={handleNewCheck}
        isProcessing={false}
        activeTaskId={check.id}
      />

      {/* Center White Rounded Card Workspace */}
      <CenterWorkspace
        text={text}
        setText={setText}
        answerDate={answerDate}
        setAnswerDate={setAnswerDate}
        isChecking={false}
        step="done"
        claims={claims}
        overallScore={check.overall_score ?? null}
        summaryCounts={summaryCounts}
        fallbackUsed={check.fallback_used ?? false}
        errorMessage={null}
        selectedClaim={selectedClaim}
        onSelectClaim={setSelectedClaim}
        onCheckFreshness={handleNewCheck}
        onSelectSample={handleSelectSample}
        onToggleLeftSidebar={handleToggleLeftSidebar}
        onToggleRightSidebar={handleToggleRightSidebar}
        isLeftSidebarOpen={isLeftSidebarOpen}
        isRightSidebarOpen={isRightSidebarOpen}
      />

      {/* Right Sidebar */}
      <SidebarRight
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
        checkId={check.id}
        overallScore={check.overall_score ?? null}
        claims={claims}
        inputText={text}
        onSelectClaim={setSelectedClaim}
        onLoadBenchmark={() => router.push("/")}
      />

      {/* Slide-out Evidence Drawer */}
      <EvidenceDrawer
        claim={selectedClaim}
        isOpen={selectedClaim !== null}
        onClose={() => setSelectedClaim(null)}
      />
    </div>
  );
}
