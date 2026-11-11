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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-100 border border-slate-200 text-slate-500">
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
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-xs font-semibold",
  };

  if (status === "Fresh") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-mono font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 ${sizeClasses[size]}`}
      >
        <Check className="w-3 h-3 text-emerald-600" />
        {typeof score === "number" && <span>{score}</span>}
        <span>Fresh</span>
      </span>
    );
  }

  if (status === "Stale") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-mono font-medium bg-rose-50 border border-rose-200 text-rose-700 ${sizeClasses[size]}`}
      >
        <X className="w-3 h-3 text-rose-600" />
        {typeof score === "number" && <span>{score}</span>}
        <span>Stale</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-mono font-medium bg-amber-50 border border-amber-200 text-amber-700 ${sizeClasses[size]}`}
    >
      <AlertTriangle className="w-3 h-3 text-amber-600" />
      {typeof score === "number" && <span>{score}</span>}
      <span>Uncertain</span>
    </span>
  );
}
