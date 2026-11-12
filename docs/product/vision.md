# Visión del producto

## Propósito

Agentic Workbench es un visor local del estado continuo de un proyecto de software. Lee la estructura y documentación del repositorio para reunir en una aplicación la información sobre requisitos, planes, tareas, hitos, roadmap y cambios.

## Problema

El estado de un proyecto suele estar repartido entre documentos, tareas, código y Git. Cuesta responder con rapidez:

- ¿Qué trabajo está en curso y qué plan lo organiza?
- ¿Qué hitos y tareas se completaron y dónde está registrada su evidencia?
- ¿Qué viene después según el roadmap del proyecto?
- ¿Qué cambios hay en el repositorio y cómo se relacionan con el trabajo documentado?

Workbench presenta estas respuestas a partir de los archivos del repositorio. La información del repositorio es la fuente de verdad; Workbench la organiza y enlaza, sin mantener una copia paralela de su estado.

## Usuario inicial

Desarrollador individual que trabaja en varios repositorios y quiere entender el estado de cada proyecto desde un espacio local. Todos los repositorios que se incorporen seguirán una estructura documental común. Workbench se probará primero con su propio repositorio y después con otro repositorio.

## Propuesta de valor

Una aplicación local que reúne cuatro vistas del mismo proyecto:

1. Proyecto: estructura, documentación y configuración.
2. Requisitos y planes: alcance, trabajo en curso, bloqueos y progreso declarado.
3. Roadmap e hitos: prioridades y trabajo completado según la documentación del repositorio.
4. Cambios: estado Git y diferencias vinculadas a la evidencia documental disponible.

Las vistas deben enlazar a sus archivos de origen y distinguir los datos explícitos de la información ausente o inconsistente. No se infiere que una tarea se completó solo porque hayan cambiado archivos.

## Principios de producto

- Local-first: los repositorios y sus documentos permanecen en el equipo del usuario.
- Repositorio como fuente de verdad: los estados del proyecto se leen de archivos versionables; no se duplican en una base de datos de Workbench.
- Lectura progresiva: el usuario puede consultar los documentos originales desde cada vista.
- Sin dependencia de un LLM: Workbench organiza información declarada y no necesita llamar a una API de modelos.
- Observabilidad honesta: se muestran los estados y cambios observables; no se inventan tareas, relaciones ni evidencias.
- Herramientas independientes: los agentes y CLI se utilizan fuera de Workbench. Sus resultados se reflejan en la medida en que queden registrados en el repositorio.
- Simplicidad: se implementan capacidades que mejoren la lectura del proyecto, no integraciones de proveedores sin una necesidad demostrada.
- Sin colaboración remota ni telemetría en el alcance local inicial.

## No es

- No es un IDE ni pretende competir con editores existentes.
- No ejecuta ni controla agentes CLI.
- No sustituye el terminal, Git ni los documentos del proyecto.
- No es una plataforma cloud ni un servicio multiusuario.
- No conoce actividad que no esté reflejada en los archivos o en Git.
- No muestra razonamiento privado de modelos ni infiere acciones que no hayan ocurrido.

## Alcance inicial

La V0.1 permite registrar repositorios, explorar archivos, consultar documentación, visualizar requisitos y planes y revisar Git en modo de solo lectura. Las siguientes versiones enriquecerán la vista del estado continuo a partir de una convención documental compartida y definida antes de implementar su lector.

Los agentes pueden modificar el repositorio desde herramientas externas. Workbench vuelve a consultar la información cuando se refresca; la actualización automática requiere una decisión y un requisito propios.

## Criterio de éxito

El usuario puede abrir cualquiera de sus repositorios conformes a la estructura acordada y comprender qué trabajo está en curso, qué se completó, qué viene después y qué cambios existen, con enlaces a la información fuente y sin actualizar un estado duplicado en Workbench.
