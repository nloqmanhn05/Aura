# design.md — Investing App UI (Dark/Lime Fintech) — Responsive

Responsive design spec reverse-engineered from the "Original Design" reference: three screens (Investing Quiz, Stock Detail, Analyst Ratings). Designed **mobile-first** and scales from 320px phones to 1920px+ desktops. Values are visual estimates from the image; adjust to taste.

---

## 1. Design Principles

- **High contrast, two-mode UI.** Dark screens for engagement/data moments (quiz, ratings); light screen for the dense data view (stock detail).
- **One accent.** Electric lime is the only brand color: "selected", "positive", "primary action".
- **Big, bold, uppercase headlines.** Tight leading, heavy weight, short copy.
- **Pill and super-rounded shapes everywhere.** No sharp corners.
- **Numbers are heroes.** Prices and percentages are large; labels are small and quiet.
- **Depth through fade, not shadow.**
- **Fluid first, breakpoints second.** Type, spacing and component sizes scale continuously with `clamp()`; breakpoints only change *layout*.
- **Never fixed pixel widths.** Components use `%`, `fr`, `minmax()`, `max-width`; no horizontal scroll at any width (except intentional chip/carousel rows).

---

## 2. Typography

**Font family:** [Google Sans](https://fonts.google.com/specimen/Google+Sans)

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
--font-sans: 'Google Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
```

### Fluid type scale
Each token interpolates between a 320px and a 1440px viewport.

| Token | Min → Max size | Line-height | Weight | Case | Usage |
|---|---|---|---|---|---|
| `display-xl` | 36px → 64px | 1.0 | 700 | Normal | Price (`$176.02`), big % (`65%`) |
| `display-l` | 28px → 56px | 1.06 | 700 | **UPPERCASE** | Screen headlines |
| `title-m` | 20px → 28px | 1.2 | 700 | Normal | Option value, stat value |
| `title-s` | 16px → 20px | 1.25 | 600 | Normal | Card titles |
| `body-m` | 14px → 16px | 1.4 | 500 | Normal | Buttons, labels |
| `body-s` | 12px → 14px | 1.35 | 400 | Normal | Nav subtitles, captions |
| `caption` | 11px → 12px | 1.2 | 500 | Normal | Deltas, chips, tooltip |

```css
:root {
  --fs-display-xl: clamp(2.25rem, 1.6rem + 2.9vw, 4rem);
  --fs-display-l:  clamp(1.75rem, 1.2rem + 2.5vw, 3.5rem);
  --fs-title-m:    clamp(1.25rem, 1.1rem + 0.7vw, 1.75rem);
  --fs-title-s:    clamp(1rem, 0.95rem + 0.25vw, 1.25rem);
  --fs-body-m:     clamp(0.875rem, 0.85rem + 0.12vw, 1rem);
  --fs-body-s:     clamp(0.75rem, 0.73rem + 0.1vw, 0.875rem);
  --fs-caption:    clamp(0.6875rem, 0.67rem + 0.05vw, 0.75rem);
}
```

Rules:
- Headlines: uppercase, weight 700, `text-wrap: balance`, max 3 lines on mobile, 2 lines on desktop.
- `font-variant-numeric: tabular-nums` on prices and percentages.
- Honor user font-size settings: use `rem`, never `px`, for text.

---

## 3. Color Tokens

```css
:root {
  /* Brand */
  --lime-500: #C8FF00;
  --lime-400: #D6FF4D;
  --lime-100: #F1FFB8;

  /* Neutrals (dark) */
  --ink-950: #0E0E0E;
  --ink-900: #1A1A1A;
  --ink-800: #2B2B2B;
  --ink-600: #4A4A4A;
  --gray-500: #8C8C8C;

  /* Neutrals (light) */
  --white: #FFFFFF;
  --gray-100: #F1F1F1;
  --gray-200: #E4E4E4;
  --gray-400: #A8A8A8;
  --gray-600: #6B6B6B;      /* essential text on white (AA) */

  /* Text */
  --text-on-dark: #FFFFFF;
  --text-muted-on-dark: #A0A0A0;
  --text-on-light: #0E0E0E;
  --text-on-lime: #0E0E0E;

  /* Semantic */
  --positive: var(--lime-500);
  --neutral: var(--gray-500);
  --negative: var(--ink-800);
}
```

Optional: support `prefers-color-scheme` by letting Stock Detail follow the system theme (dark = `--ink-950` background, chart line stays lime).

---

## 4. Spacing, Radius, Sizing

### Fluid spacing
```css
:root {
  --space-1: clamp(4px, 0.3vw + 2px, 6px);
  --space-2: clamp(8px, 0.5vw + 5px, 12px);
  --space-3: clamp(12px, 0.7vw + 8px, 16px);
  --space-4: clamp(16px, 1vw + 10px, 24px);
  --space-5: clamp(24px, 1.5vw + 14px, 40px);
  --space-6: clamp(32px, 2.5vw + 16px, 64px);

  --gutter: clamp(16px, 4vw, 48px);        /* screen side padding */
  --stack-gap: clamp(8px, 1vw + 4px, 16px);/* gap between cards */
}
```

### Radius
| Token | Value | Usage |
|---|---|---|
| `--r-pill` | 999px | Chips, buttons, option cards, toggle, slide button |
| `--r-card` | `clamp(20px, 2vw + 12px, 32px)` | Rating rows, stat cards, info card |

### Component sizing (fluid)
| Token | Value | Usage |
|---|---|---|
| `--btn-circle` | `clamp(36px, 2vw + 28px, 48px)` | Nav circle buttons |
| `--hit-min` | 44px | Minimum touch target (pad hit area if visual is smaller) |
| `--option-h` | `clamp(56px, 3vw + 44px, 76px)` | Quiz option cards |
| `--rating-h` | `clamp(72px, 4vw + 56px, 104px)` | Rating rows |
| `--slide-h` | `clamp(56px, 2.5vw + 46px, 72px)` | Slide-to-buy |
| `--chip-h` | `clamp(28px, 1vw + 22px, 36px)` | Timeframe chips |

**Elevation:** none. Use gradient fades:
```css
--fade-card: linear-gradient(180deg, var(--ink-800) 0%, rgba(43,43,43,0.4) 100%);
```

---

## 5. Breakpoints & Layout

Mobile-first; use `min-width` queries.

| Name | Range | Columns | Behavior |
|---|---|---|---|
| `xs` | 320–479 | 1 | Compact. Hide secondary text where noted. |
| `sm` | 480–767 | 1 | Content centered, `max-width: 480px` for quiz/ratings. |
| `md` | 768–1023 | 2 | Tablet. Stock Detail splits chart + stats. |
| `lg` | 1024–1439 | 12-col grid | Desktop. Multi-panel layout, sticky buy panel. |
| `xl` | 1440+ | 12-col grid | Wide. Content capped at `1280px`, centered. |

```css
:root {
  --bp-sm: 480px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1440px;
}

.container {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: var(--gutter);
}
```

### Safe areas & viewport units
```css
.app { min-height: 100dvh; }                        /* dvh, not vh (mobile browser chrome) */
.screen {
  padding-top: max(var(--space-3), env(safe-area-inset-top));
  padding-bottom: max(var(--space-3), env(safe-area-inset-bottom));
  padding-left: max(var(--gutter), env(safe-area-inset-left));
  padding-right: max(var(--gutter), env(safe-area-inset-right));
}
```
Sticky bottom controls (dual toggle, slide-to-buy) sit above `env(safe-area-inset-bottom)`.

### Orientation
- **Landscape phones** (`max-height: 480px`): reduce headline to `display-l` min size, collapse vertical gaps to `--space-2`, place chart and stats side-by-side.

---

## 6. Screen Layouts (per breakpoint)

### 6.1 Investing Quiz
| Breakpoint | Layout |
|---|---|
| `xs–sm` | Single column. Nav → progress bar → headline → options (stacked) → sticky dual toggle at bottom. |
| `md` | Centered column, `max-width: 560px`. Dark full-bleed background. |
| `lg+` | Two-panel: left 5/12 headline + progress (sticky, vertically centered), right 7/12 options stack (`max-width: 560px`). Dual toggle sits under options, not fixed. |

### 6.2 Stock Detail
| Breakpoint | Layout |
|---|---|
| `xs–sm` | Single column: nav → price header → chart → timeframe chips → stat cards (2-up; stack to 1-up below 360px) → sticky slide-to-buy. |
| `md` | Chart full width; stat cards 2-up beneath; slide-to-buy inline at bottom (`max-width: 480px`, centered). |
| `lg+` | 12-col grid: chart + price header span 8 cols; right 4 cols is a sticky panel with stat cards (stacked) and slide-to-buy. Chart height `clamp(320px, 40vh, 520px)`. |

### 6.3 Analyst Ratings
| Breakpoint | Layout |
|---|---|
| `xs–sm` | Headline → rating rows stacked → info card peeking at bottom (horizontal scroll carousel). |
| `md` | Rating rows stacked, `max-width: 640px`. Info cards 2-up. |
| `lg+` | Left 6 cols: headline + rating rows. Right 6 cols: info cards in a 2-col grid (`repeat(auto-fill, minmax(280px, 1fr))`). |

---

## 7. Components (responsive behavior)

### 7.1 Top Navigation
- Height `clamp(56px, 2vw + 48px, 72px)`; side padding `var(--gutter)`.
- Left/right circles use `--btn-circle` with `--hit-min` hit area.
- Center title: single-line ellipsis; subtitle (ticker) hidden below 340px.
- `lg+`: nav becomes a top bar inside `.container`; back button gets a text label ("Back").

### 7.2 Segmented Progress Bar
- Full width, `height: clamp(4px, 0.3vw + 2px, 6px)`, gap `--space-1`, `display: grid; grid-auto-flow: column; grid-auto-columns: 1fr`.

### 7.3 Option Card (Quiz)
```css
.option {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--option-h);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--r-pill);
}
```
- Selected: `--lime-500` background, `--text-on-lime`. Unselected: `--fade-card`.
- Avatar stack hides below 360px; count chip hides below 320px.
- Labels truncate with ellipsis, never wrap.

### 7.4 Dual Toggle
- Fixed to bottom on `xs–md` (above safe area); static in flow on `lg+`.
- Circles use `--btn-circle`.

### 7.5 Price Header
- Price uses `--fs-display-xl`; arrow icon sized `1em`.
- Delta `--fs-caption`, wraps below price on `xs`.

### 7.6 Area Chart (responsive)
- Render as SVG with `viewBox`, `width: 100%; height: auto`, `preserveAspectRatio="none"` for the area, fixed stroke via `vector-effect: non-scaling-stroke`.
- Aspect ratio: `4 / 3` on `xs`, `16 / 9` on `md`, fixed height `clamp(320px, 40vh, 520px)` on `lg+`.
- Axis/zoom controls (+/−) stay left-anchored; on `xs` they move to the top-right to free chart width.
- Tooltip clamps to chart bounds (never overflows viewport edges).
- Redraw on resize with `ResizeObserver`.

### 7.7 Timeframe Chips
- Single row; `overflow-x: auto; scroll-snap-type: x proximity; scrollbar-width: none`.
- From `md`, chips stretch with `display: flex; justify-content: space-between`.

### 7.8 Stat Cards
```css
.stats { display: grid; gap: var(--stack-gap); grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr)); }
```
- 2-up on phones ≥ 360px, 1-up below. Stacked on desktop right panel.

### 7.9 Slide-to-Buy
- Full width of its container (`max-width: 480px` on `md+`).
- Thumb `calc(var(--slide-h) - 12px)`; commit threshold at 85% of track width (computed from container, not a fixed px).
- Provide a tap-fallback `Buy Stock` button for keyboard/screen reader users.

### 7.10 Rating Row
```css
.rating {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  min-height: var(--rating-h);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--r-card);
}
```
- Percentage `--fs-display-xl`; count `--fs-title-m`.
- Hatch overlay: `repeating-linear-gradient(135deg, rgba(255,255,255,.18) 0 2px, transparent 2px 6px)`.

### 7.11 Info Card
- Carousel on `xs–sm`: `display: flex; overflow-x: auto; scroll-snap-type: x mandatory`; each card `flex: 0 0 85%`.
- Grid on `md+`: `repeat(auto-fill, minmax(280px, 1fr))`.
- Body text clamps to 2 lines (`-webkit-line-clamp: 2`).

---

## 8. Iconography

- 1.5–2px stroke, rounded caps; size `1.25em` of the parent button so icons scale with `--btn-circle`.
- Needed: chevron-left, chevron-right, check, arrow-down-left, arrow-up-right, share, refresh, bell, plus, minus.
- Use SVG with `currentColor`; no raster icons.

---

## 9. Motion

| Interaction | Behavior |
|---|---|
| Option select | Cross-fade to lime (180ms ease-out); check scales 0.9 → 1 |
| Progress bar | Segment fills left-to-right (240ms) |
| Chart scrub | Crosshair + tooltip follow pointer, no easing |
| Timeframe change | Line morph (300ms ease-in-out) |
| Slide to buy | Thumb follows pointer; label fades; haptic on commit |
| Rating rows | Staggered fade-up, 60ms offset |
| Layout change | Avoid animating layout at breakpoints |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```

---

## 10. Input & Interaction by Device

- **Touch (`pointer: coarse`):** minimum 44×44 targets, 8px spacing between targets, swipe for carousels and slide-to-buy.
- **Mouse (`pointer: fine`):** hover states (lime → `--lime-400`), chart crosshair on hover, cursor `grab` on slide thumb.
- **Keyboard:** visible focus ring `outline: 2px solid var(--lime-500); outline-offset: 2px` (use white ring on lime surfaces). Arrow keys move chart crosshair; Left/Right move slide-to-buy; Enter/Space selects options.
- **Hover-only content is forbidden**; every hover reveal has a tap/focus equivalent.

---

## 11. Accessibility

- Lime on near-black ≈ 15:1; near-black on lime same. Passes AA/AAA.
- Buy/Hold/Sell always include text labels, not just color.
- Use `--gray-600` (not `--gray-400`) for any essential text on white.
- Support 200% text zoom and 320px width without loss of content (WCAG 1.4.4 / 1.4.10).
- Landmarks: `<header>`, `<main>`, `<nav>`; chart has `role="img"` with `aria-label` summarizing trend, plus an accessible data table fallback.
- Respect `prefers-reduced-motion` and `prefers-contrast: more` (increase borders, drop gradient fades).

---

## 12. CSS Starter

```css
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; font-family: var(--font-sans); font-size: var(--fs-body-m); background: var(--ink-950); color: var(--text-on-dark); }
img, svg { max-width: 100%; height: auto; display: block; }

.headline { font-size: var(--fs-display-l); line-height: 1.06; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; text-wrap: balance; }
.pill { border-radius: var(--r-pill); }

/* Quiz */
.quiz { display: grid; gap: var(--space-4); max-width: 560px; margin-inline: auto; }
@media (min-width: 1024px) {
  .quiz { max-width: none; grid-template-columns: 5fr 7fr; align-items: center; gap: var(--space-6); }
  .quiz__intro { position: sticky; top: var(--space-5); }
}

/* Stock detail */
.stock { display: grid; gap: var(--space-4); }
@media (min-width: 1024px) {
  .stock { grid-template-columns: 8fr 4fr; align-items: start; }
  .stock__panel { position: sticky; top: var(--space-5); }
}

/* Ratings */
.ratings { display: grid; gap: var(--space-4); }
@media (min-width: 1024px) {
  .ratings { grid-template-columns: 1fr 1fr; gap: var(--space-6); }
}

/* Chips row */
.chips { display: flex; gap: var(--space-2); overflow-x: auto; scrollbar-width: none; scroll-snap-type: x proximity; }
.chip { flex: 0 0 auto; min-height: var(--chip-h); padding-inline: var(--space-2); border-radius: var(--r-pill); background: var(--gray-200); color: var(--text-on-light); font-size: var(--fs-caption); font-weight: 500; }
.chip.is-active { background: var(--lime-500); }
@media (min-width: 768px) { .chips { justify-content: space-between; overflow: visible; } .chip { flex: 1 1 0; } }

/* Landscape phones */
@media (max-height: 480px) and (orientation: landscape) {
  .headline { font-size: 1.75rem; }
  .stock { grid-template-columns: 1fr 1fr; }
}
```

---

## 13. Container Queries (component-level)

Use where a component lives in different-width parents (e.g. stat cards in a sidebar vs. full width).

```css
.stats-wrap { container-type: inline-size; }
@container (min-width: 360px) { .stats { grid-template-columns: 1fr 1fr; } }
@container (max-width: 359px) { .stats { grid-template-columns: 1fr; } }
```

---

## 14. Testing Matrix

| Device class | Viewport | Must pass |
|---|---|---|
| Small phone | 320×568 | No horizontal scroll, all text legible, targets ≥ 44px |
| Phone | 390×844 | Matches reference design |
| Large phone | 430×932 | Content not stretched; gutters grow |
| Tablet portrait | 768×1024 | Centered column / 2-up grids |
| Tablet landscape | 1024×768 | Desktop grid kicks in |
| Laptop | 1440×900 | 12-col layout, sticky panels |
| Wide | 1920×1080 | Content capped at 1280px, centered |
| Landscape phone | 844×390 | Side-by-side chart/stats, no clipped controls |
| 200% zoom | 640×360 effective | Reflows to single column |

---

## 15. Screen Inventory

1. **Investing Quiz (3/6)** — dark, headline, 3 option cards, dual toggle.
2. **Stock Detail (AAPL)** — light, price, chart, timeframe chips, 2 stat cards, slide-to-buy.
3. **Analyst Ratings (AAPL)** — dark, headline with ↗, Buy/Hold/Sell rows, info cards.

## 16. Notes

- The "Copy Design" in the reference swaps the refresh icon for a bell on Stock Detail. This spec follows the original (refresh); swap per product need.
- The dark gray page background in the reference is presentation only.
- The device frames (Dynamic Island, rounded bezel) in the reference are mockup chrome; do not ship them in the responsive build.
