# 02 — TRD (Technical Requirements Document)

### Architecture & Technology Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, lucide-react.
- **Backend**: Next.js Route Handlers on the Node runtime. Progress streamed to the browser with Server-Sent Events (SSE).
- **Core Libraries**: `zod`, `openai` (official SDK pointed at Bifrost via `baseURL`), `@tavily/core`, `@supabase/supabase-js`, `nanoid`.
- **Database**: Supabase Postgres (free tier), accessed only from the server with the service role key. *(Fallback: If Supabase setup slows the build, skip persistence, keep results in client state, and disable the shareable link).*
- **Auth**: None in v1. An anonymous `session_id` cookie is used only for history.

### AI Gateway & Search Integration
- **LLM Gateway — Bifrost**: Self-hosted with `npx -y @maximhq/bifrost` or `docker run -p 8080:8080 maximhq/bifrost`.
  - Add provider keys (for example a Gemini free-tier key and a Groq free-tier key) inside Bifrost's own UI or config, never in the Next.js app.
  - Configure a primary model (`MODEL_PRIMARY`) and a fallback model (`MODEL_FALLBACK`).
  - App calls Bifrost's OpenAI-compatible chat completions endpoint at `BIFROST_BASE_URL`.
- **Live Search — Tavily**: Tavily Search API with basic depth and `max_results 5`.
  - Free tier: 1,000 credits per month (1 basic search = 1 credit).
  - Use `topic: "news"` for leadership and announcement claims, `"general"` for everything else.

### Hosting
- Next.js on Vercel. Bifrost on a long-running host (Docker on Railway, Render or Fly; or local host fallback with recorded demo + README).
- Set `export const maxDuration = 60` on the check route and stream results via SSE so requests never time out or look hung.

### Request Flow
1. Browser sends `POST /api/check` with `text` and optional `answerDate`.
2. Server asks Bifrost to extract claims (Prompt A, Appendix) and validates with Zod.
3. Server keeps claims with volatility high or medium, ranked high first, max 8. The rest are marked skipped.
4. For each kept claim (concurrency 4): build a query from template `{entity} {attribute} latest {current year}`, check `search_cache`, otherwise call Tavily, then store evidence.
5. Server asks Bifrost to judge the claim against the evidence (Prompt B) and validates with Zod.
6. Server computes the freshness score in plain code (formula below). The LLM never outputs the score.
7. Server streams events: `claims_extracted`, `claim_verified` (one per claim), `done`. Everything is saved to DB.
8. The UI updates progressively as events arrive.

### What Each Technology Does (Show on `/how-it-works`)
- **Bifrost**: One gateway for both LLM tasks (claim extraction, evidence judging), automatic failover from primary to fallback model, and request logs with latency and cost in its dashboard.
- **Tavily**: The only source of live web evidence used to re-verify claims, with URLs and dates that the user can click.

### Freshness Score Formula (`lib/score.ts`)
- **Base score by verdict**:
  - `SUPPORTED`: 90
  - `PARTIALLY_SUPPORTED`: 60
  - `UNVERIFIABLE`: 40
  - `OUTDATED`: 10
- **Adjustments**:
  - `+5` if the judge marks at least one source as official (the entity's own site, docs, or a government site).
  - `+5` if two or more independent domains agree.
  - `-10` if the newest supporting evidence is older than 12 months and volatility is high.
  - `-10` if sources conflict.
- **Clamping**: Clamp to 0–100.
  - `75` and above: **Fresh** (green)
  - `40–74`: **Uncertain** (amber)
  - Below `40`: **Stale** (red)
- **Overall answer score**: Mean of claim scores weighted by volatility (`high`: 3, `medium`: 2).

### LLM Output Contracts (Zod Schemas)
- **Extraction Schema**:
  - `claims[]` where each claim has: `id`, `text`, `claim_type`, `volatility`, `entity`, `attribute`, `asserted_value`, and `start` / `end` character offsets into the input (fall back to a text search if offsets are wrong).
- **Judge Schema**:
  - `verdict` (`SUPPORTED` | `PARTIALLY_SUPPORTED` | `OUTDATED` | `UNVERIFIABLE`)
  - `current_value` (string or null)
  - `explanation` (max 40 words)
  - `supporting_urls[]`
  - `newest_evidence_date` (string or null)
  - `official_source` (boolean)
  - `sources_agree` (boolean)
  - `conflict` (boolean)
- Use `temperature: 0` and JSON output mode on every call.

### Environment Variables
```env
TAVILY_API_KEY=
BIFROST_BASE_URL=http://localhost:8080/v1
BIFROST_API_KEY=
MODEL_PRIMARY=gemini-1.5-flash
MODEL_FALLBACK=llama-3.1-8b-instant
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_CLAIMS_PER_CHECK=8
CACHE_TTL_HOURS=24
```

### Folder Structure
```
app/page.tsx               # checker home
app/check/[id]/page.tsx    # result page
app/how-it-works/page.tsx  # Tavily and Bifrost explainer
app/history/page.tsx       # nice to have
app/api/check/route.ts     # streaming pipeline
app/api/check/[id]/route.ts# fetch saved result
lib/bifrost.ts
lib/tavily.ts
lib/extract.ts
lib/judge.ts
lib/score.ts
lib/schemas.ts
lib/db.ts
components/                # AnswerInput, AnnotatedAnswer, ClaimCard, ScoreBadge,
                           # EvidenceDrawer, ProgressSteps, SampleChips
data/samples.ts            # the three demo answers
tests/                     # unit tests for score and schemas
```
