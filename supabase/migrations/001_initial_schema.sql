-- FreshCheck Initial Schema (Geek Room Global AI Hackathon 2026)
-- Enable UUID generator (optional utility)
create extension if not exists "uuid-ossp";

-- Table 1: checks
-- Note: id uses text to support flexible nanoid / uuid identifiers
create table if not exists checks (
  id text primary key default gen_random_uuid()::text,
  session_id text,
  input_text text not null,
  answer_date date null,
  status text not null check (status in ('processing', 'done', 'failed')),
  overall_score int null,
  model_used text null,
  fallback_used boolean default false,
  tavily_credits_used int default 0,
  created_at timestamptz default now()
);

-- Table 2: claims
create table if not exists claims (
  id text primary key default gen_random_uuid()::text,
  check_id text not null references checks(id) on delete cascade,
  idx int not null,
  text text not null,
  start_offset int null,
  end_offset int null,
  claim_type text not null,
  volatility text not null,
  verification_mode text null check (verification_mode in ('freshness', 'truth', 'skip', null)),
  entity text null,
  attribute text null,
  asserted_value text null,
  skipped boolean default false,
  verdict text null check (verdict in ('SUPPORTED', 'PARTIALLY_SUPPORTED', 'OUTDATED', 'CONTRADICTED', 'UNVERIFIABLE', null)),
  current_value text null,
  explanation text null,
  freshness_score int null,
  score_breakdown jsonb null,
  checked_at timestamptz null
);

-- Table 3: evidence
create table if not exists evidence (
  id text primary key default gen_random_uuid()::text,
  claim_id text not null references claims(id) on delete cascade,
  url text not null,
  title text not null,
  domain text not null,
  published_date date null,
  snippet text not null,
  is_official boolean default false,
  rank int default 1
);

-- Table 4: search_cache
create table if not exists search_cache (
  query_hash text primary key,
  query text not null,
  response jsonb not null,
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_claims_check_id on claims(check_id);
create index if not exists idx_evidence_claim_id on evidence(claim_id);
create index if not exists idx_checks_session_created on checks(session_id, created_at desc);
create index if not exists idx_search_cache_created on search_cache(created_at);

-- Row Level Security (RLS)
alter table checks enable row level security;
alter table claims enable row level security;
alter table evidence enable row level security;
alter table search_cache enable row level security;

-- Policies for service role (full access) and public reads
create policy "Allow all access to service role on checks" on checks for all using (true);
create policy "Allow all access to service role on claims" on claims for all using (true);
create policy "Allow all access to service role on evidence" on evidence for all using (true);
create policy "Allow all access to service role on search_cache" on search_cache for all using (true);


