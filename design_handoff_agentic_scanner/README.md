# Handoff: ANZ Agentic Readiness Scanner — Systems That Decide rebrand

## Overview
A visual rebrand of the **ANZ Agentic Readiness Scanner** — a live tool that scans the top 100 ANZ publishers (supply side, `adagents.json`) and top 100 AU advertisers (demand side, `brand.json`) for Ad Context Protocol (AdCP) adoption. **Functionality is unchanged.** This handoff only swaps the visual styling from the old dark-navy/neon-tech look to the **Systems That Decide** editorial system (obsidian + gold, Playfair / Inter / Space Mono).

## Reference screenshots
- `preview/screenshot-01-hero.png` — masthead + context strip + panel tops (the editorial chrome: gold top-rule, dot texture, Playfair headline with italic-gold emphasis).
- `preview/screenshot-02-results.png` — both panels post-scan: stats, status rows, LIVE (green glow, Yahoo AU) and POSSIBLE (amber) states, category/country chips.

## About the design files
- **`index.jsx`** — the actual rebuilt page component. This is a **near drop-in**: it is the original Next.js page with identical logic (same `/api/scan` fetch, state machine, filters, counts, summary copy) and only the styling rewritten. In most codebases this can replace the existing page file directly. Treat it as the source of truth.
- **`preview/ASRP Scanner.html`** — a standalone, framework-free preview of the same design (React via CDN + Babel). Use it only to *see* the design in a browser. **Do not ship it.** Because the static preview has no backend, its `runScan` falls back to mock data; the real component (`index.jsx`) keeps the live `/api/scan` fetch and its original error handling.
- **`assets/logo-transparent.png`** — the Systems That Decide wordmark (light cut, for dark grounds).

The intended task: **drop `index.jsx` into the existing Next.js app** (or recreate it faithfully in whatever framework the live site uses), ensure the logo asset and webfonts are available, and ship. No new backend work — `/api/scan` is untouched.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interaction styling. Recreate pixel-for-pixel. All values are listed in **Design Tokens** below and are already inline in `index.jsx`.

## What changed vs. the original
- Background `#070C14` (navy-black) → `#0D0D0D` obsidian. Card surfaces `#0A111D` → `#141414`.
- Single typeface `DM Mono` → three-family system: **Playfair Display** (headlines/stat numbers, with one italic-gold emphasis word), **Inter** (body/UI/names), **Space Mono** (eyebrows, labels, domains, code, status labels, meta).
- Status colors: neon green `#2a9b45` → editorial green `#6E9E78`; blue `#4A9FD4` → gold `#9A8B47`/`#BBA55F`; amber `#b87820` → `#C9873A`.
- **Per-category rainbow chips were removed.** All category tags now render as one uniform muted mono chip (the old `CAT_COLORS` map is gone). If color-coded categories are required, this is the one intentional information change to flag.
- Added signature chrome: 4px fixed **gold top-rule**, faint **dot texture** on the masthead, **2px gold top-accent** on each panel card, square shadowless borders, gold left-accent on summary/footer bands.
- Headline copy changed to **"ANZ Agentic Readiness Scanner"** (was "ANZ AdCP Readiness Scanner"); *Readiness* is the italic-gold emphasis word. Page `<title>` updated to match.

## Screens / Views
Single page, three regions stacked vertically inside a `maxWidth: 1400px` centered column (`padding: 0 36px`).

### 1. Masthead
- **Surface:** `#141414` with dot-texture background, `1px #2A2825` bottom border, padding `30px 36px 26px`.
- **Layout:** flfrom `space-between`, `align-items: flex-end`, wraps. Left block `maxWidth: 680px`; right block right-aligned meta.
- **Left block, top to bottom:**
  - Logo row: `logo-transparent.png` at `height: 26px` + Space Mono `9px` `letter-spacing 0.22em` uppercase `#7A7773` reading `systemsthatdecide.io`, gap `14px`, margin-bottom `18px`.
  - Eyebrow: Space Mono `10px` `0.22em` uppercase, `#9A8B47` "ANZ Readiness" + dim `·` + `#7A7773` "Live Scanner". Margin-bottom `14px`.
  - H1: Playfair Display `700`, `44px`, `letter-spacing -0.025em`, `line-height 1.08`, color `#F0EDE8`. Text: `ANZ Agentic ` + `<em>` italic `#9A8B47` `Readiness` + ` Scanner`.
  - Paragraph: Inter `14px`, `line-height 1.65`, `#B8B2AE`, `maxWidth 660px`, margin-top `20px`. Inline `adagents.json` / `brand.json` rendered Space Mono `12.5px` `#BBA55F`.
- **Right meta block:** Space Mono `9px`, `line-height 2.1`, `0.1em` uppercase, label word `#5A5752` + value `#7A7773`. Four rows: Protocol / Market / Sources / Updated.

### 2. Context strip
- **Surface:** `#141312` (warm dark), `1px #2A2825` bottom border, padding `13px 36px`.
- Flex row, gap `40px`, wraps. Four items, each: Space Mono `9px` `0.14em` uppercase `#7A7773` label + Space Mono `11px` `700` `#BBA55F` value. (Protocol launched / ANZ confirmed live (supply) / Only confirmed ANZ seller / IAB ARTF status.)

### 3. Two panels (the core)
- Flex row, gap `24px`, `align-items: flex-start`, wraps; each panel `flex: 1; min-width: 360px`. Margin-top `28px`.
- Left = **Publisher Readiness** (`scanType: "publishers"`, `adagents.json`). Right = **Advertiser Readiness** (`scanType: "advertisers"`, `brand.json`). Publisher panel additionally shows AU/NZ/ANZ country filters.

Each panel = header card + scrolling results list + summary band.

**Panel header card:** `#141414`, `1px #2A2825` border with **`2px #9A8B47` top border**, no bottom border, padding `22px 22px 18px`.
- Subtitle eyebrow: Space Mono `9px` `0.22em` uppercase `#7A7773`, margin-bottom `9px`.
- Title: Playfair `700` `25px` `-0.02em` `line-height 1.05` `#F0EDE8`, with trailing italic `#9A8B47` emphasis word (`Readiness`). Margin-bottom `7px`.
- Path line: Space Mono `10px`. `/.well-known/<file>` in `#BBA55F`, ` · ` + description in `#7A7773`. Margin-bottom `16px`.
- **Stats** (after first scan): flex gap `24px`, top border `1px #1F1D1A`, padding-top `4px`. Each stat: Playfair `700` `30px` number + Space Mono `9px` `0.14em` uppercase `#7A7773` label, baseline-aligned gap `7px`. Number colors — Live `#6E9E78`, Possible `#C9873A`, Not found `#7A7773`.
- **Progress** (after first scan): track `height 2px` `#1F1D1A`; fill `#9A8B47` (or `#4A7C59` once any live found), `width: <progress>%`, `transition width 0.3s ease`. Caption Space Mono `9px` `0.12em` uppercase `#7A7773` ("Processing… N%" / "Complete").
- **Controls:** flex, gap `7px`, wrap.
  - Run/Re-scan button: padding `8px 18px`, Space Mono `9px` `700` `0.18em` uppercase, `#C4A84A` on `rgba(154,139,71,.12)` fill with `1px rgba(154,139,71,.22)` border; disabled (running) = transparent, `#7A7773`, `1px #2A2825`.
  - Filter buttons (country + status): padding `6px 10px`, Space Mono `9px` `700` `0.14em` uppercase. Inactive `#7A7773` / transparent / `1px #2A2825`. Active `#C4A84A` / `rgba(154,139,71,.12)` / `1px rgba(154,139,71,.22)`.
  - Hover (non-disabled): border → `rgba(154,139,71,.22)`, color → `#B8B2AE` (active hover color → `#C4A84A`). Transition `0.2s cubic-bezier(0.22,1,0.36,1)`.

**Results list:** `1px #2A2825` border (top border `1px #1F1D1A`), background `#0D0D0D`, `maxHeight 600px`, `overflow-y: auto`, thin gold-on-obsidian scrollbar.
- Empty state: Space Mono `11px` `#5A5752` centered, padding `44px 20px` ("Press Run Scan to check all 100 …").
- Loading state (running, no items): Space Mono `11px` `#BBA55F` centered ("One API call in progress…").
- **Row** (`padding 9px 16px`, `1px #1F1D1A` bottom border, `2px` left border = `#4A7C59` if live / `#C9873A` if possible / transparent; row bg `rgba(110,158,120,.07)` live, `rgba(201,135,58,.07)` possible, else transparent):
  - Rank: Space Mono `10px` `#5A5752`, width `22px`, right-aligned, zero-padded 2 digits.
  - Status dot: `7px` circle, color from status; live gets `0 0 8px rgba(110,158,120,.8)` glow; checking gets `0 0 6px #9A8B47` glow + `std-pulse 1s infinite`.
  - Name: Inter `13px` `600` `-0.005em`; color `#6E9E78` live / `#C9873A` possible / `#F0EDE8` default.
  - Domain: Space Mono `10px` `#5A5752`.
  - Category chip: Space Mono `9px` `0.14em` uppercase, `#7A7773` on `rgba(154,139,71,.06)` with `1px #2A2825` border, padding `2px 7px`, **square**.
  - Country chip (publishers only): Space Mono `9px` `700` `0.12em` uppercase, `#B8B2AE`, transparent bg, `1px #2A2825` border.
  - Optional note line: Inter `11px` `line-height 1.5`, `#4A7C59` live / `#9A7438` possible / `#5A5752` default, margin-top `4px`.
  - Status label (right): Space Mono `9px` `700` `0.18em` uppercase, color from status, `white-space: nowrap`.
- "No results match filter": Space Mono `11px` `#7A7773` centered (when done + filtered empty).

**Summary band** (after scan completes): margin-top `10px`, padding `14px 18px`, `#141414` with `1px #2A2825` border + `3px #9A8B47` left border, Inter `12px` `line-height 1.7` `#B8B2AE`. Copy: if 0 live & 0 possible → the "Zero of the top 100…" sentence; else → `<live> confirmed live` (`#6E9E78` bold) · `<possible> possible` (`#C9873A`) · `<n> not found` (`#7A7773`).

### Footer
Margin-top `28px`. `#141414` band, `1px #2A2825` border + `3px #9A8B47` left border, padding `16px 20px`, Inter `11px` `line-height 1.9` `#7A7773`. "Methodology" label Space Mono `9px` `0.18em` uppercase `#9A8B47`. `curl …` snippets Space Mono `11px` `#BBA55F`. Links `#BBA55F`, underline on hover.

## Interactions & behavior
- **Run Scan / Re-scan:** sets `running`, `started`, resets `progress`, `filter`, `countryFilter`; starts a `setInterval` ticking `progress` toward `88` every `320ms`; `POST /api/scan` with `{ type: scanType }`; on response clears interval, sets `progress` to `100`, maps `data.entities` + `data.results` into rows. On error, clears interval and marks existing items `not_found` with note "Scan error". Finally clears `running`. **(Unchanged from original — preserve exactly.)**
- **Filters:** `filter` ∈ {all, live, possible(=live+possible)}; `countryFilter` ∈ {all, AU, NZ, ANZ} (publishers only). Filtering is pure client-side derived state.
- **Status mapping:** API `status` `"live"` → LIVE, `"possible"` → POSSIBLE, anything else → NOT_FOUND.
- **`done`** = `started && !running && items.length === 100` (gates stats "Not found" number, summary band, empty-filter message).
- Motion: button transitions `200ms` ease `cubic-bezier(0.22,1,0.36,1)`; progress fill `300ms ease`; checking-dot pulse `std-pulse` 1s infinite. No bounce/spring/scale.

## State management
Per `Panel` (local `useState`): `items: []`, `running: bool`, `started: bool`, `progress: 0`, `filter: "all"`, `countryFilter: "all"`. Derived (not stored): `liveCount`, `possibleCount`, `done`, `filtered`. No global store; two panels are fully independent. Data fetching: one `POST /api/scan` per panel per scan run.

## Design tokens
**Colors**
| Token | Hex | Role |
| --- | --- | --- |
| obsidian | `#0D0D0D` | page + results ground |
| surface | `#141414` | cards, masthead, bands |
| warm | `#141312` | context strip |
| hairline | `#2A2825` | borders |
| hairline-soft | `#1F1D1A` | row dividers, inner rules |
| gold | `#9A8B47` | top-rule, card accent, emphasis, eyebrow |
| gold-light | `#BBA55F` | code, links, values |
| gold-bright | `#C4A84A` | active button text |
| gold-soft | `rgba(154,139,71,.12)` | active/CTA fill |
| gold-line | `rgba(154,139,71,.22)` | hover/active border |
| gold-faint | `rgba(154,139,71,.06)` | category chip fill |
| off | `#F0EDE8` | primary text |
| muted | `#B8B2AE` | secondary text |
| dim | `#7A7773` | meta / labels |
| darker | `#5A5752` | faintest labels |
| confirmed | `#6E9E78` | LIVE |
| confirmed-deep | `#4A7C59` | live accents/progress |
| caution | `#C9873A` | POSSIBLE |
| risk | `#B85042` | (reserved; unused) |

**Type:** Playfair Display `400/600/700` + italic (display/headlines/stat numbers); Inter `300–700` (body/UI/names); Space Mono `400/700` (eyebrows, labels, domains, code, status, meta). Webfonts loaded from Google Fonts.

**Spacing:** 8pt-ish; page gutter `36px`, max width `1400px`, panel gap `24px`, panel min-width `360px`.

**Radii:** square everywhere (`0`); chips/cards/buttons all square. **Shadows:** none, except status-dot glow.

**Signature chrome:** 4px fixed gold top-rule; 32px dot-texture tile on masthead; 2px gold panel top-accent; 3px gold left-accent on summary/footer.

## Assets
- `assets/logo-transparent.png` (568×200, transparent) — Systems That Decide wordmark, light cut for dark grounds. **Place where the app serves static files** (Next.js: `public/logo-transparent.png`). `index.jsx` references `/logo-transparent.png`. Never recolor; swap to the dark cut only on light/paper grounds.
- Google Fonts (Playfair Display, Inter, Space Mono) via `<link>` in the page `<Head>`. If the app self-hosts fonts, wire these three families into the existing pipeline instead.

## Files
- `index.jsx` — rebuilt page component (drop-in). Inline styles + one global `<style>` block (top-rule, dot texture, scrollbar, `.std-btn` hover, `std-pulse` keyframes).
- `preview/ASRP Scanner.html` — browser preview only (CDN React/Babel, mock-data fallback). Reference, do not ship.
- `assets/logo-transparent.png` — wordmark asset.

## Implementation notes
1. Replace the existing page file with `index.jsx` (adjust import paths / file name to the app's routing — e.g. `pages/index.jsx` or an app-router equivalent; if app-router, move data fetching to a client component as needed).
2. Ensure `logo-transparent.png` is served at `/logo-transparent.png` (or update the `<img src>`).
3. Confirm the three webfonts load (keep the `<Head>` `<link>` or hook into the existing font system).
4. `/api/scan` is unchanged — no backend work. Verify the existing endpoint still returns `{ entities, results }`.
5. The `<style>{`…`}</style>` block uses global selectors (`body`, `::-webkit-scrollbar`, `.std-btn`). In Next.js styled-jsx this needs `<style jsx global>`; if your setup differs, move these rules to a global stylesheet.
