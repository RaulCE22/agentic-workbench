# Estándar frontend: Feature-Sliced Design

## Alcance y stack

Este estándar se aplica a proyectos frontend nuevos. Usa FSD v2.1 (pages-first) con React, Vite, TypeScript estricto, React Router Data Mode, TanStack Query, React Hook Form, Zod, shadcn/ui, Tailwind y Vitest, según ADR-0002. Workbench conserva su arquitectura concreta documentada en `docs/architecture/frontend.md`.

## Capas y dependencias

```text
app → pages → widgets (opcional) → features → entities → shared
```

Las capas superiores pueden importar las inferiores; `shared` no importa capas de negocio. Omite capas y segmentos que no tengan responsabilidad real. Empieza en la página y extrae una feature, widget o entity cuando exista una responsabilidad reutilizable o un límite de dominio estable. No extraigas código por reutilización hipotética.

- `app`: router, providers, configuración y estilos globales.
- `pages`: composición de rutas y casos locales a una pantalla.
- `widgets`: composición grande y reutilizada entre páginas.
- `features`: acciones de usuario con comportamiento propio.
- `entities`: conceptos de dominio estables y su representación.
- `shared`: UI genérica, transporte HTTP y utilidades sin reglas de dominio.

Cada slice expone sus imports externos por `index.ts`. Una slice no importa archivos internos de otra slice del mismo nivel. Usa API de cross-import explícita solo entre entities cuando el dominio requiera esa relación. Segmenta por propósito (`ui`, `model`, `api`, `lib`, `config`), no por tipo de archivo global.

## Rutas, estado y límites

`app` declara las rutas de React Router Data Mode. Loader y action viven junto a la ruta/página y delegan lógica y acceso a datos. TanStack Query posee el estado remoto; la URL posee filtros y estado navegable; React mantiene estado efímero local; Zustand se reserva para estado cliente transversal que no encaja en los anteriores. No dupliques datos remotos en stores.

Zod valida datos en límites de red y formularios. RHF, su esquema y la interacción del formulario viven con la página o feature propietaria. `shared/api` contiene transporte/configuración común; adapters que conocen una entidad o acción viven en su slice. shadcn/ui generado vive en `shared/ui`; UI con reglas de negocio vive junto a su módulo.

Tailwind es el estilo primario. Mantén CSS global mínimo en `app` y estilos específicos junto a su módulo. Co-localiza pruebas unitarias/componentes; usa integración en los límites entre módulos y para flujos críticos.

## Validación

Ejecuta `pnpm run check:architecture:frontend`. Steiger con el plugin oficial cubre reglas estructurales configuradas, imports y convenciones FSD; no evalúa cohesión, criterio de dominio ni calidad funcional. Consulta [ADR-0009](../decisions/ADR-0009-frontend-feature-sliced-design.md) y [ADR-0011](../decisions/ADR-0011-architecture-validation-tools.md).
