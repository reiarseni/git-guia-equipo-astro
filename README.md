# Git — Guía de Buenas Prácticas

Guía oficial del flujo de trabajo con Git y GitLab para equipos de desarrollo.
Disponible en: **https://reiarseni.github.io/git-guia-equipo-astro/**

---

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/
npm run preview    # previsualiza el build
npx astro check    # type-check TypeScript
```

---

## Despliegue

El sitio se despliega automáticamente en **GitHub Pages** al hacer push a `main`
mediante GitHub Actions (`.github/workflows/deploy.yml`).

Para activarlo por primera vez en un fork:
1. **Settings → Pages → Source** → seleccionar `GitHub Actions`
2. Hacer push a `main` para disparar el primer deploy

---

## Contenido (16 secciones)

| Grupo | Secciones |
|---|---|
| Ramas | Estructura de Ramas · Workitems y Ramas · Nombrado de Ramas |
| Flujo de Trabajo | Flujo de Trabajo Diario · Merge como Estrategia |
| Commits y PRs | Commits · Pull Requests · Merge Strategy · Draft PRs |
| Releases | Versionado y Tags · Flujo HotFix |
| Calidad | CI/CD y Branch Protection · Code Review · Reglas Generales · Gitignore · Trazabilidad de Testing |

---

## Arquitectura

```
src/
├── components/
│   ├── Footer.astro          # Pie de página
│   ├── PageNav.astro         # Navegación anterior/siguiente
│   ├── PwaInstallPrompt.astro# Prompt de instalación PWA
│   ├── Section.astro         # Wrapper de sección de contenido
│   └── Sidebar.astro         # Navegación lateral
├── data/
│   └── sections.ts           # Fuente de verdad de rutas y grupos
├── layouts/
│   └── Layout.astro          # Layout principal (sidebar + PWA + SW)
├── pages/
│   ├── index.astro           # Portada con índice
│   └── *.astro               # 16 páginas de contenido
└── styles/
    └── global.css            # Variables CSS, dark theme, componentes
public/
├── icons/                    # Iconos SVG para PWA
├── manifest.json             # Web App Manifest
└── sw.js                     # Service Worker (cache-first)
```

**Patrón de cada página de contenido:**
```astro
const idx = N; // posición en sections[]
<Layout title="...">
  <Sidebar slot="sidebar" />
  <div class="container">
    <Section title="..." id="...">...</Section>
    <PageNav prev={sections[idx-1]} next={sections[idx+1]} />
    <Footer />
  </div>
</Layout>
```

Para añadir una nueva sección: registrarla primero en `src/data/sections.ts`.

---

## PWA

El sitio es instalable como Progressive Web App en Android, iOS y Desktop:

- **Android / Chrome / Edge** — prompt nativo de instalación
- **iOS Safari** — instrucciones paso a paso (Share → Añadir a inicio)
- **Anti-spam** — no vuelve a mostrar el prompt si se rechazó 2 veces o en los últimos 7 días
- **Service Worker** — estrategia cache-first, funciona offline tras la primera visita

Para resetear el estado del prompt en desarrollo:
```js
localStorage.removeItem('pwa-install-state')
```

---

## Roadmap

Próximas features planeadas. Requieren migrar a **Supabase** como backend
(client-side, compatible con GitHub Pages).
Ver guía de implementación detallada en [`dinamic-features-guide.md`](./dinamic-features-guide.md).

### Progreso de lectura
- Seguimiento anónimo por dispositivo (UUID en localStorage)
- Secciones leídas marcadas con checkmark en el sidebar
- Badge "X / 16 secciones completadas"

### Comentarios, dudas y sugerencias
- Auth con GitHub OAuth (solo usuarios en lista aprobada)
- Tres tipos de entrada: 💬 Comentario · ❓ Duda · 💡 Sugerencia
- Visibles para todos, identificados con avatar y username de GitHub
- Soporte para bloques de código con ` ``` `
- Actualizaciones en tiempo real (Supabase Realtime)
- Borrado por autor o por admin

### Quiz de evaluación
- Disponible para usuarios logueados y aprobados
- 10 preguntas · 10 puntos cada una · total 100 pts
- Evaluación por sección del flujo de trabajo
- Resultado con desglose: secciones aprobadas vs. a repasar
- Historial de intentos guardado por usuario
- Umbrales: ✅ 90–100 listo · ⚠️ 70–89 casi · ❌ <70 repasar
