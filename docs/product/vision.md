# Visión del producto

## Propósito

Agentic Workbench es un centro de control local para el desarrollo de software asistido por agentes. Reúne en una única aplicación el contexto del proyecto, el ciclo de vida de las funcionalidades, la actividad observable de los agentes y la revisión de cambios.

## Problema

Cuando se utilizan varios CLI y herramientas de programación agéntica, la información queda repartida entre terminales, editores, archivos Markdown, tareas, ramas Git y paneles de cada proveedor. Cuesta responder preguntas básicas:

- ¿Qué agentes están trabajando ahora y en qué proyecto?
- ¿Qué tarea o funcionalidad está intentando resolver cada uno?
- ¿Qué ha hecho realmente y qué herramientas ha utilizado?
- ¿Qué archivos ha leído o modificado?
- ¿Está bloqueado esperando permiso o necesita una respuesta?
- ¿Qué criterios de aceptación siguen pendientes?
- ¿Qué cambios hay en el repositorio y cómo se relacionan con la funcionalidad?

Workbench debe dar una visión coherente de ese trabajo sin sustituir los CLI ni los editores que ya funcionan.

## Usuario inicial

Desarrollador individual que trabaja en varios repositorios, utiliza distintos agentes CLI y quiere conservar el control del diseño, el contexto, la ejecución y la revisión. La primera versión prioriza un único usuario y un único equipo local. No se diseña todavía para colaboración multiusuario.

## Propuesta de valor

Una aplicación local que conecta cuatro vistas del mismo trabajo:

1. Proyecto: estructura de código, documentación, diagramas, configuración y estado Git.
2. Funcionalidad: requisito, plan, tareas, progreso, criterios de aceptación y evidencias.
3. Agente: proveedor, modelo declarado por el CLI, sesión, mensajes visibles, herramientas, permisos, resultados y archivos afectados.
4. Cambios: ramas, commits, diferencias, worktrees, revisión y entrega.

La unidad principal de trabajo es la funcionalidad o tarea, no la conversación aislada con un modelo. Las sesiones de agentes deben poder vincularse a esa unidad.

## Principios de producto

- Local-first: el código, la documentación, la base de datos y el historial de trabajo se mantienen en el equipo del usuario.
- CLI nativos: cada proveedor conserva su autenticación, configuración, permisos, cuotas y modelo.
- Sin dependencia de un LLM: Workbench no necesita llamar a una API de modelos para funcionar.
- Observabilidad, no telepatía: se presentan eventos emitidos por las herramientas, salidas, llamadas, permisos y cambios detectables. No se intenta mostrar razonamiento interno privado ni inferir acciones que no hayan ocurrido.
- Trazabilidad: las acciones del agente se relacionan con proyectos, funcionalidades, sesiones, archivos y commits cuando exista evidencia.
- Control humano: el usuario puede inspeccionar, pausar, cancelar y aprobar las acciones sensibles.
- Aislamiento: las tareas concurrentes que escriben código deben ejecutarse en carpetas o worktrees separados.
- Fuentes abiertas: los requisitos, ADR y planes permanecen como archivos versionables en cada repositorio.
- Progresividad: primero visibilidad del proyecto; después ejecución y observabilidad de agentes; finalmente automatización y orquestación.

## No es

- No es un IDE ni pretende competir con Cursor, VS Code o Antigravity.
- No es un agente ni un modelo de lenguaje.
- No es un sustituto del terminal: los CLI continúan siendo ejecutables desde la terminal.
- No es una plataforma cloud ni un servicio multiusuario.
- No es un sistema de telemetría que envíe código o conversaciones a terceros.
- No promete registrar eventos que un CLI no exponga.
- No muestra el razonamiento privado interno del modelo.

## Alcance inicial

La V0.1 permitirá registrar repositorios locales, explorar su estructura, consultar documentos y diagramas, visualizar funcionalidades documentadas y revisar el estado y los diffs de Git en modo de solo lectura. No ejecutará agentes ni modificará archivos.

Las siguientes fases incorporarán los adaptadores de CLI, la gestión de sesiones, el ciclo de vida de funcionalidades, operaciones Git y coordinación de varios agentes.

## Criterio de éxito

El usuario puede abrir un proyecto y comprender rápidamente qué contiene, qué funcionalidades están definidas, en qué estado se encuentran y qué cambios Git existen; después puede incorporar agentes sin tener que reorganizar sus repositorios ni renunciar a sus CLI nativos.
