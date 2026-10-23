# Design Philosophy

This site is the public front‑door for Pittawat Taveekitworachai’s work. Every experience choice should reinforce clarity, responsiveness, and a sense of craft. The following principles calibrate future changes, whether we are tuning existing flows or designing new surfaces.

## 1. Purposeful Storytelling

- **Primary focus**: highlight impact and curiosity through case studies, writing, and speaking engagements. Every page should quickly answer “What does Pete do now and why does it matter?”
- **Progressive disclosure**: lead with high‑level positioning, then invite the reader deeper via sections and related content. Complex timelines and long form writing should be skimmable before they are immersive.

## 2. Calm, Confident Aesthetics

- **Dark editorial surfaces**: use an ink navy canvas, quiet opaque panels, fine dividers, and blue accents. Translucency belongs to navigation; shadows belong to overlays. The homepage portrait, galaxy, and orbit form the signature illustration, with restrained glow and motion.
- **Typography first**: writing is the core product. Favor generous line heights, controlled measure, and high contrast. Decorative elements must never distract from the text.
- **Ambient motion**: animations signal state change and delight without demanding attention. Respect `prefers-reduced-motion` and avoid gratuitous effects.

## 3. Fast by Default

- **Static first**: ship a static Astro build backed by lightweight islands only where interaction is essential (search, explorers). Avoid global client bundles.
- **Instant perception**: prefetch high intent routes, lazy-load heavy assets, and keep the LCP element (hero) predictable.
- **Resilient degradations**: the experience must remain legible and navigable with JavaScript disabled. Critical information should never hide behind client-only logic.

## 4. Guided Exploration

- **Search as command palette**: the modal is a fast lane to reach any artifact. Filtering and keyboard support need to feel as responsive as native tooling.
- **Contextual anchors**: when routing to deep links (projects, publications, talks), auto-focus the target and communicate the surrounding context.
- **Related pathways**: writing should surface adjacent projects, talks, or series to encourage exploration without dead-ends.

## 5. Maintainable Systems

- **Composable primitives**: shared hooks (filters, infinite lists, hash syncing) keep explorers consistent and shrink component complexity.
- **Design tokens**: favor centralized colors, spacing, and shadows. Hard-coded values should be rare and defensible.
- **Document intent**: significant affordances—search behavior, header states, content architecture—belong in docs so future contributors know the “why,” not only the “how.”

## 6. Inclusivity & Accessibility

- **Keyboard parity**: every interactive element must be reachable and usable without a pointer. Visible focus styles are non-negotiable.
- **Assistive clarity**: aria labels, semantic headings, and consistent landmarks give screen reader users a coherent map.
- **Localized empathy**: respect locale differences (dates, units) and provide fallbacks for users with constrained bandwidth or data saver enabled.

## 7. Continuous Iteration

- **Measure sentiment**: qualitative feedback from peers and audiences informs which stories resonate. Analytics can validate, but conversations decide priorities.
- **Ship in layers**: each iteration should stand alone, but anticipate the next step—architecture for about pages, highlight reels, or new content types should scale without rewrites.
- **Retain the human voice**: even as the system grows, maintain writing that feels personal, curious, and generous.

---

This philosophy is a living artifact. Revisit it whenever we introduce a new surface or notice tension between user needs and implementation reality. The goal is a site that feels crafted, fast, and unmistakably Pete.

## Shared visual system

- `src/styles/tokens.css` owns palette channels, semantic surfaces, typography, spacing, shape, focus and motion. Tailwind and legacy aliases derive from these tokens.
- Use Anuphan for headings, Krub for body text and controls, and Noto Serif / Noto Serif Thai for editorial introductions. Use semantic `--type-*` sizes, including fluid page and article titles. Article code/math may scale in `em` with its prose; fixed artwork keeps its own canvas typography.
- Page content shares a 72rem maximum width and responsive gutters. Use `page-stack` between page regions and `page-section` between homepage sections. Article reading columns and full-width cover artwork remain purpose-specific.
- Controls use 6px corners, cards 10px, dialogs 16px. Standalone buttons and icon controls have a minimum 44px target; inline text links and noninteractive metadata retain natural dimensions.
- Selected controls use a blue-tinted surface and border. Keyboard focus uses a separate blue ring. Ordinary content cards have no elevation or lift; actionable arrows may shift slightly.
- Feedback transitions use the shared 150–200ms durations. The signature illustration may use slower orbital motion; reduced-motion mode retains its complete static composition and accessible labels.
- Preserve the bilingual reading experience, static HTML, deferred search, native listing dialogs and build performance budgets when refining the design.
