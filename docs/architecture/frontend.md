# Arquitectura frontend

Estado: stack adoptado. La aplicación se sirve localmente desde el backend Node; el navegador no accede directamente al sistema de archivos ni a procesos del sistema.

## Tecnologías

- React + Vite + TypeScript.
- React Router en Data Mode.
- TanStack Query para estado del servidor/API local.
- React Hook Form para formularios.
- Zod para validación en runtime.
- shadcn/ui con Tailwind CSS.
- Zustand para estado de cliente solo cuando React state o URL state no sean suficientes.
- Vitest para pruebas unitarias y de componentes.

## Áreas principales

- Project Workspace: selección de proyecto, árbol de archivos y resumen.
- Documentation: Markdown, diagramas Mermaid y navegación documental.
- Features: requisitos, planes, tareas y trazabilidad.
- Agent Center: sesiones, eventos y permisos (V0.2).
- Git: estado, ramas y diferencias; operaciones de escritura en fases posteriores.

## Responsabilidades

- Las rutas componen páginas y módulos funcionales.
- Cada módulo funcional es propietario de su interfaz, hooks y comportamiento.
- Los componentes UI compartidos se incorporan solo cuando exista reutilización real.
- El acceso a la API se centraliza en un cliente tipado.
- Zod valida los datos externos en runtime.
- TanStack Query gestiona estado del servidor, caché, invalidación y mutaciones.
- Zustand gestiona únicamente estado de cliente o de interfaz compartido entre rutas.
- React Hook Form gestiona la interacción del formulario; Zod define sus reglas de validación.

## Estructura funcional propuesta

```text
apps/web/src/
  app/
  features/<feature>/
    api/
    components/
    hooks/
    schemas/
    routes/
    types/
  components/ui/
  lib/
  styles/
```

## Reglas

- Nunca dupliques en Zustand los datos gestionados por TanStack Query.
- Prioriza parámetros URL para filtros, paginación y estado de navegación compartible.
- Mantén las reglas de negocio fuera de los componentes de presentación.
- Evita stores globales y providers grandes sin una necesidad clara.
- Mantén accesibles y semánticamente correctos los componentes shadcn/ui.
- No permitas que componentes React accedan directamente a rutas locales, variables de entorno o procesos.
- Representa estados de carga, vacío, error y permisos denegados de forma explícita.

## Pruebas

Utiliza Vitest. Añade Testing Library y user-event cuando se preparen las primeras pruebas de componentes. Prueba comportamiento visible para el usuario, validación y transiciones de estado. En V0.1 se cubre la sanitización Markdown y la API sin añadir una herramienta E2E de navegador.

Las versiones exactas de los paquetes se seleccionarán al crear la aplicación y quedarán registradas en el lockfile.
