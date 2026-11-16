# ADR-0008: El repositorio como fuente del estado del proyecto

- Estado: Aceptado
- Fecha: 2026-11-12
- Responsable de la decisión: Propietario del proyecto

## Contexto

Workbench necesita ayudar a entender el estado de un proyecto. La información de requisitos, roadmap, planes y progreso ya debe permanecer en archivos versionables del repositorio. Ejecutar o integrar proveedores CLI añade complejidad antes de que el usuario haya elegido qué herramientas utilizar.

## Decisión

1. El producto se centra en leer y presentar el estado declarado en cada repositorio registrado.
2. Los repositorios incorporados a Workbench siguen una estructura documental común bajo `docs/`, incluidos sus planes; los archivos que las herramientas requieran en ubicaciones técnicas pueden quedar como excepciones.
3. Los archivos del repositorio son la fuente de verdad para roadmap, requisitos, planes, tareas e hitos.
4. Workbench deriva vistas de esos archivos y Git; no mantiene una copia autoritativa de los estados en su registro local.
5. Las tareas se registran dentro de cada plan; no se mantiene un backlog separado.
6. El roadmap enlaza requisitos y planes; Workbench deriva el estado de sus hitos desde los estados de esos planes en vez de guardar un estado duplicado.
7. Los agentes CLI se utilizan fuera de Workbench. Su actividad solo se refleja cuando queda declarada en los documentos o cambios del repositorio.
8. La integración de procesos, terminales, protocolos y eventos de agentes queda fuera del alcance actual. ADR-0006 se aplaza.
9. Cada hito del roadmap tiene título, objetivo y enlaces explícitos a requisitos y planes; no exige fecha ni estado manual. Se reconocen únicamente los vocabularios de estado documentados en REQ-002. Ante datos ausentes, referencias rotas o contradicciones, Workbench informa del problema sin elegir un valor ni reparar la relación.

Esta propuesta no modifica la arquitectura local-first ni las decisiones de seguridad aceptadas en ADR-0005 y ADR-0007. Delimita el producto actual y la prioridad de las siguientes fases; cualquier reconsideración de ejecución de procesos requiere una nueva decisión explícita.

## Opciones consideradas

1. Integrar protocolos específicos de agentes: ofrece eventos y permisos estructurados, pero exige elegir y mantener adaptadores por proveedor antes de validar la necesidad.
2. Ejecutar agentes en terminales web: reduce el acoplamiento de protocolo, pero añade una superficie de ejecución de comandos y no proporciona por sí sola datos semánticos de tareas o permisos.
3. Leer el estado documentado del repositorio: aprovecha fuentes versionables y funciona con cualquier agente externo, a cambio de acordar y mantener una convención documental.

## Justificación

La tercera opción aporta valor sin depender de un proveedor, mantiene los estados junto al proyecto y permite validar el producto primero con el repositorio de Workbench y luego con otro repositorio que siga la misma estructura.

## Consecuencias

- Positivas:
  - Workbench puede funcionar aunque se cambie de CLI o los agentes se utilicen fuera de la aplicación.
  - Los requisitos y estados quedan sujetos al historial y revisión del repositorio.
  - No se duplica información de proyecto en la persistencia de Workbench.
- Negativas:
  - Los datos deben registrarse explícitamente y pueden quedar desactualizados.
  - No se conoce el estado de una sesión de agente en tiempo real.
  - Los repositorios deben seguir una convención común.
- Riesgos:
  - Documentos contradictorios pueden producir resúmenes engañosos si el lector elige silenciosamente una fuente.
  - La convención puede ser demasiado específica o costosa para repositorios existentes.

## Restricciones y seguimiento

- La convención documentada en REQ-002 debe probarse con Agentic Workbench y un segundo repositorio antes de completar la entrega.
- El lector debe enlazar a sus fuentes y señalar información ausente o contradictoria sin inventar valores.
- No implementar escritura documental, ejecución de agentes ni actualización automática hasta que exista requisito y decisión aprobados.

## Referencias

- [Visión del producto](../product/vision.md)
- [Hoja de ruta](../product/roadmap.md)
- [REQ-002](../requirements/REQ-002-repository-project-state.md)
- [ADR-0005: arquitectura local-first](ADR-0005-arquitectura-local-first.md)
- [ADR-0006: integración de agentes, aplazado](ADR-0006-integracion-agentes.md)
