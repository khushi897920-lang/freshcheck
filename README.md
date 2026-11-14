<div align="center">

# 🛡️ FreshCheck
### *The Autonomous Temporal Firewall for Generative AI*

**Spell-check for facts that expire. Paste any AI answer or ask a question to see which claims are fresh vs. stale.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Production-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://freshguard-ai-eight.vercel.app)
[![Demo Video](https://img.shields.io/badge/Watch-Demo%20Video-E50914?style=for-the-badge&logo=google-drive&logoColor=white)](https://drive.google.com/file/d/1_K1Z49LbPwDp9XzVNoX4xJT_jQQbJ8jT/view?usp=sharing)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/khushi897920-lang/freshcheck)
[![Bifrost Gateway](https://img.shields.io/badge/AI%20Gateway-Bifrost%20by%20Maxim%20AI-4F46E5?style=for-the-badge)](https://bifrost-production-9a46e70e.up.railway.app)
[![Tavily Search](https://img.shields.io/badge/Live%20Web-Tavily%20Search%20API-0ea5e9?style=for-the-badge)](https://tavily.com)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Tests](https://img.shields.io/badge/Tests-22%2F22%20Passing-success?style=for-the-badge&logo=vitest&logoColor=white)](https://github.com/khushi897920-lang/freshcheck)

<br />

Built for **Geek Room Global AI Hackathon 2026**  
**Problem Statement 06 (Tavily × Bifrost by Maxim AI)**  
**Theme:** *AI-Powered Fact Verification & Information Freshness*

<br />

[Explore Live Demo](https://freshguard-ai-eight.vercel.app) · [Watch 55s Video](https://drive.google.com/file/d/1_K1Z49LbPwDp9XzVNoX4xJT_jQQbJ8jT/view?usp=sharing) · [Report Bug](https://github.com/khushi897920-lang/freshcheck/issues)

</div>

---

## 💡 What is FreshCheck?

Large language models generate answers with 100% confidence, but **their training is frozen in time**. 

In the real world:
- 📦 **APIs deprecate** (e.g. *Create React App* was officially superseded by Vite/Next.js).
- 💰 **SaaS pricing shifts** (token prices drop from $0.002 to $0.50/M tokens).
- 👔 **Leadership changes** (CEOs step down, ministers take office).
- ⚖️ **Regulations update** (SEBI compliance, CSRD rules evolve).

When LLMs answer questions involving volatile facts, they quietly output **expired truths**—leading to broken production builds, wrong financial models, and compliance risks.

**FreshCheck is an autonomous verification layer** that deconstructs AI responses into atomic claims, verifies each claim against real-time 2026 web evidence via **Tavily**, orchestrates resilient LLM evaluation via **Bifrost by Maxim AI**, and calculates a deterministic **0–100 Freshness Score** with 1-click semantic auto-correction.

---

## 🎬 Live Product Showcase

```
+------------------------------------------------------------------------------------------------+
|  [ FRESHNESS SCORE: 61 UNCERTAIN ]    (1 Fresh  ·  0 Uncertain  ·  1 Stale)                    |
|                                                                                                |
|  Annotated Answer:                                                                             |
|  [GREEN: 95 Fresh] "OpenAI charges $30 per million input tokens for GPT-4", and                |
|  [PINK: 10 Stale]  "Anthropic's Claude 3 Opus is their only multimodal model."                 |
|                                                                                                |
|  Extracted Claims:                                                                             |
|  #1 PRICING       ✔️ 95 Fresh  → Confirmed $30.00 rate (Tavily 5 web sources)                 |
|  #2 AVAILABILITY  ❌ 10 Stale  → TRUTH: Multiple newer models support multimodality           |
+------------------------------------------------------------------------------------------------+
```

- 🟢 **Fresh ($\ge 75$):** Grounded in authoritative, current 2026 evidence.
- 🟡 **Uncertain ($40–74$):** Partial support or conflicting web reports.
- 🔴 **Stale ($< 40$):** Proven outdated or contradicted by current records.
- 🪄 **1-Click Auto-Correction:** Replaces obsolete claims with verified current facts and clickable citations.

---

## 🏗️ System Architecture & Workflow

```
                                    ┌────────────────────────────────────────────────────────┐
                                    │              FreshCheck Next.js 14 Client              │
                                    │   • Chat-style Input Bar    • Character-Snapped Canvas │
                                    │   • Sub-second SSE Stepper  • Session-Isolated History │
                                    └───────────────────────────┬────────────────────────────┘
                                                                │ POST /api/check (SSE Stream)
                                                                ▼
                                    ┌────────────────────────────────────────────────────────┐
                                    │               Streaming Pipeline Engine                │
                                    │   1. Question Router & Direct Q&A (via Bifrost)        │
                                    │   2. Atomic Claim Extraction & Volatility Tagging      │
                                    │   3. Temporal Search Query Formulation ("latest 2026") │
                                    │   4. Two-Pass Cross-Verification & Evidence Judging    │
                                    │   5. Deterministic Calibrated Scoring (lib/score.ts)   │
                                    └───────────────┬────────────────────────┬───────────────┘
                                                    │                        │
                    Structured Orchestration & Failover        Real-Time Ground-Truth Retrieval
                                                    │                        │
                                                    ▼                        ▼
                                    ┌────────────────────────┐      ┌────────────────────────┐
                                    │   Bifrost AI Gateway   │      │   Tavily Search API    │
                                    │   (Railway Cloud)      │      │   (@tavily/core)       │
                                    │   • Virtual Key Auth   │      │   • 2026 Time Anchor   │
                                    │   • Groq Qwen 27B      │      │   • Snippet Sanitizer  │
                                    │   • Llama 3.3 Fallback │      │   • SHA-256 Dedupe     │
                                    └────────────────────────┘      └────────────────────────┘
                                                    │                        │
                                                    └───────────┬────────────┘
                                                                ▼
                                    ┌────────────────────────────────────────────────────────┐
                                    │              Supabase PostgreSQL Database              │
                                    │   • checks (Session ID, Score, Processing Status)      │
                                    │   • claims (Entity, Attribute, Offsets, Verdict)       │
                                    │   • evidence (URLs, Snippets, Reliability Rank)        │
                                    │   • search_cache (SHA-256 Hashed Query Deduplication)  │
                                    └────────────────────────────────────────────────────────┘
```

---

## ⚡ The 4 Hackathon Core Pillars (PS 06)

### 1. 🔍 Claim Identification
- Breaks compound answers into testable atomic assertions using structured JSON schemas enforced by **Bifrost**.
- Discriminated volatility tagging (*High*, *Medium*, *Low*, *Stable Fact*).
- **Fuzzy Character Snapping:** Proprietary algorithm (`lib/extract.ts`) snaps raw LLM string offsets to exact sentence boundaries, eliminating disjointed text highlights.

### 2. ⏳ Freshness Detection
- Proactively flags temporal decay across 4 high-risk domains:
  1. **Software & Runtime Deprecations** (Node.js LTS, React, Python default releases).
  2. **Model Releases & SaaS Pricing** (OpenAI token rates, Anthropic tiers).
  3. **Corporate Leadership** (CEO tenures, ministerial cabinets).
  4. **Compliance & Regulations** (SEBI BRSR, EU AI Act, CSRD).

### 3. 🌐 Live Verification (Powered by Tavily)
- Sole source of live real-world truth.
- **Temporal Query Synthesis:** Generates high-intent queries automatically appended with current temporal anchors (`latest 2026`).
- **Snippet Sanitization (`cleanSnippetText`):** Strips raw markdown hashtags (`#`, `##`), promotional clutter, and messy HTML tags before presentation.
- **Strict Honesty Rule:** Zero fabricated URLs. A claim cannot receive a verdict other than `UNVERIFIABLE` unless substantiated by an authentic Tavily result.

### 4. 🧮 Deterministic Freshness Scoring (`lib/score.ts`)
FreshCheck **never asks an LLM to guess a score**. Freshness is calculated mathematically:

$$
\text{Base Score} = 
\begin{cases} 
90 & \text{SUPPORTED} \\
60 & \text{PARTIALLY\_SUPPORTED} \\
40 & \text{UNVERIFIABLE} \\
10 & \text{OUTDATED}
\end{cases}
$$

**Deterministic Adjustments:**
- `+15` Bonus if substantiated by official vendor documentation or government domains (`.gov`, `.edu`, official documentation).
- `+5` Bonus if two or more independent top-level domains corroborate.
- `-30` Penalty if contradicted by newer primary evidence.
- `-10` Penalty if sources present unresolved temporal conflict.

---

## 🛠️ Technology Stack

| Layer | Technology | Role & Deployment |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)** | Server-Sent Events (SSE) streaming UI, Tailwind CSS, Lucide Icons, Framer Motion. Deployed on **Vercel Edge**. |
| **AI Gateway** | **Bifrost by Maxim AI** | Deployed on **Railway Cloud**. Orchestrates Groq Qwen 27B with automated fallback to Llama 3.3. Virtual Key authentication (`sk-bf-...`). |
| **Live Search** | **Tavily Core API** | Real-time web retrieval, temporal query formulation, and sanitized snippet extraction. |
| **Database** | **Supabase PostgreSQL** | Relational schema with RLS policies, tracking `checks`, `claims`, `evidence`, and `search_cache`. |
| **Testing** | **Vitest** | 22 comprehensive unit and integration test suites covering extraction, judging, scoring, and streaming APIs. |

---

## 🚀 Quickstart Guide (< 5 Minutes)

### 1. Clone & Install
```bash
git clone https://github.com/khushi897920-lang/freshcheck.git
cd freshcheck
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Provide your API keys:
```env
# Tavily Search API
TAVILY_API_KEY=tvly-your-api-key

# Bifrost AI Gateway (Maxim AI)
BIFROST_BASE_URL=https://bifrost-production-9a46e70e.up.railway.app/v1
BIFROST_API_KEY=sk-bf-your-virtual-key
MODEL_PRIMARY=groq/qwen/qwen3.8-27b
MODEL_FALLBACK=groq/qwen/qwen3.8-27b

# Supabase (Cloud Persistence)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Test Suite
```bash
pnpm test
```
```
 ✓ tests/score.test.ts (7 tests)
 ✓ tests/nice-to-have.test.ts (2 tests)
 ✓ tests/db.test.ts (2 tests)
 ✓ tests/smoke-test.test.ts (2 tests)
 ✓ tests/extract.test.ts (2 tests)
 ✓ tests/judge.test.ts (2 tests)
 ✓ tests/api.test.ts (5 tests)

Test Files  7 passed (7)
     Tests  22 passed (22)
```

---

## 👥 Team Amigo

Crafted with ❤️ for **Geek Room Global AI Hackathon 2026**:

- **Khushi Singh** — Full-Stack Architecture & Cloud Deployment ([@khushi897920-lang](https://github.com/khushi897920-lang))
- **Zaara Firdaus** — AI Gateway & Model Routing (Bifrost)
- **Mohid Alam** — Real-Time Search & Verification (Tavily)

---

## 📄 License & Compliance

Distributed under the **MIT License**. See `LICENSE` for details. Built in strict adherence to the **Geek Room Global AI Hackathon 2026 Problem Statement 06 Guidelines**.
