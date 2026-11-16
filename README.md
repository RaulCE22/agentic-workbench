# Agentic Workbench

Aplicación web local para explorar proyectos registrados, consultar su documentación y estado declarado, y revisar Git en modo de solo lectura.

## Documentación

- [Índice de documentación](docs/README.md)
- [Visión y hoja de ruta](docs/product/vision.md)
- [Planes activos y completados](docs/plans/README.md)
- [Arquitectura y seguridad](docs/architecture/overview.md)

Los documentos del proyecto, incluidos requisitos, decisiones, planes y progreso, viven bajo `docs/`. Los archivos Markdown junto a aplicaciones, paquetes y herramientas sirven como referencias locales breves.

## Desarrollo

Requisitos: Node.js 24 y pnpm 10. Consulta [runtime](docs/architecture/runtime.md).

```bash
pnpm install
pnpm run verify
pnpm dev
```

La aplicación escucha en `127.0.0.1:4173`. Workbench lee únicamente las carpetas de proyecto registradas y no expone el servidor a la red.
