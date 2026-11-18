# ADR-0010: Estándar backend monolito modular

- Estado: Aceptado (estructura); stack condicionado a ADR-0003
- Fecha: 2026-11-16
- Responsable de la decisión: Propietario del proyecto

## Contexto
ADR-0003 es una propuesta de stack reutilizable y sigue sin cerrar una POC ni decisiones de integración. ADR-0007 y la arquitectura actual establecen un backend local para Workbench con Hono, Node.js 24.15 y JSON. Hace falta fijar una forma de organizar backends futuros sin cambiar el producto local.

## Decisión
Se acepta un único monolito modular organizado por dominios: cada `src/modules/<dominio>/` posee HTTP, aplicación, dominio e infraestructura solo cuando sean necesarios. Los handlers Hono validan/transforman transporte y delegan casos de uso; aplicación orquesta y define límites de transacción/puertos solo si se justifican; dominio contiene reglas invariantes; infraestructura implementa persistencia e integraciones. No se crean interfaces/repositorios por ceremonia ni capas vacías. `src/app` compone Hono, configuración y dependencias; `src/shared` aloja capacidades transversales estables pequeñas; `src/db` configura conexión y migraciones, con esquemas Drizzle de tablas co-localizados en su módulo cuando resulte viable.

Se propone para proyectos nuevos el stack de ADR-0003 sujeto a su decisión final y POC: Node LTS vigente, TypeScript estricto, Hono con adaptador Node, PostgreSQL, Drizzle ORM/Kit, Zod y Better Auth únicamente si se necesita autenticación. A la fecha de análisis Node 26 aparece como LTS; esto no actualiza Node 24.15 de Workbench. Las dependencias entre módulos cruzan únicamente APIs públicas/fachadas; no se permiten ciclos ni accesos a tablas/repositorios internos de otro módulo. HTTP no importa Drizzle ni accede directamente a la base de datos.

Zod valida entorno y límites HTTP; el error middleware central convierte errores tipados en respuestas sin filtrar detalles internos. Logs estructurados omiten secretos y datos sensibles. PostgreSQL y migraciones Drizzle son explícitos/revisables; una operación de aplicación coordina una transacción cuando requiere atomicidad multi-escritura. AuthN/AuthZ se valida en middleware/casos de uso según recurso y operación. Pruebas: unitarias para reglas y casos de uso, integración para adaptadores/DB/migraciones, API para rutas, validación, permisos y formato de errores.

Hono 5 documenta Node 22.12+ como requisito; el Node 26 LTS propuesto lo satisface. Better Auth documenta montaje directo en Hono y adapter Drizzle para PostgreSQL. La compatibilidad exacta de versiones de Node, Hono, Better Auth y Drizzle, incluido el driver PG, queda pendiente de la POC de ADR-0003. Esto no actualiza el runtime 24.15 de Workbench.

## Opciones consideradas
1. Monolito modular por dominio — coherencia con despliegue sencillo y aislamiento local de cambios; requiere disciplina de imports.
2. Capas globales HTTP/services/repositories — simples al inicio, pero mezclan múltiples dominios dentro de cada carpeta.
3. Microservicios o perfiles Clean/Hexagonal/MVC — añaden topologías o arquitecturas alternativas sin necesidad demostrada.

## Justificación
Los módulos por dominio reducen el conocimiento cruzado; se utilizan separaciones HTTP/aplicación/dominio/infraestructura dentro del módulo solo donde el caso lo necesita.

## Consecuencias
- Positivas: límites de dominio visibles, evolución y pruebas locales a cada módulo.
- Negativas: exige diseñar contratos entre módulos y disciplina ante imports internos.
- Riesgos: ADR-0003 no está aprobado; el driver PG, interfaz/API, errores/paginación, contratos, email, cookies/sesiones, rate limits y auditoría siguen pendientes.

## Restricciones y seguimiento
ADR-0010 no aprueba ni reemplaza el stack de ADR-0003. Antes de ratificar el stack se ejecuta la POC indicada por aquel ADR y se resuelven sus preguntas abiertas; el estándar estructural puede revisarse por separado. No cambiar la arquitectura local Workbench ni imponer Better Auth.

## Referencias
- https://nodejs.org/en/about/previous-releases
- https://hono.dev/docs/getting-started/nodejs
- https://orm.drizzle.team/docs/get-started/postgresql-new
- https://orm.drizzle.team/docs/migrations
- https://hono.dev/docs/guides/migrating-to-v5
- https://better-auth.com/docs/integrations/hono
- https://better-auth.com/docs/installation
- Requisitos relacionados: REQ-003.
- ADR relacionados: ADR-0003, ADR-0007.
