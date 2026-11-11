import { Verdict, Volatility } from "./schemas";

export interface ScoreAdjustmentFactors {
  officialSource?: boolean;
  independentDomainsCount?: number;
  newestEvidenceDate?: string | null;
  volatility: Volatility;
  conflict?: boolean;
}

export interface ClaimScoreBreakdown {
  baseScore: number;
  officialSourceBonus: number;
  multiDomainBonus: number;
  stalenessPenalty: number;
  conflictPenalty: number;
  finalScore: number;
  label: "Fresh" | "Uncertain" | "Stale";
}

export function computeClaimScore(
  verdict: Verdict,
  factors: ScoreAdjustmentFactors
): ClaimScoreBreakdown {
  // 1. Base score by verdict
  let baseScore = 40;
  switch (verdict) {
    case "SUPPORTED":
      baseScore = 90;
      break;
    case "PARTIALLY_SUPPORTED":
      baseScore = 60;
      break;
    case "OUTDATED":
      baseScore = 10;
      break;
    case "UNVERIFIABLE":
    default:
      baseScore = 40;
      break;
  }

  // 2. Add 5 if official source
  const officialSourceBonus = factors.officialSource ? 5 : 0;

  // 3. Add 5 if two or more independent domains agree
  const multiDomainBonus =
    (factors.independentDomainsCount ?? 0) >= 2 ? 5 : 0;

  // 4. Subtract 10 if newest supporting evidence is older than 12 months and volatility is high
  let stalenessPenalty = 0;
  if (factors.volatility === "high" && factors.newestEvidenceDate) {
    try {
      const evidenceTime = new Date(factors.newestEvidenceDate).getTime();
      const now = Date.now();
      const twelveMonthsInMs = 365 * 24 * 60 * 60 * 1000;
      if (!isNaN(evidenceTime) && now - evidenceTime > twelveMonthsInMs) {
        stalenessPenalty = 10;
      }
    } catch {
      // Ignore date parsing failure
    }
  }

  // 5. Subtract 10 if sources conflict
  const conflictPenalty = factors.conflict ? 10 : 0;

  // Total and clamp 0-100
  const rawScore =
    baseScore +
    officialSourceBonus +
    multiDomainBonus -
    stalenessPenalty -
    conflictPenalty;

  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Labels: 75+ Fresh, 40-74 Uncertain, <40 Stale
  let label: "Fresh" | "Uncertain" | "Stale" = "Uncertain";
  if (finalScore >= 75) {
    label = "Fresh";
  } else if (finalScore < 40) {
    label = "Stale";
  }

  return {
    baseScore,
    officialSourceBonus,
    multiDomainBonus,
    stalenessPenalty,
    conflictPenalty,
    finalScore,
    label,
  };
}

export function computeOverallScore(
  claims: Array<{ score: number; volatility: Volatility; skipped?: boolean }>
): number {
  const activeClaims = claims.filter((c) => !c.skipped);
  if (activeClaims.length === 0) return 100; // stable/no time-sensitive claims

  let weightedSum = 0;
  let totalWeight = 0;

  for (const claim of activeClaims) {
    const weight = claim.volatility === "high" ? 3 : 2; // high 3, medium 2 (low skipped)
    weightedSum += claim.score * weight;
    totalWeight += weight;
  }

  return totalWeight === 0 ? 100 : Math.round(weightedSum / totalWeight);
}
