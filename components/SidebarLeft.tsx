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
  X,
  PanelLeftClose,
} from "lucide-react";

interface SidebarLeftProps {
  onNewCheck: () => void;
  activeTaskId?: string;
  isProcessing?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarLeft({
  onNewCheck,
  activeTaskId,
  isProcessing = false,
  isOpen,
  onClose,
}: SidebarLeftProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile & Tablet Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 sm:w-64 max-w-[85vw] flex-shrink-0 bg-[#EFECE6] border-r border-[#E0DACF] flex flex-col justify-between p-3.5 select-none text-[#2D3139] text-xs font-sans shadow-2xl lg:shadow-none transition-transform duration-200 ease-in-out`}
      >
        {/* Top Section */}
        <div className="space-y-4">
          {/* Workspace Brand Header */}
          <div className="flex items-center justify-between px-1.5 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-6.5 h-6.5 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/30 flex items-center justify-center text-[#6366F1]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-tight text-[#0F172A]">
                FreshCheck
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1.5 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#E5E0D7] transition-colors cursor-pointer"
                title="Search (⌘K)"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
              {/* Close Button on Mobile / Desktop */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#E5E0D7] transition-colors cursor-pointer"
                title="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* New Check Button */}
          <button
            type="button"
            onClick={() => {
              onNewCheck();
              if (typeof window !== "undefined" && window.innerWidth < 1024) {
                onClose();
              }
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD7CD] hover:border-[#6366F1]/50 shadow-xs font-semibold text-xs text-[#0F172A] transition-all cursor-pointer group min-h-[42px]"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-[#6366F1] group-hover:scale-110 transition-transform" />
              <span>New check</span>
            </div>
            <span className="text-[10px] font-mono text-[#64748B] bg-slate-100 px-1.5 py-0.5 rounded">⌘N</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-0.5">
            <Link
              href="/"
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 1024) onClose();
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#0F172A] bg-[#E5E0D7]/80 font-semibold text-xs min-h-[38px]"
            >
              <Search className="w-3.5 h-3.5 text-[#6366F1]" />
              <span>Search &amp; verify</span>
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 1024) onClose();
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#334155] hover:text-[#0F172A] hover:bg-[#E5E0D7]/50 font-medium transition-colors text-xs min-h-[38px]"
            >
              <Cpu className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Bifrost gateway</span>
            </Link>
            <a
              href="https://tavily.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#334155] hover:text-[#0F172A] hover:bg-[#E5E0D7]/50 font-medium transition-colors text-xs min-h-[38px]"
            >
              <Globe className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Tavily intelligence</span>
            </a>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#334155] hover:text-[#0F172A] hover:bg-[#E5E0D7]/50 font-medium transition-colors text-xs min-h-[38px] cursor-pointer">
              <FileText className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Reports &amp; files</span>
            </div>
          </nav>

          {/* Active Tasks & Pipeline Status */}
          <div className="pt-2 border-t border-[#E0DACF]/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] px-2 uppercase tracking-wider">
              <span>Tasks</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-[#64748B]">
                  {isProcessing ? "1 RUNNING" : "READY"}
                </span>
                <ChevronDown className="w-3 h-3 text-[#64748B]" />
              </div>
            </div>

            <div className="space-y-1.5 px-1">
              <div className="p-2.5 rounded-xl bg-white/90 border border-[#DDD7CD] shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#0F172A] text-xs truncate">
                    {isProcessing ? "Verifying factual claims..." : "Ready for input"}
                  </span>
                  {isProcessing ? (
                    <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-ping" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  )}
                </div>
                <p className="text-[11px] text-[#64748B] font-mono">
                  {isProcessing ? "Active · Bifrost & Tavily" : "Idle · Standing by"}
                </p>
              </div>

              <div className="p-2 rounded-lg bg-transparent hover:bg-white/40 transition-colors space-y-0.5">
                <p className="text-xs font-semibold text-[#0F172A] truncate">
                  Tavily Query Cache
                </p>
                <p className="text-[11px] text-[#64748B]">24-hour TTL active</p>
              </div>

              <div className="p-2 rounded-lg bg-transparent hover:bg-white/40 transition-colors space-y-0.5">
                <p className="text-xs font-semibold text-[#0F172A] truncate">
                  Bifrost Failover Pool
                </p>
                <p className="text-[11px] text-[#64748B]">Gemini 1.5 ➔ Llama 3.1</p>
              </div>
            </div>
          </div>

          {/* Scheduled / Benchmarks Section */}
          <div className="pt-2 border-t border-[#E0DACF]/70 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] px-2 uppercase tracking-wider">
              <span>Benchmarks</span>
              <span className="text-[10px] font-mono text-[#64748B]">3 LIVE</span>
            </div>

            <div className="space-y-1 px-1">
              <div className="flex items-center gap-2 p-2 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-white/60 transition-colors cursor-pointer font-medium text-xs">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="truncate">Node.js LTS Version Check</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-white/60 transition-colors cursor-pointer font-medium text-xs">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="truncate">YouTube / Twitter Leadership</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-white/60 transition-colors cursor-pointer font-medium text-xs">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="truncate">OpenAI GPT-3.5 Pricing Drift</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Profile Pill */}
        <div className="pt-3 border-t border-[#E0DACF] space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#DDD7CD] shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#6366F1] text-white font-bold flex items-center justify-center text-xs">
                FC
              </div>
              <div>
                <p className="font-bold text-xs text-[#0F172A]">FreshCheck Cowork</p>
                <p className="text-[10px] text-[#64748B] font-medium">Auditor · Member</p>
              </div>
            </div>
            <button
              type="button"
              className="p-1.5 rounded-md text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          <Link
            href="/how-it-works"
            className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] px-1 py-0.5 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>How it works</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
