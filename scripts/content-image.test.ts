import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';

import sharp from 'sharp';

import {
  createCardVisualHash,
  resolveCardVisualSpec,
  toProjectCardVisualInput,
} from '../src/lib/card-visual/index.ts';
import { createContentImageHash, renderCoverWebp } from './content-image.ts';

const execFileAsync = promisify(execFile);

test('image cache includes source artwork and metadata', () => {
  const source = Buffer.from('first artwork');
  const hash = createContentImageHash(source, 'metadata');
  assert.equal(hash, createContentImageHash(source, 'metadata'));
  assert.notEqual(hash, createContentImageHash(Buffer.from('revised artwork'), 'metadata'));
  assert.notEqual(hash, createContentImageHash(source, 'revised metadata'));
});

test('vector covers are downsampled to the required dimensions', async () => {
  const svg = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#173951"/></svg>'
  );
  const image = await renderCoverWebp(svg, true);
  const metadata = await sharp(image).metadata();
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
  assert.equal(metadata.format, 'webp');
});

test('card generator refreshes changed PNGs, skips unchanged inputs, and restores the fallback', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'cover-generator-'));
  const project = { title: 'Cover Test', tags: ['AI'], year: 2026 };
  const spec = resolveCardVisualSpec(toProjectCardVisualInput(project));
  const outputPath = path.join(root, 'public', spec.imagePath);
  const sourcePath = outputPath.replace(/\.webp$/, '.png');
  const manifestPath = path.join(root, 'public/visual/cards/manifest.json');
  const script = new URL('./generate-card-visuals.ts', import.meta.url);
  const run = () => execFileAsync(process.execPath, [script.pathname], { cwd: root });
  const readManifest = async () => JSON.parse(await fs.readFile(manifestPath, 'utf8'));

  try {
    for (const collection of ['projects', 'publications', 'talks']) {
      const dir = path.join(root, 'src/content', collection);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(
        path.join(dir, `${collection}.json`),
        JSON.stringify(collection === 'projects' ? [project] : [])
      );
    }
    await fs.mkdir(path.dirname(sourcePath), { recursive: true });
    const writeSource = async (background: string) => {
      await sharp({ create: { width: 1600, height: 900, channels: 3, background } })
        .png()
        .toFile(sourcePath);
    };

    await writeSource('#176a99');
    await run();
    const firstManifest = await readManifest();
    const firstImage = await fs.readFile(outputPath);
    const dimensions = await sharp(firstImage).metadata();
    assert.equal(dimensions.width, 1200);
    assert.equal(dimensions.height, 630);

    const skipped = await run();
    assert.match(skipped.stdout, /0 generated, 1 skipped/);
    assert.deepEqual(await readManifest(), firstManifest);

    // Older exports keep their bytes and timestamps while gaining source tracking.
    const legacyDate = '2026-01-01T00:00:00.000Z';
    await fs.writeFile(
      manifestPath,
      JSON.stringify({
        [spec.manifestKey]: { hash: createCardVisualHash(spec), generatedAt: legacyDate },
      })
    );
    const migrated = await run();
    assert.match(migrated.stdout, /0 generated, 1 skipped/);
    const migratedManifest = await readManifest();
    assert.equal(migratedManifest[spec.manifestKey].generatedAt, legacyDate);
    assert.ok(migratedManifest[spec.manifestKey].inputHash);
    assert.deepEqual(await fs.readFile(outputPath), firstImage);

    // An export-version change alone is optional; --refresh explicitly opts in.
    migratedManifest[spec.manifestKey].hash = 'older-export-settings';
    await fs.writeFile(manifestPath, JSON.stringify(migratedManifest));
    assert.match((await run()).stdout, /0 generated, 1 skipped/);
    const refreshed = await execFileAsync(process.execPath, [script.pathname, '--refresh'], {
      cwd: root,
    });
    assert.match(refreshed.stdout, /1 generated, 0 skipped/);
    assert.equal(
      (await readManifest())[spec.manifestKey].hash,
      firstManifest[spec.manifestKey].hash
    );

    await writeSource('#b7492f');
    await run();
    assert.notEqual(
      (await readManifest())[spec.manifestKey].hash,
      firstManifest[spec.manifestKey].hash
    );
    assert.notDeepEqual(await fs.readFile(outputPath), firstImage);

    await fs.rm(sourcePath);
    await run();
    const fallbackImage = await fs.readFile(outputPath);
    assert.notDeepEqual(fallbackImage, firstImage);
    const fallbackSkipped = await run();
    assert.match(fallbackSkipped.stdout, /0 generated, 1 skipped/);
    await fs.rm(outputPath);
    await run();
    assert.deepEqual(await fs.readFile(outputPath), fallbackImage);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
