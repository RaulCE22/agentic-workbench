# Decisiones de arquitectura pendientes

Estas cuestiones están abiertas deliberadamente. Los agentes no deben resolverlas por suposición.

| ID | Tema | Posición actual | Resolver antes de |
|---|---|---|---|
| REPO-01 | Convención documental común | Definir ubicaciones, metadatos e identificadores para roadmap, planes, tareas e hitos | Aprobación del requisito de vista de estado |
| REPO-02 | Estados y finalización | Definir vocabulario, transiciones y qué evidencia permite declarar un elemento completado | Implementación del lector de estado |
| REPO-03 | Documentación inconsistente | Definir cómo presentar datos ausentes, referencias rotas y estados contradictorios | Aprobación de criterios de aceptación |
| API-01 | Actualización de vistas | La V0.1 consulta al refrescar; no hay eventos asíncronos | Si se requiere actualización automática |
| UX-01 | Empaquetado | Aplicación web local primero; Tauri/Electron no seleccionados | Distribución a otros equipos |

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
