import { z } from "zod";

export const ClaimTypeSchema = z.enum([
  "pricing",
  "version",
  "leadership",
  "law_regulation",
  "product_availability",
  "statistic",
  "stable_fact",
]);

export const VolatilitySchema = z.enum(["high", "medium", "low"]);

export const VerificationModeSchema = z.enum(["freshness", "truth", "skip"]);

export const ExtractedClaimSchema = z.object({
  id: z.string(),
  text: z.string(),
  claim_type: ClaimTypeSchema,
  volatility: VolatilitySchema,
  entity: z.string().nullable().optional(),
  attribute: z.string().nullable().optional(),
  asserted_value: z.string().nullable().optional(),
  verification_mode: VerificationModeSchema.optional(),
  start: z.number().int().nonnegative().optional(),
  end: z.number().int().nonnegative().optional(),
});

export const ExtractionResponseSchema = z.object({
  claims: z.array(ExtractedClaimSchema),
});

export const VerdictSchema = z.enum([
  "SUPPORTED",
  "PARTIALLY_SUPPORTED",
  "OUTDATED",
  "CONTRADICTED",
  "UNVERIFIABLE",
]);

export const JudgeResponseSchema = z.object({
  verdict: VerdictSchema,
  current_value: z.string().nullable().optional(),
  explanation: z.string().max(300), // ~40 words limit
  supporting_urls: z.array(z.string().url()).default([]),
  newest_evidence_date: z.string().nullable().optional(),
  official_source: z.boolean().default(false),
  sources_agree: z.boolean().default(true),
  conflict: z.boolean().default(false),
});

export const TruthJudgeResponseSchema = z.object({
  verdict: z.enum(["SUPPORTED", "CONTRADICTED", "UNVERIFIABLE"]),
  current_value: z.string().nullable().optional(),
  explanation: z.string().max(300),
  supporting_urls: z.array(z.string().url()).default([]),
  newest_evidence_date: z.string().nullable().optional(),
  official_source: z.boolean().default(false),
  sources_agree: z.boolean().default(true),
  conflict: z.boolean().default(false),
});

export type ClaimType = z.infer<typeof ClaimTypeSchema>;
export type Volatility = z.infer<typeof VolatilitySchema>;
export type VerificationMode = z.infer<typeof VerificationModeSchema>;
export type ExtractedClaim = z.infer<typeof ExtractedClaimSchema>;
export type ExtractionResponse = z.infer<typeof ExtractionResponseSchema>;
export type Verdict = z.infer<typeof VerdictSchema>;
export type JudgeResponse = z.infer<typeof JudgeResponseSchema>;
export type TruthJudgeResponse = z.infer<typeof TruthJudgeResponseSchema>;

