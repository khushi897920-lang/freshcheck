"use client";

import Link from "next/link";
import {
  Search,
  Plus,
  FileText,
  Clock,
  Sparkles,
  Settings,
  ShieldCheck,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Globe,
} from "lucide-react";

interface SidebarLeftProps {
  onNewCheck: () => void;
  activeTaskId?: string;
  isProcessing?: boolean;
}

export function SidebarLeft({
  onNewCheck,
  activeTaskId,
  isProcessing = false,
}: SidebarLeftProps) {
  return (
    <aside className="w-64 flex-shrink-0 bg-[#EFECE6] border-r border-[#E0DACF] flex flex-col justify-between p-3.5 select-none text-[#2D3139] text-xs">
      {/* Top Section */}
      <div className="space-y-4">
        {/* Workspace Brand Header */}
        <div className="flex items-center justify-between px-1.5 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1]">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-[#1E232B]">
              FreshCheck
            </span>
          </div>
          <button
            type="button"
            className="p-1 rounded text-[#64748B] hover:text-[#1E232B] hover:bg-[#E5E0D7] transition-colors"
            title="Search (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* New Check Button */}
        <button
          type="button"
          onClick={onNewCheck}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-[#DDD7CD] hover:border-[#6366F1]/40 shadow-xs font-medium text-[#1E232B] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 text-[#6366F1] group-hover:scale-110 transition-transform" />
            <span>New check</span>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8]">⌘N</span>
        </button>

        {/* Navigation Links */}
        <nav className="space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[#1E232B] bg-[#E5E0D7]/70 font-medium"
          >
            <Search className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Search &amp; verify</span>
          </Link>
          <Link
            href="/how-it-works"
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[#64748B] hover:text-[#1E232B] hover:bg-[#E5E0D7]/40 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Bifrost gateway</span>
          </Link>
          <a
            href="https://tavily.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[#64748B] hover:text-[#1E232B] hover:bg-[#E5E0D7]/40 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Tavily intelligence</span>
          </a>
          <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[#64748B] hover:text-[#1E232B] hover:bg-[#E5E0D7]/40 transition-colors cursor-pointer">
            <FileText className="w-3.5 h-3.5" />
            <span>Reports &amp; files</span>
          </div>
        </nav>

        {/* Active Tasks & Pipeline Status */}
        <div className="pt-2 border-t border-[#E0DACF]/70 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B] px-2 uppercase tracking-wider">
            <span>Tasks</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-[#94A3B8]">
                {isProcessing ? "1 RUNNING" : "READY"}
              </span>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </div>
          </div>

          <div className="space-y-1.5 px-1">
            <div className="p-2 rounded-lg bg-white/70 border border-[#DDD7CD] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#1E232B] text-[11px] truncate">
                  {isProcessing ? "Verifying factual claims..." : "Ready for input"}
                </span>
                {isProcessing ? (
                  <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-ping" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                )}
              </div>
              <p className="text-[10px] text-[#64748B] font-mono">
                {isProcessing ? "Active • Bifrost & Tavily" : "Idle • Standing by"}
              </p>
            </div>

            <div className="p-2 rounded-lg bg-transparent hover:bg-white/40 transition-colors space-y-0.5">
              <p className="text-[11px] font-medium text-[#1E232B] truncate">
                Tavily Query Cache
              </p>
              <p className="text-[10px] text-[#64748B]">24-hour TTL active</p>
            </div>

            <div className="p-2 rounded-lg bg-transparent hover:bg-white/40 transition-colors space-y-0.5">
              <p className="text-[11px] font-medium text-[#1E232B] truncate">
                Bifrost Failover Pool
              </p>
              <p className="text-[10px] text-[#64748B]">Gemini 1.5 ➔ Llama 3.1</p>
            </div>
          </div>
        </div>

        {/* Scheduled / Recents Section */}
        <div className="pt-2 border-t border-[#E0DACF]/70 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B] px-2 uppercase tracking-wider">
            <span>Benchmarks</span>
            <span className="text-[10px] font-mono text-[#94A3B8]">3 LIVE</span>
          </div>

          <div className="space-y-1 px-1">
            <div className="flex items-center gap-2 p-1.5 rounded-lg text-[#64748B] hover:text-[#1E232B] hover:bg-white/50 transition-colors cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span className="truncate text-[11px]">Node.js LTS Version Check</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-lg text-[#64748B] hover:text-[#1E232B] hover:bg-white/50 transition-colors cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span className="truncate text-[11px]">YouTube / Twitter Leadership</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-lg text-[#64748B] hover:text-[#1E232B] hover:bg-white/50 transition-colors cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="truncate text-[11px]">OpenAI GPT-3.5 Pricing Drift</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Profile Pill */}
      <div className="pt-3 border-t border-[#E0DACF] space-y-2">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#DDD7CD]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#6366F1] text-white font-semibold flex items-center justify-center text-[10px]">
              FC
            </div>
            <div>
              <p className="font-semibold text-[11px] text-[#1E232B]">FreshCheck Cowork</p>
              <p className="text-[9px] text-[#64748B]">Auditor · Member</p>
            </div>
          </div>
          <button
            type="button"
            className="p-1 rounded text-[#94A3B8] hover:text-[#1E232B] transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        <Link
          href="/how-it-works"
          className="flex items-center gap-1.5 text-[10px] text-[#64748B] hover:text-[#1E232B] px-1 py-0.5 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>How it works</span>
        </Link>
      </div>
    </aside>
  );
}
