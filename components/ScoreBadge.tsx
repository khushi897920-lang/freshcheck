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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 border border-slate-300 text-slate-700">
        <Minus className="w-3.5 h-3.5" />
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
    sm: "px-2.5 py-0.5 text-xs font-semibold tracking-wide",
    md: "px-3 py-1 text-xs font-bold tracking-wide",
    lg: "px-3.5 py-1.5 text-sm font-bold tracking-wide",
  };

  if (status === "Fresh") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-mono bg-emerald-100 border border-emerald-300 text-emerald-900 shadow-2xs ${sizeClasses[size]}`}
      >
        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
        {typeof score === "number" && <span className="font-bold">{score}</span>}
        <span>Fresh</span>
      </span>
    );
  }

  if (status === "Stale") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-mono bg-rose-100 border border-rose-300 text-rose-900 shadow-2xs ${sizeClasses[size]}`}
      >
        <X className="w-3.5 h-3.5 text-rose-700 stroke-[2.5]" />
        {typeof score === "number" && <span className="font-bold">{score}</span>}
        <span>Stale</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono bg-amber-100 border border-amber-300 text-amber-950 shadow-2xs ${sizeClasses[size]}`}
    >
      <AlertTriangle className="w-3.5 h-3.5 text-amber-700 stroke-[2.5]" />
      {typeof score === "number" && <span className="font-bold">{score}</span>}
      <span>Uncertain</span>
    </span>
  );
}
