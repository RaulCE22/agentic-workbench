# Progreso: V0.1 — Project Workspace

- Requisitos: REQ-001
- Plan: ./plan.md
- Última actualización: 2026-11-10

## Estado actual

No iniciado.

## Trabajo completado

- Adaptada la documentación heredada a la identidad de Agentic Workbench.
- Definida la visión del producto y la hoja de ruta incremental.
- Aceptada la arquitectura local-first.
- Registrada la estrategia de integración de agentes como propuesta pendiente de pruebas técnicas.
- Creado el requisito REQ-001 y el plan inicial de V0.1.

## Cambios realizados

Solo documentación de producto, arquitectura y planificación. No se ha generado código de aplicación.

## Verificación

| Comando/comprobación | Resultado | Notas |
|---|---|---|
| pnpm run verify | No ejecutado | Debe ejecutarse en un checkout local con Node.js 24 y pnpm 10 |
| Pruebas de aplicación | No ejecutadas | Todavía no existe aplicación |

## Decisiones y descubrimientos

- No usar la arquitectura PostgreSQL/Better Auth/Hetzner heredada: el producto es local y de un solo usuario.
- Cursor y Antigravity documentan ACP; Codex App Server sigue marcado como experimental; Claude Code expone SDK/stream-json.
- No se debe empezar a implementar adaptadores antes de validar versiones y permisos.

## Preguntas abiertas / bloqueos

- Driver y ORM SQLite.
- Seguridad de la API local y autenticación de la instancia.
- Política de selección de carpetas y symlinks.
- Estrategia Git y pruebas E2E.

## Siguiente paso

Realizar el análisis técnico de las decisiones pendientes de V0.1 y aprobar el plan antes de generar código de aplicación.
