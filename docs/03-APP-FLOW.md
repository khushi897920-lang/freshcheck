# 03 — App Flow

### Pages
- `/`: Checker Home
- `/check/[id]`: Result Page
- `/how-it-works`: Explainer (Bifrost & Tavily)
- `/history`: Previous checks (nice to have)

### Navigation
Top navbar with logo, 'How it works', 'History' (if built) and a GitHub link. Stays consistent on mobile with a compact menu.

### First Screen (New Visitor)
One-line headline, a large textarea, three sample chips (`'API versions'`, `'Company leadership'`, `'Pricing and models'`), an optional date field, and a primary button `'Check freshness'`.

### User Journeys

#### Core Journey 1 — Check a Pasted Answer
1. User pastes an AI answer and clicks `'Check freshness'`.
2. Button becomes disabled; a progress stepper shows: `Extracting claims → Searching the web → Judging evidence → Scoring`.
3. Claims appear one by one as cards with `'Checking…'` skeletons that turn into verdict badges.
4. When done, the URL updates to `/check/[id]` (replace, not push) and the page shows the overall score, summary counts, and the annotated answer.
5. User clicks a highlighted claim; the evidence drawer opens with verdict, current value, explanation, score breakdown, and source links.

#### Core Journey 2 — One-Click Demo
1. User clicks a sample chip; the textarea fills with a pre-written stale answer.
2. User clicks `'Check freshness'` and observes red, amber, and green results in real time.

#### Core Journey 3 — Share
1. On the result page, the user clicks `'Copy link'`.
2. Anyone opening `/check/[id]` sees the identical read-only result.

### Empty & Loading States
- **Home with empty textarea**: Shows helper text `'Paste an AI answer to check which facts have expired'`.
- **Answer with no time-sensitive claims**: Shows `'No time-sensitive claims found. This answer looks stable.'`
- **Loading states**: Progress stepper, claim skeleton cards, disabled input.

### Error Handling & Edge States
- **Primary model fails**: Bifrost automatically fails over to the fallback model; UI renders an info banner `'Switched to backup model via Bifrost'`.
- **All models fail**: Show an error card with a `'Retry'` button; preserve the pasted text.
- **Tavily fails or quota exhausted**: Mark affected claims `UNVERIFIABLE` and display banner `'Live verification unavailable for some claims'`.
- **Input empty or > 4,000 characters**: Inline validation message.
- **Unknown `/check/[id]`**: 404 page with a button back to home.
- **Overlays**: Evidence drawer (right side on desktop, bottom sheet on mobile), dismissible with Escape or backdrop click.
