# Runtime y herramientas

## Versión de Node.js

- Runtime del proyecto: Node.js 24 LTS.
- Versión fijada: 24.15.0.
- Justificación del cambio: fijado en Node.js 24.15.0 por compatibilidad con el sistema y el entorno de ejecución del equipo.
- Node 24 entró en Active LTS en octubre de 2025. Su fin de vida programado es el 30-04-2028; el calendario puede cambiar según las políticas de soporte oficiales.
- Node.js se fija mediante .nvmrc, .node-version y engines en package.json (>=24.0.0 <25.0.0).

Referencias oficiales:
- https://nodejs.org/en/about/previous-releases
- https://github.com/nodejs/Release
- https://github.com/nodejs/node/blob/main/BUILDING.md

## Compatibilidad con macOS

Los binarios oficiales de Node.js 24 para macOS requieren macOS 13.5 o posterior. Un Mac con macOS 12 Monterey no puede ejecutar estos binarios oficiales.

Node.js 22 es compatible con versiones anteriores de macOS, incluida macOS 11, pero su fin de vida está programado para el 30-04-2027. No se selecciona como runtime estándar de esta nueva base reutilizable porque está demasiado cerca del fin de soporte.

Solución preferida: actualizar el Mac de desarrollo a macOS 13.5 o posterior, idealmente a una versión de macOS que siga teniendo soporte. Si no es posible, utiliza un entorno de desarrollo remoto Linux soportado en lugar de cambiar silenciosamente la versión estándar de Node del repositorio.

El runtime Node 24 sobre Linux utilizado en CI y despliegue no está afectado por el requisito de los binarios de macOS.

## pnpm

- Versión fijada del gestor de paquetes: pnpm 10.28.2.
- package.json declara packageManager (pnpm@10.28.2) y el rango de versiones compatible (>=10.0.0 <13.0.0).
- Instalación de la versión fijada de pnpm:

```bash
npm install --global pnpm@10.28.2
```

El script scripts/engineering/check-workspace.mjs valida que la versión de Node sea 24.x y que packageManager declare pnpm 10.x.

Referencias oficiales:
- https://pnpm.io/
- https://github.com/nodejs/node/blob/main/doc/contributing/distribution.md

## Actualización del runtime

Cuando se adopte una nueva versión de Node, actualiza conjuntamente .nvmrc, .node-version y la versión documentada. Mantén package.json engines alineado con la versión principal soportada. Revisa dependencias nativas y CI antes de cambiar de versión principal.
