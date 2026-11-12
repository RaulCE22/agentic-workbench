# REQ-002: Estado del proyecto desde el repositorio

- Estado: Borrador
- Prioridad: Alta
- Responsable: Propietario del proyecto
- ADR relacionados: ADR-0005, ADR-0007, ADR-0008 (propuesto)

## Propósito

Permitir que el usuario comprenda el estado continuo de un proyecto desde los documentos de su repositorio, sin mantener una copia paralela del estado en Workbench.

## Alcance

### Incluye
- Presentar el roadmap del repositorio seleccionado.
- Resumir el plan y las tareas declaradas como en curso.
- Mostrar hitos y tareas declarados como completados.
- Enlazar los datos presentados con sus documentos fuente.
- Leer una estructura documental común seguida por todos los repositorios registrados.

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

Al seleccionar un proyecto, el usuario puede consultar un resumen derivado de su roadmap y de los documentos de planes, tareas e hitos que sigan la convención común.

### RF-02 — Navegar a la fuente

Cada elemento del resumen enlaza al documento del repositorio del que procede para que el usuario pueda inspeccionarlo.

### RF-03 — Mantener una única fuente de verdad

Workbench presenta los estados leídos del repositorio y no escribe ni conserva una copia autoritativa de esos estados.

### RF-04 — Reflejar cambios documentales

Cuando los documentos del repositorio cambian externamente, el usuario puede refrescar la vista para volver a consultar el estado declarado.

## Reglas de negocio

- Los estados presentados proceden de los documentos reconocidos por la convención acordada.
- Los cambios en código o Git no bastan por sí solos para declarar una tarea o hito completado.
- Los nombres, ubicaciones, campos y valores de estado admitidos quedan pendientes de definición en el plan.

## Criterios de aceptación

### REQ-002-AC-01 — Consultar el roadmap y el estado

Dado un proyecto registrado que sigue la convención documental común, cuando el usuario abre su resumen, entonces puede consultar su roadmap, el plan y las tareas en curso, y los hitos o tareas completados.

### REQ-002-AC-02 — Abrir el documento fuente

Dado un elemento mostrado en el resumen, cuando el usuario lo selecciona, entonces Workbench abre el documento del repositorio que contiene ese dato.

### REQ-002-AC-03 — No inferir estado ausente

Dado un documento sin un estado reconocido o con referencias que no pueden resolverse, cuando Workbench presenta el resumen, entonces no atribuye un estado o una relación que no esté declarada en el repositorio.

### REQ-002-AC-04 — Actualizar tras cambios externos

Dado que un documento del proyecto cambió fuera de Workbench, cuando el usuario refresca el resumen, entonces Workbench vuelve a leer el repositorio y presenta la información actualizada.

## Impacto en datos y API

- Datos: información derivada de archivos del repositorio; no se crea persistencia autoritativa nueva.
- API/contratos: pendiente de definir cuando se cierre la convención documental.
- Migración: ninguna prevista; los proyectos registrados deberán seguir la estructura acordada.

## Requisitos no funcionales

- Mantener las validaciones de rutas, límites de lectura y protección de secretos de REQ-001.
- Tratar el contenido del repositorio como datos no confiables.
- Informar de documentos ausentes o no reconocidos sin inventar información.

## Dependencias y preguntas abiertas

- Definir la estructura común de roadmap, planes, tareas e hitos.
- Definir vocabulario de estados y qué evidencia representa una finalización.
- Definir cómo mostrar referencias rotas y conflictos entre documentos.
- Probar la convención con el repositorio de Workbench y otro repositorio.

## Trazabilidad

- Plan de definición e implementación: ../../plans/active/repository-project-state-viewer/plan.md
- Requisito base de lectura de proyectos: REQ-001.
