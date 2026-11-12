# Registros de decisiones de arquitectura (ADR)

Un ADR propuesto todavía no es una regla aceptada.

| ID | Decisión | Estado |
|---|---|---|
| ADR-0001 | Estrategia de monorepo y workspaces | Aceptado |
| ADR-0002 | Stack tecnológico de frontend | Aceptado |
| ADR-0003 | Stack backend de la plantilla | Sustituido para este producto |
| ADR-0004 | Plataforma de alojamiento compartida | No aplicable a la ejecución local |
| ADR-0005 | Arquitectura local-first de Agentic Workbench | Aceptado |
| ADR-0006 | Estrategia de integración de agentes CLI | Aplazado |
| ADR-0007 | Seguridad simple y persistencia local para V0.1 | Aceptado |
| ADR-0008 | El repositorio como fuente del estado del proyecto | Propuesto |

ADR-0001 y ADR-0002 se conservan como base de ingeniería. Las decisiones heredadas sobre PostgreSQL, Better Auth y despliegue en Hetzner no se aplican a la arquitectura inicial de Workbench.

Utiliza docs/templates/adr.md para registrar nuevas decisiones. No modifiques silenciosamente una decisión aceptada: sustitúyela mediante un nuevo ADR.
