# Índice de documentación

Empieza por este índice y abre únicamente los documentos necesarios para la tarea.

| Área | Documento de entrada | Propósito |
|---|---|---|
| Producto | [Visión](product/vision.md) | Problema, usuarios, principios y límites |
| Hoja de ruta | [Roadmap](product/roadmap.md) | Entregas incrementales y alcance |
| Requisitos | [Requisitos](requirements/README.md) | Comportamiento y criterios de aceptación |
| Arquitectura | [Visión general](architecture/overview.md) | Topología local y límites del sistema |
| Backend | [Servidor local](architecture/backend.md) | API, sistema de archivos, procesos y persistencia |
| Frontend | [Frontend](architecture/frontend.md) | Stack y convenciones de interfaz |
| Runtime | [Runtime](architecture/runtime.md) | Versiones de Node.js y compatibilidad |
| Monorepo | [Monorepo](architecture/monorepo.md) | Espacios de trabajo y límites de paquetes |
| Seguridad | [Línea base](quality/security-baseline.md) | Protección de datos y operaciones locales |
| Calidad | [Quality gates](quality/quality-gates.md) | Criterios de verificación |
| Decisiones | [ADR](decisions/README.md) | Registro de decisiones aceptadas y propuestas |
| Protocolos de agentes | [ADR-0006](decisions/ADR-0006-integracion-agentes.md) | Evaluación de integraciones por CLI |
| Flujo de trabajo | [Ciclo de funcionalidades](workflows/feature-lifecycle.md) | Análisis, planificación, implementación y revisión |
| Contexto | [Gestión del contexto](workflows/context-management.md) | Carga progresiva de información |
| Plantillas | [Plantillas](templates/) | Requisitos, ADR, planes y revisiones |
| Planes | [Planes de trabajo](../plans/README.md) | Trabajo activo y completado |

## Jerarquía documental

1. Los requisitos definen el comportamiento deseado del producto.
2. Los ADR aceptados definen decisiones arquitectónicas duraderas y sus consecuencias.
3. Los documentos de arquitectura explican límites y convenciones estables.
4. Los planes definen el alcance aprobado de un cambio concreto.
5. Los registros de progreso reflejan lo que realmente ha ocurrido.
6. El código fuente y las pruebas automatizadas definen el comportamiento implementado.

Si dos documentos entran en conflicto, no elijas uno silenciosamente. Expón la contradicción y resuelve cuál es la fuente de verdad antes de implementar.
