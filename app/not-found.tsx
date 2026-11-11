import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#6366F1]/30">
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-24 flex-1 flex flex-col items-center justify-center text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
          <img
            src="/favicon.svg"
            alt="FreshCheck Logo"
            className="w-7 h-7 max-w-[28px] max-h-[28px] object-contain"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            404 — Page Not Found
          </h1>
          <p className="text-sm text-slate-200 max-w-sm leading-relaxed font-normal">
            The verification audit report or page you requested does not exist or has expired.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-slate-200 font-bold text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to FreshCheck Cowork</span>
        </Link>
      </main>
    </div>
  );
}
