# 05 — Backend Schema

### Data Access Model
- Direct server route handler access using the Supabase service role key.
- Row Level Security (RLS) enabled on all tables with no direct public read/write access.
- Result pages are accessible to anyone possessing the unguessable check UUID.

---

### Database Tables (PostgreSQL / Supabase)

#### 1. `checks`
Stores overall execution sessions and aggregate freshness results.
```sql
create table checks (
  id uuid primary key default gen_random_uuid(),
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
```

#### 2. `claims`
Stores atomic factual claims extracted from the answer.
```sql
create table claims (
  id uuid primary key default gen_random_uuid(),
  check_id uuid not null references checks(id) on delete cascade,
  idx int not null,
  text text not null,
  start_offset int null,
  end_offset int null,
  claim_type text not null,
  volatility text not null,
  entity text null,
  attribute text null,
  asserted_value text null,
  skipped boolean default false,
  verdict text null check (verdict in ('SUPPORTED', 'PARTIALLY_SUPPORTED', 'OUTDATED', 'UNVERIFIABLE', null)),
  current_value text null,
  explanation text null,
  freshness_score int null,
  score_breakdown jsonb null,
  checked_at timestamptz null
);
```

#### 3. `evidence`
Stores search snippets and URL sources backing each evaluated claim.
```sql
create table evidence (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references claims(id) on delete cascade,
  url text not null,
  title text not null,
  domain text not null,
  published_date date null,
  snippet text not null,
  is_official boolean default false,
  rank int default 1
);
```

#### 4. `search_cache`
Deduplicates live Tavily searches across checks within a 24-hour TTL.
```sql
create table search_cache (
  query_hash text primary key,
  query text not null,
  response jsonb not null,
  created_at timestamptz default now()
);
```

---

### Indexes
```sql
create index idx_claims_check_id on claims(check_id);
create index idx_evidence_claim_id on evidence(claim_id);
create index idx_checks_session_created on checks(session_id, created_at desc);
create index idx_search_cache_created on search_cache(created_at);
```

### Security & Privacy
- Sensitive input data: Do not log raw `input_text` to the console.
- Enable RLS on all 4 tables with zero public client policies.
