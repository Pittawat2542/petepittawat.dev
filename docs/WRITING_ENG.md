# English Blog Writing Principles (สไตล์การเขียนบล็อกภาษาอังกฤษ)

This document outlines the core writing principles, styles, and formatting conventions for **English blog posts** on this platform. It serves to maintain structural clarity, professional tone, and logical consistency across all English content.

---

## 1. First Principles & Ideology

Every English article must satisfy the following four foundational concepts:

| Principle                     | Description                                                                 | English Implementation                                                                                                                                      |
| :---------------------------- | :-------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Narrative Anchoring**       | Grounding abstract technical/philosophical theories in human experience.    | Begin with personal journal entries, historical references, or an observation (e.g., "Recently, I found myself revisiting old notes...").                   |
| **Incremental Progression**   | Building complexity gradually so the reader is never overwhelmed.           | Start with high-level introductory models, transition to relatable analogies, and then expose code blocks or mathematical formulas.                         |
| **Multi-Dimensional Zooming** | Connecting granular implementation detail with systemic, high-level impact. | Blend line-by-line syntax or library function calls (Zooming In) with broad considerations like architecture, team agreements, or philosophy (Zooming Out). |
| **Cognitive Scannability**    | Respecting the reader's time by making key ideas visually distinct.         | Use bold keywords, italics for metaphors, formatted code lists, horizontal dividers, and specific summary subsections.                                      |

---

## 2. Voice & Tone

The voice in English blogs is **thoughtful, analytical, and highly collaborative**:

- **Empathetic Inclusiveness (The Collective "We"):** Frequently use **"we"**, **"us"**, and **"our"** in tutorial guides (e.g., _"Today, we'll break down how each method works..."_). This treats learning as a joint exploration.
- **Reflective First-Person ("I"):** Use **"I"** when sharing personal journal reflections, subjective viewpoints, or choices you made (e.g., _"Personally, I believe in..."_).
- **Intellectual & Objective:** The tone is sophisticated and precise. Avoid casual jargon, slang, or overly promotional phrasing. Use elevated verbs and nouns (e.g., _transcend_, _crystallize_, _deconstruct_, _speculative_).

---

## 3. Formatting, Style & Typography

Consistency in text-level formatting helps convey meaning at a glance:

### 3.1 Vocabulary & Terminology

- **Consistent Verbs:** Choose clear verbs for software actions and keep them consistent across the article (e.g., establish if you are using _get_, _fetch_, _view_, _observe_, or _download_).
- **Clear Conceptual Labels:** Keep programming principles in **bold Title Case** (e.g., **Single-Responsibility Principle**, **K-Means Clustering**).

### 3.2 Typography Rules

- **Metaphors in Italics:** Conceptual frameworks used as metaphors or models are italicized (e.g., _glue_, _lingua franca_, _attention_, _energy landscape_).
- **Console Outputs & Comments:** When writing code snippets, include clear inline comments showing expected inputs, outputs, or error states.
  ```dart
  print('Hello, Dart!'.uppercaseReversed);
  // OUTPUT: !TRAD ,OLLEH
  ```

---

## 4. Article Anatomy & Formatting

English MDX files are highly structured documents. Follow this layout:

### 4.1 MDX Header & Imports

- **Frontmatter Metadata:** Standard fields include `slug` (with `-en` suffix), `title`, `pubDate`, `tags`, `coverImage`, `lang` (`en`), `translationId`, and `excerpt`. For stub files redirecting to other sites, include `externalUrl`.
- **Component Imports:** Always place custom React component imports immediately below the frontmatter block, with a preceding empty line.

  ```mdx
  ---
  slug: 'example-slug-en'
  ...
  ---

  import Figure from '@/components/mdx/Figure';
  import Callout from '@/components/content/Callout';
  ```

### 4.2 Structural Sections

1. **Introduction:** Establish context, introduce the core hook, and state the objective.
2. **TLDR; / Key Takeaways:** (Optional) Provide direct answers for technical lookup posts.
3. **Core Sections:** Organize with heading levels `##` and `###`. Major transitions must be separated by a horizontal rule (`---`) with blank lines on both sides.
4. **Summary / Conclusion:** Synthesize findings and end with an open-ended philosophical question or invitation to choose.
5. **References:** List citations at the bottom under the `## References` section using standard numbers.

### 4.3 Custom Components

- **Figure:** Use custom figure blocks to load Unsplash URLs or local SVG assets with descriptive captions.
  ```mdx
  <Figure
    src="url_or_relative_path"
    alt="Short alt description"
    caption="Detailed description of the diagram's conceptual meaning"
  />
  ```
- **Callout:** Close the post with a stylized sign-off box.
  ```mdx
  <Callout type="tip" title="Thanks for reading">
    📚 Hope you enjoy reading!
  </Callout>
  ```
