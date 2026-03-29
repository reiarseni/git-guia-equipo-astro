// Service Worker — Git Guía Equipo
// Estrategia: install-time shell + stale-while-revalidate + progressive background cache

const CACHE = 'git-guia-v3';
const BASE  = '/git-guia-equipo-astro';

// ── Shell: se cachea en install (bloquea hasta tenerlo) ──────────
const SHELL = [
  BASE + '/',
  BASE + '/offline.html',
];

// ── Páginas en orden de prioridad ────────────────────────────────
// La primera se cachea en install junto al shell.
// Las demás se cachean progresivamente en background tras activate.
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
      .then(() => self.skipWaiting())
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

// Cachea las páginas 2-14 una a una con pausa entre requests.
// No bloquea la activación; corre en segundo plano.
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

  // Solo GET dentro del scope de la app
  if (request.method !== 'GET') return;
  if (!request.url.startsWith(self.location.origin + BASE)) return;
  // No interceptar el propio SW
  if (request.url.includes('/sw.js')) return;

  e.respondWith(
    request.mode === 'navigate'
      ? handleNavigation(request)
      : handleAsset(request)
  );
});

// Stale-While-Revalidate para páginas HTML
// → normaliza trailing slash (evita ERR_FAILED por 301 de GitHub Pages)
// → sirve desde caché inmediatamente (sin esperar red)
// → actualiza la caché en segundo plano
// → si no hay caché y falla la red → offline.html
async function handleNavigation(request) {
  const url = new URL(request.url);

  // GitHub Pages emite 301 para rutas sin trailing slash.
  // Resolver aquí evita que el browser reciba una respuesta redirect
  // que puede derivar en ERR_FAILED en algunos contextos de SW.
  if (!url.pathname.endsWith('/') && !url.pathname.split('/').pop().includes('.')) {
    return Response.redirect(url.origin + url.pathname + '/' + url.search, 301);
  }

  const cache  = await caches.open(CACHE);
  const cached = await matchNormalized(cache, request);

  // Fetch en background para mantener caché actualizada
  const network = fetch(request)
    .then(res => { if (res.ok) cache.put(request, res.clone()); return res; })
    .catch(() => null);

  if (cached) {
    network.catch(() => {}); // fire-and-forget, silenciar errores
    return cached;
  }

  // Sin caché → esperar red
  const fresh = await network;
  if (fresh && fresh.ok) return fresh;

  // Sin red y sin caché → página offline
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

// Intenta cachear con y sin trailing slash para tolerar ambos formatos de URL
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
