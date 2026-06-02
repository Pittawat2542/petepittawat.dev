# Frontend Style Architecture

This guide defines how Astro, React, and CSS should work together in this repository so visible UI changes do not silently render incorrectly.

It exists to prevent a specific failure mode:

- a component change looks correct in markup
- the relevant CSS lives far away from the component
- style scoping rules are mixed or misunderstood
- the route still builds, but the page looks broken in the browser

## Goals

- Keep style ownership obvious.
- Keep Astro style scoping predictable.
- Make frontend review explicit instead of implicit.
- Require rendered verification for visible UI changes.

## Non-Negotiable Rules

### 1. Use one Astro scoping model per file

Default to scoped `<style>` blocks.

Use `:global(...)` only for deliberate escapes inside a scoped `<style>` block.

If a file uses `<style is:global>`, do not use `:global(...)` in that same file.

Valid scoped example:

```astro
<section class="hero-shell">
  <slot />
</section>

<style>
  .hero-shell {
    padding: 1.5rem;
  }

  .hero-shell :global(a) {
    text-decoration: underline;
  }
</style>
```

Valid global example:

```astro
<style is:global>
  .prose-shell h2 {
    margin-top: 2rem;
  }
</style>
```

Invalid mixed example:

```astro
<style is:global>
  .prose-shell :global(h2) {
    margin-top: 2rem;
  }
</style>
```

### 2. Components own their primary visuals

Each component should own the styles that define its visual identity:

- typography
- spacing inside the component
- borders, backgrounds, shadows
- hover, focus, active, expanded, and selected states

Parent layouts may control:

- placement in page grid
- outer spacing between sections
- width and stacking behavior

Parent layouts must not define the primary visual styling of nested component internals.

Invalid ownership pattern:

```astro
<!-- Parent layout -->
<Sidebar>
  <Toc />
</Sidebar>

<style>
  .sidebar .toc-link {
    padding: 0.75rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.08);
  }
</style>
```

Preferred pattern:

```astro
<!-- Parent layout -->
<div class="sidebar-slot">
  <Toc />
</div>

<style>
  .sidebar-slot {
    width: 100%;
  }
</style>
```

The `Toc` component should own `.toc-link` styling itself.

### 3. Use shared styles only for truly shared surfaces

Put styles in `src/styles/components/` only when all of the following are true:

- the styles serve multiple independent components or pages
- the styles are not tightly coupled to one component's DOM structure
- the styles represent a stable shared pattern rather than one-off page composition

Use colocated component styles when any of the following are true:

- the selectors depend on one component's internal class names
- the styling defines a component's personality or states
- the markup and styling are likely to evolve together

### 4. Large layout styles need explicit boundaries

Long `.astro` layout files are allowed only when their styling is limited to true layout concerns.

When a layout begins styling:

- nested component internals
- content widgets rendered from child components
- multiple unrelated page sub-systems

split the ownership.

Typical split direction:

- page shell and section spacing stay in the layout
- component visuals move into the component or a colocated stylesheet
- shared tokens stay in global styles

### 5. Use the project typography system

Font sizes must communicate intent, not isolated pixel matching.

Use these project-level typography APIs for runtime UI:

- standard Tailwind text utilities (`text-xs`, `text-sm`, `text-base`, etc.), which are backed by the project scale in `src/styles/global.css`
- semantic type utilities such as `type-eyebrow`, `type-meta`, `type-body`, `type-prose`, `type-card-title`, `type-section-title`, `type-page-title`, and `type-home-display`
- component-local `font-size: var(--type-*)` declarations when the component owns a distinctive visual surface

Do not add raw runtime font sizes:

```css
/* Avoid */
.card-title {
  font-size: 1.93rem;
}

.hero-title {
  font-size: clamp(2rem, 6vw, 5rem);
}
```

Use semantic tokens instead:

```css
.card-title {
  font-size: var(--type-card-title);
}

.hero-title {
  font-size: var(--type-page-title);
}
```

Avoid numeric arbitrary Tailwind text utilities such as `text-[11px]` or `text-[1.8rem]`.
Color-only arbitrary utilities such as `text-[color:var(--accent)]` are still valid.

Fixed-canvas generation code, embedded article assets, and non-runtime content illustrations may use explicit numeric font sizes when the visual format requires exact coordinates and sizing.

## Frontend Verification Workflow

Visible UI changes must not be closed from static checks alone.

For frontend changes, the author must:

1. Run `pnpm lint`.
2. Run `pnpm build`.
3. Open the affected route locally.
4. Verify desktop layout.
5. Verify one narrow/mobile viewport.
6. Verify relevant interaction states:
   - hover
   - focus
   - expanded/collapsed
   - selected/active
   - empty/error/loading states when applicable
7. Capture before/after screenshots for any visible UI change.
8. Attach those screenshots in the PR.

## Reviewer Checklist

Reviewers should explicitly verify the following for frontend changes:

- Does the component own its primary visual styling?
- Is Astro style scoping used consistently in each edited file?
- If `<style is:global>` is present, is `:global(...)` absent from that file?
- Are shared styles actually shared, or are they styling one component from afar?
- Does runtime typography use project text tokens or semantic utilities instead of raw numeric sizes?
- Did the author provide desktop and narrow/mobile screenshots?
- Did the author verify the interaction states affected by the change?

If any answer is "no" or "unclear", the PR is not ready.

## UI Verification Checklist

Use this checklist in PR descriptions and local review:

- Route opened locally
- Desktop checked
- Narrow/mobile viewport checked
- Hover state checked
- Focus-visible state checked
- Expanded or collapsed state checked when applicable
- Active or selected state checked when applicable
- Before screenshot attached
- After screenshot attached

## Dry Run: Blog Post TOC Incident

This checklist would have caught the recent TOC issue in three places:

1. **Style-scoping review**
   The edited layout mixed `<style is:global>` with `:global(...)`, which violates the single-model rule.

2. **Ownership review**
   The TOC component markup changed, but most of the TOC styling still lived in the blog post layout instead of the TOC component.

3. **Rendered verification**
   Opening the blog post route and checking the expanded TOC on desktop would have shown that the new visual treatment had not actually applied.

## Adoption Checkpoint

After the next 5 frontend PRs that change visible UI:

- review whether screenshot evidence was consistently attached
- review whether authors actually documented desktop and narrow/mobile checks
- review whether reviewers caught ownership or scoping issues before merge
- list any misses that still escaped review

If the same class of issue continues to slip through, escalate to automation-first safeguards rather than expanding manual guidance further.

## Related Project Artifacts

- Debt inventory and cleanup plan: [frontend-style-debt-audit.md](./frontend-style-debt-audit.md)
- Design principles: [design-philosophy.md](./design-philosophy.md)
