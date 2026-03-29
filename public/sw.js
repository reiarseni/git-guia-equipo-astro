// Service Worker — Git Guía Equipo
// CACHE_VERSION se puede reemplazar en el build con el SHA de Git actual
const CACHE_VERSION = 'git-guia-v1';
const BASE = '/git-guia-equipo-astro/';

const PRECACHE_URLS = [BASE];

// ── Instalación ────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activación: limpia cachés antiguas ─────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first, red como fallback ──────────────
self.addEventListener('fetch', (e) => {
  // Solo interceptar requests del mismo origen
  if (!e.request.url.startsWith(self.location.origin)) return;
  // Solo GET
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((response) => {
        // Cachear solo respuestas válidas
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(e.request, toCache));
        return response;
      });
    })
  );
});
