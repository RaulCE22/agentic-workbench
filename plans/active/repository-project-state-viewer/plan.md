# Plan de definición e implementación: Visor del estado del repositorio

- Estado: Borrador — falta acordar la convención documental antes de implementar.
- Requisitos: REQ-002
- ADR relacionados: ADR-0005, ADR-0007, ADR-0008 (propuesto); ADR-0006 aplazado.
- Riesgo: Medio
- Aprobación: Pendiente

## Objetivo

Definir y construir una vista de solo lectura que resuma roadmap, planes, tareas e hitos declarados por cada repositorio registrado, usando sus documentos como fuente de verdad.

## Alcance

### Incluye
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

Workbench lee Markdown limitado a `docs/` y `plans/`, extrae títulos de encabezados, lista requisitos REQ-### y encuentra referencias a requisitos dentro de planes. No hay modelo formal de tareas, hitos ni roadmap de cada proyecto, ni un lector unificado del estado. REQ-001 aporta acceso local seguro y refresco manual; REQ-002 está en borrador porque faltan las convenciones de datos.

## Diseño propuesto

Derivar la vista desde los archivos reconocidos dentro del proyecto registrado y exponer solo los campos necesarios mediante el backend y contratos Zod. El frontend presentará los datos y enlaces a la documentación original. No se guardarán copias autoritativas del estado en el store JSON de Workbench.

La ubicación, esquema y valores de estado no se fijan en este borrador. La fase inicial debe resolverlos mediante una propuesta documental y probarla en dos repositorios antes de aprobar el diseño de API y UI.

## Archivos y áreas que se prevé modificar

- Documentación de producto y arquitectura: visión, roadmap, módulos frontend/backend y decisiones pendientes.
- `docs/requirements/REQ-002-repository-project-state.md` y el índice de requisitos.
- `apps/api/src/app.ts` o el módulo de lectura documental que se concrete; contratos compartidos en `packages/contracts` si frontend y backend los necesitan.
- `apps/web/src/App.tsx` y estilos de la nueva vista, reutilizando el catálogo documental y la navegación existentes.
- Pruebas de parsing/API y componentes asociadas a los criterios aprobados.
- Fixture o repositorio de ejemplo para comprobar que el lector no está acoplado al contenido del propio Workbench.

## Fases de trabajo propuestas

1. Definir ubicaciones y esquema documental para roadmap, planes, tareas, hitos, estados y evidencia de finalización.
2. Actualizar REQ-002 con la convención aprobada y criterios observables; aprobar requisito y plan.
3. Crear ejemplos representativos en el repositorio de Workbench y en un segundo repositorio de prueba.
4. Implementar un lector determinista que valide rutas, trate los documentos como no confiables y devuelva datos derivados con enlaces a origen.
5. Construir una vista de resumen con estados explícitos, documentos fuente y estados vacíos o inconsistentes.
6. Verificar parsing, seguridad de rutas, refresco manual, accesibilidad y consistencia entre ambos repositorios.

No iniciar las fases 3–6 hasta cerrar la convención y aprobar el plan de implementación.

## Criterios de aceptación y relación con pruebas

| Criterio de aceptación | Verificación prevista |
|---|---|
| REQ-002-AC-01 | Pruebas de parsing y de UI con datos de ambos repositorios; el resumen presenta roadmap, plan/tareas en curso e hitos/tareas completados. |
| REQ-002-AC-02 | Prueba de navegación desde cada tipo de elemento a su documento fuente. |
| REQ-002-AC-03 | Fixtures con estados ausentes, referencias rotas y conflicto; comprobar que no se inventan estados ni relaciones. |
| REQ-002-AC-04 | Prueba API/UI después de modificar externamente un documento y refrescar. |

## Riesgos y reversión

- Una convención ambigua o no validada hace que la vista presente estados erróneos. Mitigación: definir valores y referencias antes de codificar y probar en dos repositorios.
- La documentación puede contradecirse o quedar desactualizada. El lector debe exponer lo que no puede resolver en lugar de elegir una fuente silenciosamente.
- El contenido del repositorio no es confiable; las rutas deben pasar por el servicio seguro existente y la vista no debe renderizar HTML arbitrario.
- Reversión localizada: retirar lector y vista derivados. No se migra ni se duplica estado persistido.

## Decisiones que requieren aprobación

- Convención documental común, vocabulario de estados y evidencia de finalización.
- Comportamiento frente a metadatos ausentes o contradictorios.
- El requisito y el plan de implementación final antes de modificar código.

## Comandos de verificación

- `pnpm run verify`
- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test`
- Pruebas de parsing y contrato con fixtures de Workbench y del segundo repositorio.

## Condiciones de entrega

El resumen funciona con dos repositorios que siguen la misma convención; cumple REQ-002; enlaza a la fuente; no inventa estados; las comprobaciones quedan registradas en `progress.md`; y la revisión del diff no encuentra cambios fuera del alcance aprobado.
