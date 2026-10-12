import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';

// Local-only diagnostic server. Never included in the deployed site.
// Usage: node scripts/performance/serve-benchmark.mjs dist 4330 --mobile
const root = resolve(process.argv[2] ?? 'dist');
const port = Number(process.argv[3] ?? 4330);
const mobile = process.argv.includes('--mobile');
const failFirst = process.argv.includes('--fail-first');
const reducedMotion = process.argv.includes('--reduced-motion');
const failModule = process.argv.includes('--fail-module');
const delayHeader = process.argv.includes('--delay-header');
const attempts = new Map();
let searchRecovered = false;
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};
let nextChunk = 0;
const pause = ms => new Promise(done => setTimeout(done, ms));
const instrumentation = `<aside id="benchmark" style="position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#071018;color:white;padding:8px;font:12px monospace;max-height:40vh;overflow:auto"><button id="run-benchmark" style="border:1px solid;padding:4px">Measure filters</button><button id="recover-search">Allow search retry</button><button id="find-last-card">Find last card</button><pre id="benchmark-report">Loading…</pre></aside><script>
document.getElementById('recover-search').onclick = () => fetch('/__performance/recover-search');
const report = { network: ${JSON.stringify(mobile ? '1.6 Mbps aggregate, 150 ms latency, cold cache; no CPU slowdown' : 'local unthrottled')}, cards: 0, interactiveMs: null, lcpMs: null, filterMs: [] };
if (${reducedMotion}) {
  const nativeMedia = window.matchMedia.bind(window);
  window.matchMedia = query => {
    const media = nativeMedia(query);
    if (query.includes('prefers-reduced-motion')) Object.defineProperty(media, 'matches', {value:true});
    return media;
  };
  const nativeScroll = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function(options) { report.hashScrollBehavior = options?.behavior; return nativeScroll.call(this, options); };
  report.reducedMotion = true;
}
const output = () => document.getElementById('benchmark-report').textContent = JSON.stringify(report);
new PerformanceObserver(list => { report.lcpMs = Math.round(list.getEntries().at(-1).startTime); output(); }).observe({type:'largest-contentful-paint', buffered:true});
const ready = () => document.querySelector('[data-static-listing][data-initialized]') || (document.querySelector('astro-island') && !document.querySelector('astro-island[ssr]'));
const watch = setInterval(() => { if (!ready()) return; clearInterval(watch); report.cards = document.querySelectorAll('[data-listing-item]').length || document.querySelectorAll('.blog-card').length; report.interactiveMs = Math.round(performance.now()); output(); }, 20);
document.getElementById('run-benchmark').onclick = async () => {
  if (!ready()) return;
  const input = document.querySelector('input[placeholder*="Search"]');
  const status = document.querySelector('[data-results-count], .editorial-results-info');
  report.filterMs = [];
  for (const query of ['flutter', 'python', 'dart', 'ai', 'no-match-xyz', '', 'flutter', 'python', 'dart', 'ai', 'no-match-xyz', '']) {
    const previous = status.textContent; const start = performance.now();
    const changed = new Promise((done, fail) => {
      const observer = new MutationObserver(() => { if (status.textContent !== previous) { observer.disconnect(); clearTimeout(timeout); requestAnimationFrame(() => requestAnimationFrame(done)); } });
      const timeout = setTimeout(() => {observer.disconnect(); fail(new Error('Filter did not update'));}, 10000);
      observer.observe(status, {childList:true, subtree:true, characterData:true});
    });
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input, query);
    input.dispatchEvent(new Event('input', {bubbles:true}));
    try { await changed; } catch(error) { report.error = error.message; output(); return; }
    report.filterMs.push(Math.round((performance.now()-start)*10)/10); output();
  }
  report.maxFilterMs = Math.max(...report.filterMs); report.complete = true; output();
};
document.getElementById('find-last-card').onclick = () => {
  const cards = document.querySelectorAll('[data-listing-item]:not([hidden])');
  const target = cards[cards.length - 1];
  const title = target.querySelector('h3').textContent;
  report.browserFind = window.find(title, false, true, true);
  report.foundText = window.getSelection().toString();
  output();
};
output();
</script>`;
const fixture = `<script>
const content = document.querySelector('[data-listing-content]');
const originals = Array.from(content.querySelectorAll('[data-listing-item]'));
const featured = content.querySelector('[data-featured-list]');
const grid = content.querySelector('[data-grid-list]');
featured.replaceChildren(); grid.replaceChildren();
for (let i = 0; i < 500; i++) {
  const card = originals[i % originals.length].cloneNode(true);
  const meta = JSON.parse(card.dataset.meta); meta.id = 'fixture-' + i;
  card.id = meta.id; card.dataset.meta = JSON.stringify(meta);
  (i === 0 ? featured : grid).append(card);
}
</script>`;
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/__performance/recover-search') {
      searchRecovered = true;
      res.writeHead(200);
      res.end('Retry enabled');
      return;
    }
    if (failModule && !searchRecovered && /mount-search\..*\.js$/.test(url.pathname)) {
      res.writeHead(503);
      res.end('Simulated search module failure');
      return;
    }
    if (
      failFirst &&
      (url.pathname.startsWith('/listing-assets/') || url.pathname === '/search.json')
    ) {
      const attempt = (attempts.get(url.pathname) ?? 0) + 1;
      attempts.set(url.pathname, attempt);
      if (url.pathname === '/search.json' ? !searchRecovered : attempt <= 1) {
        res.writeHead(503);
        res.end('Simulated transient failure');
        return;
      }
    }
    if (url.pathname === '/sw.js') {
      res.writeHead(404);
      res.end();
      return;
    }
    const isFixture = url.pathname === '/__performance/500/';
    const isNoJS = url.pathname.startsWith('/__nojs/');
    const relative = isFixture
      ? '/blog/'
      : isNoJS
        ? url.pathname.slice('/__nojs'.length)
        : url.pathname;
    let path = resolve(join(root, decodeURIComponent(relative)));
    if (!path.startsWith(root + '/')) throw new Error('Invalid path');
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    let bytes = await readFile(path);
    if (delayHeader && /Header\.astro.*\.js$/.test(path))
      bytes = Buffer.from(
        'await new Promise(resolve => setTimeout(resolve, 4000));\n' + bytes.toString()
      );
    if (reducedMotion && extname(path) === '.css')
      bytes = Buffer.from(
        bytes.toString().replace(/@media\s*\(prefers-reduced-motion:\s*reduce\)/g, '@media all')
      );
    if (extname(path) === '.html') {
      let html = bytes.toString();
      if (isNoJS) html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
      else if (!url.searchParams.has('screenshot'))
        html = html.replace('</body>', (isFixture ? fixture : '') + instrumentation + '</body>');
      bytes = Buffer.from(html);
    }
    const compressed = /\.(?:html|js|css|json|svg)$/.test(path);
    if (compressed) bytes = gzipSync(bytes);
    res.writeHead(200, {
      'Content-Type': types[extname(path)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
      ...(compressed ? { 'Content-Encoding': 'gzip' } : {}),
    });
    if (mobile) await pause(150);
    for (let offset = 0; offset < bytes.length; offset += 16384) {
      const chunk = bytes.subarray(offset, offset + 16384);
      if (mobile) {
        const start = Math.max(Date.now(), nextChunk);
        nextChunk = start + chunk.length / 200;
        await pause(nextChunk - Date.now());
      }
      if (res.destroyed) break;
      res.write(chunk);
    }
    res.end();
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log('Diagnostic server: http://127.0.0.1:' + port));
