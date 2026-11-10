# Decisiones de arquitectura pendientes

Estas cuestiones están abiertas deliberadamente. Los agentes no deben resolverlas por suposición.

| ID | Tema | Posición actual | Resolver antes de |
|---|---|---|---|
| DB-01 | Driver SQLite | Comparar better-sqlite3, node:sqlite y alternativas compatibles con Drizzle | Primera persistencia |
| DB-02 | ORM y migraciones | Drizzle es candidato; confirmar coste/beneficio en SQLite | Primer esquema persistente |
| SEC-01 | Autenticación de la instancia local | Token de instancia/cookie local, validación Host/Origin y protección CSRF | Primera API accesible desde navegador |
| FS-01 | Alta y autorización de proyectos | El usuario registra una ruta; canonicalización, symlinks y exclusiones | Primer explorador de archivos |
| FS-02 | Archivos sensibles | Definir exclusión de secretos, límites de tamaño y vista previa binaria | Primer visor de archivos |
| GIT-01 | Integración Git | execFile con Git CLI frente a librería; salida estructurada y límites | Primer panel Git |
| API-01 | Canal de eventos | SSE como preferencia inicial frente a WebSocket | Primer evento asíncrono |
| PROC-01 | Gestión de procesos | Spawn, PTY, señales, timeout, entorno y PATH en procesos iniciados desde GUI | Primer lanzamiento CLI |
| AG-01 | Contrato común de eventos | Definir envoltorio común sin perder payloads específicos | Primer adaptador de agente |
| AG-02 | ACP | Versiones, métodos y extensiones realmente soportadas por Cursor y Antigravity | Primer adaptador ACP |
| AG-03 | Codex App Server | Protocolo aún experimental; fijar versión y estrategia de compatibilidad | Integración Codex estable |
| AG-04 | Claude Code | Evaluar SDK/stream-json y su capacidad de interacción/permiso | Integración Claude Code |
| AG-05 | Persistencia de sesiones | Qué datos se guardan, retención y limpieza de salidas sensibles | Historial de sesiones |
| UX-01 | Empaquetado | Aplicación web local primero; Tauri/Electron no seleccionados | Distribución a otros equipos |
| QA-01 | E2E | Elegir herramienta para probar browser + API + filesystem | Primer flujo vertical crítico |

## Proceso para cerrar una decisión

1. Revisar documentación oficial de la versión instalada.
2. Construir una prueba de concepto pequeña cuando exista riesgo de integración.
3. Evaluar seguridad, mantenimiento, portabilidad y coste.
4. Registrar la elección en un ADR.
5. Actualizar arquitectura y este registro.

No conviertas una integración experimental en dependencia estable sin fijar una versión de referencia y comprobar los flujos críticos.
