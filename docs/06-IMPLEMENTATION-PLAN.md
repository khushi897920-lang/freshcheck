# 06 — Implementation Plan

Build window closes: **Nov 15, 2026**

---

### Phase 1 — Project Setup (Nov 11)
Init Next.js 14 with TypeScript and Tailwind, add shadcn/ui, create the folder structure from the TRD, add `.env.example`, set up a GitHub repo.
*Done when*: the app runs locally and the folder structure matches the TRD.

### Phase 2 — Smoke Test Bifrost and Tavily (Nov 11)
Run Bifrost locally, add a Gemini key and a Groq key, set the primary and fallback models. Write `lib/bifrost.ts` and `lib/tavily.ts`. Create a throwaway script that sends one chat completion and one Tavily search.
*Done when*: one LLM call and one search both return data, and the request appears in Bifrost's log view. Disable the primary model once and confirm the fallback answers.

### Phase 3 — Database (Nov 11)
Create the Supabase project, run migrations for all four tables and indexes, enable RLS, write `lib/db.ts`.
*Done when*: a test insert and read of a check with claims and evidence works from a server route.

### Phase 4 — Claim Extraction (Nov 11–12)
Implement Prompt A, Zod schema, offset repair, and the filter that keeps up to 8 high or medium volatility claims.
*Done when*: all 3 sample answers return sensible claims with correct types and volatility.

### Phase 5 — Live Verification and Judging (Nov 12)
Implement the query template, the Tavily call with cache, evidence storage, Prompt B and its Zod schema, and the retry then UNVERIFIABLE fallback.
*Done when*: each flagged claim in the samples has a verdict backed by at least one real URL, and a repeated check uses the cache instead of Tavily.

### Phase 6 — Scoring (Nov 12)
Implement `lib/score.ts` exactly as in the TRD, plus unit tests for each verdict and each adjustment.
*Done when*: tests pass and the score breakdown is stored per claim.

### Phase 7 — Streaming API (Nov 12)
Build `POST /api/check` with SSE events, persistence and error handling, and `GET /api/check/[id]`.
*Done when*: a curl call streams `claims_extracted`, `claim_verified` and `done`, and the saved check can be fetched.

### Phase 8 — UI (Nov 13)
Build the home page, progress stepper, claim cards, score badge, annotated answer, evidence drawer, result page and How it works page following the Design Brief.
*Done when*: Journeys 1, 2 and 3 work end to end on desktop and mobile.

### Phase 9 — Reliability and Edge Cases (Nov 14)
Add all error and empty states from the App Flow, including the fallback model banner and the Tavily-unavailable banner.
*Done when*: each error state is reproduced once on purpose and handled without a crash.

### Phase 10 — Demo Assets and README (Nov 14)
Finalise the three sample answers (verify them live the day of the demo), capture a screenshot of the Bifrost dashboard, write the README with setup steps, architecture diagram and the Tavily and Bifrost roles.
*Done when*: a new person can run the project from the README in under 10 minutes.

### Phase 11 — Deploy (Nov 14)
Deploy the app to Vercel and Bifrost to a Docker host, or follow the local-demo fallback plan from the TRD. Set production env vars.
*Done when*: the production URL completes a sample check, or the local demo video is recorded.

### Phase 12 — Submission (Nov 15, Buffer Day)
Record a 2-minute demo, submit the repo and link, fix only critical bugs.
*Done when*: the submission is filed before the deadline.

---

## Appendix A — Prompt Templates

### Prompt A — Claim Extraction (System)
> You extract factual claims from an AI-generated answer. Return only JSON. Split the text into atomic, checkable factual statements. Ignore opinions, advice and instructions. For each claim give: id, text (copied exactly from the input), start and end character offsets, claim_type (pricing, version, leadership, law_regulation, product_availability, statistic, stable_fact), volatility (high if it changes within months, medium if within years, low if rarely), entity, attribute, and asserted_value. If the user supplied an answer date, use it only as context. Do not verify anything.

### Prompt B — Evidence Judge (System)
> You judge whether a claim is still true using only the evidence snippets provided. Return only JSON. Choose a verdict: SUPPORTED if the evidence confirms the claim is current, PARTIALLY_SUPPORTED if part is right, OUTDATED if the evidence shows a newer or different value, UNVERIFIABLE if the evidence is missing or unclear. Give current_value if the evidence states it, an explanation of at most 40 words, the URLs you relied on, the newest evidence date, whether any source is official, whether sources agree, and whether they conflict. Never use knowledge outside the evidence. Never invent URLs.

---

## Appendix B — Demo Script and Sample Answers

### 2-Minute Demo Flow
- `0:00` — State the problem: AI answers expire silently.
- `0:20` — Click a sample, run the check, narrate the stepper.
- `0:50` — Show red, amber and green claims, open one evidence drawer, show the source link.
- `1:15` — Show the Bifrost dashboard with the model calls, then disable the primary model and run again to show failover.
- `1:40` — Show the How it works page: Tavily gives live evidence, Bifrost gives routing, failover and visibility.
- `1:55` — Close with the shareable link.
