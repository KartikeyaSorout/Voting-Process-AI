'use strict';
/**
 * ElectIQ — Service Worker
 * Cache-first for static assets, network-first for API calls.
 * @version 1.1.0
 */

const CACHE_NAME    = "electiq-v1.1.0";
const DYNAMIC_CACHE = "electiq-dynamic-v1.1.0";
const MAX_DYNAMIC_CACHE_SIZE = 50;

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/js/auth.js",
  "/js/chat.js",
  "/js/quiz.js",
  "/js/timeline.js",
  "/js/news.js",
  "/js/firebase-config.js",
  "/manifest.json"
];

/* ── Install ── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

/* ── Activate: clean old caches ── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== DYNAMIC_CACHE)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/**
 * Limit dynamic cache size to prevent storage bloat.
 * @param {string} cacheName
 * @param {number} maxItems
 */
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys  = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxItems);
  }
}

/* ── Fetch: cache-first for static, network-first for API ── */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // Network-first for API calls
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .catch(() => new Response(
          JSON.stringify({ error: "offline", reply: "You appear to be offline. Please check your connection." }),
          { headers: { "Content-Type": "application/json" } }
        ))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.status === 200 && response.type !== "opaque") {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, clone);
            trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
          });
        }
        return response;
      });
    })
  );
});
