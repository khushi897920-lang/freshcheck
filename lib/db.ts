import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

export interface CheckRecord {
  id: string;
  session_id?: string | null;
  input_text: string;
  answer_date?: string | null;
  status: "processing" | "done" | "failed";
  overall_score?: number | null;
  model_used?: string | null;
  fallback_used?: boolean;
  tavily_credits_used?: number;
  created_at?: string;
  claims?: ClaimRecord[];
}

export interface ClaimRecord {
  id: string;
  check_id: string;
  idx: number;
  text: string;
  start_offset?: number | null;
  end_offset?: number | null;
  claim_type: string;
  volatility: string;
  entity?: string | null;
  attribute?: string | null;
  asserted_value?: string | null;
  skipped?: boolean;
  verdict?: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "OUTDATED" | "UNVERIFIABLE" | null;
  current_value?: string | null;
  explanation?: string | null;
  freshness_score?: number | null;
  score_breakdown?: any;
  checked_at?: string | null;
  evidence?: EvidenceRecord[];
}

export interface EvidenceRecord {
  id: string;
  claim_id: string;
  url: string;
  title: string;
  domain: string;
  published_date?: string | null;
  snippet: string;
  is_official?: boolean;
  rank?: number;
}

// In-Memory store for offline fallback
const memoryChecks = new Map<string, CheckRecord>();
const memoryClaims = new Map<string, ClaimRecord[]>();
const memoryEvidence = new Map<string, EvidenceRecord[]>();
const memorySearchCache = new Map<string, any>();

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export async function createCheck(
  data: Omit<CheckRecord, "id" | "created_at">
): Promise<CheckRecord> {
  const id = nanoid();
  const now = new Date().toISOString();
  const record: CheckRecord = {
    ...data,
    id,
    created_at: now,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: inserted, error } = await supabase
        .from("checks")
        .insert({
          id: record.id,
          session_id: record.session_id,
          input_text: record.input_text,
          answer_date: record.answer_date,
          status: record.status,
          overall_score: record.overall_score,
          model_used: record.model_used,
          fallback_used: record.fallback_used ?? false,
          tavily_credits_used: record.tavily_credits_used ?? 0,
        })
        .select()
        .single();

      if (!error && inserted) {
        return inserted as CheckRecord;
      }
    } catch (e) {
      console.warn("[DB] Supabase insert failed, using memory store:", e);
    }
  }

  // Memory fallback
  memoryChecks.set(id, record);
  return record;
}

export async function updateCheck(
  id: string,
  updates: Partial<CheckRecord>
): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("checks").update(updates).eq("id", id);
    } catch (e) {
      console.warn("[DB] Supabase update failed, updating memory store:", e);
    }
  }

  const existing = memoryChecks.get(id);
  if (existing) {
    memoryChecks.set(id, { ...existing, ...updates });
  }
}

export async function insertClaims(
  claims: Array<Omit<ClaimRecord, "id">>
): Promise<ClaimRecord[]> {
  const records: ClaimRecord[] = claims.map((c) => ({
    ...c,
    id: nanoid(),
  }));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("claims").insert(records);
    } catch (e) {
      console.warn("[DB] Supabase insert claims failed, using memory store:", e);
    }
  }

  // Group by check_id in memory
  for (const record of records) {
    const list = memoryClaims.get(record.check_id) || [];
    list.push(record);
    memoryClaims.set(record.check_id, list);
  }

  return records;
}

export async function insertEvidence(
  evidence: Array<Omit<EvidenceRecord, "id">>
): Promise<EvidenceRecord[]> {
  const records: EvidenceRecord[] = evidence.map((e) => ({
    ...e,
    id: nanoid(),
  }));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("evidence").insert(records);
    } catch (e) {
      console.warn("[DB] Supabase insert evidence failed, using memory store:", e);
    }
  }

  for (const record of records) {
    const list = memoryEvidence.get(record.claim_id) || [];
    list.push(record);
    memoryEvidence.set(record.claim_id, list);
  }

  return records;
}

export async function getCheckById(id: string): Promise<CheckRecord | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: check, error } = await supabase
        .from("checks")
        .select(`
          *,
          claims (
            *,
            evidence (*)
          )
        `)
        .eq("id", id)
        .single();

      if (!error && check) {
        return check as CheckRecord;
      }
    } catch (e) {
      console.warn("[DB] Supabase getCheckById failed, querying memory store:", e);
    }
  }

  // Memory fallback
  const check = memoryChecks.get(id);
  if (!check) return null;

  const claims = memoryClaims.get(id) || [];
  const claimsWithEvidence = claims.map((claim) => ({
    ...claim,
    evidence: memoryEvidence.get(claim.id) || [],
  }));

  return {
    ...check,
    claims: claimsWithEvidence,
  };
}

