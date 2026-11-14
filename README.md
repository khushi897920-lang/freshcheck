<div align="center">

# 🛡️ FreshCheck
### Autonomous Temporal Fact-Checking & Stale-Answer Detection Engine

**Spell-check for facts that expire. Paste any AI-generated response or ask a question to detect outdated claims, inspect live web evidence, and auto-correct with verified ground truth.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://freshguard-ai-eight.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/khushi897920-lang/freshcheck)
[![Bifrost Gateway](https://img.shields.io/badge/AI%20Gateway-Bifrost%20by%20Maxim%20AI-blueviolet?style=for-the-badge)](https://bifrost.maxim.ai)
[![Tavily](https://img.shields.io/badge/Live%20Search-Tavily%20API-orange?style=for-the-badge)](https://tavily.com)
[![Database](https://img.shields.io/badge/Database-Supabase%20Postgres-emerald?style=for-the-badge&logo=supabase)](https://supabase.com)

Built for **Geek Room Global AI Hackathon 2026**  
**Problem Statement 06:** *Build a Stale-Answer Detector for AI Applications (Tavily × Bifrost by Maxim AI)*

[**🚀 Launch Live Web App**](https://freshguard-ai-eight.vercel.app) • [**🎬 Watch 1-Min Demo Video**](https://drive.google.com/file/d/1_K1Z49LbPwDp9XzVNoX4xJT_jQQbJ8jT/view?usp=sharing) • [**📦 GitHub Repo**](https://github.com/khushi897920-lang/freshcheck)

</div>

---

## ⚡ The Problem: Temporal AI Hallucinations

Large Language Models (LLMs) answer with 100% confidence, but their training data is frozen in time. As the real world shifts, AI outputs quietly degrade into obsolete and misleading assertions:

- **Software & API Deprecations:** LLMs confidently recommend dead packages (e.g., *Create React App*) and end-of-life runtimes (*Node.js 14*).
- **SaaS Pricing & Model Drift:** Outputting outdated token rate cards, expired tiers, and superseded models.
- **Executive Leadership Transitions:** Stating former CEOs, ministers, and board members as current.
- **Dynamic Regulations & Laws:** Relying on outdated compliance mandates and tax codes.

Traditional RAG searches entire paragraphs blindly—wasting tokens and introducing noise. **FreshCheck solves this by extracting only time-sensitive atomic claims, verifying them against 2026 live web ground truth via Tavily, and routing/evaluating them through the Bifrost AI Gateway.**

---

## 🌟 Key Features

- **🎯 Claim-Targeted Retrieval:** Deconstructs paragraphs into atomic propositions and queries *only* volatile claims. Cuts search API quota consumption by up to **70%**.
- **⚡ Sub-Second SSE Streaming:** Real-time visual progress steps (`Extracting` ➔ `Searching` ➔ `Judging` ➔ `Scoring`) via Server-Sent Events.
- **🎨 Inline Tri-Color Highlighting:** Exact character-offset boundary snapping paints verified text:
  - 🟢 **Fresh ($\ge 75$):** Verified against current authoritative web sources.
  - 🟡 **Uncertain ($40-74$):** Partial or conflicting web records.
  - 🔴 **Stale ($< 40$):** Proven outdated or deprecated by fresh evidence.
- **🛡️ Strict Honesty Rule:** A claim cannot receive a verdict other than `UNVERIFIABLE` unless backed by a real Tavily source URL. Zero fabricated citations or hallucinations.
- **✨ 1-Click Semantic Auto-Correction:** Instantly rewrites outdated statements into accurate, current-day truths with inline clickable citations.
- **🔒 Private Session History:** Supabase PostgreSQL persistence with client-isolated sessions so each user's history remains private.

---

## 🏗️ System Architecture & Sponsor Integration

```
┌───────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 14 FRONTEND (Vercel)                       │
│   • Server-Sent Events (SSE) Stream    • Interactive Annotated Canvas     │
│   • Side-by-Side Evidence Drawer       • Session-Isolated Cloud History   │
└─────────────────────┬───────────────────────────────┬─────────────────────┘
                      │                               │
                      ▼                               ▼
┌───────────────────────────────────┐   ┌───────────────────────────────────┐
│      BIFROST GATEWAY (Railway)    │   │         TAVILY SEARCH API         │
│ • Cloud Virtual Key Authentication│   │ • Real-Time Web Source Retrieval  │
│ • Primary: Groq Qwen 27B          │   │ • 2026 Temporal Anchoring         │
│ • Fallback: Groq Llama 3.3 70B    │   │ • Clean Snippet Sanitizer         │
│ • JSON Schema Enforcement         │   │ • SHA-256 Response Cache          │
└─────────────────────┬─────────────┘   └─────────────────┬─────────────────┘
                      │                                   │
                      └─────────────────┬─────────────────┘
                                        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       SUPABASE POSTGRESQL DATABASE                        │
│   • checks (Session ID, Score, Status)    • claims (Offsets, Verdict)     │
│   • evidence (URLs, Snippets, Ranks)     • search_cache (Hashed Queries)  │
└───────────────────────────────────────────────────────────────────────────┘
```

### 1. Bifrost (Maxim AI) Gateway
- **Multi-Model Orchestration:** Deployed as a dedicated cloud instance on Railway with Virtual Key authentication (`sk-bf-...`).
- **Resilient Failover:** Automated zero-downtime failover between primary model (`groq/qwen/qwen3.8-27b`) and secondary model (`groq/llama-3.3-70b-versatile`).
- **Structured JSON Guarantees:** Enforces strict Zod schema validation for atomic claim offsets and judgment metrics.

### 2. Tavily Web Intelligence API
- **Live 2026 Ground-Truth Search:** Appends temporal anchors (`latest 2026`) to craft high-intent queries targeting specific volatile entities and attributes.
- **Markdown & Noise Sanitization:** Custom snippet cleaner removes raw markdown headers (`#`, `##`), promotional artifacts, and tracking links.
- **SHA-256 Deduplication Cache:** Caches search results to prevent duplicate API hits across sessions.

---

## 🧮 Calibrated Mathematical Freshness Scoring

FreshCheck **never asks an LLM to guess a score**. Freshness is computed deterministically in code (`lib/score.ts`):

| Claim Verdict | Base Score | Status | Criteria |
| :--- | :---: | :---: | :--- |
| **SUPPORTED** | **90** | 🟢 Fresh | Backed by current authoritative web sources |
| **PARTIALLY_SUPPORTED** | **60** | 🟡 Uncertain | Partially matched with minor discrepancy |
| **UNVERIFIABLE** | **40** | 🟡 Uncertain | Zero reliable web sources found (*Strict Honesty Rule*) |
| **OUTDATED** | **10** | 🔴 Stale | Contradicted by newer 2026 ground truth |

**Score Modifiers & Penalties:**
- **`+15` Official Domain Bonus:** Corroborated by primary domains (`.gov`, `.edu`, or official vendor documentation).
- **`+10` Consensus Bonus:** 3 or more independent domains corroborate the claim.
- **`-30` Staleness Penalty:** Newer evidence contradicts the asserted value.
- **Final Score:** Weighted mean across all active time-sensitive claims (scaled `0–100`).

---

## 🚀 Quickstart Guide

### 1. Clone & Install
```bash
git clone https://github.com/khushi897920-lang/freshcheck.git
cd freshcheck
pnpm install
```

### 2. Configure Environment Variables
Create `.env.local` in the project root:
```env
# Tavily Search API
TAVILY_API_KEY=tvly-your-api-key

# Bifrost AI Gateway (Railway or Local)
BIFROST_BASE_URL=https://bifrost-production-9a46e70e.up.railway.app/v1
BIFROST_API_KEY=sk-bf-your-virtual-key
MODEL_PRIMARY=groq/qwen/qwen3.8-27b
MODEL_FALLBACK=groq/llama-3.3-70b-versatile

# Supabase (Cloud Persistence)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view FreshCheck in your browser.

### 4. Run Automated Test Suite
```bash
pnpm test
```
Executes all **22 unit and integration tests** across 7 test suites testing scoring, fuzzy offset repair, judgment honesty rules, and SSE stream formatting.

---

## 📦 Project Structure

```
freshcheck/
├── app/
│   ├── page.tsx               # Interactive workspace canvas & history restoration
│   ├── check/[id]/page.tsx    # Shareable permanent verification report
│   ├── api/check/route.ts     # SSE streaming verification pipeline & session history
│   └── api/check/[id]/route.ts# Saved check fetcher & delete handler
├── components/
│   ├── CenterWorkspace.tsx    # Central canvas, auto-resizing input & mascot
│   ├── Sidebar.tsx            # Session-isolated history sidebar & benchmark presets
│   ├── AnnotatedAnswer.tsx    # Interactive sentence highlighter
│   ├── ClaimCard.tsx          # Structured claim cards with Truth badges
│   ├── EvidenceDrawer.tsx     # Deep citation inspector with score breakdown
│   ├── CodexBlobPet.tsx       # Interactive responsive mascot
│   └── ScoreBadge.tsx         # Color-coded freshness score badges
├── lib/
│   ├── bifrost.ts             # Bifrost AI gateway client with automatic failover
│   ├── tavily.ts              # Tavily live search with snippet cleaner & query cache
│   ├── extract.ts             # Atomic claim extraction & fuzzy character-offset snapping
│   ├── judge.ts               # Two-pass evidence judging & honesty rule enforcement
│   ├── score.ts               # Deterministic 0-100 scoring calibration
│   ├── correct.ts             # Semantic fresh answer rewriter
│   ├── schemas.ts             # Strict Zod schemas
│   └── db.ts                  # Supabase persistence with local fallback
├── tests/                     # 22 automated unit & integration tests
└── public/
    └── diagrams/              # System architecture & pipeline schematics
```

---

## 👥 Team Amigo

- **Khushi Singh** ([@khushi897920-lang](https://github.com/khushi897920-lang)) — *Full-Stack Architecture & Cloud Deployment*
- **Zaara Firdaus** — *AI Gateway & LLM Orchestration (Bifrost)*
- **Mohid Alam** — *Live Search & Ground-Truth Verification (Tavily)*

---

<div align="center">

**FreshCheck** — *Bridging Static LLM Memory and Real-World Reality.*  
Built with ❤️ for **Geek Room Global AI Hackathon 2026**

</div>
