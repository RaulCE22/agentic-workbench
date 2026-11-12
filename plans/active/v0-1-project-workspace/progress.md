# Progreso: V0.1 — Project Workspace

- Requisitos: REQ-001
- Plan: ./plan.md
- Última actualización: 2026-11-12

## Estado actual

Listo para revisión. Las áreas funcionales y las pruebas automatizadas están implementadas. El smoke test HTTP pasó al ejecutar el servidor con permisos de loopback; la revisión visual en navegador queda pendiente.

## Trabajo completado

- Aprobado REQ-001 y el plan; decisiones simplificadas registradas en ADR-0007.
- Implementados servidor Hono loopback, API con contratos Zod, frontend React y catálogo de proyectos persistido fuera de los repositorios.
- Implementados explorador acotado, visor Markdown/Mermaid sanitizado, catálogo REQ con planes relacionados y consultas Git de solo lectura.
- Añadidas pruebas para persistencia, origen local, traversal/symlinks, archivos sensibles, Markdown, catálogo y estado/diff Git.

## Cambios realizados

- `apps/api/`: servidor, almacenamiento JSON, rutas seguras, Git y API.
- `apps/web/`: navegación React, vistas de proyecto, archivos, documentación, requisitos y Git.
- `packages/contracts/`: esquemas compartidos Zod.
- `docs/`: decisiones, arquitectura y puesta en marcha actualizadas.
- `package.json`, manifests por workspace y lockfile: scripts de desarrollo, lint, pruebas y build.

## Verificación

| Comando/comprobación | Resultado | Notas |
|---|---|---|
| `pnpm install --store-dir /Users/raulcalleescuredo/Library/pnpm/store/v10 --offline` | Correcto | Workspace enlazado desde el store existente; sin descarga adicional en la reconciliación final. |
| `pnpm run verify` | Correcto | Documentación y workspace. |
| `pnpm run typecheck` | Correcto | Contratos, API y frontend. |
| `pnpm run lint` | Correcto | ESLint sin errores. |
| `pnpm run test` | Correcto | 10 pruebas API y 1 prueba web. |
| `pnpm run build` | Correcto con aviso | Bundle genera un chunk Mermaid de 1.5 MB, usado bajo demanda para diagramas. |
| `node apps/api/dist/main.js` | Correcto con permisos de loopback | Inició en `127.0.0.1:4173`; se detuvo al terminar las peticiones. |
| `curl -fsS http://127.0.0.1:4173/api/health` | Correcto | Respondió `{"status":"ok"}`. |
| `curl -fsS http://127.0.0.1:4173/` | Correcto | Sirvió `index.html` del bundle compilado. |
| Revisión visual en navegador | No ejecutada | Falta comprobar visualmente el flujo desde el navegador. |

## Decisiones y descubrimientos

- Persistencia JSON local, sin SQLite ni ORM; acceso por origen/Host exactos y sin CORS.
- Symlinks se excluyen del árbol y se rechazan cuando salen de la raíz; archivos sensibles conocidos y binarios no se muestran.
- Git usa argumentos separados, sin shell, sin configuración global y con timeout/límite de salida.
- Mermaid se carga solo si el documento incluye diagramas; la aplicación no requiere recursos remotos.

## Preguntas abiertas / bloqueos

- Ninguna decisión técnica pendiente para V0.1. Solo falta la inspección visual del flujo en navegador.

## Siguiente paso

Abrir `http://127.0.0.1:4173` con `pnpm dev` para la inspección visual final.
