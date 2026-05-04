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
