# Hoja de ruta del producto

La hoja de ruta de cada repositorio describe ese proyecto. En este archivo, el repositorio de Agentic Workbench describe su propia hoja de ruta. Las versiones no implican fechas ni una promesa de implementación automática.

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

Estado: completado.

## V0.2 — Estado del repositorio

**Objetivo:** ofrecer una vista resumida del estado declarado por cada repositorio.

Alcance propuesto:
- Mostrar el roadmap del repositorio seleccionado.
- Resumir planes y tareas en curso y elementos completados.
- Mostrar hitos y enlazar cada elemento con su documento fuente.
- Leer una estructura común que todos los repositorios incorporados acuerden seguir.
- No mantener en Workbench una copia de los estados del repositorio.

La estructura documental y las reglas para representar estados, tareas e hitos deben definirse antes de implementar esta versión. No se ha fijado todavía un mecanismo de actualización automática.

## V0.3 — Trazabilidad de funcionalidades

**Objetivo:** hacer navegable el ciclo documentado de cada funcionalidad.

Alcance propuesto:
- Relacionar requisitos, criterios de aceptación, planes, tareas y evidencias.
- Mostrar dependencias, bloqueos y resultados de verificación declarados en los documentos.
- Detectar referencias y estados ausentes o inconsistentes.

## V0.4 — Git y aislamiento de tareas

**Objetivo:** facilitar la revisión de cambios y el aislamiento del trabajo.

Alcance propuesto:
- Historial de commits y comparación de ramas.
- Diferencias por archivo y vistas vinculadas a tareas.
- Gestión controlada de ramas y worktrees, con confirmación humana para operaciones mutables.
- Integración opcional con Pull Requests si aporta valor al flujo local.

## Fuera del alcance actual

- Ejecutar o controlar agentes CLI desde Workbench.
- Integraciones por proveedor, normalización de eventos de agentes y orquestación multiagente.
- Mantener tareas o estados en una base de datos separada de los archivos del repositorio.
- Inferir actividad de agentes a partir de cambios de archivos.

Las integraciones de agentes podrán reconsiderarse mediante una nueva decisión si aparece una necesidad concreta.

## Condiciones para avanzar entre fases

- La fase anterior debe aportar valor y pasar sus controles de calidad.
- La estructura común debe probarse con el repositorio de Workbench y otro repositorio antes de ampliar el soporte.
- Las reglas de lectura deben tratar el contenido del repositorio como datos no confiables.
- Las operaciones de escritura o Git mutables requieren decisiones de seguridad y confirmación humana.
- Se prefiere completar un flujo vertical pequeño frente a crear pantallas vacías para todas las áreas.
