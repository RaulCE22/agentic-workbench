# Decisiones de arquitectura pendientes

Estas cuestiones están abiertas deliberadamente. Los agentes no deben resolverlas por suposición.

| ID | Tema | Posición actual | Resolver antes de |
|---|---|---|---|
| API-01 | Actualización de vistas | La V0.1 consulta al refrescar; no hay eventos asíncronos | Si se requiere actualización automática |
| UX-01 | Empaquetado | Aplicación web local primero; Tauri/Electron no seleccionados | Distribución a otros equipos |

## Convención documental aprobada

- La documentación del proyecto y los planes están organizados bajo `docs/`, incluidos `docs/plans/active/` y `docs/plans/completed/`.
- Se conservarán fuera de `docs/` los archivos Markdown que deban permanecer en una ubicación raíz o técnica para que el repositorio y sus herramientas funcionen, como README e instrucciones de agentes.
- Las tareas se registran dentro del plan que las agrupa.
- El roadmap enlaza a requisitos y planes; no mantiene un estado duplicado por hito. Workbench deriva el hito solo de los estados de sus planes enlazados.
- El estado del plan resume su trabajo y verificaciones; los estados de tareas ofrecen detalle y sirven para detectar inconsistencias.
- El estado de aprobación de un requisito no representa el progreso de implementación.
- Cada hito del roadmap tiene título, objetivo y enlaces explícitos a requisitos y planes; las fechas son opcionales y no se guarda estado manual.
- Solo se reconocen los valores de estado definidos en REQ-002. Ante campos ausentes, valores no reconocidos, referencias rotas o contradicciones, Workbench informa de datos incompletos o inconsistentes sin elegir un estado ni reparar relaciones.

### Vocabulario inicial de estados

- Requisito: `Borrador`, `Aprobado`, `Retirado`.
- Tarea: `Pendiente`, `En curso`, `Bloqueada`, `Completada`.
- Plan: `Pendiente`, `En curso`, `Bloqueado`, `Listo para revisión`, `Completado`; el campo `Aprobación` es independiente (`Pendiente`, `Aprobado`, `No necesaria`).
- Hito derivado: `Planificado`, `En curso`, `Bloqueado`, `Completado`.
- Un hito está `Bloqueado` si algún plan enlazado está bloqueado; `Completado` si todos sus planes están completados; `En curso` si algún plan enlazado ha empezado; en otro caso está `Planificado`. Sin planes enlazados se muestra `Planificado`. Si la información falta o se contradice, se informa como incompleta y no se asigna un estado derivado.

### Metadatos mínimos

- Requisito: estado de aprobación documental.
- Plan: requisitos relacionados, estado de ejecución y campo de aprobación separado.
- Tarea: descripción, estado y criterios de aceptación relacionados; se define dentro del plan.
- Roadmap/hito: título y enlaces a requisitos y planes; no incluye un campo de estado. Workbench deriva el estado únicamente de los planes enlazados.
- Progreso: registro y evidencias; no duplica el estado vigente del plan.

## Decisiones aplazadas

La ejecución y observación de agentes CLI no forman parte del enfoque actual. Los puntos AG-01–AG-05 sobre procesos, protocolos, eventos y sesiones se conservan como temas de ADR-0006 y solo se reabrirán si se prioriza esa capacidad.

Las decisiones DB-01/02, SEC-01, FS-01/02, GIT-01 y QA-01 para V0.1 se cerraron en [ADR-0007](../decisions/ADR-0007-v0-1-seguridad-y-persistencia-local.md). La persistencia inicial usa JSON local; no se eligió todavía una solución de base de datos para versiones futuras.

## Proceso para cerrar una decisión

1. Revisar documentación oficial de la versión instalada.
2. Construir una prueba de concepto pequeña cuando exista riesgo de integración.
3. Evaluar seguridad, mantenimiento, portabilidad y coste.
4. Registrar la elección en un ADR.
5. Actualizar arquitectura y este registro.

No conviertas una integración experimental en dependencia estable sin fijar una versión de referencia y comprobar los flujos críticos.
