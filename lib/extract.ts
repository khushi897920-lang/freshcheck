import { executeBifrostCompletion } from "./bifrost";
import {
  ExtractedClaim,
  ExtractionResponseSchema,
  Volatility,
} from "./schemas";
import { nanoid } from "nanoid";

export const PROMPT_A_SYSTEM = `You extract factual claims from an AI-generated answer. Return only JSON matching this schema:
{
  "claims": [
    {
      "id": "claim-1",
      "text": "exact snippet copied from input",
      "start": 0,
      "end": 45,
      "claim_type": "pricing" | "version" | "leadership" | "law_regulation" | "product_availability" | "statistic" | "stable_fact",
      "volatility": "high" | "medium" | "low",
      "entity": "subject entity or null",
      "attribute": "fact attribute or null",
      "asserted_value": "asserted value or null"
    }
  ]
}
Split the text into atomic, checkable factual statements. Ignore opinions, advice and instructions.
volatility: high if it changes within months, medium if within years, low if rarely.
If the user supplied an answer date, use it only as context. Do not verify anything.`;

/**
 * Repairs character offsets using substring search if LLM offsets are misaligned.
 */
export function repairOffsets(
  inputText: string,
  claim: ExtractedClaim
): { start: number; end: number } {
  const claimText = claim.text.trim();
  if (
    typeof claim.start === "number" &&
    typeof claim.end === "number" &&
    inputText.slice(claim.start, claim.end) === claim.text
  ) {
    return { start: claim.start, end: claim.end };
  }

  // Exact search
  const exactIndex = inputText.indexOf(claimText);
  if (exactIndex !== -1) {
    return { start: exactIndex, end: exactIndex + claimText.length };
  }

  // Case-insensitive search
  const lowerInput = inputText.toLowerCase();
  const lowerClaim = claimText.toLowerCase();
  const caseInsensitiveIndex = lowerInput.indexOf(lowerClaim);
  if (caseInsensitiveIndex !== -1) {
    return {
      start: caseInsensitiveIndex,
      end: caseInsensitiveIndex + claimText.length,
    };
  }

  // Default fallback if offsets cannot be found
  return { start: claim.start ?? 0, end: claim.end ?? claimText.length };
}

export interface ProcessedClaim extends ExtractedClaim {
  skipped: boolean;
  start: number;
  end: number;
}

export interface ExtractionResult {
  claims: ProcessedClaim[];
  modelUsed: string;
  fallbackUsed: boolean;
}

/**
 * Extract claims via Bifrost, repair offsets, and prioritize high/medium volatility (max 8).
 */
export async function extractClaims(
  inputText: string,
  answerDate?: string | null,
  maxClaims: number = 8
): Promise<ExtractionResult> {
  const userContent = answerDate
    ? `Answer generated on: ${answerDate}\n\nAI Answer:\n${inputText}`
    : `AI Answer:\n${inputText}`;

  let extractedClaims: ExtractedClaim[] = [];
  let modelUsed = "bifrost";
  let fallbackUsed = false;

  try {
    const result = await executeBifrostCompletion(
      {
        messages: [
          { role: "system", content: PROMPT_A_SYSTEM },
          { role: "user", content: userContent },
        ],
        jsonMode: true,
      },
      ExtractionResponseSchema
    );

    extractedClaims = result.data.claims;
    modelUsed = result.modelUsed;
    fallbackUsed = result.fallbackUsed;
  } catch (err) {
    console.warn("[Extraction] Bifrost call failed, using heuristic extraction fallback:", err);
    // Heuristic rule-based fallback if offline/mock
    extractedClaims = heuristicExtract(inputText);
  }

  // 1. Repair offsets for all claims
  const processedWithOffsets: ProcessedClaim[] = extractedClaims.map((claim, idx) => {
    const { start, end } = repairOffsets(inputText, claim);
    return {
      ...claim,
      id: claim.id || `claim-${idx + 1}-${nanoid(4)}`,
      start,
      end,
      skipped: false,
    };
  });

  // 2. Classify and rank:
  // Stable facts / low volatility are marked skipped
  // Keep high and medium volatility, ranked high first, max 8.
  const timeSensitive = processedWithOffsets.filter(
    (c) => c.volatility === "high" || c.volatility === "medium"
  );
  const stableOrLow = processedWithOffsets.filter(
    (c) => c.volatility === "low" || c.claim_type === "stable_fact"
  );

  // Sort high first, then medium
  timeSensitive.sort((a, b) => {
    if (a.volatility === "high" && b.volatility !== "high") return -1;
    if (b.volatility === "high" && a.volatility !== "high") return 1;
    return 0;
  });

  const keptClaims: ProcessedClaim[] = [];
  const excessClaims: ProcessedClaim[] = [];

  timeSensitive.forEach((claim, idx) => {
    if (idx < maxClaims) {
      keptClaims.push({ ...claim, skipped: false });
    } else {
      excessClaims.push({ ...claim, skipped: true });
    }
  });

  const skippedStable: ProcessedClaim[] = stableOrLow.map((c) => ({
    ...c,
    skipped: true,
  }));

  // Re-sort in text appearance order (by start offset) so UI highlight mapping is clean
  const finalClaims = [...keptClaims, ...excessClaims, ...skippedStable].sort(
    (a, b) => a.start - b.start
  );

  return {
    claims: finalClaims,
    modelUsed,
    fallbackUsed,
  };
}

/**
 * Deterministic sentence-level heuristic extractor for offline/fallback scenarios
 */
function heuristicExtract(text: string): ExtractedClaim[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.map((sentence, idx) => {
    const trimmed = sentence.trim();
    const hasVersion = /version|release|node|python|v\d+/i.test(trimmed);
    const hasPrice = /\$|price|pricing|tier|cost/i.test(trimmed);
    const hasLeader = /ceo|founder|leads|president/i.test(trimmed);

    let claim_type: ExtractedClaim["claim_type"] = "stable_fact";
    let volatility: Volatility = "low";

    if (hasPrice) {
      claim_type = "pricing";
      volatility = "high";
    } else if (hasVersion) {
      claim_type = "version";
      volatility = "high";
    } else if (hasLeader) {
      claim_type = "leadership";
      volatility = "medium";
    }

    return {
      id: `c-${idx + 1}`,
      text: trimmed,
      claim_type,
      volatility,
      entity: null,
      attribute: null,
      asserted_value: null,
      start: text.indexOf(trimmed),
      end: text.indexOf(trimmed) + trimmed.length,
    };
  });
}
