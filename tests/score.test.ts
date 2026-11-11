import { describe, it, expect } from "vitest";
import { computeClaimScore, computeOverallScore } from "../lib/score";

describe("computeClaimScore", () => {
  it("computes base scores for verdicts without adjustments", () => {
    expect(computeClaimScore("SUPPORTED", { volatility: "medium" }).finalScore).toBe(90);
    expect(computeClaimScore("PARTIALLY_SUPPORTED", { volatility: "medium" }).finalScore).toBe(60);
    expect(computeClaimScore("UNVERIFIABLE", { volatility: "medium" }).finalScore).toBe(40);
    expect(computeClaimScore("OUTDATED", { volatility: "medium" }).finalScore).toBe(10);
  });

  it("applies official source and multi-domain bonuses", () => {
    const res = computeClaimScore("SUPPORTED", {
      volatility: "medium",
      officialSource: true,
      independentDomainsCount: 3,
    });
    // 90 + 5 + 5 = 100
    expect(res.finalScore).toBe(100);
    expect(res.officialSourceBonus).toBe(5);
    expect(res.multiDomainBonus).toBe(5);
    expect(res.label).toBe("Fresh");
  });

  it("applies staleness penalty for old evidence on high volatility claims", () => {
    const res = computeClaimScore("SUPPORTED", {
      volatility: "high",
      newestEvidenceDate: "2020-01-01",
    });
    // 90 - 10 = 80
    expect(res.finalScore).toBe(80);
    expect(res.stalenessPenalty).toBe(10);
  });

  it("applies conflict penalty and labels correctly", () => {
    const res = computeClaimScore("PARTIALLY_SUPPORTED", {
      volatility: "medium",
      conflict: true,
    });
    // 60 - 10 = 50 -> Uncertain
    expect(res.finalScore).toBe(50);
    expect(res.label).toBe("Uncertain");

    const outdated = computeClaimScore("OUTDATED", {
      volatility: "medium",
    });
    // 10 -> Stale
    expect(outdated.finalScore).toBe(10);
    expect(outdated.label).toBe("Stale");
  });
});

describe("computeOverallScore", () => {
  it("weights high volatility 3 and medium volatility 2", () => {
    const claims = [
      { score: 100, volatility: "high" as const }, // 100 * 3 = 300
      { score: 50, volatility: "medium" as const }, // 50 * 2 = 100
    ];
    // (300 + 100) / (3 + 2) = 400 / 5 = 80
    expect(computeOverallScore(claims)).toBe(80);
  });

  it("ignores skipped claims", () => {
    const claims = [
      { score: 100, volatility: "high" as const },
      { score: 0, volatility: "low" as const, skipped: true },
    ];
    expect(computeOverallScore(claims)).toBe(100);
  });
});
