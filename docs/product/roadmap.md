# Hoja de ruta del producto

La hoja de ruta está organizada por capacidades que aportan valor por sí mismas. Las versiones no implican fechas ni una promesa de implementación automática.

## V0.1 — Project Workspace

**Objetivo:** convertir el repositorio local en un espacio de trabajo navegable.

Incluye:
- Registro y selección de varios proyectos locales.
- Explorador de estructura de carpetas y archivos.
- Lectura segura de archivos de texto y código.
- Visor de Markdown, enlaces internos y diagramas Mermaid.
- Catálogo de requisitos y planes siguiendo las convenciones documentales del repositorio.
- Vista Git de solo lectura: rama, estado, ficheros modificados y diff.
- Persistencia local de proyectos registrados y preferencias.

No incluye:
- Lanzamiento de agentes.
- Edición de código o documentos desde Workbench.
- Escritura, staging, commit, merge o push de Git.
- Worktrees.
- Ejecución de comandos arbitrarios.
- Sincronización remota, login cloud o colaboración.

## V0.2 — Agent Center

**Objetivo:** ejecutar y observar los CLI admitidos desde la interfaz.

Incluye:
- Detección y configuración de ejecutables CLI.
- Inicio, cancelación y seguimiento de sesiones.
- Integraciones específicas para Cursor, Antigravity, Codex y Claude Code.
- Flujo de eventos normalizado y preservación de eventos originales.
- Mensajes visibles, llamadas a herramientas, salida, errores, permisos y cambios de archivos.
- Aprobación y rechazo de permisos desde la interfaz cuando el protocolo lo soporte.
- Historial local de sesiones y relación con proyectos.

Condición: cada adaptador debe superar una prueba técnica con una versión concreta del CLI. No se debe prometer paridad entre proveedores.

## V0.3 — Feature Lifecycle

**Objetivo:** gestionar el ciclo completo de una funcionalidad.

Incluye:
- Fichas de funcionalidades y requisitos.
- Planes, tareas, bloqueos y progreso.
- Criterios de aceptación y evidencias de verificación.
- Sesiones de agentes vinculadas a funcionalidades.
- Historial de actividad y trazabilidad requisito → plan → sesión → cambios.

## V0.4 — Git & Worktrees

**Objetivo:** revisar y controlar cambios desde el espacio de trabajo.

Incluye:
- Historial de commits y comparación de ramas.
- Creación y gestión controlada de ramas.
- Creación de worktrees por tarea o agente.
- Diff por archivo y vista de cambios.
- Stage, commit y merge con confirmación humana.
- Detección de conflictos y guía de resolución.
- Integración opcional con Pull Requests.

## V0.5 — Orquestación

**Objetivo:** coordinar tareas con varios agentes sin perder aislamiento ni trazabilidad.

Incluye:
- Descomposición explícita de una funcionalidad en tareas.
- Asignación a agentes y ejecución paralela en worktrees aislados.
- Dependencias entre tareas y estados de bloqueo.
- Revisión independiente por otro agente.
- Integración controlada de resultados.
- Panel global de recursos, sesiones y actividad.

## Condiciones para avanzar entre fases

- La fase anterior debe aportar valor y pasar sus controles de calidad.
- Las integraciones externas necesitan una prueba técnica reproducible.
- Las decisiones de seguridad se resuelven antes de habilitar escritura o ejecución.
- No se introduce automatización multiagente hasta que el aislamiento de carpetas y la trazabilidad funcionen.
- Se prefiere completar un flujo vertical pequeño frente a crear pantallas vacías para todas las áreas.
