# Git — Guía de Buenas Prácticas

Guía oficial del flujo de trabajo con Git y GitLab para equipos de desarrollo.

## 🚀 Despliegue

Este proyecto está configurado para desplegarse automáticamente en **GitHub Pages**.

### Activar GitHub Pages

1. Ve a **Settings** → **Pages** del repositorio
2. En **Build and deployment** → **Source**, selecciona **Deploy from a branch**
3. Selecciona la rama **main** y la carpeta **/(root)**
4. Guarda los cambios

El sitio estará disponible en: `https://reiarseni.github.io/git-guia-equipo-astro/`

### Despliegue manual

```bash
npm install
npm run build
```

El resultado se genera en la carpeta `dist/`.

## 🛠️ Desarrollo local

```bash
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:4321`

## 📁 Estructura

```
src/
├── components/    # Componentes reutilizables
├── layouts/       # Layout principal
├── pages/         # Páginas Astro
└── styles/        # Estilos globales
```

## 📋 Contenido

La guía cubre:
- Estructura de ramas (main + testing)
- Workitems y ramas
- Nombrado de ramas
- Flujo de trabajo diario
- Rebase como estrategia
- Commits (Conventional Commits)
- Pull Requests
- Merge Strategy (Squash & Merge)
- Draft PRs
- Flujo HotFix
- CI/CD y Branch Protection
- Code Review
- Reglas Generales