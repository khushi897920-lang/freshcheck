import Link from "next/link";
import { ShieldCheck, ExternalLink, HelpCircle, GitFork } from "lucide-react";

export function Navbar({ fallbackBanner }: { fallbackBanner?: boolean }) {
  return (
    <header className="border-b border-[#222222] bg-black/95 backdrop-blur-md sticky top-0 z-40 text-white">
      {fallbackBanner && (
        <div className="bg-amber-950/80 border-b border-amber-700/80 px-4 py-2 text-center text-xs text-amber-200 font-mono flex items-center justify-center gap-2">
          <span>⚠️</span> Switched to backup model via Bifrost
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/favicon.svg"
            alt="FreshCheck Logo"
            className="w-6 h-6 max-w-[24px] max-h-[24px] object-contain rounded-md border border-white/20 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-slate-200 transition-colors">
                FreshCheck
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-semibold">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden sm:block">
              Tavily × Bifrost AI Verification Layer
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/how-it-works"
            className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-white/10"
          >
            <HelpCircle className="w-4 h-4 text-white" />
            <span>How it works</span>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-white/10"
          >
            <GitFork className="w-4 h-4 text-white" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </nav>
      </div>
    </header>
  );
}

