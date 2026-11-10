# Agentic Workbench

Centro de control local para trabajar con proyectos de software y agentes de programación nativos.

**Un único espacio para entender el proyecto, seguir sus funcionalidades, observar a los agentes y revisar los cambios que producen.**

## Qué es

Agentic Workbench es una aplicación web local que se ejecuta en el equipo del desarrollador. Reúne:

- Proyectos: estructura de código, documentación y estado general.
- Funcionalidades: requisitos, planes, progreso y criterios de aceptación.
- Agentes: sesiones de Cursor, Antigravity, Codex y Claude Code; actividad observable, herramientas, permisos y archivos modificados.
- Documentación: Markdown, diagramas Mermaid, esquemas y referencias técnicas.
- Git: ramas, commits, estado del árbol de trabajo, diferencias, worktrees y revisión.

No pretende ser otro IDE, un proveedor de modelos ni una plataforma cloud. Los editores y CLI existentes siguen siendo responsables de ejecutar el trabajo. Workbench aporta visibilidad, contexto y control.

## Principios

1. Local-first: los proyectos y los datos permanecen en el equipo del usuario.
2. CLI nativos: se utilizan las instalaciones, cuentas, autenticaciones y cuotas de cada proveedor.
3. Proveedor independiente: el modelo puede cambiar sin cambiar el espacio de trabajo.
4. Observabilidad real: mostrar mensajes, eventos, llamadas a herramientas, permisos, resultados y cambios de archivos; nunca fingir acceso al razonamiento privado del modelo.
5. Control humano: ninguna operación destructiva, permiso sensible o cambio Git irreversible se ejecuta sin autorización explícita.
6. Seguridad por defecto: acceso limitado a carpetas registradas, servidor ligado a loopback y ejecución de procesos controlada.
7. Fuente de verdad en el repositorio: los requisitos, planes y decisiones permanecen versionados junto al código.
8. Simplicidad: monolito local modular antes que microservicios, servicios remotos o infraestructura innecesaria.

## Estado actual

El repositorio parte de la base de ingeniería agentic-engineering. Esta primera etapa adapta la documentación al producto y define el alcance de la V0.1. Todavía no contiene una aplicación ejecutable.

## Hoja de ruta

| Etapa | Resultado |
|---|---|
| V0.1 — Project Workspace | Proyectos, explorador de archivos, documentación, catálogo de funcionalidades y Git de solo lectura |
| V0.2 — Agent Center | Ejecutar y observar sesiones de los CLI nativos, eventos, permisos y archivos afectados |
| V0.3 — Feature Lifecycle | Planificación, tareas, progreso, criterios de aceptación y trazabilidad |
| V0.4 — Git & Worktrees | Ramas, diffs avanzados, operaciones Git controladas y espacios de trabajo aislados |
| V0.5 — Orquestación | Flujos multiagente, revisión cruzada y coordinación de tareas |

Consulta la visión del producto y la hoja de ruta en docs/product/.

## Arquitectura prevista

- Frontend: React, Vite, TypeScript, React Router, TanStack Query, shadcn/ui y Tailwind CSS.
- Backend local: Node.js y Hono.
- Persistencia local: SQLite; la elección del driver y del ORM se cerrará tras una prueba técnica.
- Contratos: Zod en los límites entre frontend y backend.
- Integración de agentes: adaptadores por CLI; ACP cuando esté disponible, protocolo específico cuando no lo esté.
- Git y procesos del sistema: invocados únicamente desde el backend local con argumentos validados.

El navegador se conectará a un servidor ejecutado en el propio equipo. No se contempla desplegar esta instancia en Hetzner ni exponerla públicamente.

## CLI objetivo

| Proveedor | Comando | Integración que se evaluará |
|---|---|---|
| Cursor | agent | ACP |
| Google Antigravity | agy | ACP |
| OpenAI Codex | codex | App Server |
| Anthropic Claude Code | claude | SDK / salida JSON en streaming |

Las integraciones están sujetas a validación con las versiones instaladas. Consulta docs/decisions/ADR-0006-integracion-agentes.md.

## Estructura del repositorio

- apps/web/: interfaz web.
- apps/api/: servidor local, acceso al sistema y procesos.
- packages/contracts/: contratos compartidos cuando existan consumidores reales.
- docs/product/: visión, alcance y hoja de ruta.
- docs/requirements/: requisitos funcionales.
- docs/architecture/: arquitectura y límites técnicos.
- docs/decisions/: decisiones de arquitectura (ADR).
- plans/: planes y seguimiento del trabajo.
- .agents/skills/: procedimientos compartidos para los CLI.
- scripts/engineering/: validaciones y utilidades deterministas.

## Desarrollo

Requisitos: Node.js 26 y pnpm 12. Consulta docs/architecture/runtime.md.

```bash
npm install --global pnpm@12.18.0
pnpm install
pnpm run verify
```

La aplicación aún no tiene comandos de ejecución. Se añadirán al implementar la V0.1.

## Privacidad y seguridad

- No se envía código a un backend propio ni se sincronizan proyectos con la nube.
- Workbench no usa claves API ni factura consumo de modelos por su cuenta.
- Las credenciales permanecen bajo el control de los CLI oficiales.
- El acceso al sistema de archivos y la ejecución de procesos pasan por el backend local.
- No se debe publicar el servidor local en una interfaz de red externa.
- Los logs y resultados de agentes pueden contener secretos: se consideran datos sensibles.

Consulta docs/quality/security-baseline.md.
