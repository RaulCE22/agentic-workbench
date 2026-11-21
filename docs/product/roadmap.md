# Hoja de ruta del producto

La hoja de ruta de cada repositorio describe ese proyecto. En este archivo, el repositorio de Agentic Workbench describe su propia hoja de ruta. Las versiones no implican fechas ni una promesa de implementación automática.

Cada hito enlaza sus requisitos y planes. No se almacena un estado manual del hito: Workbench lo deriva de los estados de los planes enlazados. Las tareas se consultan dentro de cada plan y permiten señalar inconsistencias con su resumen.

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

Requisitos: [REQ-001](../requirements/REQ-001-local-project-workspace.md).
Planes: [Plan V0.1](../plans/completed/v0-1-project-workspace/plan.md), [Árbol y búsqueda de documentación](../plans/completed/documentation-tree-search/plan.md).

## V0.2 — Estado del repositorio

**Objetivo:** ofrecer una vista resumida del estado declarado por cada repositorio.

Alcance entregado:
- Mostrar el roadmap del repositorio seleccionado.
- Resumir planes y tareas en curso y elementos completados.
- Mostrar hitos y enlazar cada elemento con su documento fuente.
- Leer una estructura común que todos los repositorios incorporados acuerden seguir.
- No mantener en Workbench una copia de los estados del repositorio.

La convención documental, los estados reconocidos y el tratamiento de datos incompletos están implementados según REQ-002 y ADR-0008. El resumen se actualiza al solicitarlo; no hay actualización automática.

Requisitos: [REQ-002](../requirements/REQ-002-repository-project-state.md).
Planes: [Visor del estado del repositorio](../plans/completed/repository-project-state-viewer/plan.md).

## V0.3 — Estándares de ingeniería Frontend y Backend

**Objetivo:** establecer dos arquitecturas oficiales, documentadas, reutilizables y verificables para proyectos personales nuevos.

Alcance entregado:
- Definir FSD para frontend y monolito modular para backend, adaptados a los stacks decididos.
- Documentar responsabilidades, estructuras, dependencias, pruebas, contratos y validación.
- Crear skills compartidas para los agentes y estructuras iniciales reutilizables.
- Documentar cómo incorporar los estándares en repositorios nuevos; un proyecto full-stack combina ambos.
- Evaluar y configurar validadores automáticos frontend y backend.

Requisito: [REQ-003](../requirements/REQ-003-engineering-standards-frontend-backend.md).
Plan: [Estándares de ingeniería V0.3](../plans/completed/engineering-standards-v03/plan.md).

Los estándares, skills, esqueletos y validadores están publicados según REQ-003 y ADR-0009..0011. Los pilotos frontend y backend confirmaron las reglas cubiertas y el modo de fallo determinista de cada validador. La propuesta anterior de trazabilidad de funcionalidades queda aplazada, sin compromiso ni hito asignado.

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
