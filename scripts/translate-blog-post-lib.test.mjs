import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  buildTargetMdx,
  buildNimChatPayload,
  buildTranslationPrompt,
  deriveTranslationPlan,
  loadProjectEnv,
  parseNimChatCompletion,
} from './translate-blog-post-lib.mjs';

const repoRoot = '/repo';

test('derives a Thai translation plan from a legacy English post and normalizes source metadata', () => {
  const sourcePath = path.join(repoRoot, 'src/content/blog/wisdom.mdx');
  const sourceMdx = `---
slug: 'wisdom'
title: 'Wisdom'
excerpt: 'A short post.'
pubDate: 2026-01-01T00:00:00.000Z
tags: ['Thinking']
---

# Wisdom

Hello world.
`;

  const plan = deriveTranslationPlan({
    repoRoot,
    sourcePath,
    sourceMdx,
    targetLang: 'th',
  });

  assert.equal(plan.sourceLang, 'en');
  assert.equal(plan.publicRouteSlug, 'wisdom');
  assert.equal(plan.translationId, 'wisdom');
  assert.equal(plan.targetInternalSlug, 'wisdom-th');
  assert.equal(plan.targetPath, path.join(repoRoot, 'src/content/blog/th/wisdom.mdx'));
  assert.match(plan.normalizedSourceMdx, /lang: 'en'/);
  assert.match(plan.normalizedSourceMdx, /translationId: 'wisdom'/);
});

test('derives an English translation plan from a bilingual Thai source without mutating existing metadata', () => {
  const sourcePath = path.join(repoRoot, 'src/content/blog/th/the-silicon-mind.mdx');
  const sourceMdx = `---
slug: 'the-silicon-mind-th'
routeSlug: 'the-silicon-mind'
title: 'The Silicon Mind'
excerpt: 'Thai source.'
pubDate: 2026-04-11T00:00:00.000Z
tags: ['AI']
lang: 'th'
translationId: 'the-silicon-mind'
---

# Title
`;

  const plan = deriveTranslationPlan({
    repoRoot,
    sourcePath,
    sourceMdx,
    targetLang: 'en',
  });

  assert.equal(plan.sourceLang, 'th');
  assert.equal(plan.publicRouteSlug, 'the-silicon-mind');
  assert.equal(plan.translationId, 'the-silicon-mind');
  assert.equal(plan.targetInternalSlug, 'the-silicon-mind-en');
  assert.equal(plan.targetPath, path.join(repoRoot, 'src/content/blog/en/the-silicon-mind.mdx'));
  assert.equal(plan.normalizedSourceMdx, sourceMdx);
});

test('builds a target MDX file with controlled bilingual frontmatter fields', () => {
  const sourcePath = path.join(repoRoot, 'src/content/blog/wisdom.mdx');
  const sourceMdx = `---
slug: 'wisdom'
title: 'Wisdom'
excerpt: 'A short post.'
pubDate: 2026-01-01T00:00:00.000Z
tags: ['Thinking']
lang: 'en'
translationId: 'wisdom'
---

# Wisdom

Hello world.
`;

  const plan = deriveTranslationPlan({
    repoRoot,
    sourcePath,
    sourceMdx,
    targetLang: 'th',
  });

  const targetMdx = buildTargetMdx({
    plan,
    translatedTitle: 'ปัญญา',
    translatedExcerpt: 'โพสต์สั้น ๆ',
    translatedBodyMdx: '# ปัญญา\n\nสวัสดีโลก\n',
  });

  assert.match(targetMdx, /slug: 'wisdom-th'/);
  assert.match(targetMdx, /routeSlug: 'wisdom'/);
  assert.match(targetMdx, /title: 'ปัญญา'/);
  assert.match(targetMdx, /excerpt: 'โพสต์สั้น ๆ'/);
  assert.match(targetMdx, /lang: 'th'/);
  assert.match(targetMdx, /translationId: 'wisdom'/);
  assert.match(targetMdx, /# ปัญญา/);
});

test('builds a translation prompt with MDX-specific guardrails', () => {
  const prompt = buildTranslationPrompt({
    sourceLang: 'th',
    targetLang: 'en',
    publicRouteSlug: 'the-silicon-mind',
    targetInternalSlug: 'the-silicon-mind-en',
    translationId: 'the-silicon-mind',
    sourceMdx: '# Example',
  });

  assert.match(prompt.instructions, /Preserve MDX structure/i);
  assert.match(prompt.instructions, /Do not translate code fences/i);
  assert.match(prompt.instructions, /Translate reader-visible prose/i);
  assert.match(prompt.input, /Public route slug: the-silicon-mind/);
  assert.match(prompt.input, /Target internal slug: the-silicon-mind-en/);
  assert.match(prompt.input, /Translation ID: the-silicon-mind/);
});

test('builds a NIM chat payload with system and user messages', () => {
  const payload = buildNimChatPayload({
    model: 'moonshotai/kimi-k2.6',
    instructions: 'System instructions',
    input: 'User input',
  });

  assert.equal(payload.model, 'moonshotai/kimi-k2.6');
  assert.equal(payload.stream, true);
  assert.equal(payload.max_tokens, 65536);
  assert.equal(payload.messages[0]?.role, 'system');
  assert.equal(payload.messages[0]?.content, 'System instructions');
  assert.equal(payload.messages[1]?.role, 'user');
  assert.equal(payload.messages[1]?.content, 'User input');
});

test('parses translated JSON from a NIM chat completion response', () => {
  const translation = parseNimChatCompletion({
    choices: [
      {
        message: {
          content: '{"title":"Hello","excerpt":"Summary","bodyMdx":"# Heading\\n\\nBody"}',
        },
      },
    ],
  });

  assert.deepEqual(translation, {
    title: 'Hello',
    excerpt: 'Summary',
    bodyMdx: '# Heading\n\nBody',
  });
});

test('parses translated JSON even when NIM wraps it in a fenced code block', () => {
  const translation = parseNimChatCompletion({
    choices: [
      {
        message: {
          content:
            '```json\n{"title":"Hello","excerpt":"Summary","bodyMdx":"# Heading\\n\\nBody"}\n```',
        },
      },
    ],
  });

  assert.equal(translation.title, 'Hello');
  assert.equal(translation.excerpt, 'Summary');
});

test('loads NIM configuration from a project .env file', async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'translate-blog-post-env-'));
  await fs.writeFile(
    path.join(tempRoot, '.env'),
    ['NVIDIA_NIM_API_KEY=test-key', 'NVIDIA_NIM_MODEL=test-model'].join('\n'),
    'utf8'
  );

  const previousApiKey = process.env.NVIDIA_NIM_API_KEY;
  const previousModel = process.env.NVIDIA_NIM_MODEL;
  delete process.env.NVIDIA_NIM_API_KEY;
  delete process.env.NVIDIA_NIM_MODEL;

  try {
    const result = loadProjectEnv(tempRoot);

    assert.equal(result.loaded, true);
    assert.equal(process.env.NVIDIA_NIM_API_KEY, 'test-key');
    assert.equal(process.env.NVIDIA_NIM_MODEL, 'test-model');
  } finally {
    restoreEnv('NVIDIA_NIM_API_KEY', previousApiKey);
    restoreEnv('NVIDIA_NIM_MODEL', previousModel);
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
});

test('tolerates a missing project .env file', () => {
  const result = loadProjectEnv('/definitely-missing-project-root');

  assert.equal(result.loaded, false);
  assert.match(result.path, /\.env$/);
});

function restoreEnv(key, value) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}
