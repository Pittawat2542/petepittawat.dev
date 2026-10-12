/* Lightweight service worker optimized for GitHub Pages
 * - Adds long-lived runtime caching for hashed Astro assets and images
 * - Keeps HTML fresh (network-first) while enabling fast repeat visits
 */
const SW_VERSION = 'v2026-10-static-listings-01';
const RUNTIME_CACHE = `runtime-${SW_VERSION}`;

self.addEventListener('install', (event) => {
  // Activate immediately after install
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith('runtime-') && !k.endsWith(SW_VERSION)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

function isHashedAstroAsset(url) {
  return url.origin === location.origin && (url.pathname.startsWith('/_astro/') || url.pathname.startsWith('/listing-assets/blog/'));
}

function isLongLivedImage(url) {
  if (url.origin !== location.origin) return false;
  return url.pathname.startsWith('/og/') || url.pathname.startsWith('/files/');
}

function isFontRequest(url) {
  return (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  );
}

function isHTMLRequest(req) {
  return req.mode === 'navigate' || (req.destination === 'document');
}

function isJSON(req, url) {
  return req.destination === 'document' ? false : (url.pathname.endsWith('.json') || url.pathname.includes('/search.json'));
}

// Strategies
async function cacheFirst(event) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(event.request);
  if (cached) return cached;
  const resp = await fetch(event.request);
  if (resp && resp.ok) event.waitUntil(cache.put(event.request, resp.clone()));
  return resp;
}

async function staleWhileRevalidate(event) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(event.request);
  const fetchPromise = fetch(event.request)
    .then((resp) => { if (resp && resp.ok) event.waitUntil(cache.put(event.request, resp.clone())); return resp; })
    .catch(() => cached);
  event.waitUntil(fetchPromise.then(() => undefined));
  return cached || fetchPromise;
}

async function networkFirst(event) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const resp = await fetch(event.request);
    if (resp && resp.ok) event.waitUntil(cache.put(event.request, resp.clone()));
    return resp;
  } catch (e) {
    const cached = await cache.match(event.request);
    if (cached) return cached;
    // Optional: offline fallback could be returned here
    throw e;
  }
}

// Register a lifetime promise during dispatch, before async cache reads begin.
function respond(event, response) {
  event.respondWith(response);
  event.waitUntil(response.then(() => undefined, () => undefined));
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Hashed Astro assets: cache-first (safe to cache long-term)
  if (isHashedAstroAsset(url)) {
    respond(event, cacheFirst(event));
    return;
  }

  // Long-lived images
  if (isLongLivedImage(url) || request.destination === 'image') {
    respond(event, staleWhileRevalidate(event));
    return;
  }

  // Google Fonts: cache CSS SWR, fonts cache-first
  if (isFontRequest(url)) {
    if (url.hostname === 'fonts.googleapis.com') {
      respond(event, staleWhileRevalidate(event));
    } else {
      respond(event, cacheFirst(event));
    }
    return;
  }

  // JSON (e.g., search index): SWR
  if (isJSON(request, url)) {
    respond(event, staleWhileRevalidate(event));
    return;
  }

  // HTML/documents: network-first for freshness
  if (isHTMLRequest(request)) {
    respond(event, networkFirst(event));
    return;
  }
});

