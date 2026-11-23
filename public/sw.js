// Service worker: makes the app open offline and keeps what you've read.
//
// - Pages (HTML): network first, so you always get the latest deploy when
//   online. If the network is down or very slow, the last copy you opened is
//   used, and failing that a small offline page.
// - Next's build files (/_next/static): cache first. Their names change with
//   every deploy, so a cached copy is never out of date.
// - Hacker News API: network first, falling back to the last response, so
//   lists, posts and comments you've seen load offline.
// - Other files of ours (icons, svgs, manifest): served from cache and
//   refreshed in the background.
//
// Bump VERSION only to throw away every cache (e.g. after changing how
// responses are stored). Normal deploys don't need it.
const VERSION = "v1";
const SHELL = `shell-${VERSION}`;
const STATIC = `static-${VERSION}`;
const PAGES = `pages-${VERSION}`;
const DATA = `data-${VERSION}`;
const CACHES = [SHELL, STATIC, PAGES, DATA];

const OFFLINE_URL = "/offline.html";
const SHELL_FILES = [
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Rough caps so the caches don't grow forever. Oldest entries go first.
const LIMITS = { [STATIC]: 300, [PAGES]: 150, [DATA]: 2000 };
// How long a page waits for the network before using a cached copy.
const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(SHELL_FILES.map((url) => new Request(url, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((name) => !CACHES.includes(name)).map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    // Next's client-side navigation data. Left to the network: if it fails,
    // Next falls back to a full page load, which the page handler covers.
    if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;

    if (request.mode === "navigate") {
      event.respondWith(page(event));
    } else if (url.pathname.startsWith("/_next/static/")) {
      event.respondWith(cacheFirst(event, STATIC));
    } else if (!url.pathname.startsWith("/_next/") && !url.pathname.startsWith("/api/")) {
      event.respondWith(staleWhileRevalidate(event, SHELL));
    }
    return;
  }

  if (isHackerNewsApi(url)) {
    event.respondWith(networkFirst(event, DATA));
  }
});

function isHackerNewsApi(url) {
  return url.hostname.endsWith("firebaseio.com") && url.pathname.endsWith(".json");
}

async function page(event) {
  const { request } = event;
  // Started before any await so the page still gets saved if we answer from
  // the cache first because the network was slow.
  const network = fetch(request);
  const saved = network.then(async (response) => {
    if (response.ok && response.type === "basic") {
      await put(await caches.open(PAGES), PAGES, request, response.clone());
    }
  });
  event.waitUntil(saved.catch(() => {}));

  const cached = await caches.open(PAGES).then((cache) => cache.match(request, { ignoreVary: true }));
  try {
    // With nothing cached there's no point giving up on a slow network.
    return cached ? await withTimeout(network, NETWORK_TIMEOUT_MS) : await network;
  } catch {
    if (cached) return cached;
    const offline = await caches.match(OFFLINE_URL);
    return offline ?? Response.error();
  }
}

async function networkFirst(event, cacheName) {
  const { request } = event;
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) event.waitUntil(put(cache, cacheName, request, response.clone()));
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirst(event, cacheName) {
  const { request } = event;
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) event.waitUntil(put(cache, cacheName, request, response.clone()));
  return response;
}

async function staleWhileRevalidate(event, cacheName) {
  const { request } = event;
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request).then((response) => {
    if (response.ok && response.type === "basic") {
      return cache.put(request, response.clone()).then(() => response);
    }
    return response;
  });
  if (cached) {
    event.waitUntil(network.catch(() => {}));
    return cached;
  }
  return network;
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

// Trimming reads every key, so only do it every so often.
let putsSinceTrim = 0;

async function put(cache, cacheName, request, response) {
  await cache.put(request, response);
  if (++putsSinceTrim < 25) return;
  putsSinceTrim = 0;
  const limit = LIMITS[cacheName];
  if (!limit) return;
  const keys = await cache.keys();
  // keys() lists entries in the order they were added.
  await Promise.all(keys.slice(0, Math.max(0, keys.length - limit)).map((key) => cache.delete(key)));
}
