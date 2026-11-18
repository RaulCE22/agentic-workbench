---
name: backend-architecture
description: Aplica el estándar de monolito modular a proyectos backend nuevos y revisa módulos, límites HTTP, persistencia y dependencias.
---

# Arquitectura backend

1. Lee `docs/standards/backend.md` y confirma el stack aprobado; ADR-0003 conserva su POC pendiente.
2. Organiza por dominios y crea capas solo cuando aporten una responsabilidad real.
3. Haz que HTTP delegue en casos de uso; cruza dominios por APIs públicas, sin ciclos ni acceso a persistencia ajena.
4. Valida configuración y entradas en los límites, y revisa autorización, errores y redacción de logs.
5. Ejecuta `pnpm run check:architecture:backend` cuando esté configurado; revisa manualmente lo semántico.
