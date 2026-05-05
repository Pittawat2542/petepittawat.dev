import assert from 'node:assert/strict';
import test from 'node:test';

import { __testOnly } from './translate-blog-post.mjs';

test('parseArgs ignores a standalone double-dash separator', () => {
  const options = __testOnly.parseArgs(['--', 'src/content/blog/wisdom.mdx', 'en'], {
    defaultModel: 'moonshotai/kimi-k2.6',
  });

  assert.equal(options.sourcePath, 'src/content/blog/wisdom.mdx');
  assert.equal(options.targetLang, 'en');
});

test('skips an existing target file by default outside dry-run mode', () => {
  assert.equal(
    __testOnly.getExistingTargetBehavior({
      dryRun: false,
      overwrite: false,
      targetExists: true,
    }),
    'skip'
  );
});

test('keeps overwrite semantics when target file already exists', () => {
  assert.equal(
    __testOnly.getExistingTargetBehavior({
      dryRun: false,
      overwrite: true,
      targetExists: true,
    }),
    'write'
  );
});

test('does not skip dry-run output when target file already exists', () => {
  assert.equal(
    __testOnly.getExistingTargetBehavior({
      dryRun: true,
      overwrite: false,
      targetExists: true,
    }),
    'write'
  );
});

test('formats nested error causes for terminal output', () => {
  const error = new Error('fetch failed', { cause: { code: 'ENOTFOUND' } });

  assert.equal(__testOnly.formatError(error), 'fetch failed (cause: ENOTFOUND)');
});

test('uses the configured request timeout when provided via env', () => {
  assert.equal(__testOnly.resolveTimeoutMs('900000'), 900000);
});

test('falls back to the default request timeout when env is unset', () => {
  assert.equal(__testOnly.resolveTimeoutMs(undefined), 1800000);
});

test('rejects invalid timeout values from env', () => {
  assert.throws(() => __testOnly.resolveTimeoutMs('abc'), /NVIDIA_NIM_TIMEOUT_MS/);
});

test('parses streamed SSE chat completion payloads', () => {
  const payload = __testOnly.parseEventStreamPayload(
    [
      'data: {"choices":[{"delta":{"content":"{\\"title\\":\\"Hello\\","}}]}',
      '',
      'data: {"choices":[{"delta":{"content":"\\"excerpt\\":\\"Summary\\",\\"bodyMdx\\":\\"# Heading\\\\n\\\\nBody\\"}"}}]}',
      '',
      'data: [DONE]',
      '',
    ].join('\n')
  );

  assert.deepEqual(payload, {
    choices: [
      {
        message: {
          content: '{"title":"Hello","excerpt":"Summary","bodyMdx":"# Heading\\n\\nBody"}',
        },
      },
    ],
  });
});

test('formats a readable streaming preview tail', () => {
  const preview = __testOnly.formatStreamingPreview(
    'Prefix words that should fall off once the preview is truncated.\n' +
      'Second line\n\nThird line with extra words for preview visibility.'
  );

  assert.equal(preview, '...Second line Third line with extra words for preview visibility.');
});

test('builds streaming-friendly request headers', () => {
  const headers = __testOnly.buildRequestHeaders('test-key');

  assert.deepEqual(headers, {
    Authorization: 'Bearer test-key',
    Accept: 'text/event-stream, application/json',
    'Content-Type': 'application/json',
  });
});
