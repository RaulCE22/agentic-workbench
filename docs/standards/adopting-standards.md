# Adoptar los estándares en un repositorio

## Frontend o backend

1. Copia el paquete aplicable de `templates/standards/frontend/` o `templates/standards/backend/` al repositorio nuevo. Conserva sus archivos de configuración y ejemplos útiles; elimina los placeholders que no uses.
2. Copia el estándar correspondiente de `docs/standards/` a `docs/standards/` del nuevo repositorio.
3. Copia la skill correspondiente de `.agents/skills/frontend-architecture/` o `backend-architecture/` a `.agents/skills/`. Los cuatro CLI admitidos comparten esta ubicación; Claude Code la descubre mediante `.claude/skills/` cuando el proyecto configura ese enlace.
4. Añade los comandos de arquitectura a los scripts existentes y fija las versiones de las herramientas en el manifiesto/lockfile del proyecto.
5. Adapta el esqueleto al stack y a los límites reales del proyecto sin vaciar capas ni slices.

La copia es offline y autónoma: las instrucciones locales apuntan a rutas del repositorio nuevo. No se necesita clonar Workbench ni acceder a sus documentos para aplicar el paquete. La instalación de dependencias de validación requiere el registro de paquetes elegido por el proyecto.

## Full-stack

Combina ambos paquetes. Mantén frontend y backend como aplicaciones con sus propias configuraciones, scripts y límites. No compartas módulos de dominio a través de capas de UI o transporte; comparte contratos explícitos solo si el proyecto los necesita.
