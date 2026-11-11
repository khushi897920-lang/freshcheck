# 04 — UI/UX Design Brief

### Aesthetic
Minimal, dark-first, precise. Think Linear or Vercel: generous spacing, thin 1px borders, subtle accent colour, high information density.

### Color Palette
- **Background**: `#0B0D12`
- **Surface**: `#12151C`
- **Border**: `#1F2430`
- **Text Primary**: `#E6E8EE`
- **Text Muted**: `#8A91A3`
- **Primary / CTA**: `#6366F1` (Indigo accent with subtle glow)
- **Status Signals**:
  - `Fresh`: `#22C55E` (Emerald Green)
  - `Uncertain`: `#F59E0B` (Amber)
  - `Stale`: `#EF4444` (Crimson Red)
  - `Skipped`: `#6B7280` (Neutral Gray)

### Typography
- **UI Font**: Inter / Geist Sans
- **Mono Font**: JetBrains Mono for scores, URLs, dates, and extracted entities/values.
- **Scale**: H1 40px desktop / 28px mobile, body 16px.

### Components & Micro-interactions
- **Surfaces**: 12px rounded corners, flat surfaces with 1px border (`#1F2430`), no heavy drop shadows.
- **Score Badge**: Pill shape with icon, number, and status label:
  - `✓ 92 Fresh`
  - `! 55 Uncertain`
  - `✕ 12 Stale`
- **Annotated Text Highlights**: Coloured bottom border/underline with light translucent tinted background corresponding to status.
- **Key UI Patterns**:
  - Large textarea card with character counter (max 4,000)
  - Interactive sample chips (`API versions`, `Company leadership`, `Pricing and models`)
  - Real-time progress stepper
  - Responsive claim cards with skeleton shimmer loading
  - Radial overall score ring
  - Slide-out evidence drawer (desktop right-side, mobile bottom sheet)
  - Clipboard copy toast for share link

### Accessibility & Responsiveness
- Contrast at least 4.5:1 for text.
- **Never color-alone**: Always pair color with an icon (`✓`, `!`, `✕`) and readable text label.
- Keyboard accessible (Tab navigation, Escape closes drawer).
- `aria-live` region for screen reader progress announcement during streaming check.
