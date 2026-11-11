export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0B0D12] text-[#E6E8EE]">
      <div className="max-w-2xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#12151C] border border-[#1F2430] text-[#6366F1]">
          <span>●</span> Problem Statement 06 (Tavily × Bifrost)
        </div>
        <h1 className="text-4xl font-bold tracking-tight">FreshCheck</h1>
        <p className="text-lg text-[#8A91A3]">
          Spell-check for facts that expire. Paste any AI answer and see which claims are stale.
        </p>
      </div>
    </main>
  );
}

