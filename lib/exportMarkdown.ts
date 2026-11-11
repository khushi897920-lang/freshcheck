import { DrawerClaimData } from "@/components/EvidenceDrawer";

export function generateMarkdownReport(
  inputText: string,
  overallScore: number | null,
  claims: DrawerClaimData[],
  checkId?: string | null
): string {
  const timestamp = new Date().toISOString();
  let md = `# FreshCheck Verification Report\n\n`;
  if (checkId) {
    md += `**Check ID**: \`${checkId}\`  \n`;
  }
  md += `**Generated**: ${timestamp}  \n`;
  md += `**Overall Freshness Score**: ${overallScore ?? "N/A"}/100  \n\n`;

  md += `## Original Input Answer\n\n`;
  md += `> ${inputText.replace(/\n/g, "\n> ")}\n\n`;

  md += `## Claim-by-Claim Breakdown\n\n`;

  claims.forEach((claim, idx) => {
    const verdict = claim.skipped ? "SKIPPED (Stable Fact)" : (claim.verdict ?? "UNVERIFIABLE");
    const score = claim.scoreBreakdown?.finalScore ?? (claim.skipped ? 100 : 40);

    md += `### Claim #${idx + 1}: ${verdict} (${score}/100)\n\n`;
    md += `- **Asserted Claim**: "${claim.text}"\n`;
    md += `- **Type**: \`${claim.claim_type || "fact"}\` | **Volatility**: \`${claim.volatility || "normal"}\`\n`;

    if (claim.current_value) {
      md += `- **Current Verified Value**: **${claim.current_value}**\n`;
    }

    if (claim.explanation) {
      md += `- **Explanation**: ${claim.explanation}\n`;
    }

    if (claim.evidence && claim.evidence.length > 0) {
      md += `- **Live Tavily Sources**:\n`;
      claim.evidence.forEach((ev) => {
        md += `  - [${ev.title}](${ev.url}) (${ev.domain}${ev.is_official ? " - Official Source" : ""})\n`;
      });
    }

    md += `\n`;
  });

  md += `---\n*Verified with FreshCheck (Tavily Web Intelligence × Bifrost AI Gateway)*\n`;
  return md;
}

export function downloadMarkdown(filename: string, content: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

