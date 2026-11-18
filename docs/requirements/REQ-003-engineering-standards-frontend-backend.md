# REQ-003: Estándares de ingeniería frontend y backend

- Estado: Aprobado
- Prioridad: Alta
- Responsable: Propietario del proyecto
- ADR relacionados: ADR-0009, ADR-0010, ADR-0011

## Propósito
Disponer de dos estándares arquitectónicos únicos, reutilizables y verificables para orientar el desarrollo de proyectos personales con los cuatro agentes CLI habituales, manteniendo separada la arquitectura local de Agentic Workbench.

## Alcance
- Incluye: estándares, skills agnósticas de proveedor, estructuras iniciales, mecanismos de validación y guía de adopción en repositorios nuevos.
- No incluye: generador, perfiles seleccionables, tercera arquitectura full-stack, refactor general de Workbench, cambio de su runtime o persistencia, ni aprobación automática de ADR propuestos.

## Actores y permisos
Desarrolladores y agentes que contribuyen a proyectos personales. Los agentes siguen AGENTS.md y las skills compartidas del repositorio.

## Requisitos funcionales
- RF-01: El estándar frontend define FSD adaptado al stack aprobado en ADR-0002.
- RF-02: El estándar backend define un monolito modular y explicita el estado propuesto y las decisiones abiertas de ADR-0003.
- RF-03: Cada estándar describe responsabilidades, estructura, dependencias, contratos públicos, pruebas y validación automatizada.
- RF-04: Existen skills `frontend-architecture` y `backend-architecture` concisas y portables entre Cursor, Antigravity, Codex y Claude Code.
- RF-05: Hay estructuras iniciales frontend y backend que reflejan los estándares y pueden copiarse sin depender de Workbench.
- RF-06: La documentación explica cómo incorporar cada estándar a un repositorio nuevo; un proyecto full-stack combina ambos.
- RF-07: Los documentos genéricos no sustituyen ni contradicen la arquitectura específica aceptada de Workbench.
- RF-08: V0.3 del roadmap se sustituye por esta reforma; V0.1/V0.2 siguen completadas y V0.4 conserva su alcance.

## Reglas de negocio
- RN-01: Solo hay una arquitectura oficial por cada parte; no hay perfiles ni alternativas seleccionables.
- RN-02: Better Auth solo se incluye en un proyecto que requiera autenticación.
- RN-03: No se modifica una decisión aceptada sin ADR de sustitución.
- RN-04: No se añade dependencia sin justificación y aprobación.

## Criterios de aceptación

### REQ-003-AC-01 — Estándar frontend
Dado un proyecto frontend nuevo, cuando un desarrollador o agente consulta el estándar, entonces puede decidir dónde ubicar rutas, páginas, funcionalidades, entidades, modelos, API, formularios, estilos y pruebas, respetando dependencias descendentes y APIs públicas.

### REQ-003-AC-02 — Estándar backend
Dado un backend nuevo, cuando se aplica el estándar, entonces los módulos de dominio encapsulan HTTP, aplicación, dominio e infraestructura según necesidad, no hay acceso HTTP directo a persistencia y se documentan transacciones, errores, configuración, seguridad y pruebas.

### REQ-003-AC-03 — Portabilidad
Dado un repositorio que no contiene Agentic Workbench, cuando recibe el paquete de adopción, entonces sus agentes pueden consultar estándares e instrucciones locales sin depender de enlaces a este repositorio.

### REQ-003-AC-04 — Validación
Dado un proyecto que incorpora los validadores aprobados, cuando ejecuta sus verificaciones frontend y backend, entonces las infracciones de estructura/dependencias cubiertas por esas herramientas hacen fallar el comando y se declaran expresamente los límites semánticos de cada validador.

### REQ-003-AC-05 — Separación Workbench
Dado el backend local actual, cuando se adopta la documentación V0.3, entonces conserva Hono, Node 24.15 y JSON local, sin PostgreSQL, Drizzle ni Better Auth impuestos.

### REQ-003-AC-06 — Roadmap e índices
Dado el roadmap actualizado, cuando se consultan sus hitos, entonces V0.3 describe esta reforma, V0.1/V0.2 permanecen entregadas, V0.4 mantiene su alcance y trazabilidad queda aplazada sin compromiso.

## Impacto en datos y API
- Datos: No cambia persistencia ni datos de Workbench.
- API/contratos: No cambia contratos de aplicación.
- Migración: No aplica.

## Requisitos no funcionales
Documentación en español; convenciones pragmáticas, deterministas, mantenibles y verificables; skills cortas y agnósticas de proveedor.

## Dependencias y preguntas abiertas
- Completar el piloto de Steiger para confirmar reglas y falsos positivos; el backend mantiene stack y POC condicionados a ADR-0003.
- Confirmar el backend stack tras la POC pendiente de ADR-0003, sin marcarlo aprobado por esta reforma.
- Piloto compatible de Steiger (beta) y comparación del validador backend de bajo coste.

## Trazabilidad
- Pruebas: pnpm run verify; revisión documental; verificaciones específicas que se definan durante implementación.
- Plan de implementación: docs/plans/active/engineering-standards-v03/plan.md
