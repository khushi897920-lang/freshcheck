# FreshCheck <img src="public/favicon.svg" alt="FreshCheck Logo" width="36" height="36" align="center" />
> **Spell-check for facts that expire. Paste any AI answer or ask any question to see which claims are fresh vs stale.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://freshguard-ai-eight.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/khushi897920-lang/freshcheck)
[![Database](https://img.shields.io/badge/Database-Supabase-emerald?style=for-the-badge&logo=supabase)](https://supabase.com)

Built for **Geek Room Global AI Hackathon 2026** · **Problem Statement 06 (Tavily × Bifrost)**

🔗 **Live Production URL:** [https://freshguard-ai-eight.vercel.app](https://freshguard-ai-eight.vercel.app)  
📦 **Repository:** [https://github.com/khushi897920-lang/freshcheck](https://github.com/khushi897920-lang/freshcheck)

---

## ⚡ The Problem
Large Language Models (LLMs) are trained up to a fixed cutoff date. After that cutoff, **SaaS pricing tiers, library versions, APIs, tax regulations, and company executives change**, but AI models continue asserting stale facts with 100% confidence.

Users copy deprecated code, paste wrong prices into financial budgets, or reach out to former CEOs. Existing warning banners are vague (*"AI can make mistakes"*). **FreshCheck provides claim-level verification**, an objective 0–100 Freshness Score, the current verified value, and live source citations.

---

## 🏗️ Architecture & Dual Sponsor Integration

```
               ┌────────────────────────────────────────────────────────┐
               │             FreshCheck Cowork (Next.js 14)             │
               │   • ChatGPT-style Prompt Bar  • Interactive Canvas     │
               │   • Real-time SSE Stepper     • Chronological History  │
               │   • Score Ring & Metrics      • Slide-out Evidence     │
               └───────────────────────────┬────────────────────────────┘
                                           │ POST /api/check (SSE Stream)
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │               Next.js Route Handlers Pipeline          │
               │   1. Bifrost Direct Q&A (Answers questions via LLM)    │
               │   2. Bifrost Claim Extraction (Atomic facts + offsets) │
               │   3. Tavily Search per claim (with 24h Query Cache)    │
               │   4. Bifrost Evidence Judging (Truth alignment)        │
               │   5. Deterministic Scoring in Code (lib/score.ts)      │
               └───────────────┬────────────────────────┬───────────────┘
                               │                        │
       LLM Orchestration & Failover        Live Ground-Truth Web Evidence
                               │                        │
                               ▼                        ▼
               ┌────────────────────────┐      ┌────────────────────────┐
               │  Bifrost AI Gateway    │      │  Tavily Web Search     │
               │  (Docker Container)    │      │  (@tavily/core API)    │
               │  • Qwen 3.8 / Llama 3  │      │  • Basic depth         │
               │  • Universal OpenAI SDK│      │  • News/General routing│
               │  • Auto-failover banner│      │  • Honesty rule URLs   │
               └────────────────────────┘      └────────────────────────┘
```

### 1. Tavily Web Intelligence Integration
- **Sole source of live evidence**: Tavily searches the live web for authoritative citations, published dates, and snippets.
- **Quota Protection (Ground Rule 6)**: Max 8 verified claims per check, 1 basic search per claim, cached by query hash for 24 hours. Stays under 10 credits per check.
- **Strict Honesty Rule (Ground Rule 4)**: A claim cannot receive a verdict other than `UNVERIFIABLE` unless backed by a real Tavily result URL. Zero fabricated URLs or dates.

### 2. Bifrost (Maxim AI) Gateway Integration
- **Universal LLM Mediation**: 100% of claim extraction, evidence judging, and question-answering prompts route through Bifrost (`BIFROST_BASE_URL`).
- **Zero-Downtime Failover**: Seamless failover from primary model to fallback model. When failover activates, the UI alerts the user with an in-app banner.
- **Dockerized Gateway**: Runs locally in Docker with zero latency overhead.

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

## ✨ Key Features & User Experience

1. **ChatGPT-Style Prompt Bar**:
   - Auto-minimizes smoothly upon submission like ChatGPT.
   - Textarea auto-expands in height as multiline answers are pasted without vertical text clipping.
2. **ChatGPT-Style Verification History**:
   - Sidebar displays past checks chronologically grouped into `Today`, `Yesterday`, `Previous 7 Days`, and `Previous 30 Days`.
   - Single-click restores previous claims, evidence, and scores without re-running or consuming tokens.
   - 1-click delete on hover.
3. **Direct Question Answering**:
   - Type questions like *"Who is the CEO of Twitter?"* or *"Is Sundar Pichai dead?"*.
   - Bifrost generates a direct factual answer, and the pipeline verifies each claim live with Tavily web evidence.
4. **One-Click Corrected Answer**:
   - Click *"Generate Fresh Answer"* on any stale report to see an updated version where outdated claims are replaced with current ground truth.
5. **Interactive Codex Blob Mascot**:
   - Reactive companion that celebrates fresh answers, nods while checking, and displays tips.
6. **Zero Scrollbar Clutter**:
   - Global scrollbar suppression with native smooth mouse wheel, touch, and trackpad gestures.

---

## ⏱️ 2-Minute Demo Script (For Hackathon Judges)

| Timestamp | Action | What to Say / Observe |
| :--- | :--- | :--- |
| **0:00 – 0:20** | **State Problem** | *"LLMs answer with high confidence using outdated information. FreshCheck is an automated factual freshness firewall."* |
| **0:20 – 0:50** | **1-Click Demo** | Click the **'Pricing and models'** or **'API versions'** sample preset. Click **'Check freshness'**. Watch the real-time SSE progress stepper: *Extracting claims → Searching the web → Judging evidence → Scoring*. |
| **0:50 – 1:15** | **Evidence Drawer** | Inspect the colored highlights. Click a red stale claim. The slide-out evidence drawer shows the asserted claim, the current verified value, and direct Tavily source URLs. |
| **1:15 – 1:35** | **Corrected Answer** | Click **'Generate Fresh Answer'** to show automatic replacement of stale claims with current verified facts. |
| **1:35 – 1:50** | **History & Direct Q&A** | Ask a live question (*"Who is the CEO of Twitter?"*) or select past checks from the ChatGPT-style history sidebar. |
| **1:50 – 2:00** | **Share Result** | Click **'Copy Share Link'** (`/check/[id]`) or download the Markdown audit report. |

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
BIFROST_API_KEY=sk-bf-your-bifrost-key
MODEL_PRIMARY=qwen/qwen3.8-27b
MODEL_FALLBACK=qwen/qwen3.8-27b
```

### 3. Run Bifrost Gateway (Docker)
```bash
docker compose up -d
```
The Bifrost container will start on `http://localhost:8080`.

### 4. Run the Dev Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Unit & Integration Tests
```bash
pnpm test
```
All **19 tests** across 7 test suites will execute and pass cleanly.

---

## 📦 Project Structure

```
freshcheck/
├── app/
│   ├── page.tsx               # Workspace canvas with ChatGPT prompt bar & history
│   ├── check/[id]/page.tsx    # Shareable permanent verification report
│   ├── how-it-works/page.tsx  # Interactive Bifrost & Tavily explainer
│   ├── api/check/route.ts     # SSE streaming verification pipeline + history GET
│   └── api/check/[id]/route.ts# Saved check fetcher & delete handler
├── components/
│   ├── CenterWorkspace.tsx    # Central canvas, auto-resizing input & mascot
│   ├── SidebarLeft.tsx        # ChatGPT-style grouped history sidebar & benchmarks
│   ├── SidebarRight.tsx       # Reports & evidence side-panel
│   ├── AnnotatedAnswer.tsx    # High-contrast interactive claim highlighter
│   ├── ClaimCard.tsx          # Structured claim cards with Truth badges
│   ├── EvidenceDrawer.tsx     # Deep citation inspector with score breakdown
│   ├── CodexBlobPet.tsx       # Interactive Feral Blob mascot companion
│   └── ScoreBadge.tsx         # Freshness score pills
├── lib/
│   ├── bifrost.ts             # Bifrost AI gateway client with automatic failover
│   ├── tavily.ts              # Tavily web search with 24-hr query cache
│   ├── extract.ts             # Prompt A extraction + offset repair
│   ├── judge.ts               # Prompt B evidence judging + honesty rule enforcement
│   ├── score.ts               # Deterministic 0-100 scoring calibration
│   ├── correct.ts             # Corrected fresh answer generator
│   ├── exportMarkdown.ts      # Markdown audit exporter
│   ├── schemas.ts             # Strict Zod schemas
│   └── db.ts                  # Hybrid Supabase & file-backed persistence store
├── data/
│   └── samples.ts             # Benchmark test cases
├── tests/                     # 19 unit & integration tests across 7 test files
└── docs/                      # 6 Foundation Architectural Documents
```

---

## 🏆 Hackathon Ground Rules Compliance Checklist

- [x] **No API keys in client code**: All calls to Tavily and Bifrost are strictly executed in Next.js Route Handlers.
- [x] **Dual Sponsor Integration**: 100% of LLM calls route through Bifrost; 100% of live web evidence retrieved via Tavily.
- [x] **Strict Honesty Rule**: Zero fabricated links; non-unverifiable verdicts require live Tavily URLs.
- [x] **Quota Protection**: 24-hour cache on Tavily queries; max 8 claims verified per check.
- [x] **Reliability & Failover**: Automatic fallback handling with UI notification banner.
- [x] **Deterministic Scoring**: Formula implemented in plain TypeScript; no hallucinated scores.
