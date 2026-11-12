# Aplicación web

SPA React + Vite + TypeScript. El servidor local entrega el bundle compilado junto con la API desde el mismo origen.

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

La SPA usa React Router para las áreas, TanStack Query para los datos de API y DOMPurify para sanear Markdown. Mermaid se renderiza en modo estricto y las imágenes remotas de Markdown se bloquean.
