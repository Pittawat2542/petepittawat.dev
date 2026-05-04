#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildTargetMdx,
  buildNimChatPayload,
  buildTranslationPrompt,
  deriveTranslationPlan,
  loadProjectEnv,
  parseNimChatCompletion,
} from './translate-blog-post-lib.mjs';

const DEFAULT_MODEL = 'moonshotai/kimi-k2.6';
const DEFAULT_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const SCRIPT_DIR = path.dirname(SCRIPT_PATH);
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');

async function main() {
  loadProjectEnv(REPO_ROOT);

  const options = parseArgs(process.argv.slice(2), {
    defaultModel: process.env.NVIDIA_NIM_MODEL || DEFAULT_MODEL,
  });
  if (options.help) {
    printHelp();
    return;
  }

  const apiKey = process.env.NVIDIA_NIM_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing NVIDIA_NIM_API_KEY. Export it before running this script.');
  }

  const sourcePath = path.resolve(REPO_ROOT, options.sourcePath);
  const sourceMdx = await fs.readFile(sourcePath, 'utf8');
  const plan = deriveTranslationPlan({
    repoRoot: REPO_ROOT,
    sourcePath,
    sourceMdx,
    targetLang: options.targetLang,
  });

  if (!options.dryRun && !options.overwrite && (await fileExists(plan.targetPath))) {
    throw new Error(
      `Target file already exists at ${path.relative(REPO_ROOT, plan.targetPath)}. ` +
        'Re-run with --overwrite to replace it.'
    );
  }

  const prompt = buildTranslationPrompt({
    sourceLang: plan.sourceLang,
    targetLang: plan.targetLang,
    publicRouteSlug: plan.publicRouteSlug,
    targetInternalSlug: plan.targetInternalSlug,
    translationId: plan.translationId,
    sourceMdx: plan.normalizedSourceMdx,
  });

  const translation = await requestTranslation({
    apiKey,
    apiUrl: process.env.NVIDIA_NIM_API_URL || DEFAULT_API_URL,
    input: prompt.input,
    instructions: prompt.instructions,
    model: options.model,
  });

  if (/^---\s*$/m.test(translation.bodyMdx.split('\n')[0] || '')) {
    throw new Error('Model returned frontmatter inside bodyMdx. Expected body content only.');
  }

  const targetMdx = buildTargetMdx({
    plan,
    translatedTitle: translation.title,
    translatedExcerpt: translation.excerpt,
    translatedBodyMdx: translation.bodyMdx,
  });

  if (options.dryRun) {
    printDryRun({
      plan,
      sourceChanged: plan.normalizedSourceMdx !== sourceMdx,
      targetMdx,
    });
    return;
  }

  await fs.mkdir(path.dirname(plan.targetPath), { recursive: true });

  if (plan.normalizedSourceMdx !== sourceMdx) {
    await fs.writeFile(sourcePath, plan.normalizedSourceMdx, 'utf8');
  }

  await fs.writeFile(plan.targetPath, targetMdx, 'utf8');

  console.log(`Wrote ${path.relative(REPO_ROOT, plan.targetPath)}`);
  if (plan.normalizedSourceMdx !== sourceMdx) {
    console.log(`Updated ${path.relative(REPO_ROOT, sourcePath)} with explicit language metadata.`);
  }
}

function parseArgs(argv, { defaultModel }) {
  if (argv.includes('--help') || argv.includes('-h')) {
    return { help: true };
  }

  const positional = [];
  let dryRun = false;
  let overwrite = false;
  let model = defaultModel;

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--') {
      continue;
    }
    if (value === '--dry-run') {
      dryRun = true;
      continue;
    }
    if (value === '--overwrite') {
      overwrite = true;
      continue;
    }
    if (value === '--model') {
      model = argv[index + 1];
      index += 1;
      continue;
    }
    if (value.startsWith('--model=')) {
      model = value.slice('--model='.length);
      continue;
    }
    positional.push(value);
  }

  if (positional.length < 2) {
    throw new Error('Usage: node scripts/translate-blog-post.mjs <source-path> <target-lang>');
  }

  const [sourcePath, targetLang] = positional;
  if (!['en', 'th'].includes(targetLang)) {
    throw new Error(`Unsupported target language "${targetLang}". Expected "en" or "th".`);
  }

  if (!model) {
    throw new Error('Expected a model name after --model.');
  }

  return {
    dryRun,
    help: false,
    model,
    overwrite,
    sourcePath,
    targetLang,
  };
}

async function requestTranslation({ apiKey, apiUrl, input, instructions, model }) {
  const requestBody = buildNimChatPayload({
    model,
    instructions,
    input,
  });

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const responsePayload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof responsePayload.error?.message === 'string'
        ? responsePayload.error.message
        : `NVIDIA NIM API request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return parseNimChatCompletion(responsePayload);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function printDryRun({ plan, sourceChanged, targetMdx }) {
  console.error(`Dry run for ${path.relative(REPO_ROOT, plan.targetPath)}`);
  if (sourceChanged) {
    console.error(
      `Source normalization would update ${path.relative(REPO_ROOT, plan.sourcePath)} first.`
    );
  }
  process.stdout.write(`${targetMdx}\n`);
}

function printHelp() {
  console.log(`Translate a blog post into its English or Thai sibling via NVIDIA NIM.

Usage:
  node scripts/translate-blog-post.mjs <source-path> <target-lang> [--model moonshotai/kimi-k2.6] [--dry-run] [--overwrite]

Examples:
  node scripts/translate-blog-post.mjs src/content/blog/wisdom.mdx th
  node scripts/translate-blog-post.mjs src/content/blog/th/the-silicon-mind.mdx en --model moonshotai/kimi-k2.6

Environment:
  NVIDIA_NIM_API_KEY          Required API key
  NVIDIA_NIM_MODEL            Optional default model override
  NVIDIA_NIM_API_URL          Optional chat completions endpoint override

Config files:
  .env                        Automatically loaded from the project root if present
  .env.example                Starter template for local configuration

Compatibility:
  OPENAI_API_KEY              Fallback alias for the bearer token, if already set
`);
}

export const __testOnly = {
  parseArgs,
};

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
  main().catch(error => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`translate-blog-post failed: ${message}`);
    process.exitCode = 1;
  });
}
