# ADR-0006: Estrategia de integración de agentes CLI

- Estado: Propuesto
- Fecha: 2026-11-10
- Responsable de la decisión: Propietario del proyecto

## Contexto

Workbench debe iniciar y observar agentes de distintos proveedores, pero cada CLI expone capacidades y protocolos diferentes. La aplicación necesita una vista homogénea sin ocultar las diferencias ni depender de APIs de modelos externas.

## Evidencia técnica inicial

| CLI | Interfaz disponible según documentación oficial consultada | Implicación |
|---|---|---|
| Cursor Agent | agent acp; ACP sobre stdio con JSON-RPC 2.0 | Candidato a primer adaptador |
| Google Antigravity | agy acp; ACP sobre stdio | Candidato a primer adaptador |
| OpenAI Codex | codex app-server; stdio, WebSocket o Unix socket; documentación lo marca experimental | Integrar tras prueba técnica y fijar versión |
| Claude Code | SDK/CLI con entrada y salida stream-json | Adaptador específico; probar interacción y permisos |

Referencias:
- Cursor ACP: https://prod.cursor.com/docs/cli/acp
- Antigravity ACP: https://antigravity.google/docs/cli/acp
- Codex App Server: https://learn.chatgpt.com/docs/app-server
- Codex CLI reference: https://learn.chatgpt.com/docs/cli/reference
- Claude Code CLI: https://docs.anthropic.com/en/docs/claude-code/cli-usage
- Claude Code SDK: https://docs.anthropic.com/en/docs/claude-code/sdk

La disponibilidad, madurez y estabilidad pueden cambiar con las versiones instaladas.

## Decisión propuesta

Crear una capa interna de adaptadores con un ciclo de vida común, pero sin forzar un protocolo de transporte universal:

- Detección de CLI y versión.
- Inicio y cierre de proceso/sesión.
- Envío de mensajes cuando lo soporte.
- Recepción y preservación de eventos del proveedor.
- Traducción de eventos relevantes a un modelo común.
- Flujo de permisos y solicitudes del usuario.
- Cancelación y recuperación cuando estén soportadas.
- Asociación explícita con proyecto, funcionalidad y directorio de trabajo.

El modelo común no reemplaza ni descarta el mensaje original del proveedor. Cada evento conserva proveedor, versión, identificador de sesión, marca temporal, tipo original y payload.

## Eventos comunes previstos

- session.started, session.updated, session.completed, session.failed
- assistant.message
- tool.started, tool.output, tool.completed
- permission.requested, permission.resolved
- file.changed
- todo.updated
- plan.updated

La lista es orientativa y se concretará con evidencia de los protocolos. No se deben inventar eventos que el CLI no emita.

## Observabilidad y límites

Workbench mostrará mensajes, eventos de herramientas, resultados, permisos, tareas y cambios de archivos que el CLI o el sistema operativo expongan. No intentará representar razonamiento interno privado del modelo ni inferir qué está haciendo cuando no hay datos observables.

## Prueba de concepto requerida

1. Lanzar Cursor y Antigravity en ACP desde un proceso Node.
2. Completar inicialización, autenticación existente, creación de sesión y prompt.
3. Renderizar mensajes en streaming, eventos de herramientas y peticiones de permiso.
4. Verificar cancelación y cierre limpio del proceso.
5. Probar Codex App Server y registrar explícitamente las limitaciones de su estado experimental.
6. Evaluar Claude Code SDK/stream-json para sesiones, continuación y control de permisos.
7. Comparar la calidad de eventos de cada CLI y ajustar el contrato común sin perder información.

## Consecuencias

- No habrá un único adaptador genérico basado en parsing de texto de terminal.
- Las capacidades de la interfaz podrán variar por proveedor.
- La compatibilidad se probará y documentará por versión del CLI.
- El producto no necesita almacenar ni conocer credenciales de los proveedores.
- Los adaptadores se implementarán de forma incremental y no bloquearán la V0.1.
