# Plan de implementación: Estándares de ingeniería V0.3

- Estado: Completado
- Requisitos: REQ-003
- ADR relacionados: ADR-0009, ADR-0010, ADR-0011 (todos Aceptados)
- Riesgo: Alto
- Aprobación: Aprobado por el propietario del proyecto el 2026-11-17

## Objetivo
Publicar y preparar la adopción de un estándar frontend FSD y uno backend monolito modular, con instrucciones compartidas para agentes, estructuras iniciales portables y validación acotada, manteniendo intacta la arquitectura específica local de Workbench.

## Alcance
### Incluye
- ADR-0009..0011; documentos canónicos en `docs/standards/`.
- Skills comunes `.agents/skills/frontend-architecture` y `backend-architecture`.
- Dos estructuras iniciales copiables, con instrucciones portables y sin motor de generación.
- Comandos de validación separados y scripts de calidad para proyectos nuevos.
- Sustitución de V0.3, índices y guía de adopción.

### No incluye
- Código de producto de apps/web o apps/api, reescritura o conversión a FSD.
- Cambiar runtime/persistencia de Workbench, aplicar PG/Drizzle/Auth al backend local.
- Aprobar ADR-0003 ni fijar decisiones pendientes sin su POC.
- Generador, sistema de plantillas, perfiles o interfaz de selección.
- Añadir deps al workspace Workbench durante esta reforma sin aprobación.

## Situación actual
REQ-001/002 aprobados; V0.1/V0.2 entregadas, incluido el plan archivado `docs/plans/completed/repository-project-state-viewer/`. ADR-0002 frontend aceptado; ADR-0003 backend propuesto y sustituido para Workbench; ADR-0007 local-first aceptado. El frontend Workbench usa stack React/Vite/TS y todavía tiene organización concreta propia. La API Workbench usa Hono, Node 24.15, JSON y filesystem/Git local; no usa PostgreSQL, Drizzle ni Better Auth. `pnpm run verify` ejecuta check documental y workspace. `new-document.mjs` acepta actualmente slug como primer argumento tras el tipo; el `--` que indica su mensaje de uso llega como slug y falla. Se usó la forma operativa sin `--`; corregir el generador queda fuera de este plan salvo aprobación separada.

## Diseño propuesto
### Frontend
Árbol de referencia (crear solo lo que tenga contenido real):
```text
src/
  app/                         # bootstrap, router Data Mode, providers, CSS global
  pages/<route>/               # composición de pantalla y loader/action de ruta
  widgets/<block>/             # opcional: bloque grande, autónomo y reutilizado
  features/<user-action>/      # interacción/caso de uso, form, schema y adapter propios
  entities/<domain>/           # concepto estable, modelo y UI/API de dominio reutilizable
  shared/
    ui/                         # shadcn/ui y primitivas sin dominio
    api/                        # transporte HTTP común, no reglas de negocio
    lib/                        # utilidades pequeñas con propósito único
```
Una slice expone imports externos mediante `index.ts`; internos no cruzan a otra slice del mismo nivel. Dependencias descienden `app > pages > widgets > features > entities > shared`; `widgets` puede omitirse. `pages` componen, `features` expresan acciones, `entities` conceptos; no todo botón es feature ni todo tipo es entity. React Router Data Mode define el enrutamiento en `app`; loader/action se co-localizan con ruta/página y delegan. Evitar dos dueños para datos: TanStack Query remoto, URL navegable, React local efímero, Zustand únicamente estado cliente transversal. RHF/Zod junto al flujo de formulario y validación Zod también en límites de API. Tailwind primario; CSS global en app y específico junto al módulo. Pruebas junto al módulo y tests de integración donde se cruzan módulos/flujo.

### Backend
```text
src/
  app/                         # ensamblaje Hono, configuración e inyección
  modules/<domain>/
    http/                      # rutas, handlers y schemas de transporte
    application/               # casos de uso y límites transaccionales
    domain/                    # entidades/reglas cuando existan
    infrastructure/            # adapters Drizzle/integraciones
    index.ts                   # API pública del módulo
  db/                          # conexión, Drizzle Kit, migraciones
  shared/                      # errores/logging/config cross-domain justificados
```
Los segmentos de módulo se crean cuando aportan separación. Handlers Hono traducen HTTP y llaman casos de uso; nunca consultan DB directamente. La aplicación orquesta; dominio contiene invariantes; infraestructura implementa persistencia. Módulos se comunican por fachadas públicas, sin ciclos ni imports internos entre dominios. Zod valida env/HTTP, error middleware centraliza traducción y no filtra secretos, logs estructurados redaccionan información sensible. Drizzle schema se co-localiza al módulo y migraciones se revisan; las transacciones cubren atomicidad de una operación de aplicación con varias escrituras. Better Auth condicional y autorización por operación/recurso. Pruebas unitarias, integración con PostgreSQL/migraciones y API por rutas/errores/permisos.

### Distribución portable
`docs/standards/*.md` será fuente canónica en Workbench. Estructuras copiables bajo `templates/standards/frontend/` y `templates/standards/backend/` contendrán solo estructura/archivos de arranque y README con instrucciones para copiar la skill y el documento estándar a las ubicaciones locales (`docs/standards/` y `.agents/skills/`). Así el repositorio futuro no depende de links a Workbench ni duplica reglas completas. Un full-stack combina ambos paquetes.

## Archivos y áreas que se prevé modificar
- Crear `docs/standards/README.md`, `frontend.md`, `backend.md` y guía de adopción `docs/standards/adopting-standards.md`.
- Crear dos estructuras iniciales bajo `templates/standards/`.
- Crear dos skills compartidas; actualizar índice de skills y compatibilidad.
- Actualizar `AGENTS.md`, visión, roadmap, docs README, índices REQ/ADR, docs de arquitectura frontend/backend, referencias de ruta de plans en skills.
- Añadir y completar REQ-003, ADR-0009..0011, este plan y `progress.md`.

## Tareas
| Tarea | Estado | Criterios relacionados |
|---|---|---|
| 1. Revisar y aprobar REQ/ADR/plan; resolver riesgos de stack y validación | Completada | REQ-003-AC-01..06 |
| 2. Escribir estándares canónicos y ejemplos FSD/monolito modular | Completada | AC-01, AC-02 |
| 3. Crear skills portables y estructuras iniciales sin duplicar estándares | Completada | AC-03 |
| 4. Pilotar Steiger y validador backend; fijar reglas/versiones y scripts | Completada | AC-04 |
| 5. Documentar adopción; sincronizar arquitectura Workbench, visión e índices | Completada | AC-03, AC-05, AC-06 |
| 6. Ejecutar verificaciones, revisar diff y cerrar trazabilidad documental | Completada | AC-01..06 |

Ambos pilotos completaron el 2026-11-21; el esqueleto frontend supera su propio preset con `CHOKIDAR_USEPOLLING=1`.

## Criterios de aceptación y relación con pruebas
| Criterio de aceptación | Verificación |
|---|---|
| REQ-003-AC-01 | Revisión de árbol y ejemplos; checklist stack/ubicaciones; Steiger piloto cubre solo reglas listadas. |
| REQ-003-AC-02 | Revisión de árbol modular, dependencias permitidas y ejemplos HTTP/use case/Drizzle; dependency-cruiser/alternativa prueba fixtures válidas e inválidas. |
| REQ-003-AC-03 | Instrucciones permiten copia offline; comprobar que el paquete local incluye docs/skills sin links externos requeridos para uso. |
| REQ-003-AC-04 | Ejecutar comandos frontend/backend sobre fixture conforme e infractor; confirmar exit code determinista y documentar límites semánticos. |
| REQ-003-AC-05 | Diff de arquitectura local confirma Node 24.15/Hono/JSON mantenidos y no se añade DB/Auth. |
| REQ-003-AC-06 | `pnpm run verify`, enlaces/índices y revisión de V0.1/V0.2/V0.4 frente a roadmap anterior. |

## Riesgos y reversión
- Steiger está en beta activa y cambió configuración en 0.5: el piloto confirmó reglas y modo de fallo; el paquete inicial fija `CHOKIDAR_USEPOLLING=1` en macOS. Si una versión futura resulta inestable, reconsiderar ESLint/no-restricted-imports.
- ADR-0003 aún requiere POC y decisiones API/driver/auth: no presentar stack como aprobado; aprobar estructura por separado si procede.
- Dos copias de estructura podrían divergir: incluir esqueletos mínimos y comprobarlos contra documentos canónicos; no copiar reglas completas.
- Roadmap V0.3 reemplaza propuesta previa: conservar “trazabilidad” como aplazada y sin compromiso; V0.4 no cambia.
- Reversión documental: revertir el commit completo de esta reforma (sin cambios de datos/esquemas ni migración de Workbench).

## Decisiones que requieren aprobación
- REQ-003, este plan y ADR-0009..0011 aprobados por el propietario el 2026-11-17.
- ADR-0010 acepta solo la estructura backend; el stack sigue pendiente de ADR-0003 y su POC.
- La selección de Steiger quedó confirmada por el piloto; el paquete inicial fija `CHOKIDAR_USEPOLLING=1` en macOS. Las dependencias se añaden únicamente a proyectos nuevos.

## Comandos de verificación
- `pnpm run verify` (documentación actual).
- `pnpm run check:docs` y `pnpm run check:workspace` individualmente si se necesita aislar fallo.
- Scripts `check:architecture:frontend` y `check:architecture:backend` sobre fixtures válidas e infractoras (pilotos completados con exit 0/1).

## Condiciones de entrega
Todos los AC tienen evidencia; documentos genéricos y arquitectura local no se contradicen; ADR aprobados según decisión humana; REQ/índices/roadmap coherentes; no se refactorizó Workbench; verificaciones y diff reportados con resultados reales.
