import { describe, it, expect } from "vitest";
import { extractClaims, repairOffsets } from "../lib/extract";
import { SAMPLE_ANSWERS } from "../data/samples";

describe("Phase 4 — Claim Extraction & Offset Repair", () => {
  it("repairs offsets correctly if misaligned", () => {
    const input = "Node.js 16 is the active LTS version.";
    const claim = {
      id: "c1",
      text: "Node.js 16 is the active LTS version",
      claim_type: "version" as const,
      volatility: "high" as const,
      start: 99, // wrong offset
      end: 150,
    };

    const repaired = repairOffsets(input, claim);
    expect(repaired.start).toBe(0);
    expect(repaired.end).toBe(claim.text.length);
    expect(input.slice(repaired.start, repaired.end)).toBe(claim.text);
  });

  it("extracts sensible claims and flags volatility for all 3 sample answers", async () => {
    for (const sample of SAMPLE_ANSWERS) {
      const result = await extractClaims(sample.text, sample.answerDate, 8);
      expect(result.claims.length).toBeGreaterThan(0);

      // Verify each claim has repaired offsets
      for (const claim of result.claims) {
        expect(claim.id).toBeDefined();
        expect(claim.start).toBeGreaterThanOrEqual(0);
        expect(claim.end).toBeGreaterThan(claim.start);
        expect(sample.text.slice(claim.start, claim.end)).toBe(claim.text);
      }

      // Verify max 8 active (non-skipped) claims
      const activeClaims = result.claims.filter((c) => !c.skipped);
      expect(activeClaims.length).toBeLessThanOrEqual(8);
    }
  }, 15000);
});
