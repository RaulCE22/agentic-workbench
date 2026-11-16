# REQ-002: Estado del proyecto desde el repositorio

- Estado: Aprobado
- Prioridad: Alta
- Responsable: Propietario del proyecto
- ADR relacionados: ADR-0005, ADR-0007, ADR-0008

## Propósito

Permitir que el usuario comprenda el estado continuo de un proyecto desde los documentos de su repositorio, sin mantener una copia paralela del estado en Workbench.

## Alcance

### Incluye
- Presentar el roadmap del repositorio seleccionado.
- Resumir el plan y las tareas declaradas como en curso.
- Mostrar hitos y tareas declarados como completados.
- Enlazar los datos presentados con sus documentos fuente.
- Leer una estructura documental común ubicada bajo `docs/` y seguida por todos los repositorios registrados.
- Mantener las tareas dentro del plan que las organiza y derivar el estado del hito desde los estados de los planes enlazados.
- Representar cada hito del roadmap con título, objetivo y enlaces explícitos a requisitos y planes; no se requieren fechas ni un estado manual.

### No incluye
- Ejecutar, observar o integrar agentes CLI.
- Inferir estados a partir de cambios de código, conversaciones o procesos externos.
- Editar documentos del proyecto desde Workbench.
- Persistir estados de tareas, planes o hitos en una base de datos separada del repositorio.
- Interpretar documentación arbitraria que no siga la convención soportada.

## Actores y permisos

El usuario local consulta proyectos que registró explícitamente. El backend solo puede leer recursos dentro de las raíces autorizadas.

## Requisitos funcionales

### RF-01 — Consultar el estado declarado

Al seleccionar un proyecto, el usuario puede consultar un resumen derivado de su roadmap y de los documentos de planes, tareas e hitos ubicados bajo `docs/` que sigan la convención común.

### RF-02 — Navegar a la fuente

Cada elemento del resumen enlaza al documento del repositorio del que procede para que el usuario pueda inspeccionarlo.

### RF-03 — Mantener una única fuente de verdad

Workbench presenta los estados leídos del repositorio y no escribe ni conserva una copia autoritativa de esos estados.

### RF-04 — Reflejar cambios documentales

Cuando los documentos del repositorio cambian externamente, el usuario puede refrescar la vista para volver a consultar el estado declarado.

## Reglas de negocio

- Los estados presentados proceden de los documentos reconocidos por la convención acordada.
- El estado de aprobación de un requisito no se interpreta como su progreso de implementación.
- El roadmap enlaza a planes y requisitos, pero no duplica un estado de ejecución para cada hito; el hito se deriva solo de los estados de sus planes.
- Las tareas se mantienen dentro del plan que las organiza; no existe un backlog paralelo.
- Los cambios en código o Git no bastan por sí solos para declarar una tarea o hito completado.
- Los valores reconocidos son: tarea (`Pendiente`, `En curso`, `Bloqueada`, `Completada`); plan (`Pendiente`, `En curso`, `Bloqueado`, `Listo para revisión`, `Completado`); hito derivado (`Planificado`, `En curso`, `Bloqueado`, `Completado`).
- El estado del plan resume sus tareas y verificaciones; Workbench señala inconsistencias entre ese estado y las tareas documentadas.
- Un hito está `Bloqueado` si algún plan enlazado está bloqueado; `Completado` si todos sus planes están completados; `En curso` si algún plan enlazado está `En curso` o `Listo para revisión`; en otro caso está `Planificado`. Sin planes enlazados está `Planificado`. Workbench compara el resumen del plan con sus tareas y señala inconsistencias, pero no vuelve a derivar el estado del hito desde las tareas.

## Criterios de aceptación

### REQ-002-AC-01 — Consultar el roadmap y el estado

Dado un proyecto registrado que sigue la convención documental común, cuando el usuario abre su resumen, entonces puede consultar su roadmap, el plan y las tareas en curso, y los hitos o tareas completados.

### REQ-002-AC-02 — Abrir el documento fuente

Dado un elemento mostrado en el resumen, cuando el usuario lo selecciona, entonces Workbench abre el documento del repositorio que contiene ese dato.

### REQ-002-AC-03 — No inferir estado ausente o contradictorio

Dado un documento sin un estado reconocido, con referencias que no pueden resolverse o con datos contradictorios, cuando Workbench presenta el resumen, entonces señala que el dato está incompleto y no atribuye un estado o una relación no declarada.

### REQ-002-AC-04 — Actualizar tras cambios externos

Dado que un documento del proyecto cambió fuera de Workbench, cuando el usuario refresca el resumen, entonces Workbench vuelve a leer el repositorio y presenta la información actualizada.

### REQ-002-AC-05 — Mantener la documentación bajo `docs/`

Dado un repositorio que sigue la estructura común, cuando el usuario explora su documentación, entonces los documentos del proyecto y los planes activos o completados están bajo `docs/`, salvo archivos que las herramientas requieran en ubicaciones específicas.

## Impacto en datos y API

- Datos: información derivada de archivos del repositorio; no se crea persistencia autoritativa nueva.
- API/contratos: definir durante la implementación de acuerdo con la convención documental aprobada.
- Migración: Workbench centraliza sus documentos y planes bajo `docs/`; los repositorios registrados deben seguir la estructura acordada y no se migran automáticamente.

## Requisitos no funcionales

- Mantener las validaciones de rutas, límites de lectura y protección de secretos de REQ-001.
- Tratar el contenido del repositorio como datos no confiables.
- Informar de documentos ausentes o no reconocidos sin inventar información.

## Dependencias

- Probar la convención con el repositorio de Workbench y otro repositorio.

La implementación debe reconocer solo los valores de estado enumerados en este requisito. Los campos ausentes, valores no reconocidos, referencias rotas y contradicciones se muestran como información incompleta o inconsistente, sin asignar un estado ni reparar relaciones automáticamente.

## Trazabilidad

- Plan de definición e implementación: ../plans/completed/repository-project-state-viewer/plan.md
- Requisito base de lectura de proyectos: REQ-001.
