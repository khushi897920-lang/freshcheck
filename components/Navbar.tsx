import Link from "next/link";
import { ShieldCheck, ExternalLink, HelpCircle, GitFork } from "lucide-react";

export function Navbar({ fallbackBanner }: { fallbackBanner?: boolean }) {
  return (
    <header className="border-b border-[#1F2430] bg-[#0B0D12]/80 backdrop-blur-md sticky top-0 z-40">
      {fallbackBanner && (
        <div className="bg-amber-950/60 border-b border-amber-800/60 px-4 py-2 text-center text-xs text-amber-300 font-mono flex items-center justify-center gap-2">
          <span>⚠️</span> Switched to backup model via Bifrost
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/favicon.svg"
            alt="FreshCheck Logo"
            className="w-8 h-8 rounded-lg border border-[#2D3748] shadow-sm group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-[#E6E8EE]">
                FreshCheck
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#12151C] border border-[#1F2430] text-[#8A91A3]">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-[#8A91A3] hidden sm:block">
              Tavily × Bifrost AI Verification Layer
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/how-it-works"
            className="flex items-center gap-1.5 text-[#8A91A3] hover:text-[#E6E8EE] transition-colors py-1 px-2.5 rounded-md hover:bg-[#12151C]"
          >
            <HelpCircle className="w-4 h-4" />
            <span>How it works</span>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[#8A91A3] hover:text-[#E6E8EE] transition-colors py-1 px-2.5 rounded-md hover:bg-[#12151C]"
          >
            <GitFork className="w-4 h-4" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </nav>
      </div>
    </header>
  );
}

