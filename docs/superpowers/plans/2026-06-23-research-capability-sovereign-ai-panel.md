# Research Capability as the Foundation of Sovereign Al Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the 18 June 2026 panel to the talks collection with a custom, project-bound 1200x630 card image.

**Architecture:** This is a data-only addition to the existing JSON-backed talks collection. The card image follows the site-wide Image Gen style, and the existing card-visual helpers calculate the manifest hash that protects the custom image from deterministic regeneration.

**Tech Stack:** Astro content collections, JSON, TypeScript card-visual helpers, built-in Image Gen, pnpm validation scripts

---

### Task 1: Add the talk record

**Files:**

- Modify: `src/content/talks/talks.json`

- [ ] **Step 1: Insert the record in reverse chronological order**

Insert this object before the 31 May 2026 entry:

```json
{
  "date": "2026-06-18",
  "title": "Research Capability as the Foundation of Sovereign Al",
  "audience": "Connect the Dots 2026: Realizing Sovereign AI – Thailand’s LLM Direction",
  "audienceUrl": "https://bridge.bdi.or.th/events/ctd-18jun-ai-llm/",
  "mode": "on-site: Grande Centre Point Lumphini",
  "resources": [
    {
      "label": "Event page",
      "href": "https://bridge.bdi.or.th/events/ctd-18jun-ai-llm/"
    }
  ],
  "tags": ["Panel", "AI Research", "Sovereign AI", "Large Language Models"]
}
```

- [ ] **Step 2: Run the Astro content check**

Run: `pnpm exec astro check`

Expected: exit code 0 with no content-schema errors.

### Task 2: Generate and save the talk card image

**Files:**

- Create: `public/visual/cards/talks/2026-06-18-research-capability-as-the-foundation-of-sovereign-al.png`

- [ ] **Step 1: Generate one card image with built-in Image Gen**

Use this prompt:

```text
Use case: stylized-concept
Asset type: talk cover image, 1200x630 landscape
Primary request: create a content-specific cover image for “Research Capability as the Foundation of Sovereign Al”.
Content signal: a panel for Connect the Dots 2026 about research capability as the foundational layer that enables Thailand to build, control, and sustain sovereign large language models.
Subject: a precise luminous research foundation made of layered scientific grids and interconnected nodes, physically supporting a coherent sovereign AI model network above it.
Scene/backdrop: deep editorial technology space with glass panels, faint perspective grid, fine network lines, and quiet data texture.
Style/medium: polished cinematic dark tech editorial illustration, dark glassmorphism, subtle scientific diagram language, premium research-lab interface aesthetic.
Composition/framing: crop-safe landscape, one strong centered symbolic structure, generous edge clearance, legible at card thumbnail size.
Lighting/mood: calm, intelligent, reflective, low-key studio lighting with soft violet, electric blue, and cyan glow.
Color palette: near-black navy, indigo, violet, electric blue, and soft cyan.
Materials/textures: frosted glass, luminous data lines, holographic panels, soft gradients, precise geometric overlays.
Constraints: visually specific to research capability and sovereign AI; no title text, no readable words, no logos, no fake event branding, no watermark.
Avoid: generic AI brain imagery, national flags, photorealistic stock-photo scenes, fake app screens, cluttered diagrams, low-contrast muddy colors.
```

- [ ] **Step 2: Copy the selected generated image into the project**

Copy the built-in Image Gen output from its generated-images location to:

`public/visual/cards/talks/2026-06-18-research-capability-as-the-foundation-of-sovereign-al.png`

- [ ] **Step 3: Inspect the saved asset**

Confirm it has no readable text, logo, or watermark and that the focal foundation/network metaphor remains clear at card size.

- [ ] **Step 4: Confirm dimensions and format**

Run:

```bash
sips -g pixelWidth -g pixelHeight -g format public/visual/cards/talks/2026-06-18-research-capability-as-the-foundation-of-sovereign-al.png
```

Expected: width `1200`, height `630`, format `png`.

### Task 3: Protect the custom card image in the manifest

**Files:**

- Modify: `public/visual/cards/manifest.json`

- [ ] **Step 1: Calculate and write the repository-defined manifest hash**

Run:

```bash
node --experimental-strip-types -e "
import fs from 'node:fs/promises';
import { createCardVisualHash, resolveCardVisualSpec, toTalkCardVisualInput } from './src/lib/card-visual/index.ts';

const title = 'Research Capability as the Foundation of Sovereign Al';
const items = JSON.parse(await fs.readFile('src/content/talks/talks.json', 'utf8'));
const item = items.find(candidate => candidate.title === title);
if (!item) throw new Error('Item title not found for manifest update: ' + title);

const spec = resolveCardVisualSpec(toTalkCardVisualInput(item));
const manifestPath = 'public/visual/cards/manifest.json';
let manifest = {};
try {
  manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
} catch {}

manifest[spec.manifestKey] = {
  hash: createCardVisualHash(spec),
  generatedAt: new Date().toISOString(),
};

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\\n');
console.log(spec.imagePath);
console.log(spec.manifestKey);
"
```

Expected output includes:

```text
public/visual/cards/talks/2026-06-18-research-capability-as-the-foundation-of-sovereign-al.png
talks:2026-06-18-research-capability-as-the-foundation-of-sovereign-al
```

### Task 4: Validate the complete addition

**Files:**

- Verify: `src/content/talks/talks.json`
- Verify: `public/visual/cards/talks/2026-06-18-research-capability-as-the-foundation-of-sovereign-al.png`
- Verify: `public/visual/cards/manifest.json`

- [ ] **Step 1: Validate all cover and card assets**

Run: `pnpm run validate:cover-assets`

Expected: exit code 0 and confirmation that cover assets are valid.

- [ ] **Step 2: Validate Astro content and TypeScript**

Run: `pnpm exec astro check`

Expected: exit code 0 with zero errors.

- [ ] **Step 3: Review the final diff and workspace state**

Run:

```bash
git diff --check
git status --short
git diff -- src/content/talks/talks.json public/visual/cards/manifest.json
```

Expected: no whitespace errors; the talk data and one manifest entry are the only textual implementation changes; the new PNG and this plan are the only new implementation files.
