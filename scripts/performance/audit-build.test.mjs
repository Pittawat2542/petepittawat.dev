import assert from 'node:assert/strict';
import test from 'node:test';

const validFeed =
  '<rss xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><language>en</language><item><link>https://example.com/post/</link><content:encoded>Article</content:encoded></item></channel></rss>';

test('RSS accepts a well-formed feed and rejects the original malformed declaration', async () => {
  const { validateRss } = await import('./validate-build-content.mjs');
  assert.doesNotThrow(() => validateRss(validFeed));
  assert.throws(() =>
    validateRss(
      validFeed.replace(
        '<item>',
        '<xmlns:content="http://purl.org/rss/1.0/modules/content/"/><item>'
      )
    )
  );
});

test('collection search URLs must resolve to an existing ID in the expected archive', async () => {
  const { validateSearchAnchors } = await import('./validate-build-content.mjs');
  const html = new Map([['publications', '<li id="publication-example"></li>']]);
  const publication = {
    type: 'publication',
    title: 'Example paper',
    localizedUrl: '/publications#publication-example',
  };
  assert.equal(validateSearchAnchors([publication], html), 1);
  for (const localizedUrl of [
    undefined,
    '/publications',
    '/publications#missing',
    '/talks#publication-example',
  ]) {
    assert.throws(
      () => validateSearchAnchors([{ ...publication, localizedUrl }], html),
      /Example paper/
    );
  }
});
