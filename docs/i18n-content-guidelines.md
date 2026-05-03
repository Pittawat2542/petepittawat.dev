# i18n Content Guidelines

## Non-blog canonical copy

- Canonical non-blog copy lives in `src/data/site/copy.ts`.
- English is the authored source in the current phase.
- Non-blog Thai routes currently use the same content interface and fall back to English.
- Longer editorial copy belongs in the site copy module, not in `src/i18n/ui.ts`.
- `src/i18n/ui.ts` should stay focused on short UI labels and status strings.

## Blog translation conventions

- Keep `lang` on every blog post frontmatter entry.
- Keep `translationId` as the durable mapping key between localized variants.
- Treat English as the canonical source text for future scripted translation unless a post is intentionally Thai-first.
- Localized `title`, `excerpt`, and `slug` may differ by language.
- The pairing key is `translationId`, not filename similarity.

## Recommended structure going forward

- Legacy blog posts can remain where they are today to avoid noisy churn.
- New bilingual posts may be placed under `src/content/blog/en/` and `src/content/blog/th/` if that becomes useful operationally.
- If that folder split is introduced later, preserve the same frontmatter contract so routing and search continue to work without another content migration.
