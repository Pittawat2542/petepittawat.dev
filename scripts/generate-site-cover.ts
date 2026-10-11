import fs from 'node:fs/promises';
import path from 'node:path';

import { SITE_CONFIG } from '../src/lib/constants.ts';
import { createContentImageHash, renderCoverJpeg } from './content-image.ts';

const root = process.cwd();
const sourcePath = path.join(root, 'public/visual/site/home-cover.png');
const outputPath = path.join(root, 'public/home-og-image.jpeg');
const manifestPath = path.join(root, 'public/visual/site/manifest.json');

if (process.argv.includes('--prompt')) {
  console.log(createSiteCoverPrompt());
} else {
  await generate();
}

function createSiteCoverPrompt() {
  return `Use case: stylized-concept
Asset type: premium editorial cover for a personal AI researcher and builder website; social sharing image.
Primary request: create a polished, distinctive wide cover for ${SITE_CONFIG.title}.
Input images: use the supplied original site logo as an exact brand reference. The local logo is src/assets/images/logo.png; use the vivid cyan-blue background and black monogram from the original cover when that reference is supplied. Preserve the horizontal bar and two downward rounded loops exactly, without reinterpreting the mark as letters.
Context: ${SITE_CONFIG.description}
Scene/backdrop: deep midnight navy, consistent with a dark observatory-themed portfolio. A restrained, luminous scientific sculpture on the right: delicate interconnected glass orbits around a small warm core, suggesting reasoning, evaluation, and connected systems. Precise, tactile materials and subtle depth, with generous breathing room. Avoid a busy schematic.
Style/medium: refined editorial art direction, sophisticated optical glass and brushed metal rendered with realistic light. A memorable single focal object, carefully balanced with elegant typography.
Composition/framing: landscape 1.905:1, ideally 2400x1260. Left 58% reserved for a clean, highly legible typographic composition, sculpture on the right. Form a compact brand row above the headline: original blue rounded-square logo on the left, PETEPITTAWAT.DEV wordmark beside it, vertically centered. The logo should be roughly 60px square at the final 1200x630 size, clearly recognizable but subordinate to the headline. Keep generous margins and spacing. Crisp at 1200x630 and readable at thumbnail size.
Lighting/mood: quiet, thoughtful, confident. Soft cyan rim light, restrained lavender reflections, a small warm amber focal highlight, deep navy negative space. No excessive bloom.
Text (verbatim): "PETEPITTAWAT.DEV" as a small but readable masthead; "Research. Build.\nUnderstand." as the large editorial headline on three lines; "Language models · Reasoning · AI systems" as a supporting line; "${SITE_CONFIG.author}" as a clear byline.
Typography: beautifully typeset ivory editorial serif headline, clean sans serif supporting text, disciplined spacing, aligned left. Accurate spelling and strong hierarchy. Render text sharply and completely inside the safe area.
Constraints: include exactly the supplied original site logo, no additional logos or text, no fabricated metrics, no watermark, no outer border or rounded corners, no robot, no brain icon, no stock circuit-board wallpaper. Full-bleed opaque background.`;
}

async function generate() {
  const source = await fs.readFile(sourcePath);
  const hash = createContentImageHash(source, 'site-cover-jpeg-94-444');
  const previous = await readManifest();
  const outputExists = await fs.access(outputPath).then(
    () => true,
    () => false
  );

  if (outputExists && previous?.hash === hash) {
    console.log('Site cover skipped: public/home-og-image.jpeg');
    return;
  }

  await fs.writeFile(outputPath, await renderCoverJpeg(source));
  await fs.writeFile(
    manifestPath,
    JSON.stringify({ hash, generatedAt: new Date().toISOString() }, null, 2) + '\n'
  );
  console.log('Site cover generated: public/home-og-image.jpeg');
}

async function readManifest(): Promise<{ hash: string } | undefined> {
  try {
    return JSON.parse(await fs.readFile(manifestPath, 'utf8')) as { hash: string };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
}
