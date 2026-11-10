# Backend local

Directorio reservado para el servidor Node.js + Hono. Todavía no se ha generado código fuente.

Este backend es el proceso local de confianza que conecta la interfaz con el sistema de archivos, Git, procesos CLI y persistencia SQLite. No es una API remota multiusuario.

Consulta:
- docs/architecture/backend.md
- docs/architecture/overview.md
- docs/quality/security-baseline.md
- docs/architecture/pending-decisions.md

Principios:
- Escuchar únicamente en loopback.
- Autorizar explícitamente las raíces de proyecto.
- Canonicalizar rutas y comprobar symlinks.
- No ejecutar comandos arbitrarios ni usar shell interpolation.
- Mantener los módulos de dominio independientes de Hono.
- Validar entradas con Zod.
- Persistir solo metadatos propios de Workbench fuera de los repositorios.
- No implementar escritura de archivos ni operaciones Git mutables en V0.1.
