# Backend local

Servidor Node.js + Hono que sirve la SPA y la API desde `127.0.0.1:4173`.

Este backend es el proceso local que conecta la interfaz con el sistema de archivos, Git y el registro JSON de Workbench. No es una API remota multiusuario.

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
- Persistir solo el registro y preferencias de Workbench en `~/.agentic-workbench/projects.json`, fuera de los repositorios.
- No implementar escritura de archivos ni operaciones Git mutables en V0.1.

Inicia desde la raíz del monorepo con `pnpm dev`. El comando compila la SPA y el servidor antes de levantar la aplicación local.
