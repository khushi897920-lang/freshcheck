import { Check, AlertTriangle, X, Minus } from "lucide-react";

interface ScoreBadgeProps {
  score?: number | null;
  label?: "Fresh" | "Uncertain" | "Stale" | "Skipped";
  verdict?: string | null;
  size?: "sm" | "md" | "lg";
  skipped?: boolean;
}

export function ScoreBadge({
  score,
  label,
  verdict,
  size = "md",
  skipped = false,
}: ScoreBadgeProps) {
  if (skipped) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-zinc-800/60 border border-zinc-700 text-zinc-400">
        <Minus className="w-3 h-3" />
        <span>Skipped</span>
      </span>
    );
  }

  // Derive label if not provided
  let status = label;
  if (!status) {
    if (typeof score === "number") {
      if (score >= 75) status = "Fresh";
      else if (score < 40) status = "Stale";
      else status = "Uncertain";
    } else if (verdict === "SUPPORTED") status = "Fresh";
    else if (verdict === "OUTDATED") status = "Stale";
    else status = "Uncertain";
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm font-semibold",
  };

  if (status === "Fresh") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] ${sizeClasses[size]}`}
      >
        <Check className="w-3.5 h-3.5" />
        {typeof score === "number" && <span>{score}</span>}
        <span>Fresh</span>
      </span>
    );
  }

  if (status === "Stale") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] ${sizeClasses[size]}`}
      >
        <X className="w-3.5 h-3.5" />
        {typeof score === "number" && <span>{score}</span>}
        <span>Stale</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] ${sizeClasses[size]}`}
    >
      <AlertTriangle className="w-3.5 h-3.5" />
      {typeof score === "number" && <span>{score}</span>}
      <span>Uncertain</span>
    </span>
  );
}
