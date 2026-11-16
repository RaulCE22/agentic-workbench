# Plan de implementación: Árbol y búsqueda de documentación

- Estado: Completado
- Requisitos: REQ-001 (AC-09, AC-10)
- ADR relacionados: ADR-0005, ADR-0007
- Riesgo: Bajo
- Aprobación: Aprobado por el propietario del proyecto el 2026-11-12

## Objetivo
Mejorar la vista Documentación con navegación de documentos Markdown por carpetas y búsqueda por título o ruta, manteniendo el visor actual.

## Alcance
### Incluye
- Mostrar en forma de árbol los documentos Markdown que el catálogo existente encuentra bajo `docs/`.
- Permitir desplegar y contraer carpetas y seleccionar documentos para abrirlos en el visor existente.
- Filtrar documentos por coincidencias de consulta en su título o ruta, sin buscar en el contenido.
- Al limpiar la consulta, restaurar la navegación completa del árbol.

### No incluye
- Búsqueda en el contenido de los documentos, indexación o cambios al endpoint/catálogo de la API.
- Documentos fuera de `docs/`, formatos distintos de Markdown o cambios al renderizado Markdown.
- Edición, creación, movimiento o eliminación de documentos.

## Situación actual
La API `GET /api/projects/:id/documents` enumera documentos Markdown bajo `docs/` y devuelve `path` y `title`, con límites de profundidad y volumen. `DocumentationPage` en `apps/web/src/App.tsx` presenta un árbol con búsqueda y usa el endpoint de lectura existente para cargar el documento seleccionado. El API tipado y sus esquemas están en `apps/web/src/api.ts` y `packages/contracts`.

## Diseño propuesto
Mantener el catálogo remoto en TanStack Query. Construir en la vista de Documentación la jerarquía de carpetas a partir de las rutas ya recibidas; mantener en estado local la consulta y las carpetas desplegadas. Filtrar los metadatos de título y ruta en el cliente y pasar la ruta seleccionada al mecanismo actual de lectura. No se requiere cambio de contrato ni acceso nuevo al sistema de archivos.

## Archivos y áreas que se prevé modificar
- `docs/requirements/REQ-001-local-project-workspace.md`: criterios AC-09 y AC-10.
- `apps/web/src/App.tsx`: árbol, campo de búsqueda, selección y estados vacíos de la vista.
- `apps/web/src/styles.css`: presentación y estados visuales del árbol y buscador.
- Pruebas de componente de Documentación, si el módulo ya dispone del arnés adecuado; confirmar ubicación al iniciar implementación.

## Tareas

| Tarea | Estado | Criterios relacionados |
|---|---|---|
| Agrupar los documentos del catálogo en un árbol desplegable | Completada | REQ-001-AC-09 |
| Integrar selección del documento con el visor existente | Completada | REQ-001-AC-09 |
| Añadir búsqueda por título y ruta y restauración del árbol completo | Completada | REQ-001-AC-10 |
| Verificar estados vacíos, navegación y accesibilidad | Completada | REQ-001-AC-09, REQ-001-AC-10 |

## Criterios de aceptación y relación con pruebas
| Criterio de aceptación | Verificación |
|---|---|
| REQ-001-AC-09 | Prueba de componente: agrupa los documentos por carpetas, permite expandir/contraer y abre el documento elegido en el visor. |
| REQ-001-AC-10 | Prueba de componente: encuentra coincidencias en título y ruta, no en contenido, y al limpiar la consulta restaura el árbol completo. |

## Riesgos y reversión
- La jerarquía derivada de rutas puede quedar inconsistente si se duplican carpetas o se construye con claves ambiguas; usar rutas relativas completas como identidad de nodos.
- La lista está limitada actualmente por el recorrido de la API; la búsqueda cubre el catálogo devuelto, sin ampliar esos límites.
- Reversión localizada: retirar el árbol y el buscador y recuperar la lista plana; no hay migración ni datos persistidos.

## Decisiones que requieren aprobación
- Ninguna decisión de producto pendiente: el alcance de búsqueda y las raíces cubiertas fueron acordados para REQ-001.
- Plan aprobado por el propietario del proyecto el 2026-11-12.

## Comandos de verificación
- Prueba de componente de la vista Documentación para AC-09 y AC-10.
- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run verify`

## Condiciones de entrega
AC-09 y AC-10 satisfechos; selección, navegación por enlaces internos y visor actual conservados; comprobaciones ejecutadas y anotadas en `progress.md`; revisión final del diff sin cambios fuera del alcance.
