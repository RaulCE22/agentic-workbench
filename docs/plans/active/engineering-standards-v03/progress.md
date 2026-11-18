# Progreso: Estándares de ingeniería V0.3

- Requisitos: REQ-003
- Plan: ./plan.md
- Última actualización: 2026-11-17

## Resumen de progreso
REQ-003, ADR-0009..0011 y el plan fueron aprobados por el propietario. Los estándares, las skills, los paquetes iniciales y la guía de adopción están redactados. No se añadieron dependencias al workspace de Workbench. El piloto backend confirmó las reglas de ciclos e imports configuradas y se añadió una comprobación del acceso entre dominios; el piloto frontend queda pendiente por un error de watchers de Steiger en el entorno.

## Trabajo completado
- Inspección de documentación, árbol, arquitectura y estado Git actuales.
- Investigación de documentación oficial FSD, Steiger, Node, Hono, React Router, Drizzle y dependency-cruiser.
- Generación y redacción de REQ-003, ADR-0009..0011, plan y registro de progreso.
- Aprobación humana registrada el 2026-11-17; ADR-0010 mantiene pendiente el stack de ADR-0003.
- Estándares canónicos, skills portables, paquetes iniciales y guía de adopción añadidos.
- Configuración backend probada con fixture conforme y fixture infractor; import público permitido e import interno entre dominios rechazado.

## Cambios realizados
- Cambiados los documentos REQ/ADR, estándares, arquitectura e índices; añadidos skills y archivos bajo `templates/standards/`.
- No se modificó código de producto ni manifiestos/lockfiles del workspace.

## Verificación
| Comando/comprobación | Resultado | Notas |
|---|---|---|
| `pnpm run new:requirement -- engineering-standards-frontend-backend` | Falló | El script recibe `--` como slug por diferencia entre mensaje de uso y parser. |
| `pnpm run new:requirement engineering-standards-frontend-backend` | Correcto | Creó REQ-003; mismo ajuste operativo usado para ADR y plan. |
| `pnpm run new:adr ...` y `pnpm run new:plan ...` | Correcto | Slug sin `--`; IDs generados por el script. |
| `pnpm run verify` | Correcto | Validación documental correcta (73 archivos Markdown; 21 obligatorios) y workspace correcta. |
| `pnpm run verify` | Correcto | Ejecutado tras crear estándares/skills y antes de los últimos ajustes; 81 archivos Markdown y workspace correctos. No se volvió a ejecutar tras los cambios posteriores. |
| `pnpm dlx --package=dependency-cruiser@18.6.0 node check-architecture.cjs` (fixture backend válido) | Correcto | En fixture temporal aislado; no instaló dependencias en el workspace. |
| `pnpm dlx --package=dependency-cruiser@18.6.0 node check-architecture.cjs` (fixture con import interno entre dominios) | Correcto | Falló como se esperaba e informó `modules-use-public-api`. |
| `pnpm run check:architecture:frontend` (Steiger 0.10.0, fixture aislado) | Falló | Error `EMFILE: too many open files, watch`; el piloto frontend no se considera completado. |
| `rg` sobre rutas de planes y roadmap; `git diff --check` | Correcto | Referencia obsoleta del skill corregida; V0.4 conserva su alcance; diff sin errores de whitespace. |

## Decisiones y descubrimientos
- Node.js 26 aparece LTS al 16-11-2026; no modifica el Node 24.15 fijado para Workbench.
- Steiger ofrece plugin oficial FSD, está en beta y configuración 0.5 tuvo cambio incompatible; exige piloto.
- FSD v2.1 oficial prescribe pages-first; React Router Data Mode proporciona loaders/actions con router basado en datos.
- Hono 5 requiere Node 22.12+; Better Auth documenta Hono y Drizzle PostgreSQL. Versiones concretas siguen en POC.
- `dependency-cruiser` permite reglas prohibidas/ciclos; aprobar su dependencia solo tras comparar coste con ESLint.
- dependency-cruiser 18.6.0 pasó el fixture backend conforme y detectó el acceso a un internals de otro módulo. Steiger 0.10.0 y plugin 0.8.2 se fijaron en el paquete inicial; su ejecución no se pudo validar por `EMFILE`.
- ADR-0003 continúa Propuesto y conserva decisiones/piloto sin resolver.

## Preguntas abiertas / bloqueos
- Completar el piloto Steiger en un entorno que permita el escaneo de archivos y confirmar sus reglas/falsos positivos.
- Resolver POC/decisiones de ADR-0003 por separado; no bloquea la estructura backend documentada.

## Siguiente paso
Resolver el piloto frontend, ejecutar `pnpm run verify` y revisar el diff final. Las dependencias ya están declaradas para que el usuario las instale en sus proyectos cuando adopte los estándares.
