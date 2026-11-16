# Plan de definición e implementación: Visor del estado del repositorio

- Estado: Completado
- Requisitos: REQ-002
- ADR relacionados: ADR-0005, ADR-0007, ADR-0008; ADR-0006 aplazado.
- Riesgo: Medio
- Aprobación: Aprobado

## Objetivo

Definir y construir una vista de solo lectura que resuma roadmap, planes, tareas e hitos declarados por cada repositorio registrado, usando sus documentos como fuente de verdad.

## Alcance

### Incluye
- Centralizar bajo `docs/` la documentación del proyecto y los planes activos/completados para que sea fácil localizar los Markdown del proyecto.
- Inventariar README de apps, paquetes e infraestructura y decidir si su contenido se integra en documentación canónica bajo `docs/` o queda como referencia local breve.
- Conservar fuera de `docs/` los archivos requeridos en ubicaciones específicas por herramientas, como instrucciones de agentes y skills; mantener el README raíz como punto de entrada conciso.
- Acordar una convención documental común seguida por los repositorios que se registren.
- Presentar el roadmap del repositorio, el plan y las tareas en curso y los elementos completados.
- Enlazar cada elemento mostrado con su documento fuente.
- Probar la lectura primero con Agentic Workbench y después con un segundo repositorio.
- Mantener el refresco manual y la lectura segura existentes mientras no se apruebe una actualización automática.

### No incluye
- Ejecución, terminales, observabilidad o adaptadores de agentes.
- Edición de documentos del proyecto desde Workbench.
- Inferir estados desde código, Git o actividad de procesos.
- Persistir un segundo estado de proyecto fuera del repositorio.
- Compatibilidad con repositorios que no sigan la convención acordada.

## Situación actual

Workbench leía documentos Markdown bajo `docs/` y `plans/`, extraía títulos, listaba requisitos REQ-### y encontraba referencias a requisitos en planes. Esta implementación migra los planes a `docs/plans/` para consolidar la documentación. REQ-001 aporta acceso local seguro y refresco manual; REQ-002 y la convención documental están aprobados.

## Diseño propuesto

Derivar la vista desde los archivos reconocidos dentro del proyecto registrado y exponer solo los campos necesarios mediante el backend y contratos Zod. El frontend presentará los datos y enlaces a la documentación original. No se guardarán copias autoritativas del estado en el store JSON de Workbench.

La documentación del proyecto y los planes se centralizan bajo `docs/`, salvo archivos Markdown que herramientas o paquetes necesiten en ubicaciones técnicas. Cada hito del roadmap se representa con título, objetivo y enlaces explícitos a requisitos y planes; no requiere fecha ni estado manual. Los estados reconocidos son los definidos en REQ-002. Ante datos ausentes, valores desconocidos, referencias rotas o contradicciones, el lector informa de la inconsistencia sin inventar valores ni reparar enlaces. La convención se validó con el propio Workbench y un proyecto fixture independiente.

## Archivos y áreas que se prevé modificar

- Documentación de producto y arquitectura: visión, roadmap, módulos frontend/backend y decisiones pendientes.
- `docs/requirements/REQ-002-repository-project-state.md` y el índice de requisitos.
- Migración de `plans/` a `docs/plans/`, inventario de README fuera de `docs/`, referencias Markdown, `docs/README.md`, arquitectura del monorepo y ciclo de funcionalidades.
- README raíz y README de apps, packages e infra, para retirar duplicación o actualizar referencias según el inventario.
- `scripts/engineering/new-document.mjs`, para que genere los planes bajo `docs/plans/`.
- `apps/api/src/app.ts` y `apps/web/src/App.tsx`, para leer y organizar Markdown desde la única raíz documental.
- El módulo de lectura documental que se concrete; contratos compartidos en `packages/contracts` si frontend y backend los necesitan.
- Estilos de la nueva vista, reutilizando el catálogo documental y la navegación existentes.
- Pruebas de parsing/API y componentes asociadas a los criterios aprobados.
- Fixture o repositorio de ejemplo para comprobar que el lector no está acoplado al contenido del propio Workbench.

## Tareas

| Tarea | Estado | Criterios relacionados |
|---|---|---|
| Inventariar Markdown y clasificar documentación de proyecto, referencias locales y archivos requeridos por herramientas | Completada | — |
| Migrar documentación de proyecto y planes a `docs/`; actualizar generador, enlaces y lector documental | Completada | REQ-002-AC-05 |
| Definir y registrar la convención en REQ-002, ADR-0008 y la arquitectura | Completada | REQ-002-AC-01, REQ-002-AC-03, REQ-002-AC-05 |
| Inventariar y clasificar los README locales | Completada | REQ-002-AC-05 |
| Preparar ejemplos de la convención en Workbench y en un segundo repositorio fixture | Completada | REQ-002-AC-01, REQ-002-AC-03 |
| Implementar el lector determinista con rutas seguras y enlaces a las fuentes | Completada | REQ-002-AC-01 a REQ-002-AC-05 |
| Construir la vista del estado con datos incompletos o contradictorios visibles | Completada | REQ-002-AC-01 a REQ-002-AC-04 |
| Verificar parsing, refresco manual, accesibilidad y ambos repositorios | Completada | REQ-002-AC-01 a REQ-002-AC-05 |

La convención y el alcance de implementación están aprobados y la prueba con un proyecto fixture independiente completó la entrega.

## Criterios de aceptación y relación con pruebas

| Criterio de aceptación | Verificación prevista |
|---|---|
| REQ-002-AC-01 | Pruebas de parsing y de UI con datos de ambos repositorios; el resumen presenta roadmap, plan/tareas en curso e hitos/tareas completados. |
| REQ-002-AC-02 | Prueba de navegación desde cada tipo de elemento a su documento fuente. |
| REQ-002-AC-03 | Fixtures con estados ausentes, referencias rotas y conflicto; comprobar que no se inventan estados ni relaciones. |
| REQ-002-AC-04 | Prueba API/UI después de modificar externamente un documento y refrescar. |
| REQ-002-AC-05 | Comprobación de que documentación y planes del proyecto están bajo `docs/`, con las excepciones técnicas acordadas. |

## Riesgos y reversión

- Una convención ambigua o no validada hace que la vista presente estados erróneos. Mitigación: definir valores y referencias antes de codificar y probar en dos repositorios.
- La documentación puede contradecirse o quedar desactualizada. El lector debe exponer lo que no puede resolver en lugar de elegir una fuente silenciosamente.
- El contenido del repositorio no es confiable; las rutas deben pasar por el servicio seguro existente y la vista no debe renderizar HTML arbitrario.
- Reversión localizada: retirar lector y vista derivados. No se migra ni se duplica estado persistido.

## Decisiones que requieren aprobación

Ninguna. La convención y el alcance de implementación están aprobados en REQ-002 y ADR-0008.

## Comandos de verificación

- `pnpm run verify`
- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test`
- Pruebas de parsing y contrato con fixtures de Workbench y del segundo repositorio.

## Condiciones de entrega

El resumen funciona con dos repositorios que siguen la misma convención; cumple REQ-002; enlaza a la fuente; no inventa estados; las comprobaciones quedan registradas en `progress.md`; y la revisión del diff no encuentra cambios fuera del alcance aprobado.
