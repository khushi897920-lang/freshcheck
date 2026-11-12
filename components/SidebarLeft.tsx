"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Settings,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  X,
  Trash2,
  Sparkles,
} from "lucide-react";

export interface HistoryItem {
  id: string;
  input_text: string;
  overall_score?: number | null;
  status: "processing" | "done" | "failed";
  created_at?: string;
}

interface SidebarLeftProps {
  onNewCheck: () => void;
  activeTaskId?: string;
  isProcessing?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onLoadBenchmark?: (id: string) => void;
  history?: HistoryItem[];
  onSelectCheck?: (id: string) => void;
  onDeleteCheck?: (id: string) => void;
  isLoadingHistory?: boolean;
}

function formatSingleLineTitle(text: string): string {
  if (!text) return "Untitled check";
  const cleaned = text.trim().replace(/\s+/g, " ");
  return cleaned;
}

function groupHistoryByDate(items: HistoryItem[]) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;
  const startOf7Days = startOfToday - 7 * 86400000;
  const startOf30Days = startOfToday - 30 * 86400000;

  const groups: { label: string; items: HistoryItem[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Previous 7 Days", items: [] },
    { label: "Previous 30 Days", items: [] },
    { label: "Older", items: [] },
  ];

  for (const item of items) {
    if (!item.created_at) {
      groups[4].items.push(item);
      continue;
    }
    const t = new Date(item.created_at).getTime();
    if (t >= startOfToday) {
      groups[0].items.push(item);
    } else if (t >= startOfYesterday) {
      groups[1].items.push(item);
    } else if (t >= startOf7Days) {
      groups[2].items.push(item);
    } else if (t >= startOf30Days) {
      groups[3].items.push(item);
    } else {
      groups[4].items.push(item);
    }
  }

  return groups.filter((g) => g.items.length > 0);
}

function renderScoreBadge(score?: number | null) {
  if (score === null || score === undefined) return null;
  if (score >= 75) {
    return (
      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded leading-none">
        {score}%
      </span>
    );
  }
  if (score >= 40) {
    return (
      <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded leading-none">
        {score}%
      </span>
    );
  }
  return (
    <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded leading-none">
      {score}%
    </span>
  );
}

export function SidebarLeft({
  onNewCheck,
  activeTaskId,
  isProcessing = false,
  isOpen,
  onClose,
  onLoadBenchmark,
  history = [],
  onSelectCheck,
  onDeleteCheck,
  isLoadingHistory = false,
}: SidebarLeftProps) {
  const [isBenchmarksOpen, setIsBenchmarksOpen] = useState(false);

  if (!isOpen) return null;

  const grouped = groupHistoryByDate(history);

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="fixed lg:static inset-y-0 left-0 z-50 w-64 max-w-[85vw] flex-shrink-0 bg-[#EFECE6] border-r border-[#E0DACF] flex flex-col justify-between p-3 select-none text-[#2D3139] text-xs font-sans shadow-2xl lg:shadow-none transition-transform duration-200 ease-in-out h-full overflow-hidden">
        {/* Top: Brand Header & New Check (ChatGPT Style) */}
        <div className="space-y-2.5 flex-shrink-0">
          <div className="flex items-center justify-between px-1 pt-0.5">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/favicon.svg"
                alt="FreshCheck Logo"
                className="w-5 h-5 max-w-[20px] max-h-[20px] object-contain flex-shrink-0 rounded-md border border-[#DDD7CD] group-hover:scale-105 transition-transform"
              />
              <span className="font-bold text-sm tracking-tight text-[#0F172A] group-hover:text-[#6366F1] transition-colors">
                FreshCheck
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#E5E0D7] transition-colors cursor-pointer"
              title="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Check Button (Single line, ChatGPT style) */}
          <button
            type="button"
            onClick={() => {
              onNewCheck();
              if (typeof window !== "undefined" && window.innerWidth < 1024) {
                onClose();
              }
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-[#DDD7CD] hover:border-[#6366F1]/50 shadow-2xs font-medium text-xs text-[#0F172A] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 truncate">
              <Plus className="w-4 h-4 text-[#6366F1] group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="truncate">New check</span>
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8] bg-slate-100 px-1 py-0.5 rounded">⌘N</span>
          </button>
        </div>

        {/* Scrollable Center: Ultra-minimal ChatGPT Chat History */}
        <div className="flex-1 overflow-y-auto scrollbar-none my-2 space-y-3 pr-0.5">
          {isLoadingHistory && (
            <div className="py-4 text-center text-[#94A3B8] text-xs">
              Loading history...
            </div>
          )}

          {!isLoadingHistory && history.length === 0 && (
            <div className="p-3 text-center rounded-lg text-[#94A3B8] text-[11px]">
              No past checks yet.
            </div>
          )}

          {!isLoadingHistory &&
            grouped.map((group) => (
              <div key={group.label} className="space-y-0.5">
                <div className="text-[10px] font-semibold text-[#8E8EA0] px-2 py-1 tracking-wider uppercase">
                  {group.label}
                </div>
                {group.items.map((item) => {
                  const isActive = activeTaskId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectCheck && onSelectCheck(item.id);
                        if (typeof window !== "undefined" && window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                      className={`group relative flex items-center justify-between h-8 px-2.5 rounded-lg text-xs cursor-pointer select-none transition-colors ${
                        isActive
                          ? "bg-[#E5E0D7] text-[#0F172A] font-semibold"
                          : "text-[#334155] hover:text-[#0F172A] hover:bg-[#E5E0D7]/60 font-normal"
                      }`}
                      title={item.input_text}
                    >
                      <span className="truncate flex-1 pr-2 text-left">
                        {formatSingleLineTitle(item.input_text)}
                      </span>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {renderScoreBadge(item.overall_score)}
                        {onDeleteCheck && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteCheck(item.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-rose-600 transition-opacity"
                            title="Delete check"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

          {/* Minimal Benchmark Presets Accordion */}
          <div className="pt-2 border-t border-[#E0DACF]/70">
            <button
              type="button"
              onClick={() => setIsBenchmarksOpen((prev) => !prev)}
              className="w-full flex items-center justify-between text-[10px] font-semibold text-[#8E8EA0] px-2 py-1 tracking-wider uppercase cursor-pointer hover:text-slate-900"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#6366F1]" />
                <span>Presets</span>
              </div>
              {isBenchmarksOpen ? (
                <ChevronDown className="w-3 h-3 text-[#8E8EA0]" />
              ) : (
                <ChevronRight className="w-3 h-3 text-[#8E8EA0]" />
              )}
            </button>

            {isBenchmarksOpen && (
              <div className="space-y-0.5 pt-1">
                <div
                  onClick={() => {
                    onLoadBenchmark && onLoadBenchmark("api-versions");
                    if (typeof window !== "undefined" && window.innerWidth < 1024) onClose();
                  }}
                  className="flex items-center gap-2 h-7 px-2 rounded-md text-[#475569] hover:text-[#0F172A] hover:bg-[#E5E0D7]/60 transition-colors cursor-pointer text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                  <span className="truncate">Node.js &amp; Deprecations</span>
                </div>
                <div
                  onClick={() => {
                    onLoadBenchmark && onLoadBenchmark("company-leadership");
                    if (typeof window !== "undefined" && window.innerWidth < 1024) onClose();
                  }}
                  className="flex items-center gap-2 h-7 px-2 rounded-md text-[#475569] hover:text-[#0F172A] hover:bg-[#E5E0D7]/60 transition-colors cursor-pointer text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  <span className="truncate">Leadership &amp; C-Suite</span>
                </div>
                <div
                  onClick={() => {
                    onLoadBenchmark && onLoadBenchmark("pricing-and-models");
                    if (typeof window !== "undefined" && window.innerWidth < 1024) onClose();
                  }}
                  className="flex items-center gap-2 h-7 px-2 rounded-md text-[#475569] hover:text-[#0F172A] hover:bg-[#E5E0D7]/60 transition-colors cursor-pointer text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span className="truncate">Pricing &amp; Model Drift</span>
                </div>
                <div
                  onClick={() => {
                    onLoadBenchmark && onLoadBenchmark("sebi-regulations");
                    if (typeof window !== "undefined" && window.innerWidth < 1024) onClose();
                  }}
                  className="flex items-center gap-2 h-7 px-2 rounded-md text-[#475569] hover:text-[#0F172A] hover:bg-[#E5E0D7]/60 transition-colors cursor-pointer text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
                  <span className="truncate">Regulatory &amp; Compliance</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer: User Profile & How It Works */}
        <div className="pt-2 border-t border-[#E0DACF] space-y-1.5 flex-shrink-0">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/70 border border-[#DDD7CD]">
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#6366F1] via-[#7B7CF8] to-[#9CA3FA] text-white font-bold flex items-center justify-center text-[10px] tracking-tight shadow-xs ring-1 ring-white/30 flex-shrink-0">
                FC
              </div>
              <div className="truncate">
                <p className="font-semibold text-xs text-[#0F172A] truncate">FreshCheck Cowork</p>
                <p className="text-[10px] text-[#64748B]">Auditor</p>
              </div>
            </div>
            <button
              type="button"
              className="p-1 rounded text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
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
