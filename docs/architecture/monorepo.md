# Arquitectura del monorepo

## Estructura de espacios de trabajo

```text
apps/
  web/                 # Aplicación de navegador React + Vite
  api/                 # API local Node.js + Hono

packages/
  contracts/           # Contratos de transporte Zod compartidos
  (futuros paquetes)   # Añadir solo cuando exista reutilización real

docs/                  # Producto, arquitectura, requisitos, ADR, calidad y planes
.agents/skills/        # Skills independientes del proveedor
scripts/engineering/   # Utilidades deterministas de ingeniería
infra/                 # Docker, Dockge, Traefik y Cloudflare
```

## Estructura de documentación

La documentación del proyecto, incluidos los planes activos y completados, se mantiene bajo `docs/`:

```text
docs/
  README.md
  agents/
  architecture/
  decisions/
  plans/
    active/
    completed/
  product/
  quality/
  requirements/
  templates/
  workflows/
```

Los README e instrucciones que las herramientas requieren en la raíz o junto a un paquete permanecen fuera de `docs/` como referencias locales breves. Los documentos canónicos y planes se mantienen bajo `docs/`.

## Reglas del monorepo
- Utiliza pnpm workspaces. No añadas Turborepo hasta que el tiempo de ejecución de tareas o el grafo de dependencias lo justifiquen.
- Cada aplicación desplegable es propietaria de sus dependencias de ejecución, compilación, configuración de entorno y Dockerfile.
- Los paquetes compartidos deben tener un propósito acotado y exportaciones explícitas.
- No crees paquetes genéricos utils ni compartas código sin un segundo consumidor real.
- Mantén inicialmente los componentes shadcn/ui dentro de apps/web. Crea un paquete UI compartido solo cuando otra aplicación lo necesite.
- Coloca contratos Zod compartidos en packages/contracts únicamente cuando frontend y backend los consuman.
- El esquema de base de datos, la configuración de Drizzle y las migraciones pertenecen a apps/api.
- Evita dependencias circulares e importaciones de rutas internas de otros paquetes.

## Nomenclatura
Utiliza nombres de paquete con ámbito, por ejemplo @app/web, @app/api y @app/contracts. Usa kebab-case en minúsculas para directorios y archivos, salvo que una herramienta exija otra convención. Mantén TypeScript en modo estricto.

## Aplicaciones futuras
Añade nuevas unidades desplegables como apps/<nombre>. Documenta su propósito, runtime, dependencias, puertos, comprobaciones de salud, variables de entorno y estrategia de despliegue.
