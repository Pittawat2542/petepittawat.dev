#!/usr/bin/env node

import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import {
  buildTargetMdx,
  buildNimChatPayload,
  buildTranslationPrompt,
  deriveTranslationPlan,
  loadProjectEnv,
  parseNimChatCompletion,
} from './translate-blog-post-lib.mjs';

const DEFAULT_MODEL = 'deepseek-ai/deepseek-v4-pro';
const DEFAULT_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_REQUEST_TIMEOUT_MS = 1800000;
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
  reportProgress(`Source ${path.relative(REPO_ROOT, sourcePath)}`);
  const sourceMdx = await fs.readFile(sourcePath, 'utf8');
  const plan = deriveTranslationPlan({
    repoRoot: REPO_ROOT,
    sourcePath,
    sourceMdx,
    targetLang: options.targetLang,
  });
  reportProgress(`Target ${path.relative(REPO_ROOT, plan.targetPath)}`);

  const targetExists = await fileExists(plan.targetPath);
  if (
    getExistingTargetBehavior({
      dryRun: options.dryRun,
      overwrite: options.overwrite,
      targetExists,
    }) === 'skip'
  ) {
    reportProgress(`Skipping existing translation at ${path.relative(REPO_ROOT, plan.targetPath)}`);
    return;
  }

  const prompt = buildTranslationPrompt({
    sourceLang: plan.sourceLang,
    targetLang: plan.targetLang,
    publicRouteSlug: plan.publicRouteSlug,
    targetInternalSlug: plan.targetInternalSlug,
    translationId: plan.translationId,
    sourceMdx: plan.normalizedSourceMdx,
  });

  reportProgress(
    `Requesting ${plan.sourceLang}->${plan.targetLang} translation via ${options.model}`
  );
  const translation = await requestTranslation({
    apiKey,
    apiUrl: process.env.NVIDIA_NIM_API_URL || DEFAULT_API_URL,
    input: prompt.input,
    instructions: prompt.instructions,
    model: options.model,
    timeoutMs: resolveTimeoutMs(process.env.NVIDIA_NIM_TIMEOUT_MS),
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
    reportProgress(
      `Updated ${path.relative(REPO_ROOT, sourcePath)} with explicit language metadata`
    );
  }

  await fs.writeFile(plan.targetPath, targetMdx, 'utf8');

  reportProgress(`Wrote ${path.relative(REPO_ROOT, plan.targetPath)}`);
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

async function requestTranslation({ apiKey, apiUrl, input, instructions, model, timeoutMs }) {
  const requestBody = buildNimChatPayload({
    model,
    instructions,
    input,
  });

  const response = await requestJson({
    body: JSON.stringify(requestBody),
    headers: buildRequestHeaders(apiKey),
    method: 'POST',
    timeoutMs,
    url: apiUrl,
  });

  if (response.statusCode < 200 || response.statusCode >= 300) {
    const message =
      typeof response.payload.error?.message === 'string'
        ? response.payload.error.message
        : `NVIDIA NIM API request failed with status ${response.statusCode}.`;
    throw new Error(message);
  }

  return parseNimChatCompletion(response.payload);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function getExistingTargetBehavior({ dryRun, overwrite, targetExists }) {
  if (!targetExists) return 'write';
  if (overwrite) return 'write';
  if (dryRun) return 'write';
  return 'skip';
}

function reportProgress(message) {
  console.error(`[translate-blog-post] ${message}`);
}

function buildRequestHeaders(apiKey) {
  return {
    Authorization: `Bearer ${apiKey}`,
    Accept: 'text/event-stream, application/json',
    'Content-Type': 'application/json',
  };
}

function reportStreamingPreview(content) {
  const preview = formatStreamingPreview(content);
  if (!preview) {
    return;
  }
  reportProgress(`Streaming tail: ${preview}`);
}

function resolveTimeoutMs(rawValue) {
  if (rawValue === undefined || rawValue === '') {
    return DEFAULT_REQUEST_TIMEOUT_MS;
  }

  const parsed = Number.parseInt(rawValue, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('NVIDIA_NIM_TIMEOUT_MS must be a positive integer in milliseconds.');
  }

  return parsed;
}

async function requestJson({ body, headers, method, timeoutMs, url }) {
  const requestUrl = new URL(url);
  const client = requestUrl.protocol === 'http:' ? http : https;

  return new Promise((resolve, reject) => {
    const request = client.request(
      requestUrl,
      {
        method,
        headers,
      },
      response => {
        const chunks = [];
        let streamBuffer = '';
        let streamContent = '';
        let streamDone = false;
        let streamHasEvents = false;
        let streamErrorMessage;

        response.setTimeout(timeoutMs, () => {
          response.destroy(new Error(`Response timed out after ${timeoutMs}ms`));
        });
        response.on('data', chunk => {
          const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          chunks.push(bufferChunk);
          streamBuffer += bufferChunk.toString('utf8');
          const processed = consumeEventStreamBuffer(streamBuffer, {
            onChunk(content) {
              streamContent += content;
              reportStreamingPreview(streamContent);
            },
            onDone() {
              streamDone = true;
            },
            onError(message) {
              streamErrorMessage = message;
            },
            onEvent() {
              streamHasEvents = true;
            },
          });
          streamBuffer = processed.remainder;
        });
        response.on('error', reject);
        response.on('end', () => {
          if (streamErrorMessage) {
            reject(new Error(streamErrorMessage));
            return;
          }
          if (streamBuffer.trim().length > 0) {
            const processed = consumeEventStreamBuffer(`${streamBuffer}\n\n`, {
              onChunk(content) {
                streamContent += content;
              },
              onDone() {
                streamDone = true;
              },
              onError(message) {
                streamErrorMessage = message;
              },
              onEvent() {
                streamHasEvents = true;
              },
            });
            streamBuffer = processed.remainder;
          }
          if (streamErrorMessage) {
            reject(new Error(streamErrorMessage));
            return;
          }
          if (streamHasEvents || streamDone || streamContent.length > 0) {
            resolve({
              payload: {
                choices: [
                  {
                    message: {
                      content: streamContent,
                    },
                  },
                ],
              },
              statusCode: response.statusCode ?? 0,
            });
            return;
          }

          const responseText = Buffer.concat(chunks).toString('utf8');
          let payload = {};
          try {
            payload = responseText.length > 0 ? JSON.parse(responseText) : {};
          } catch {
            payload = {};
          }

          resolve({
            payload,
            statusCode: response.statusCode ?? 0,
          });
        });
      }
    );

    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error(`Request timed out after ${timeoutMs}ms`));
    });
    request.on('error', reject);
    request.write(body);
    request.end();
  });
}

function consumeEventStreamBuffer(buffer, handlers) {
  let remainder = buffer;

  while (true) {
    const boundaryIndex = findEventBoundary(remainder);
    if (boundaryIndex === -1) {
      return { remainder };
    }

    const eventBlock = remainder.slice(0, boundaryIndex);
    remainder = remainder.slice(boundaryIndex).replace(/^\r?\n\r?\n/, '');
    consumeEventBlock(eventBlock, handlers);
  }
}

function consumeEventBlock(eventBlock, handlers) {
  const lines = eventBlock.split(/\r?\n/);
  const dataLines = [];

  for (const line of lines) {
    if (!line.startsWith('data:')) {
      continue;
    }
    dataLines.push(line.slice('data:'.length).trimStart());
  }

  if (dataLines.length === 0) {
    return;
  }

  handlers.onEvent();
  const data = dataLines.join('\n');
  if (data === '[DONE]') {
    handlers.onDone();
    return;
  }

  let payload;
  try {
    payload = JSON.parse(data);
  } catch {
    return;
  }

  const errorMessage = payload?.error?.message;
  if (typeof errorMessage === 'string' && errorMessage.length > 0) {
    handlers.onError(errorMessage);
    return;
  }

  const choice = payload?.choices?.[0];
  const content = choice?.delta?.content ?? choice?.message?.content;
  if (typeof content === 'string' && content.length > 0) {
    handlers.onChunk(content);
  }
}

function findEventBoundary(buffer) {
  const unixBoundary = buffer.indexOf('\n\n');
  const windowsBoundary = buffer.indexOf('\r\n\r\n');
  if (unixBoundary === -1) return windowsBoundary;
  if (windowsBoundary === -1) return unixBoundary;
  return Math.min(unixBoundary, windowsBoundary);
}

function printDryRun({ plan, sourceChanged, targetMdx }) {
  reportProgress(`Dry run for ${path.relative(REPO_ROOT, plan.targetPath)}`);
  if (sourceChanged) {
    reportProgress(
      `Source normalization would update ${path.relative(REPO_ROOT, plan.sourcePath)} first`
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
  NVIDIA_NIM_TIMEOUT_MS       Optional request timeout override in milliseconds (default: 1800000)

Config files:
  .env                        Automatically loaded from the project root if present
  .env.example                Starter template for local configuration

Compatibility:
  OPENAI_API_KEY              Fallback alias for the bearer token, if already set

Behavior:
  Existing target files are skipped by default
  Pass --overwrite to replace an existing translation
`);
}

export const __testOnly = {
  buildRequestHeaders,
  formatError,
  formatStreamingPreview,
  getExistingTargetBehavior,
  parseEventStreamPayload,
  parseArgs,
  resolveTimeoutMs,
};

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
  main().catch(error => {
    console.error(`translate-blog-post failed: ${formatError(error)}`);
    process.exitCode = 1;
  });
}

function formatError(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (!(error instanceof Error) || error.cause === undefined) {
    return message;
  }

  const causeMessage = formatErrorCause(error.cause);
  if (!causeMessage || causeMessage === message) {
    return message;
  }

  return `${message} (cause: ${causeMessage})`;
}

function formatErrorCause(cause) {
  if (cause instanceof Error) {
    return cause.message;
  }

  if (typeof cause === 'string') {
    return cause;
  }

  if (cause && typeof cause === 'object') {
    if ('code' in cause && typeof cause.code === 'string') {
      return cause.code;
    }
    if ('message' in cause && typeof cause.message === 'string') {
      return cause.message;
    }
  }

  return String(cause);
}

function parseEventStreamPayload(responseText) {
  let content = '';
  let errorMessage;

  consumeEventStreamBuffer(responseText, {
    onChunk(chunk) {
      content += chunk;
    },
    onDone() {},
    onError(message) {
      errorMessage = message;
    },
    onEvent() {},
  });

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return {
    choices: [
      {
        message: {
          content,
        },
      },
    ],
  };
}

function formatStreamingPreview(content) {
  const normalized = content.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return '';
  }

  const maxLength = 80;
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const lines = content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  let lineTail = '';

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const candidate = lineTail ? `${lines[index]} ${lineTail}` : lines[index];
    if (candidate.length > maxLength) {
      break;
    }
    lineTail = candidate;
  }

  if (lineTail) {
    return `...${lineTail}`;
  }

  const words = normalized.split(' ');
  let tail = '';

  for (let index = words.length - 1; index >= 0; index -= 1) {
    const candidate = tail ? `${words[index]} ${tail}` : words[index];
    if (candidate.length > maxLength) {
      break;
    }
    tail = candidate;
  }

  return `...${tail}`;
}
