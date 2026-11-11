import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#E6E8EE] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-24 flex-1 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-center justify-center text-[#EF4444]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">404 — Page Not Found</h1>
        <p className="text-xs text-[#8A91A3] max-w-sm leading-relaxed">
          The verification report or page you requested does not exist or has expired.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12151C] hover:bg-[#1F2430] border border-[#1F2430] text-xs font-medium text-[#E6E8EE] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to FreshCheck
        </Link>
      </main>
    </div>
  );
}

