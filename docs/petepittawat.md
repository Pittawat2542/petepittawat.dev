## Overview

`petepittawat.dev` is a personal portfolio and design system defined by **restrained glassmorphism, responsive ambient motion, squircle geometry, and deep glowing backdrops**. Built as a dark-mode-only website (`color-scheme: dark`), it prioritizes reading readability and visual craft.

Instead of traditional page-wide branding, the system uses a **dynamic page-specific accent model**. Each major section of the site maps to a dedicated accent color (e.g., Action Blue for blog/home, Green for publications, Orange for talks, Amber for about, Cyan for projects, and Pink for research). This accent color dynamically themes cards, borders, buttons, and text highlights as the user navigates across different sections, injecting vibrant micro-moments of color into an otherwise muted, glass-like slate.

Density is balanced, with layouts centering content within a clean, max-width shell. The UI relies on backdrop-blurs, radial gradient sheens, and GPU-accelerated active-state scaling (`transform: scale(0.98)` / `translateY(-2px)`) to feel tactile, interactive, and premium.

**Key Characteristics:**

- **Dark Mode Only:** Snapped to a deep `#111827` background canvas.
- **Restrained Glassmorphism:** Soft translucent panels (`.glass-card`, `.glass-surface`) frame elements using subtle white border overlays and backdrop-blurs.
- **Squircle Geometry:** Radii are mathematically shaped using CSS `clip-path` squircles rather than standard CSS border-radius loops.
- **Dynamic Accents:** Page-specific CSS variables (`--page-accent`, `--card-accent`) theme the interactive highlights per-route.
- **Ambient Glows:** Soft background radial glow plates scale or shift to supply atmospheric depth.
- **Tactile Transitions:** Magnetic hover lifts, radial sheen hover reveals, and click shrinks define the interactive vocabulary.
- **Bilingual Typographic Scale:** Customized typography mappings optimizing loading speed and layout stability for English and Thai scripts.

---

## Colors

> **Source pages analyzed:** homepage, about, projects, publications, talks, blog pages, search modal. The color system uses a unified glass-plate theme with section-dependent accents.

### Dynamic Accents

- **Base / Blog Accent** (`--accent` / `--accent-blog` — #60a5fa): Bright Action Blue.Themes the default landing pages, blog indexes, and main links.
- **Publications Accent** (`--accent-publications` — #10b981): Emerald Green. Themes the paper listings and scientific articles.
- **Talks Accent** (`--accent-talks` — #f97316): Safety Orange. Themes speaking engagements, videos, and slides.
- **About Accent** (`--accent-about` — #f59e0b): Amber Yellow. Themes biography pages and career timeline sections.
- **Projects Accent** (`--accent-projects` — #06b6d4): Bright Cyan. Themes engineering work, repos, and system cards.
- **Research Accent** (`--accent-research` — #f472b6): Soft Pink. Themes thesis work, topics, and studies.
- **Accent 1** (`--accent-1` — #60a5fa): Secondary highlight.
- **Accent 2** (`--accent-2` — #fb923c): Warm orange contrast color used for secondary star glow highlights.

### Neutrals

- **Background Canvas** (`--black` — #111827): The deep slate base. Default background of the `html` element.
- **Text Primary** (`--white` — #f9fafb): Near-white ink used for headers, primary read-outs, and body text.
- **Black Nav** (`--black-nav` — rgba(31, 41, 55, 0.7)): The translucent base overlay used for sticky navigation backdrops.

### Glassmorphism Plates

- **Glass Base Backgrounds:**
  - `--glass-bg-primary` (rgba(255, 255, 255, 0.03)): Translucent card base.
  - `--glass-bg-secondary` (rgba(255, 255, 255, 0.06)): Interactive hover backgrounds.
  - `--glass-bg-tertiary` (rgba(255, 255, 255, 0.09)): Highlighted chips and focus fills.
- **Glass Borders:**
  - `--glass-border-primary` (rgba(255, 255, 255, 0.08)): Unfocused card borders.
  - `--glass-border-secondary` (rgba(255, 255, 255, 0.12)): Standard component dividers and button borders.
  - `--glass-border-hover` (rgba(255, 255, 255, 0.16)): Elevated hover borders.
- **Glass Shadows:**
  - `--glass-shadow` (rgba(0, 0, 0, 0.3)): Drop shadow for general depth.
  - `--glass-shadow-hover` (rgba(0, 0, 0, 0.4)): Deepened shadow when cards lift.

### Ambient Glows & Gradients

- **Primary Gradient** (`--gradient-primary`): `linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(96, 165, 250, 0.14) 48%, rgba(103, 232, 249, 0.12) 100%)`.
- **Secondary Gradient** (`--gradient-secondary`): `linear-gradient(225deg, rgba(16, 185, 129, 0.12) 0%, rgba(245, 158, 11, 0.12) 100%)`.
- **Accent Gradient** (`--gradient-accent`): `linear-gradient(135deg, rgba(96, 165, 250, 0.24) 0%, rgba(56, 189, 248, 0.18) 55%, rgba(186, 230, 253, 0.14) 100%)`.
- **Surface Sheen** (`--gradient-surface`): `linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)`.
- **Border Specular** (`--gradient-border`): `linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.15) 100%)`.
- **Ambient Glows:**
  - `--ambient-glow-primary`: `radial-gradient(600px circle at 40% 20%, rgba(59, 130, 246, 0.16), transparent 50%)`.
  - `--ambient-glow-secondary`: `radial-gradient(800px circle at 80% 10%, rgba(125, 211, 252, 0.1), transparent 50%)`.
  - `--ambient-glow-tertiary`: `radial-gradient(400px circle at 60% 80%, rgba(56, 189, 248, 0.1), transparent 60%)`.

---

## Typography

### Font Family

- **English Display & Body:** Uses system-ui or Inter, styled through Tailwind CSS default text utilities.
- **Thai Display & UI:** Uses `'Anuphan', sans-serif` for titles, navigation items, buttons, and UI components.
- **Thai Body & Prose:** Uses `'Krub', sans-serif` or `'Noto Serif Thai'` for text-heavy prose, articles, and descriptions to ensure a calm reading pace.
- **Optimization:** Loaded with `font-display: swap` to mitigate Cumulative Layout Shift (CLS) during web font initialization.

### Hierarchy

| Token                            | Desktop Size     | Mobile Size      | Line Height                | Letter Spacing   | Usage                                  |
| -------------------------------- | ---------------- | ---------------- | -------------------------- | ---------------- | -------------------------------------- |
| `--type-home-display`            | 80px (5rem)      | 53.6px (3.35rem) | 1.1 (`--leading-tight`)    | -0.045em         | Landing Page Hero - First Name         |
| `--type-home-display-secondary`  | 60px (3.75rem)   | 40.8px (2.55rem) | 1.1 (`--leading-tight`)    | -0.045em         | Landing Page Hero - Last Name          |
| `--type-home-lead`               | 24px (1.5rem)    | 20px (1.25rem)   | 1.5                        | 0                | Sub-headline introduction summary      |
| `--type-page-title`              | 72px (4.5rem)    | 48px (3rem)      | 1.1 (`--leading-tight`)    | -0.055em         | Top title for dedicated index pages    |
| `--type-section-title`           | 36px (2.25rem)   | 29.6px (1.85rem) | 1.16 (`--leading-title`)   | -0.035em         | Section headers                        |
| `--type-featured-card-title`     | 32px (2rem)      | 25.6px (1.6rem)  | 1.16 (`--leading-title`)   | -0.04em          | Featured card names                    |
| `--type-card-title`              | 28px (1.75rem)   | 21.6px (1.35rem) | 1.16 (`--leading-title`)   | -0.035em         | Standard grid card headings            |
| `--type-prose`                   | 18px (1.125rem)  | 18px (1.125rem)  | 1.88 (`--leading-prose`)   | 0                | Long-form reading paragraphs           |
| `--type-body-lg`                 | 18px (1.125rem)  | 18px (1.125rem)  | 1.7 (`--leading-body`)     | 0                | Large layout descriptions              |
| `--type-body`                    | 16px (1rem)      | 16px (1rem)      | 1.7 (`--leading-body`)     | 0                | Standard body copy                     |
| `--type-body-sm`                 | 15px (0.9375rem) | 15px (0.9375rem) | 1.7 (`--leading-body`)     | 0.08em           | Navigation branding text               |
| `--type-control`                 | 14px (0.875rem)  | 14px (0.875rem)  | 1.35 (`--leading-control`) | 0                | Interactive menu links, input controls |
| `--type-meta` / `--type-eyebrow` | 12px (0.75rem)   | 12px (0.75rem)   | 1.35 (`--leading-control`) | 0.22em (eyebrow) | Tags, metadata details, section labels |
| `--type-caption`                 | 11px (0.6875rem) | 11px (0.6875rem) | 1.35 (`--leading-control`) | 0                | Image captions, secondary descriptions |
| `--type-micro`                   | 10px (0.625rem)  | 10px (0.625rem)  | 1.35 (`--leading-control`) | 0                | Micro labels and fine-print            |

### Principles

- **Clamp-based Scaling:** Display typography values adapt dynamically between viewport scales (`mobile ≤ 640px` and `desktop ≥ 640px`).
- **Tailwind Utility Aliases:** Tailwind utilities (`text-xs` to `text-4xl`) map directly to these variables via `global.css` overrides.
- **Negative display letter-spacing:** Tight tracking is applied to display text (down to `-0.055em`) for a premium visual density.
- **High line-height readability:** Body prose uses a comfortable `--leading-prose` (1.88) to optimize long reading durations.

---

## Layout

### Spacing System

- **Base scale:** Built on standard spacing metrics, structured to match layout proportions:
  - Margins between main page sections: Snaps to dynamic clamps `clamp(1.15rem, 2vw, 1.75rem)`.
  - Grid card margins: Snaps to `clamp(1.15rem, 2vw, 1.65rem)`.
  - Component inner padding: `p-5 md:p-6` for standard cards; `p-6 md:p-8` for large glass panels.
- **Page Wrapper Grid:**
  - `.page-shell`: Centers main page systems (`margin-inline: auto`).
  - Max width is `72rem` (1152px) via `--site-chrome-max-width`.
  - Layout outer padding: `clamp(1rem, 4vw, 2.5rem)` via `--site-chrome-padding-x`.
  - Margins: `mb-12 pt-28 px-6 md:px-10` to clear the fixed navigation header.

---

## Elevation & Depth

| Elevation Level    | Styling Definition                                                                                                         | Component Usage                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Base Canvas**    | Flat background `#111827` with ambient glow highlights.                                                                    | Main viewport layout, page-level background plates.               |
| **Glass Base**     | `border: 1px solid var(--glass-border-primary)`<br>`background: var(--glass-surface-1)`<br>`backdrop-filter: blur(16px)`   | Standard `.glass-card` elements, content cards, article outlines. |
| **Glass Elevated** | `border: 1px solid var(--glass-border-secondary)`<br>`background: var(--glass-surface-2)`<br>`backdrop-filter: blur(18px)` | Hovered states of `.glass-card`, focus actions.                   |
| **Glass Premium**  | `border: 1px solid var(--glass-border-hover)`<br>`background: var(--glass-surface-3)`<br>`backdrop-filter: blur(24px)`     | Modal windows, command palette overlay dialogs.                   |

### Depth Principles

- **Restrained shadows:** UI elements do not use harsh solid drop shadows. Hierarchy is achieved using white glass borders (1px) and `rgba` transparency layers.
- **Backdrop Filters:** Blurring is saturated (`saturate(135%)` to `saturate(150%)`) to retain legibility when floating over glowing backgrounds.
- **Ambient Radial Glows:** Placed behind components via `<PageBackdrop />` widgets to highlight main visual anchors.

---

## Shapes

### Squircle Clipping

Instead of traditional border radius rounding, petepittawat.dev uses a **continuous squircle geometry** via `clip-path` masks. This avoids the abrupt corners of standard circles, creating a premium Apple-like contour.

**SVG Squircle Path:**
`path('M0,34% C0,16% 16%,0 34%,0 H66% C84%,0 100%,16% 100%,34% V66% C100%,84% 84%,100% 66%,100% H34% C16%,100% 0,84% 0,66% Z')`

### Radius Scale

| Radius Token                 | Value / Constraint              | Element Target                                                 |
| ---------------------------- | ------------------------------- | -------------------------------------------------------------- |
| `--shape-squircle-radius-lg` | `clamp(1.6rem, 4vw, 2.6rem)`    | Large glass containers, main index cards.                      |
| `--shape-squircle-radius-md` | `clamp(1.1rem, 3vw, 1.8rem)`    | Buttons (`glass-button`), search fields, secondary containers. |
| `--shape-squircle-radius-sm` | `clamp(0.85rem, 2.6vw, 1.3rem)` | Small icon holders, inner figure frames.                       |
| **Pill Shape**               | `rounded-full` (999px)          | Badges, chips, tags, slider track cells.                       |

---

## Components

### 1. Site Header (`.site-header`)

- **Structure:** Fixed to the top viewport (`z-index: 50`), spanning the full width with a thin bottom border (`var(--nav-border)`).
- **Glass properties:** Backdrop blur initialized at `16px` saturation, transitioning to `22px` scroll blur (`[data-scrolled='true']`).
- **Interactive branding (`.site-header__brand-link`):**
  - Displays the site logo squircle. On hover, the brand logo expands to reveal the full capitalized name ("PITTAWAT T.") via a sliding `max-width` mask transition.
- **Nav Links (`.site-nav__link`):**
  - Styled in Anuphan font.
  - Hover triggers an elegant bottom rule reveal (`var(--nav-hover-rule)`), scaling up from `scaleX(0.7)` to `scaleX(1)`.
  - Selected state triggers a permanent thicker indicator (`var(--nav-active-rule)`), colored in the route's accent.

### 2. GlassCard (`GlassCard.astro`)

- **Structure:** Base wrapper for content groups (`section`).
- **Variants:**
  - `default`: Base `.glass-card` properties.
  - `elevated`: Saturated backdrop blur, suited for secondary focus layers.
  - `premium`: Intended for deep overlay views.
  - `glow`: Adds a subtle background glow behind the card.

### 3. HomeCard (`HomeCard.tsx`)

- **Structure:** Interactive navigation grid panels used on the homepage.
- **Accents:** Built dynamically with `createAccentStyle(accentColor)` mapping section colors (cyan, orange, emerald) to the CSS custom property `--card-accent`.
- **Hover behavior:** Lifts slightly (`translateY(-2px)`) while scaling the inner figure wrapper and fading in a radial glow sheen (`opacity: 100%`).

### 4. Search Trigger & Command Palette

- **Trigger:** Rounded pill button (`var(--nav-control-size)`) in the header that launches a keyboard-accessible search overlay.
- **Dialog Modal:** Renders as a `glass-surface-premium` window, taking down page interactions. Utilizes a blur filter to isolate the command interface.

---

## Do's and Don'ts

### Do

- **Do colocate styles:** Keep style definitions within scoped Astro components.
- **Do use design variables:** Rely on CSS custom variables (`--page-accent`, `--type-*`, `--leading-*`) to theme components dynamically.
- **Do test bilingual rendering:** Verify that layouts render correctly in English (sans) and Thai (Anuphan/Krub) font stacks.
- **Do run build checks:** Ensure `pnpm lint` and `pnpm build` compile cleanly without layout-level CSS leaks.
- **Do verify active states:** Include `transform: scale(0.98)` scaling on clickable items.

### Don't

- **Don't mix scoping systems:** Do not combine `is:global` and `:global(...)` inside the same Astro file.
- **Don't hardcode font sizes:** Avoid raw numeric font definitions (`text-[15px]`, `font-size: 1.2rem`). Route them through Tailwind class scales or custom `--type` variables.
- **Don't add arbitrary drop shadows:** Avoid standard CSS shadows on text or UI tiles. Use soft glass borders and radial glowing plates for visual separation.
- **Don't override nested component visuals from layouts:** Let child components own their styles, state transforms, and active variables.

---

## Responsive Behavior

### Breakpoints

| Breakpoint Name         | Viewport Bound   | Layout Strategy                                                                                                                                   |
| ----------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mobile**              | `≤ 640px`        | Typography scales down (e.g. page titles drop from `4.5rem` to `3rem`). Card structures stack into a single column. Horizontal padding collapses. |
| **Tablet Nav Collapse** | `< 960px`        | Navigation menu collapses into a menu toggle trigger, shifting mobile routes into a `MobileMenu.astro` overlay tray.                              |
| **Small Desktop**       | `960px - 1099px` | Header nav links use tight padding (`0.58rem`) and control scales to fit smaller desk widths.                                                     |
| **Standard Desktop**    | `≥ 1100px`       | Full multi-column grid layouts enabled. Main layout container locks maximum width to `72rem`.                                                     |

### Performance & Motion

- **Reduced Motion:** Respects user preferences. When `prefers-reduced-motion: reduce` is active, transition times are set to `1ms` and animations are disabled to prevent page lag.
- **Image Performance:** Images (excluding above-the-fold hero content) are lazy-loaded with explicit dimensions and `content-visibility: auto` to prevent Cumulative Layout Shift (CLS) on slow networks.

---

## Iteration Guide

1. **Section Accents:** When introducing a new page, add its theme to `src/layouts/BaseLayout.astro` inside the `pageKey` mapping and assign it a color hex in `src/styles/tokens.css`.
2. **Interactive States:** Double-check that components support both mouse hover, focus visible states, and active scales.
3. **Typography Tests:** If custom sizes are required, configure them inside the `@theme` directive in `src/styles/global.css`. Adding arbitrary values in Tailwind tags will fail compile checks.

---

## Known Gaps

- **Global theme transitions:** Dynamically switching active page accents mid-scroll on layout overlays can cause color jumps. The accent variables are currently mapped to route layouts.
- **Fallback squircle rendering:** Browsers that do not support CSS `clip-path` path values fallback to standard rectangular borders with border-radius.
- **Mobile overlay heights:** Long language translations inside the mobile menu can clip on small viewports. Ensure vertical scroll bars are active on viewport overflow.
