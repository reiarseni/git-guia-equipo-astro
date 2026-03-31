// Service Worker — Git Guía Equipo
// Estrategia: install-time shell + stale-while-revalidate + progressive background cache

const CACHE = 'git-guia-v5';
const BASE  = '/git-guia-equipo-astro';

// ── Shell: se cachea en install (bloquea hasta tenerlo) ──────────
const SHELL = [
  BASE + '/',
  BASE + '/offline.html',
];

// ── Páginas en orden de prioridad ────────────────────────────────
const PAGES = [
  BASE + '/estructura-de-ramas/',
  BASE + '/workitems-y-ramas/',
  BASE + '/nombrado-de-ramas/',
  BASE + '/flujo-diario/',
  BASE + '/rebase/',
  BASE + '/commits/',
  BASE + '/pull-requests/',
  BASE + '/merge-strategy/',
  BASE + '/draft-prs/',
  BASE + '/release/',
  BASE + '/hotfix/',
  BASE + '/cicd-branch-protection/',
  BASE + '/code-review/',
  BASE + '/reglas-generales/',
];

// ── Install: shell + primera página (crítico) ────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll([...SHELL, PAGES[0]]))
    // NO skipWaiting aquí — esperamos a que el cliente confirme la actualización
  );
});

// ── Activate: purga cachés viejas → claim → background caching ───
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => backgroundCache())
  );
});

// ── Message: el cliente puede pedir skipWaiting ──────────────────
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Cachea las páginas restantes una a una con pausa entre requests.
async function backgroundCache() {
  const cache = await caches.open(CACHE);
  for (const url of PAGES.slice(1)) {
    const hit = await cache.match(url);
    if (!hit) {
      try {
        const res = await fetch(url);
        if (res.ok) await cache.put(url, res);
      } catch { /* sin red, reintentar en próxima activación */ }
    }
    await sleep(400);
  }
}

// ── Fetch ────────────────────────────────────────────────────────
self.addEventListener('fetch', (e) => {
  const { request } = e;

  if (request.method !== 'GET') return;
  if (!request.url.startsWith(self.location.origin + BASE)) return;
  if (request.url.includes('/sw.js')) return;

  e.respondWith(
    request.mode === 'navigate'
      ? handleNavigation(request)
      : handleAsset(request)
  );
});

// Stale-While-Revalidate para páginas HTML
async function handleNavigation(request) {
  const url = new URL(request.url);

  if (!url.pathname.endsWith('/') && !url.pathname.split('/').pop().includes('.')) {
    return Response.redirect(url.origin + url.pathname + '/' + url.search, 301);
  }

  const cache  = await caches.open(CACHE);
  const cached = await matchNormalized(cache, request);

  const TIMEOUT_MS = 3000;
  const fetchWithTimeout = Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
    )
  ]);

  const network = fetchWithTimeout
    .then(res => { if (res.ok) cache.put(request, res.clone()); return res; })
    .catch(() => null);

  if (cached) {
    network.catch(() => {});
    return cached;
  }

  const fresh = await network;
  if (fresh && fresh.ok) return fresh;

  const offline = await cache.match(BASE + '/offline.html');
  return offline ?? new Response('<h1>Offline</h1>', {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

// Cache-First para assets estáticos (JS, CSS, fuentes, imágenes)
async function handleAsset(request) {
  const cache  = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    return new Response('', { status: 503 });
  }
}

async function matchNormalized(cache, request) {
  const direct = await cache.match(request);
  if (direct) return direct;

  const url = new URL(request.url);
  if (!url.pathname.endsWith('/')) {
    return cache.match(url.origin + url.pathname + '/' + url.search);
  }
  return null;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
