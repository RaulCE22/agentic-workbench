# Esqueleto frontend FSD

Este paquete muestra una estructura mínima. Copia `src/` y `steiger.config.ts` al proyecto destino. Añade las dependencias exactas acordadas allí; consulta `docs/standards/frontend.md` para las reglas y `.agents/skills/frontend-architecture/` para las instrucciones del agente.

Las carpetas `.gitkeep` solo representan ubicaciones iniciales; elimina las que no tengan contenido real.

## Validación

`pnpm run check:architecture:frontend` ejecuta Steiger con el preset recomendado del plugin FSD. En macOS el watcher de chokidar puede agotar descriptores (`EMFILE: too many open files, watch`); el script fija `CHOKIDAR_USEPOLLING=1` para usar polling y evitar ese fallo. En otros sistemas puedes quitar la variable si no lo necesitas.
