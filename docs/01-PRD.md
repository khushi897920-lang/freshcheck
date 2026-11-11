# FreshCheck — Master Project Brief
**Stale-Answer Detector for AI Applications** · Geek Room Global AI Hackathon 2026 · Problem Statement 06 (Tavily × Bifrost)

## Agent Ground Rules
1. Never invent a stack, library, table, route or screen that is not in these documents. If something is missing, ask first.
2. Never put API keys in client code. Tavily, Bifrost and Supabase are called only from server route handlers.
3. Every LLM call goes through Bifrost. Every live web lookup goes through Tavily. No direct provider SDK calls.
4. Honesty rule: a claim may get a verdict other than UNVERIFIABLE only if at least one real Tavily result URL backs it. Never fabricate sources, dates or values.
5. Validate every LLM JSON output with Zod. On invalid JSON retry once, then mark that claim UNVERIFIABLE instead of crashing.
6. Protect the free Tavily quota: max 8 verified claims per check, one basic search per claim, cache by query for 24 hours.

---

# 01 — PRD (Product Requirements Document)

### App Name
FreshCheck

### Tagline
Spell-check for facts that expire. Paste any AI answer and see which claims are stale.

### Problem
LLMs are trained up to a cutoff date. After that, prices, API versions, laws and company leadership change, but the model keeps stating the old value with full confidence. People copy the wrong price into a budget, run deprecated code, or email a former CEO, because the answer looks right and nobody double-checks it.

### Target User
Developers, founders, researchers and support/ops teams who use AI answers in real decisions.
**Secondary user**: teams building chatbots or AI apps who need a verification layer on top of their model output.

### Core Value
Not a vague 'this may be outdated' warning. FreshCheck gives a claim-level verdict, a 0–100 freshness score, the current value, and a source link for each time-sensitive claim.

### Core Features (Must Have)
1. **Pasted AI Answer Input**: Paste an AI-generated answer (max 4,000 characters) with an optional 'answer generated on' date.
2. **Claim Extraction**: Split the answer into atomic factual claims (LLM via Bifrost).
3. **Time-Sensitivity Classification**: Claim type (`pricing`, `version`, `leadership`, `law_regulation`, `product_availability`, `statistic`, `stable_fact`) and volatility (`high`, `medium`, `low`). Stable facts are skipped and shown as 'Not time-sensitive'.
4. **Live Verification**: One Tavily search per flagged claim, keeping title, URL, domain, published date, and snippet as evidence.
5. **Verdict per Claim**: `SUPPORTED`, `PARTIALLY_SUPPORTED`, `OUTDATED`, or `UNVERIFIABLE`, plus the current value when found.
6. **Freshness Score**: 0–100 per claim with a green/amber/red badge and a one-line reason.
7. **Annotated Answer View**: The original text with claims highlighted by colour; clicking a claim opens an evidence drawer.
8. **Summary Stats**: Overall answer freshness score and summary counts (fresh / uncertain / stale / skipped).
9. **Shareable Result Page**: Shareable permanent result page at `/check/[id]`.
10. **Reliability & Bifrost Failover**: Bifrost fails over from the primary model to a fallback model, and the UI shows which model answered.
11. **1-Click Demos**: Three built-in sample stale answers for instant demonstration.

### Nice to Have (only after all Must Haves work)
- Corrected answer: a rewrite of the original with stale claims fixed and sources cited.
- History page of previous checks (per anonymous session).
- Bifrost stats panel in-app (models used, latency, fallback count).
- Export report as Markdown.
- Public JSON API for developers.

### Out of Scope for this Version
User accounts and auth, payments, verifying opinions or predictions, non-English answers, paywalled sources, browser extension, fine-tuning, multi-user collaboration.

### User Stories
- *As a developer*, I want to paste an AI-written setup guide so that I can see which version numbers and APIs are outdated before I run the code.
- *As a founder*, I want to check an AI-generated pricing comparison so that I do not plan my budget on old prices.
- *As a sales person*, I want to verify who currently leads a company so that I do not address the wrong person.
- *As an AI app builder*, I want claim-level freshness scores so that I can decide which parts of my bot's answer to trust.
- *As a hackathon judge*, I want to try a sample in one click so that I can see the full flow in under a minute.

### Success Metrics
- All 3 sample answers produce the expected red/amber/green labels.
- End-to-end check of an answer with up to 8 flagged claims finishes in under 30 seconds.
- At most 10 Tavily credits are used per check.
- Failover demo: with the primary model disabled, the check still completes and the UI shows the fallback model.
- Every non-UNVERIFIABLE verdict links to at least one real source.

### Hackathon Requirement Mapping
| Requirement | How FreshCheck meets it |
| :--- | :--- |
| **Claim identification** | Extraction step through Bifrost, structured JSON of atomic claims |
| **Freshness detection** | Claim type + volatility classification decides what gets re-checked |
| **Live verification** | Tavily search per flagged claim, evidence stored with URLs |
| **Freshness scoring** | Deterministic 0–100 formula based on verdict and evidence quality |
| **Mandatory Tavily integration** | Sole source of live evidence; shown on the How it works page |
| **Mandatory Bifrost integration** | Gateway for all LLM calls, with failover, logs and cost visibility |
