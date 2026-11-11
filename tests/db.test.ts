import { describe, it, expect } from "vitest";
import { createCheck, insertClaims, insertEvidence, getCheckById } from "../lib/db";

describe("Phase 3 — Database & Persistence Layer", () => {
  it("creates a check, inserts claims and evidence, and retrieves full nested hierarchy", async () => {
    // 1. Create check
    const check = await createCheck({
      input_text: "Python 3.8 is the latest stable release.",
      status: "processing",
      overall_score: null,
      model_used: "gemini-1.5-flash",
      fallback_used: false,
    });

    expect(check.id).toBeDefined();
    expect(check.status).toBe("processing");

    // 2. Insert claim
    const [claim] = await insertClaims([
      {
        check_id: check.id,
        idx: 0,
        text: "Python 3.8 is the latest stable release",
        claim_type: "version",
        volatility: "high",
        entity: "Python",
        attribute: "latest stable release",
        asserted_value: "3.8",
        verdict: "OUTDATED",
        current_value: "3.13",
        explanation: "Python 3.13 is the latest stable release.",
        freshness_score: 10,
      },
    ]);

    expect(claim.id).toBeDefined();
    expect(claim.check_id).toBe(check.id);

    // 3. Insert evidence
    const [evidence] = await insertEvidence([
      {
        claim_id: claim.id,
        url: "https://www.python.org/downloads/",
        title: "Download Python | Python.org",
        domain: "python.org",
        snippet: "Python 3.13.0 is the newest major release.",
        is_official: true,
        rank: 1,
      },
    ]);

    expect(evidence.id).toBeDefined();
    expect(evidence.claim_id).toBe(claim.id);

    // 4. Retrieve complete check with relations
    const retrieved = await getCheckById(check.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(check.id);
    expect(retrieved?.claims?.length).toBe(1);
    expect(retrieved?.claims?.[0].evidence?.length).toBe(1);
    expect(retrieved?.claims?.[0].evidence?.[0].url).toBe("https://www.python.org/downloads/");
  });
});

