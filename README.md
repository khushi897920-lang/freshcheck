# FreshCheck 🛡️
> **Spell-check for facts that expire. Paste any AI answer and see which claims are stale.**

Built for **Geek Room Global AI Hackathon 2026** · **Problem Statement 06 (Tavily × Bifrost)**

---

## ⚡ The Problem
Large Language Models (LLMs) are trained up to a fixed cutoff date. After that cutoff, **SaaS pricing tiers, library versions, APIs, tax regulations, and company executives change**, but AI models continue asserting stale facts with 100% confidence.

Users copy deprecated code, paste wrong prices into financial budgets, or reach out to former CEOs. Existing warning banners are vague (*"AI can make mistakes"*). **FreshCheck provides claim-level verification**, an objective 0–100 Freshness Score, the current verified value, and live source citations.

---

## 🏗️ Architecture & Dual Mandatory Tech Roles

```
               ┌────────────────────────────────────────────────────────┐
               │              FreshCheck Web UI (Next.js 14)            │
               │   • Real-time SSE Stepper   • Interactive Highlights   │
               │   • Score Ring & Counts     • Slide-out Evidence Drawer│
               └───────────────────────────┬────────────────────────────┘
                                           │ POST /api/check (SSE Stream)
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │               Next.js Route Handlers Pipeline          │
               │   1. Bifrost Claim Extraction (Atomic facts + offsets) │
               │   2. Tavily Search per claim (with 24h Query Cache)    │
               │   3. Bifrost Evidence Judging (Truth alignment)        │
               │   4. Deterministic Scoring in Code (lib/score.ts)      │
               └───────────────┬────────────────────────┬───────────────┘
                               │                        │
       LLM Orchestration & Failover        Live Ground-Truth Web Evidence
                               │                        │
                               ▼                        ▼
               ┌────────────────────────┐      ┌────────────────────────┐
               │  Bifrost AI Gateway    │      │  Tavily Web Search     │
               │  (Maxim AI @ :8080)    │      │  (@tavily/core API)    │
               │  • Gemini 1.5 (Primary)│      │  • Basic depth         │
               │  • Llama 3.1 (Fallback)│      │  • News/General routing│
               │  • Auto-failover banner│      │  • Honesty rule URLs   │
               └────────────────────────┘      └────────────────────────┘
```

### 1. Tavily Web Intelligence Integration
- **Sole source of live evidence**: Tavily searches the live web for authoritative citations, published dates, and snippets.
- **Quota Protection (Ground Rule 6)**: Max 8 verified claims per check, 1 basic search per claim, cached by query hash for 24 hours. Stays under 10 credits per check.
- **Strict Honesty Rule (Ground Rule 4)**: A claim cannot receive a verdict other than `UNVERIFIABLE` unless backed by a real Tavily result URL. Zero fabricated URLs or dates.

### 2. Bifrost (Maxim AI) Gateway Integration
- **Universal LLM Mediation**: All claim extraction and evidence judging prompts route through Bifrost (`BIFROST_BASE_URL`).
- **Zero-Downtime Failover**: Seamless failover from primary model (`gemini-1.5-flash`) to fallback (`llama-3.1-8b-instant`). When failover activates, the UI alerts the user with an in-app banner: `'Switched to backup model via Bifrost'`.
- **Governance**: Bifrost dashboard provides live latency, token usage, and cost tracking.

---

## 🧮 Deterministic Freshness Scoring (`lib/score.ts`)

FreshCheck **never asks the LLM to guess the score**. The score is computed using a deterministic mathematical formula:

$$
\text{Base Verdict Score} = 
\begin{cases} 
90 & \text{SUPPORTED} \\
60 & \text{PARTIALLY\_SUPPORTED} \\
40 & \text{UNVERIFIABLE} \\
10 & \text{OUTDATED}
\end{cases}
$$

**Adjustments**:
- `+5` if at least one source is official (`.gov`, `.edu`, or entity documentation)
- `+5` if two or more independent domains corroborate
- `-10` if supporting evidence is older than 12 months on a high-volatility claim
- `-10` if sources conflict

**Clamping & Badges**:
- `75–100`: **Fresh** (Emerald Green `✓`)
- `40–74`: **Uncertain** (Amber `!`)
- `< 40`: **Stale** (Crimson Red `✕`)

**Overall Answer Index**: Weighted mean across active claims (High volatility: `3x`, Medium: `2x`, Low/Stable: skipped).

---

## ⏱️ 2-Minute Demo Script (For Hackathon Judges)

| Timestamp | Action | What to Say / Observe |
| :--- | :--- | :--- |
| **0:00 – 0:20** | **State Problem** | *"LLMs answer with high confidence using outdated information. FreshCheck is an automated factual freshness firewall."* |
| **0:20 – 0:50** | **1-Click Demo** | Click the **'Pricing and models'** or **'API versions'** sample chip. Click **'Check freshness'**. Watch the real-time SSE progress stepper: *Extracting claims → Searching the web → Judging evidence → Scoring*. |
| **0:50 – 1:15** | **Evidence Drawer** | Inspect the colored highlights. Click a red stale claim. The slide-out evidence drawer shows the asserted claim, the current verified value, and direct Tavily source URLs. |
| **1:15 – 1:40** | **Bifrost Failover** | Show Bifrost's request logs. Disable the primary model; re-run check to demonstrate automatic fallback to Llama with the in-app banner: *'Switched to backup model via Bifrost'*. |
| **1:40 – 1:55** | **How It Works** | Navigate to `/how-it-works` showcasing Tavily's live evidence role and Bifrost's routing and governance. |
| **1:55 – 2:00** | **Share Result** | Click **'Copy Share Link'** (`/check/[id]`) and open in an incognito window to prove shareable persistence. |

---

## 🚀 Quickstart (< 10 Minutes)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/freshcheck.git
cd freshcheck
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your keys:
```env
TAVILY_API_KEY=tvly-your-api-key
BIFROST_BASE_URL=http://localhost:8080/v1
MODEL_PRIMARY=gemini-1.5-flash
MODEL_FALLBACK=llama-3.1-8b-instant
```

### 3. Run the App
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Unit Tests
```bash
pnpm test
```
All 16 unit and integration test suites will execute and pass.

---

## 📦 Project Structure

```
freshcheck/
├── app/
│   ├── page.tsx               # Checker Home with sample chips & SSE stepper
│   ├── check/[id]/page.tsx    # Shareable permanent verification report
│   ├── how-it-works/page.tsx  # Interactive Bifrost & Tavily explainer
│   ├── api/check/route.ts     # SSE streaming verification pipeline
│   └── api/check/[id]/route.ts# Saved check fetcher
├── components/
│   ├── Navbar.tsx             # Responsive header with Bifrost failover banner
│   ├── ScoreBadge.tsx         # Pill badges with icon + score + status
│   ├── ProgressSteps.tsx      # Real-time pipeline stepper
│   ├── SampleChips.tsx        # 1-click demo presets
│   ├── ClaimCard.tsx          # Responsive claim cards with skeleton states
│   ├── AnnotatedAnswer.tsx    # Interactive highlighted text viewer
│   └── EvidenceDrawer.tsx     # Slide-out evidence inspector with score math
├── lib/
│   ├── bifrost.ts             # Bifrost AI gateway client with automatic failover
│   ├── tavily.ts              # Tavily web search with 24-hr caching
│   ├── extract.ts             # Prompt A extraction + offset repair
│   ├── judge.ts               # Prompt B evidence judging + honesty rule enforcement
│   ├── score.ts               # Deterministic 0-100 scoring calibration
│   ├── schemas.ts             # Strict Zod schemas
│   └── db.ts                  # Supabase schema & memory fallback store
├── data/
│   └── samples.ts             # 3 demo benchmarks (API, Leadership, Pricing)
├── tests/                     # 16 unit & integration tests
└── docs/                      # The 6 Architectural Foundation Documents
```

---

## 🏆 Hackathon Ground Rules Compliance Checklist

- [x] **No API keys in client code**: All calls to Tavily and Bifrost are strictly executed in Next.js Route Handlers.
- [x] **Dual Sponsor Integration**: 100% of LLM calls route through Bifrost; 100% of live web evidence retrieved via Tavily.
- [x] **Strict Honesty Rule**: Zero fabricated links; non-unverifiable verdicts require live Tavily URLs.
- [x] **Quota Protection**: 24-hour cache on Tavily queries; max 8 claims verified per check.
- [x] **Reliability & Failover**: Automatic fallback handling with UI notification banner.
- [x] **Deterministic Scoring**: Formula implemented in plain TypeScript; no hallucinated scores.
