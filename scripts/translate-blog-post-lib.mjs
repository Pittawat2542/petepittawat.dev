import path from 'node:path';
import process from 'node:process';

const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
const FRONTMATTER_KEY_PATTERN = /^([A-Za-z0-9_]+):\s*(.+)$/;
const SUPPORTED_LANGS = new Set(['en', 'th']);

export function loadProjectEnv(repoRoot) {
  const envPath = path.join(repoRoot, '.env');
  try {
    process.loadEnvFile(envPath);
    return { loaded: true, path: envPath };
  } catch (error) {
    if (isMissingEnvFile(error)) {
      return { loaded: false, path: envPath };
    }
    throw error;
  }
}

export function splitFrontmatter(mdx) {
  const match = mdx.match(FRONTMATTER_PATTERN);
  if (!match) {
    throw new Error('Expected an MDX file with YAML frontmatter.');
  }

  return {
    frontmatter: match[1],
    body: match[2],
  };
}

export function readFrontmatterScalar(frontmatter, key) {
  const pattern = new RegExp(`^${escapeRegExp(key)}:\\s*(.+)$`, 'm');
  const match = frontmatter.match(pattern);
  if (!match) return undefined;

  const rawValue = match[1].trim();
  if (
    (rawValue.startsWith("'") && rawValue.endsWith("'")) ||
    (rawValue.startsWith('"') && rawValue.endsWith('"'))
  ) {
    return rawValue.slice(1, -1).replace(/''/g, "'");
  }

  return rawValue;
}

export function setFrontmatterScalar(frontmatter, key, value) {
  const renderedLine = `${key}: ${renderYamlString(value)}`;
  const pattern = new RegExp(`^${escapeRegExp(key)}:\\s*(.+)$`, 'm');

  if (pattern.test(frontmatter)) {
    return frontmatter.replace(pattern, renderedLine);
  }

  return `${frontmatter.trimEnd()}\n${renderedLine}`;
}

export function deriveTranslationPlan({ repoRoot, sourcePath, sourceMdx, targetLang }) {
  if (!SUPPORTED_LANGS.has(targetLang)) {
    throw new Error(`Unsupported target language "${targetLang}". Expected "en" or "th".`);
  }

  const { frontmatter, body } = splitFrontmatter(sourceMdx);
  const sourceSlug = readFrontmatterScalar(frontmatter, 'slug');
  if (!sourceSlug) {
    throw new Error('Source frontmatter must include a slug.');
  }

  const sourceLang = inferSourceLanguage({
    sourcePath,
    targetLang,
    explicitLang: readFrontmatterScalar(frontmatter, 'lang'),
  });

  if (sourceLang === targetLang) {
    throw new Error(`Source post is already tagged as "${targetLang}".`);
  }

  const publicRouteSlug =
    readFrontmatterScalar(frontmatter, 'routeSlug') ?? stripLangSuffix(sourceSlug);
  const translationId = readFrontmatterScalar(frontmatter, 'translationId') ?? publicRouteSlug;
  const targetInternalSlug = `${publicRouteSlug}-${targetLang}`;
  const targetPath = path.join(repoRoot, 'src/content/blog', targetLang, `${publicRouteSlug}.mdx`);

  let normalizedFrontmatter = frontmatter;
  normalizedFrontmatter = setFrontmatterScalar(normalizedFrontmatter, 'lang', sourceLang);
  normalizedFrontmatter = setFrontmatterScalar(
    normalizedFrontmatter,
    'translationId',
    translationId
  );

  const normalizedSourceMdx = composeMdx(normalizedFrontmatter, body);

  return {
    body,
    frontmatter,
    normalizedSourceMdx,
    publicRouteSlug,
    sourceLang,
    sourcePath,
    targetInternalSlug,
    targetLang,
    targetPath,
    translationId,
  };
}

export function buildTargetMdx({ plan, translatedTitle, translatedExcerpt, translatedBodyMdx }) {
  let frontmatter = plan.frontmatter;
  frontmatter = setFrontmatterScalar(frontmatter, 'slug', plan.targetInternalSlug);
  frontmatter = setFrontmatterScalar(frontmatter, 'routeSlug', plan.publicRouteSlug);
  frontmatter = setFrontmatterScalar(frontmatter, 'title', translatedTitle);
  frontmatter = setFrontmatterScalar(frontmatter, 'excerpt', translatedExcerpt);
  frontmatter = setFrontmatterScalar(frontmatter, 'lang', plan.targetLang);
  frontmatter = setFrontmatterScalar(frontmatter, 'translationId', plan.translationId);

  return composeMdx(frontmatter, translatedBodyMdx);
}

export function buildTranslationPrompt({
  sourceLang,
  targetLang,
  publicRouteSlug,
  targetInternalSlug,
  translationId,
  sourceMdx,
}) {
  const instructions = [
    'You are translating an Astro MDX blog post for publication.',
    'Preserve MDX structure, imports, JSX tags, component usage, links, images, code blocks, and reference URLs.',
    'Translate reader-visible prose into natural target-language writing rather than literal sentence-by-sentence output.',
    'Translate visible string props inside MDX components when they are reader-facing, but do not alter non-textual props, import specifiers, paths, or URLs.',
    'Do not translate code fences, inline code identifiers, frontmatter keys, or machine-readable metadata fields.',
    'Keep markdown structure stable: headings, lists, emphasis, callouts, footnotes, and blockquotes should still render correctly.',
    'Return JSON only with exactly three string fields: title, excerpt, and bodyMdx.',
    'Do not wrap the JSON in prose before or after it.',
  ].join(' ');

  const input = [
    `Source language: ${sourceLang}`,
    `Target language: ${targetLang}`,
    `Public route slug: ${publicRouteSlug}`,
    `Target internal slug: ${targetInternalSlug}`,
    `Translation ID: ${translationId}`,
    '',
    'Translate the following MDX source. Translate title, excerpt, and body prose. Preserve MDX syntax.',
    '',
    sourceMdx,
  ].join('\n');

  return { instructions, input };
}

export function buildNimChatPayload({ model, instructions, input }) {
  return {
    model,
    messages: [
      { role: 'system', content: instructions },
      { role: 'user', content: input },
    ],
    max_tokens: 65536,
    temperature: 0.4,
    top_p: 0.9,
    stream: true,
  };
}

export function parseNimChatCompletion(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('NVIDIA NIM response did not include message content.');
  }

  const jsonText = extractJsonObject(content);

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`NVIDIA NIM response was not valid JSON: ${message}`);
  }

  if (
    typeof parsed?.title !== 'string' ||
    typeof parsed?.excerpt !== 'string' ||
    typeof parsed?.bodyMdx !== 'string'
  ) {
    throw new Error(
      'NVIDIA NIM response JSON must include string fields: title, excerpt, bodyMdx.'
    );
  }

  return parsed;
}

function extractJsonObject(content) {
  const trimmed = content.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function inferSourceLanguage({ sourcePath, targetLang, explicitLang }) {
  if (explicitLang && SUPPORTED_LANGS.has(explicitLang)) {
    return explicitLang;
  }

  const normalizedPath = sourcePath.split(path.sep).join('/');
  if (normalizedPath.includes('/src/content/blog/en/')) return 'en';
  if (normalizedPath.includes('/src/content/blog/th/')) return 'th';

  return targetLang === 'en' ? 'th' : 'en';
}

function stripLangSuffix(slug) {
  return slug.replace(/-(en|th)$/, '');
}

function composeMdx(frontmatter, body) {
  const normalizedBody = body.replace(/^\n+/, '');
  return `---\n${frontmatter.trim()}\n---\n\n${normalizedBody}`;
}

function renderYamlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isMissingEnvFile(error) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error.code === 'ENOENT' || error.code === 'ERR_INVALID_FILE_URL_PATH')
  );
}

export const __testOnly = {
  FRONTMATTER_KEY_PATTERN,
};
