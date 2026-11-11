import { describe, it, expect } from "vitest";
import { buildSearchQuery, verifyAndJudgeClaim } from "../lib/judge";
import { ProcessedClaim } from "../lib/extract";

describe("Phase 5 — Live Verification & Evidence Judging", () => {
  it("builds query with entity and attribute and routes topic", () => {
    const claim1: ProcessedClaim = {
      id: "c1",
      text: "Susan Wojcicki serves as the active CEO of YouTube",
      claim_type: "leadership",
      volatility: "medium",
      entity: "YouTube",
      attribute: "CEO",
      asserted_value: "Susan Wojcicki",
      start: 0,
      end: 50,
      skipped: false,
    };

    const q1 = buildSearchQuery(claim1);
    expect(q1.query).toContain("YouTube CEO latest");
    expect(q1.topic).toBe("news");

    const claim2: ProcessedClaim = {
      id: "c2",
      text: "Node.js 16 is the recommended LTS release",
      claim_type: "version",
      volatility: "high",
      entity: "Node.js",
      attribute: "LTS release",
      asserted_value: "16",
      start: 0,
      end: 45,
      skipped: false,
    };

    const q2 = buildSearchQuery(claim2);
    expect(q2.query).toContain("Node.js LTS release latest");
    expect(q2.topic).toBe("general");
  });

  it("strictly enforces Honesty Rule: UNVERIFIABLE if no live Tavily evidence exists", async () => {
    const claim: ProcessedClaim = {
      id: "c3",
      text: "Obscure fact with zero internet records 2099",
      claim_type: "pricing",
      volatility: "high",
      start: 0,
      end: 40,
      skipped: false,
    };

    const judged = await verifyAndJudgeClaim(claim);
    expect(judged.verdict).toBe("UNVERIFIABLE");
    expect(judged.scoreBreakdown.finalScore).toBe(40);
  });
});

