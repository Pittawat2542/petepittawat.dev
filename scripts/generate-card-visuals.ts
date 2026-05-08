import fs from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

import {
  createCardVisualHash,
  isCardVisualStale,
  renderCardVisualSvg,
  resolveCardVisualSpec,
  toProjectCardVisualInput,
  toPublicationCardVisualInput,
  toTalkCardVisualInput,
  type CardVisualManifest,
} from '../src/lib/card-visual/index.ts';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const MANIFEST_FILE = path.join(ROOT, 'public', 'visual', 'cards', 'manifest.json');
const PROJECTS_FILE = path.join(ROOT, 'src', 'content', 'projects', 'projects.json');
const PUBLICATIONS_FILE = path.join(ROOT, 'src', 'content', 'publications', 'publications.json');
const TALKS_FILE = path.join(ROOT, 'src', 'content', 'talks', 'talks.json');

type ProjectJson = {
  title: string;
  tags: string[];
  type?: string | undefined;
  year: number;
};

type PublicationJson = {
  title: string;
  tags: string[];
  type: string;
  year: number;
};

type TalkJson = {
  date: string;
  title: string;
  tags: string[];
  mode?: string | undefined;
};

await generate();

async function generate() {
  const [projects, publications, talks, manifest] = await Promise.all([
    readJsonArray<ProjectJson>(PROJECTS_FILE),
    readJsonArray<PublicationJson>(PUBLICATIONS_FILE),
    readJsonArray<TalkJson>(TALKS_FILE),
    loadManifest(),
  ]);

  const specs = [
    ...projects.map(item => resolveCardVisualSpec(toProjectCardVisualInput(item))),
    ...publications.map(item => resolveCardVisualSpec(toPublicationCardVisualInput(item))),
    ...talks.map(item => resolveCardVisualSpec(toTalkCardVisualInput(item))),
  ];

  const updatedManifest: CardVisualManifest = {};
  let generatedCount = 0;
  let skippedCount = 0;

  for (const spec of specs) {
    const outPath = path.join(PUBLIC_DIR, spec.imagePath.replace(/^\//, ''));
    const fileExists = await exists(outPath);

    if (isCardVisualStale(spec, manifest, fileExists)) {
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      const svg = renderCardVisualSvg(spec);
      await sharp(Buffer.from(svg)).png().toFile(outPath);
      generatedCount += 1;
      console.log(`Card visual generated: ${path.relative(ROOT, outPath)}`);
    } else {
      skippedCount += 1;
      console.log(`Card visual skipped: ${path.relative(ROOT, outPath)}`);
    }

    updatedManifest[spec.manifestKey] = {
      hash: createCardVisualHash(spec),
      generatedAt: new Date().toISOString(),
    };
  }

  await fs.mkdir(path.dirname(MANIFEST_FILE), { recursive: true });
  await fs.writeFile(MANIFEST_FILE, JSON.stringify(updatedManifest, null, 2));

  console.log(
    `Card visual generation complete: ${generatedCount} generated, ${skippedCount} skipped`
  );
}

async function readJsonArray<T>(filePath: string): Promise<T[]> {
  const content = await fs.readFile(filePath, 'utf8');
  const parsed = JSON.parse(content) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error(`${path.relative(ROOT, filePath)} must contain a JSON array.`);
  }

  return parsed as T[];
}

async function loadManifest(): Promise<CardVisualManifest> {
  try {
    const content = await fs.readFile(MANIFEST_FILE, 'utf8');
    return JSON.parse(content) as CardVisualManifest;
  } catch {
    return {};
  }
}

async function exists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
