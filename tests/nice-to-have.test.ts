import { describe, it, expect } from "vitest";
import { generateCorrectedAnswer } from "../lib/correct";
import { generateMarkdownReport } from "../lib/exportMarkdown";
import { DrawerClaimData } from "../components/EvidenceDrawer";

describe("Nice-To-Have Features: Corrected Answer & Markdown Export", () => {
  const mockClaims: DrawerClaimData[] = [
    {
      id: "c1",
      text: "Node.js 16 is the active LTS release",
      verdict: "OUTDATED",
      current_value: "Node.js 22 LTS",
      explanation: "Node.js 22 is the current active LTS.",
      evidence: [
        {
          url: "https://nodejs.org/en/about/previous-releases",
          title: "Node.js Releases",
          domain: "nodejs.org",
          snippet: "Node.js 22.x is active LTS.",
          is_official: true,
        },
      ],
      scoreBreakdown: {
        baseScore: 10,
        officialSourceBonus: 5,
        multiDomainBonus: 0,
        stalenessPenalty: 0,
        conflictPenalty: 0,
        finalScore: 15,
        label: "Stale",
      },
    },
  ];

  it("generates corrected answer with citations and footnotes", () => {
    const input = "For modern backends, Node.js 16 is the active LTS release.";
    const result = generateCorrectedAnswer(input, mockClaims);

    expect(result.replacedClaimsCount).toBe(1);
    expect(result.correctedText).toContain("Updated: Node.js 22 LTS");
    expect(result.correctedText).toContain("nodejs.org");
    expect(result.sources.length).toBe(1);
  });

  it("generates structured markdown report", () => {
    const input = "For modern backends, Node.js 16 is the active LTS release.";
    const md = generateMarkdownReport(input, 15, mockClaims, "check-123");

    expect(md).toContain("# FreshCheck Verification Report");
    expect(md).toContain("check-123");
    expect(md).toContain("Node.js 22 LTS");
    expect(md).toContain("nodejs.org");
  });
});

