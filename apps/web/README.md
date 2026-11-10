# Aplicación web

Directorio reservado para la SPA React + Vite + TypeScript. El stack frontend está definido en docs/architecture/frontend.md y ADR-0002. Todavía no se ha generado código fuente.

Áreas iniciales:
- Project Workspace.
- Documentation.
- Features.
- Git (solo lectura en V0.1).

Al preparar la aplicación:
- Utiliza módulos organizados por funcionalidad.
- Configura React Router Data Mode.
- Utiliza TanStack Query para el estado del servidor local.
- Utiliza React Hook Form + Zod para formularios.
- Mantén los componentes shadcn/ui dentro de esta aplicación.
- Utiliza Zustand únicamente para estado compartido de cliente.
- Configura Vitest y pruebas de componentes.
- No accedas directamente desde el navegador a rutas del sistema ni a procesos.
