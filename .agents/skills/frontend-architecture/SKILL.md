---
name: frontend-architecture
description: Aplica el estándar Feature-Sliced Design del repositorio a proyectos frontend nuevos y revisa capas, slices, estado y APIs públicas.
---

# Arquitectura frontend

1. Lee `docs/standards/frontend.md` y el stack aprobado del proyecto.
2. Empieza por páginas y extrae slices solo ante responsabilidades o límites estables.
3. Respeta dirección de capas, APIs públicas y propiedad única de estado descritas en el estándar.
4. Valida límites con `pnpm run check:architecture:frontend` cuando esté configurado.
5. Expón dudas de dominio o límites semánticos al responsable; el linter no toma esas decisiones.
