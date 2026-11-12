# Decisiones de arquitectura pendientes

Estas cuestiones están abiertas deliberadamente. Los agentes no deben resolverlas por suposición.

| ID | Tema | Posición actual | Resolver antes de |
|---|---|---|---|
| API-01 | Canal de eventos | No se usan eventos asíncronos en V0.1 | Primer evento asíncrono |
| PROC-01 | Gestión de procesos | Spawn, PTY, señales, timeout, entorno y PATH en procesos iniciados desde GUI | Primer lanzamiento CLI |
| AG-01 | Contrato común de eventos | Definir envoltorio común sin perder payloads específicos | Primer adaptador de agente |
| AG-02 | ACP | Versiones, métodos y extensiones realmente soportadas por Cursor y Antigravity | Primer adaptador ACP |
| AG-03 | Codex App Server | Protocolo aún experimental; fijar versión y estrategia de compatibilidad | Integración Codex estable |
| AG-04 | Claude Code | Evaluar SDK/stream-json y su capacidad de interacción/permiso | Integración Claude Code |
| AG-05 | Persistencia de sesiones | Qué datos se guardan, retención y limpieza de salidas sensibles | Historial de sesiones |
| UX-01 | Empaquetado | Aplicación web local primero; Tauri/Electron no seleccionados | Distribución a otros equipos |

Las decisiones DB-01/02, SEC-01, FS-01/02, GIT-01 y QA-01 para V0.1 se cerraron en [ADR-0007](../decisions/ADR-0007-v0-1-seguridad-y-persistencia-local.md). La persistencia inicial usa JSON local; no se eligió todavía una solución de base de datos para versiones futuras.

## Proceso para cerrar una decisión

1. Revisar documentación oficial de la versión instalada.
2. Construir una prueba de concepto pequeña cuando exista riesgo de integración.
3. Evaluar seguridad, mantenimiento, portabilidad y coste.
4. Registrar la elección en un ADR.
5. Actualizar arquitectura y este registro.

No conviertas una integración experimental en dependencia estable sin fijar una versión de referencia y comprobar los flujos críticos.
