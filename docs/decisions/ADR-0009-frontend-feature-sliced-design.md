# ADR-0009: Estándar frontend Feature-Sliced Design

- Estado: Aceptado
- Fecha: 2026-11-16
- Responsable de la decisión: Propietario del proyecto

## Contexto
ADR-0002 aceptó el stack frontend de Workbench, pero no una arquitectura FSD. Se requiere un estándar genérico para proyectos futuros sin convertir la arquitectura documentada de Workbench en plantilla obligatoria ni modificar su implementación actual.

## Decisión
Se propone FSD v2.1 como arquitectura única para frontend: capas `app`, `pages`, `features`, `entities`, `shared`; `widgets` opcional solo si una composición reutilizable lo justifica. `processes` está obsoleta y no se adopta. Crear capas, slices y segmentos solo cuando haya responsabilidad real. Las slices dependen únicamente de capas inferiores y se consumen mediante APIs públicas; `app` compone las rutas React Router Data Mode y proveedores. Pages componen pantallas/rutas; features encapsulan acciones de usuario; entities encapsulan conceptos de dominio; shared contiene capacidades técnicas sin conocimiento de dominio. El stack es el definido en ADR-0002: React, Vite, TypeScript estricto, React Router Data Mode, TanStack Query, React Hook Form, Zod, shadcn/ui, Tailwind, Zustand solo para estado cliente transversal necesario y Vitest.

Los segmentos se nombran por propósito (por ejemplo `ui`, `model`, `api`, `lib`, `config`); no se exigen todos. Componentes, hooks, lógica, tipos, esquemas y pruebas se mantienen junto a su slice/segmento responsable. API compartida contiene transporte/configuración; adapters específicos permanecen con la feature/entity. Zod valida entradas en límites; esquemas de formularios y su estado RHF se ubican con la feature/page del flujo. Loaders/actions se declaran junto a la ruta que los consume y delegan acceso/dominio; TanStack Query es dueño de estado remoto, URL de estado navegable/compartible, React estado efímero local y Zustand solo estado cliente transversal. shadcn/ui generado vive en `shared/ui`; componentes de negocio viven en su módulo. Tailwind es la convención primaria, CSS global mínimo en `app`, estilos específicos co-localizados. Pruebas unitarias y de componentes co-localizadas; integración en el límite de feature/page y flujos críticos.

El criterio de descomposición de FSD v2.1 es pages-first: empezar con responsabilidad local a la página y extraer solo cuando exista una necesidad estable demostrada; la reutilización hipotética no basta.

## Opciones consideradas
1. FSD v2.1 adaptado — da semántica de capas, límites y APIs públicas; exige criterio para evitar extracción prematura y depende de un validador beta.
2. Mantener estructura técnica global ad hoc — baja barrera inicial, pero tiende a mezclar dominios y no concreta las responsabilidades pedidas.

## Justificación
La documentación oficial vigente de FSD permite omitir capas y define dependencias descendentes, slices y APIs públicas. La skill oficial declara FSD v2.1; se adapta explícitamente a React Router Data Mode y al estado TanStack Query ya decidido.

## Consecuencias
- Positivas: ubicación predecible, dependencias explícitas, extracción según necesidad y stack único.
- Negativas: el equipo debe acordar ejemplos de límites de dominio; Steiger no prueba calidad semántica.
- Riesgos: beta/cambios de configuración de Steiger; imports alias pueden necesitar configuración precisa.

## Restricciones y seguimiento
La decisión fue aceptada por el propietario el 2026-11-17. El piloto de Steiger se completó el 2026-11-21 sobre un esqueleto conforme y un fixture infractor; en macOS el paquete inicial usa `CHOKIDAR_USEPOLLING=1` para evitar `EMFILE`. No aplicar FSD retroactivamente a `apps/web` sin alcance aprobado.

## Referencias
- https://feature-sliced.design/docs/reference
- https://github.com/feature-sliced/skills (skill oficial FSD v2.1 consultada como referencia; no se copia como skill común del producto)
- https://github.com/feature-sliced/steiger
- https://reactrouter.com/start/modes
- Requisitos relacionados: REQ-003.
- ADR relacionados: ADR-0002.
