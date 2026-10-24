# STS Dashboard — Design Plan

## Subject Matter & Brief
**Product**: IT Equipment Inventory Management System (ระบบจัดการคลังอุปกรณ์ไอที)
**Audience**: Thai IT administrators & warehouse staff managing equipment lifecycle
**Primary Job**: Track, withdraw, return, repair, and audit IT assets efficiently
**Context**: Internal tool — used daily, data-dense, needs clarity over marketing flair

---

## Design Principles

1. **Technical Precision** — This is an IT ops tool. The aesthetic should feel engineered: precise, systematic, trustworthy. No softness for its own sake.
2. **Information Density with Breathing Room** — Data-dense tables, but with clear visual hierarchy. Every pixel earns its keep.
3. **Status-First Communication** — Equipment status (Available/Withdrawn/Repair) is the most critical signal. Color and iconography carry this before text.
4. **Thai-First, Global-Ready** — Thai language primary, English secondary. Type choices must render Thai beautifully without falling back awkwardly.
5. **One Memorable Thing** — The status badge system. Everything else is quiet and disciplined.

---

## Color Token System

### Core Palette (6 values)

| Token | Hex | Role | Rationale |
|-------|-----|------|-----------|
| `--base-950` | `#0D0D12` | Primary text, headers | Near-black with blue undertone — technical, not harsh |
| `--base-700` | `#4A4A5A` | Secondary text, labels | Muted but readable, works for Thai glyphs |
| `--base-400` | `#9A9AAB` | Disabled, placeholders, dividers | Subtle structure |
| `--base-100` | `#F0F0F5` | Page background | Cool off-white — easier on eyes than pure white for long sessions |
| `--base-0` | `#FFFFFF` | Card/surface background | Clean separation |
| `--accent` | `#0066FF` | Primary actions, links, focus | Pure blue — the color of sysadmin terminals, SSH, links. Not purple, not indigo. Blue. |
| `--accent-hover` | `#0052CC` | Hover state | 15% darker |
| `--accent-light` | `#E8F0FE` | Badge backgrounds, hover fills | 10% opacity tint |
| `--success` | `#00A859` | Available status, success states | Green that works on both light/dark |
| `--success-light` | `#E6F7ED` | Available badge bg |
| `--warning` | `#E67700` | Withdrawn status, warnings | Amber — distinct from success/danger |
| `--warning-light` | `#FFF4E6` | Withdrawn badge bg |
| `--danger` | `#D93025` | Repair status, errors, destructive | Red that passes contrast on white |
| `--danger-light` | `#FDEAE9` | Repair badge bg |

### Semantic Aliases (for component usage)
- `--text-primary` = `--base-950`
- `--text-secondary` = `--base-700`
- `--text-muted` = `--base-400`
- `--bg-page` = `--base-100`
- `--bg-surface` = `--base-0`
- `--bg-hover` = `--base-100`
- `--border-subtle` = `#E0E0EA`
- `--border-focus` = `--accent`
- `--shadow-sm` = `0 1px 2px rgba(13,13,18,0.04), 0 1px 1px rgba(13,13,18,0.03)`
- `--shadow-md` = `0 4px 8px rgba(13,13,18,0.06), 0 2px 4px rgba(13,13,18,0.04)`
- `--shadow-lg` = `0 12px 24px rgba(13,13,18,0.08), 0 4px 8px rgba(13,13,18,0.05)`

### Why This Palette?
- **Not purple** (avoids the "SaaS default" purple gradient trap)
- **Not teal/emerald** (avoids the "financial dashboard" cliché)
- **Pure blue (#0066FF)** — the color of hyperlinks, terminals, sysadmin tools. It says "technical system" without saying it.
- **Cool neutral base** — supports Thai text rendering (no warm cream that makes Thai vowels vibrate)
- **High contrast** — designed for 8-hour admin sessions, not 30-second landing page visits

---

## Typography

### Typeface Selection

| Role | Font | Source | Weights |
|------|------|--------|---------|
| **UI / Body / Data** | **IBM Plex Sans Thai** | Google Fonts | 400, 500, 600, 700 |
| **Monospace / Codes / Serials** | **IBM Plex Mono** | Google Fonts | 400, 500, 600 |

**Why IBM Plex?**
- Designed for technical interfaces, code, and data
- **IBM Plex Sans Thai** exists — purpose-built for Thai + Latin harmony. No fallback jumps.
- Mono variant shares DNA — serial numbers, Job IDs, SKUs feel native, not foreign
- Distinctive but not loud. Not Inter, not Roboto, not Prompt.
- Open source, production-ready, variable font available

### Type Scale

```css
--text-xs:     0.6875rem;  /* 11px — metadata, timestamps */
--text-sm:     0.8125rem;  /* 13px — table cells, form labels */
--text-base:   0.9375rem;  /* 15px — body copy */
--text-lg:     1.0625rem;  /* 17px — emphasized body */
--text-xl:     1.25rem;    /* 20px — section headers */
--text-2xl:    1.5rem;     /* 24px — page titles */
--text-3xl:    2rem;       /* 32px — hero numbers (KPIs) */
--text-4xl:    3rem;       /* 48px — rarely used, empty states */

--leading-tight:   1.2;   /* Headlines, numbers */
--leading-snug:    1.4;   /* Thai body text needs more room */
--leading-normal:  1.6;   /* Latin body text */
--leading-relaxed: 1.75;  /* Long-form reading */

--font-normal:  400;
--font-medium:  500;
--font-semibold: 600;
--font-bold:    700;

/* Tracking adjustments for Thai */
--tracking-tight:  -0.02em;  /* Headlines */
--tracking-normal: 0;        /* Body */
--tracking-wide:   0.02em;   /* Labels, all-caps (rare) */
```

### Thai-Specific Considerations
- Line height **1.5 minimum** for Thai (vowel stacking above/below consonants)
- No all-caps for Thai (meaningless)
- Letter-spacing slightly wider for Thai labels
- Monospace for serial numbers, Job IDs, MAC addresses, IPs

---

## Layout Concept

### Page Structure (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────────┐
│  SIDEBAR (280px)  │  MAIN CONTENT (flex-1)                       │
│  ┌─────────────┐  │  ┌─────────────────────────────────────┐   │
│  │  LOGO       │  │  │  PAGE HEADER                          │   │
│  │  [S] STS    │  │  │  ┌─────────────────┐  ┌───────────┐  │   │
│  ├─────────────┤  │  │  │  Title + Subtitle │  │ Primary   │  │   │
│  │  NAV        │  │  │  └─────────────────┘  │  Action   │  │   │
│  │  ● Dashboard│  │  └─────────────────────────────────────┘   │
│  │  ○ Inventory│  │  ┌─────────────────────────────────────┐   │
│  │  ○ Report   │  │  │  KPI BAR (Bento Grid)               │   │
│  │  ○ Repair   │  │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌───┐  │   │
│  │             │  │  │  │Total │ │Avail │ │Withd.│ │Rep│  │   │
│  │  USER       │  │  │  │Items │ │able  │ │rawn  │ │air│  │   │
│  │  [Avatar]   │  │  │  └──────┘ └──────┘ └──────┘ └───┘  │   │
│  │  [Logout]   │  │  └─────────────────────────────────────┘   │
│  └─────────────┘  │  ┌─────────────────────────────────────┐   │
│                   │  │  CONTENT CARD                       │   │
│                   │  │  ┌─────────────────────────────────┐│   │
│                   │  │  │  TABLE / TABS / FORM            ││   │
│                   │  │  │  (full width, horizontal scroll)││   │
│                   │  │  └─────────────────────────────────┘│   │
│                   │  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Layout Decisions

1. **Left-aligned content** — Tables, forms, lists all left-aligned. Center only for: empty states, KPI numbers, modal dialogs.
2. **Sidebar fixed, content scrolls** — Sidebar stays put (position: sticky), main area scrolls independently.
3. **Bento Grid for KPIs** — Not equal cards. Primary metric (Total Items) gets 2× width. Others single. Asymmetric = intentional.
4. **16px base grid** — All spacing multiples of 4px. 16px = 1 unit.
5. **Max content width: 1440px** — Centered in viewport > 1440px. Full-width on mobile.
6. **Card radius: 12px** — Not 8px (too sharp), not 16px (too soft). 12px = technical but approachable.
7. **Border: 1px solid --border-subtle** — Hairline separation. No shadows on cards by default. Shadows only on: modals, dropdowns, elevated states.

---

## Component Patterns

### Status Badge System (The "One Memorable Thing")

```
┌─────────────────────────────────────────────────────────────┐
│  .status-badge                                              │
│  ├── .status-badge--available  (green dot + "พร้อมใช้งาน")  │
│  ├── .status-badge--withdrawn  (amber dot + "เบิกออกแล้ว")  │
│  ├── .status-badge--repair     (red dot + "อยู่ระหว่างซ่อม") │
│  └── .status-badge--pending    (gray dot + "รอดำเนินการ")   │
│                                                             │
│  Design: 8px dot + text, pill radius, no border            │
│  Dot position: leading (before text)                       │
│  Monospace for status codes if abbreviated                 │
└─────────────────────────────────────────────────────────────┘
```

### Table Row States

| State | Visual |
|-------|--------|
| Default | `--bg-surface`, subtle bottom border |
| Hover | `--bg-hover` (base-100), cursor: pointer on clickable rows |
| Selected/Active | 2px left border `--accent`, bg `--accent-light` (5%) |
| Loading (skeleton) | `--base-100` → `--base-400` pulse animation |

### Button Hierarchy

```
Primary:      bg=accent, color=white, hover=accent-hover
Secondary:    bg=transparent, color=base-950, border=base-400, hover=base-100
Ghost:        bg=transparent, color=base-700, hover=base-100
Danger:       bg=danger, color=white, hover=darker-danger
Icon-only:    36×36px, round, ghost base, hover=base-100
```

### Form Fields

```
Label:        base-950, 500, text-sm, mb-1
Input:        bg=base-0, border=base-400, radius=8px, py-2 px-3
Focus:        border=accent, box-shadow=0 0 0 3px accent-light
Error:        border=danger, aria-invalid=true, error text below (danger, text-sm)
Disabled:     bg=base-100, color=base-400, cursor=not-allowed
```

### Modal / Dialog

- Backdrop: `rgba(13,13,18,0.4)` with `backdrop-filter: blur(2px)`
- Container: `--bg-surface`, radius 12px, shadow-lg
- Max-width: 520px (forms), 720px (detail views), 90vw mobile
- Close: ✕ button top-right + ESC key + click backdrop

---

## Motion & Interaction

### Duration Tokens
- `--duration-instant`: 0ms (layout changes)
- `--duration-fast`: 120ms (hover, focus, simple transitions)
- `--duration-base`: 200ms (modal open/close, tab switch)
- `--duration-slow`: 300ms (complex expansions)

### Easing
- `--ease-out`: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — standard
- `--ease-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)` — entrance only

### What Moves (and what doesn't)

| Element | Motion | Reason |
|---------|--------|--------|
| Modal open/close | Fade + scale(0.98→1) | Confirms layer change |
| Tab switch | Cross-fade 150ms | Content replacement |
| Row hover | bg-color 120ms | Feedback, no layout shift |
| Sidebar collapse | width 200ms | Layout change |
| Skeleton pulse | 1.5s infinite | Loading indication |
| Tooltip | 100ms delay, fade 120ms | Prevent flicker |
| **No** | Staggered card entrances | Generic, distracting |
| **No** | Hover scale on cards | Layout shift, not data-dense |
| **No** | Parallax, floating elements | Not a marketing page |

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility Baseline

- **Contrast**: All text ≥ 4.5:1, UI elements ≥ 3:1
- **Focus**: Visible 2px solid `--accent` outline, 2px offset
- **Touch targets**: Minimum 44×44px (icon buttons: 36×36px + 8px padding)
- **Labels**: Every input has `<label for="id">`, no placeholder-only
- **ARIA**: `aria-live="polite"` for toasts, `role="alert"` for errors
- **Keyboard**: Tab order = visual order, skip links where needed
- **Language**: `lang="th"` on html, `lang="en"` on code/monospace spans

---

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 640px | Sidebar → drawer, tables → horizontal scroll, KPI grid → 2-col |
| Tablet | 640–1024px | Sidebar collapsible, KPI grid → 4-col |
| Desktop | 1024–1440px | Full sidebar, full layout |
| Wide | > 1440px | Content centered at 1440px max |

---

## Anti-Patterns to Avoid (Per Frontend-Design Skill)

- ❌ Warm cream background (#F4F1EA) + terracotta accent
- ❌ Near-black with acid green
- ❌ Broadsheet hairline rules everywhere
- ❌ Identical rounded cards for everything (SaaS card kit)
- ❌ ALL-CAPS eyebrow labels above every heading
- ❌ Meta strings with middle dots (A · B · C)
- ❌ 'WORD — fragment' spaced em dash labels
- ❌ Tinted near-black (#0B0B0B) pretending to be black
- ❌ Monospace for small data labels (only for actual code/serials)
- ❌ '→' appended to every button/link
- ❌ Staggered fade-in on every section
- ❌ Hover scale transforms on cards
- ❌ Gradient washes as decoration

---

## Review Against Brief

| Brief Requirement | Plan Addresses? | How |
|-------------------|-----------------|-----|
| IT inventory management | ✅ | Technical aesthetic, monospace for serials, status-first |
| Thai primary language | ✅ | IBM Plex Sans Thai, proper line heights, no all-caps |
| Data-dense daily use | ✅ | High contrast, info density, bento KPIs, keyboard nav |
| Status tracking critical | ✅ | Status badge system = memorable element |
| Supabase/React stack | ✅ | CSS variables, component-friendly tokens |
| Responsive | ✅ | Mobile drawer, table scroll, fluid grid |
| Accessibility | ✅ | Built into tokens, not afterthought |

**Distinctive choices made:**
1. **Blue not purple** — avoids SaaS default, signals "technical system"
2. **IBM Plex Sans Thai + Mono** — not Prompt, not Inter, not Roboto. Purpose-built for this exact use case.
3. **Bento KPI grid** — asymmetric, primary metric emphasized
4. **Status badges as hero** — the one memorable thing
5. **No card shadows by default** — clean, technical, hairline borders only
6. **Left-aligned everything** — data tools read left-to-right

---

## Implementation Order

1. **Tokens** — CSS custom properties in `:root` (App.css replacement)
2. **Base** — Reset, typography, page layout (sidebar + main)
3. **Components** — Buttons, inputs, badges, tables, cards, modals
4. **Pages** — Dashboard, Inventory, Details, Report, Repair
5. **Polish** — Motion, reduced-motion, focus states, RTL check (not needed), Thai rendering test

---

## Next Steps

1. ✅ Design plan complete
2. ⏳ Review with user — confirm direction
3. ⏳ Implement tokens + base styles
4. ⏳ Build component library
5. ⏳ Apply to pages
6. ⏳ Critique & refine