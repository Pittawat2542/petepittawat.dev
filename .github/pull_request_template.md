## Summary

- What changed:
- Why it changed:

## Verification

- [ ] `pnpm lint`
- [ ] `pnpm build`

## UI Verification

Complete this section for any visible UI change. If the change is not visible, state that clearly.

- [ ] Route opened locally
- [ ] Desktop viewport checked
- [ ] Narrow/mobile viewport checked
- [ ] Hover state checked when applicable
- [ ] Focus-visible state checked when applicable
- [ ] Expanded/collapsed state checked when applicable
- [ ] Active/selected state checked when applicable
- [ ] Before screenshot attached
- [ ] After screenshot attached

## Frontend Architecture Review

- [ ] Edited `.astro` files use one style-scoping model per file
- [ ] No file mixes `<style is:global>` with `:global(...)`
- [ ] Primary component visuals are owned by the component, not by a parent layout
- [ ] Any shared style usage is justified as truly shared

## Reviewer Notes

- Anything that needs special attention:
