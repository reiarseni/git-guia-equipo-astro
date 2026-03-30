export interface SectionInfo {
  title: string;
  href: string;
  group: string;
}

export const sections: SectionInfo[] = [
  { title: "Estructura de Ramas",      href: "/estructura-de-ramas",    group: "Ramas" },
  { title: "Plan de Transición",       href: "/plan-de-transicion",     group: "Ramas" },
  { title: "Workitems y Ramas",        href: "/workitems-y-ramas",      group: "Ramas" },
  { title: "Nombrado de Ramas",        href: "/nombrado-de-ramas",      group: "Ramas" },
  { title: "Flujo de Trabajo Diario",  href: "/flujo-diario",           group: "Flujo de Trabajo" },
  { title: "Merge como Estrategia",    href: "/merge-como-estrategia",  group: "Flujo de Trabajo" },
  { title: "Commits",                  href: "/commits",                group: "Commits y PRs" },
  { title: "Pull Requests",            href: "/pull-requests",          group: "Commits y PRs" },
  { title: "Merge Strategy",           href: "/merge-strategy",         group: "Commits y PRs" },
  { title: "Draft PRs",                href: "/draft-prs",              group: "Commits y PRs" },
  { title: "Versionado y Tags",         href: "/versionado-y-tags",      group: "Releases" },
  { title: "Flujo HotFix",             href: "/hotfix",                 group: "Releases" },
  { title: "CI/CD y Branch Protection",href: "/cicd-branch-protection", group: "Calidad" },
  { title: "Code Review",              href: "/code-review",            group: "Calidad" },
  { title: "Reglas Generales",         href: "/reglas-generales",       group: "Calidad" },
  { title: "Gitignore",                href: "/gitignore",              group: "Calidad" },
  { title: "Trazabilidad de Testing",  href: "/trazabilidad-testing",   group: "Calidad" },
];

export const groups: { label: string; items: SectionInfo[] }[] = [
  { label: "Ramas",            items: sections.slice(0, 4)  },
  { label: "Flujo de Trabajo", items: sections.slice(4, 6)  },
  { label: "Commits y PRs",    items: sections.slice(6, 10)  },
  { label: "Releases",         items: sections.slice(10, 12) },
  { label: "Calidad",          items: sections.slice(12)    },
];
