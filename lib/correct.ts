import { DrawerClaimData } from "@/components/EvidenceDrawer";

export interface CorrectedAnswerResult {
  correctedText: string;
  replacedClaimsCount: number;
  sources: Array<{ index: number; url: string; title: string; domain: string }>;
}

/**
 * Replaces stale claims in the original answer with their current verified values and adds citation footnotes.
 */
export function generateCorrectedAnswer(
  originalText: string,
  claims: DrawerClaimData[]
): CorrectedAnswerResult {
  let modifiedText = originalText;
  const sources: Array<{ index: number; url: string; title: string; domain: string }> = [];
  let sourceCounter = 1;
  let replacedCount = 0;

  // Process claims that are OUTDATED and have a current_value
  const outdatedClaims = claims.filter(
    (c) => !c.skipped && c.verdict === "OUTDATED" && c.current_value
  );

  for (const claim of outdatedClaims) {
    if (!claim.current_value) continue;

    // Attach citations
    const claimSources: number[] = [];
    if (claim.evidence && claim.evidence.length > 0) {
      const topEvidence = claim.evidence[0];
      const existingIdx = sources.findIndex((s) => s.url === topEvidence.url);
      if (existingIdx !== -1) {
        claimSources.push(existingIdx + 1);
      } else {
        sources.push({
          index: sourceCounter,
          url: topEvidence.url,
          title: topEvidence.title,
          domain: topEvidence.domain,
        });
        claimSources.push(sourceCounter);
        sourceCounter++;
      }
    }

    const citationTag = claimSources.length > 0 ? ` [${claimSources.join(",")}]` : "";

    // If asserted value is known, replace it; otherwise substitute snippet
    if (claim.text && modifiedText.includes(claim.text)) {
      modifiedText = modifiedText.replace(
        claim.text,
        `${claim.text} (Updated: ${claim.current_value}${citationTag})`
      );
      replacedCount++;
    }
  }

  // Append source footnotes
  if (sources.length > 0) {
    modifiedText += `\n\n---\n**Verified Sources:**\n`;
    sources.forEach((s) => {
      modifiedText += `[${s.index}] ${s.domain} — ${s.url}\n`;
    });
  }

  return {
    correctedText: modifiedText,
    replacedClaimsCount: replacedCount,
    sources,
  };
}

