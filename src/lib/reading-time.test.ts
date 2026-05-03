import assert from 'node:assert/strict';
import test from 'node:test';

import { estimateReadingMetrics } from './reading-time.ts';

test('counts Thai text without relying on spaces', () => {
  const metrics = estimateReadingMetrics('ภาษาไทยไม่มีเว้นวรรค');

  assert.deepEqual(metrics, {
    wordCount: 5,
    readingTimeMin: 1,
  });
});

test('keeps English word counts stable for plain prose', () => {
  const metrics = estimateReadingMetrics('Hello world from Astro');

  assert.deepEqual(metrics, {
    wordCount: 4,
    readingTimeMin: 1,
  });
});

test('counts mixed Thai and English segments together', () => {
  const metrics = estimateReadingMetrics('สวัสดีชาว Astro developers');

  assert.deepEqual(metrics, {
    wordCount: 4,
    readingTimeMin: 1,
  });
});

test('ignores MDX scaffolding while preserving reader-visible text', () => {
  const prose = ['หัวข้อใหญ่', 'สวัสดีชาว Astro developers', 'Read more', 'สวัสดีชาวโลก'].join(
    '\n'
  );

  const mdx = [
    "import Callout from '@/components/content/Callout';",
    '',
    '# หัวข้อใหญ่',
    'สวัสดีชาว Astro developers',
    '',
    '[Read more](https://example.com)',
    '',
    '<Callout type="tip" title="Thanks" />',
    '<Figure',
    '  src={diagram}',
    '  alt="diagram"',
    '/>',
    '',
    '```html',
    '<p>สวัสดี<wbr />ชาวโลก</p>',
    '```',
  ].join('\n');

  assert.deepEqual(estimateReadingMetrics(mdx), estimateReadingMetrics(prose));
});
