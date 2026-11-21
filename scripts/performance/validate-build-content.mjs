import assert from 'node:assert/strict';
import { SaxesParser } from 'saxes';

const contentNamespace = 'http://purl.org/rss/1.0/modules/content/';
const archiveRoutes = { project: 'projects', publication: 'publications', talk: 'talks' };

export function validateRss(xml) {
  const parser = new SaxesParser({ xmlns: true });
  const stack = [];
  let language;
  let item;
  let itemCount = 0;
  let articleCount = 0;
  parser.on('opentag', tag => {
    stack.push({ name: tag.name, uri: tag.uri, local: tag.local, text: '' });
    if (stack.map(element => element.name).join('/') === 'rss/channel/item') {
      item = { link: '', article: false };
    }
  });
  const appendText = text => {
    const element = stack.at(-1);
    if (element) element.text += text;
  };
  parser.on('text', appendText);
  parser.on('cdata', appendText);
  parser.on('closetag', () => {
    const element = stack.pop();
    const path = stack.map(parent => parent.name).join('/');
    if (path === 'rss/channel' && element.name === 'language') {
      language = element.text.trim();
    }
    if (item && path === 'rss/channel/item') {
      if (element.name === 'link') item.link = element.text.trim();
      if (element.uri === contentNamespace && element.local === 'encoded') {
        item.article = Boolean(element.text.trim());
      }
    }
    if (item && path === 'rss/channel' && element.name === 'item') {
      assert(/^https?:\/\//.test(item.link), 'RSS item requires an absolute article link');
      itemCount++;
      if (item.article) articleCount++;
      item = undefined;
    }
  });
  parser.write(xml).close();
  assert.equal(language, 'en', 'RSS channel language');
  assert(itemCount > 0 && articleCount > 0, 'RSS requires items and namespaced article content');
}

export function validateSearchAnchors(items, routeHtml) {
  const idsByRoute = new Map(
    [...routeHtml].map(([route, html]) => [
      route,
      new Set([...html.matchAll(/<[^>]+\sid="([^"]+)"/g)].map(match => match[1])),
    ])
  );
  const origin = 'https://local.invalid';
  let checked = 0;
  for (const { type, title, localizedUrl } of items) {
    if (!Object.hasOwn(archiveRoutes, type)) continue;
    const error = `Broken search anchor for "${title}": ${localizedUrl}`;
    assert(typeof localizedUrl === 'string' && localizedUrl.trim(), error);
    const url = URL.parse(localizedUrl, origin);
    const route = archiveRoutes[type];
    assert(url?.origin === origin && url.pathname.replace(/\/$/, '') === `/${route}`, error);
    assert(url.hash && idsByRoute.get(route)?.has(url.hash.slice(1)), error);
    checked++;
  }
  return checked;
}
