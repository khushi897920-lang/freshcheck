# 03 — App Flow

### Pages & Routes
- `/`: Main FreshCheck Workspace (ChatGPT-style Prompt Bar, Canvas, Interactive Mascot, Dual Drawers)
- `/check/[id]`: Shareable Permanent Verification Report
- `/how-it-works`: Explainer & Technical Deep Dive (Bifrost Gateway & Tavily Intelligence)
- `/api/check`: SSE streaming pipeline for verification + `GET` recent history
- `/api/check/[id]`: Single check retrieval & deletion

### Navigation & Layout
- **Left Sidebar**: Workspace brand, `+ New check` button (`⌘N`), Search filter, and ChatGPT-style minimal history list grouped into `Today`, `Yesterday`, `Previous 7 Days`, and `Previous 30 Days`.
- **Top Header Bar**: Menu toggle, Brand Pill, Bifrost · Tavily indicator, and Reports drawer toggle.
- **Main Canvas**: Live pipeline stepper, Score Summary Card, Interactive Highlighted Answer, Claim Cards, and Corrected Answer generation.
- **Right Sidebar / Evidence Drawer**: Verification disclosures, Audit download (Markdown), Live Logs, and deep evidence inspection.

---

### User Journeys

#### Core Journey 1 — Check a Pasted AI Answer
1. User enters or pastes an AI answer and presses Enter or clicks the submit arrow.
2. The input bar smoothly auto-minimizes to the bottom of the canvas like ChatGPT.
3. Progress stepper streams real-time stages: `Extracting claims → Searching the web → Judging evidence → Scoring`.
4. Claims appear progressively with live verdict badges (`SUPPORTED`, `OUTDATED`, `PARTIALLY_SUPPORTED`, `UNVERIFIABLE`).
5. When completed, overall score ring, summary counts, and the interactive annotated answer render on the main canvas.
6. Clicking any colored highlight opens the Evidence Drawer with current ground-truth values and direct Tavily source links.

#### Core Journey 2 — Ask Any Question Directly (Interactive AI Q&A)
1. User enters a direct question (e.g., *"Who is the CEO of Twitter?"* or *"Is Sundar Pichai dead?"*).
2. FreshCheck recognizes the interrogative prompt and routes it to Bifrost to generate a direct factual response.
3. The generated answer is presented and immediately passed into the verification pipeline to extract and verify all claims against live Tavily web evidence.

#### Core Journey 3 — One-Click Fix & Corrected Answer
1. On answers with stale claims (e.g. red `< 40` score), user clicks **"Generate Fresh Answer"**.
2. FreshCheck automatically replaces every outdated fact with verified current values, providing clean copyable text and a diff view.

#### Core Journey 4 — ChatGPT-Style History Browsing
1. Past checks are saved automatically to persistent disk storage (`.cache/local_db.json`).
2. Past verifications appear in the left sidebar grouped by time horizon (`Today`, `Yesterday`, etc.).
3. Clicking any history item instantly restores the text, claims, evidence, and scores into the workspace without re-running or consuming tokens.
4. Hovering an item reveals a trash icon for 1-click deletion.

#### Core Journey 5 — One-Click Benchmark Presets
1. User clicks any benchmark preset (`Node.js & API Deprecations`, `Leadership & C-Suite`, `Pricing & Model Drift`, `Regulatory & Compliance`).
2. The input fills with pre-calibrated test cases and begins verification instantly.

#### Core Journey 6 — Shareable Verification Report
1. On the report view, user copies the `/check/[id]` URL or clicks **Download Markdown Audit**.
2. Anyone opening `/check/[id]` loads the complete read-only audit report with identical citations and score mathematics.

---

### Empty & Loading States
- **Clean Workspace**: Shows welcome greeting and helper prompts.
- **Answer with No Volatile Claims**: Displays a verified stable card confirming the statement contains stable facts.
- **Active Processing**: Stepper displays current pipeline phase with pulsating mascot animations.

### Error Handling & Edge States
- **Primary model token limit or downtime**: Bifrost automatically falls over to the backup model; UI displays an alert banner.
- **Groq Free Tier OTPM Rate Limits**: Automatic request throttling and 2-item concurrency batching keep requests within limits.
- **No live web records**: Strictly marked `UNVERIFIABLE` under the Honesty Rule (no fabricated citations).
