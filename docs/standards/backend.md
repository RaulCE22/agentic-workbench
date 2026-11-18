# Estándar backend: monolito modular

## Alcance y stack

Organiza un único backend desplegable por dominios, sin separar servicios antes de que exista necesidad. La estructura de este documento está aceptada. El stack candidato para proyectos nuevos (Node LTS, TypeScript, Hono, PostgreSQL, Drizzle, Zod y Better Auth opcional) continúa sujeto a ADR-0003 y su POC; este estándar no lo cierra ni altera el backend de Workbench.

## Estructura

```text
src/
  app/                         # ensamblaje, configuración e inyección
  modules/<domain>/
    http/                      # rutas, handlers y schemas de transporte
    application/               # casos de uso y coordinación
    domain/                    # invariantes, cuando existan
    infrastructure/            # persistencia e integraciones, cuando existan
    index.ts                   # API pública del módulo
  db/                          # conexión y migraciones, si se usa SQL
  shared/                      # capacidades transversales pequeñas y estables
```

Un módulo solo crea las capas necesarias. HTTP valida y transforma entrada/salida y delega casos de uso; nunca consulta persistencia directamente. Aplicación coordina reglas y operaciones. Dominio contiene invariantes cuando existen. Infraestructura implementa puertos/adapters justificados, sin repositorios por ceremonia. `app` conecta módulos mediante inyección y fachadas públicas. `shared` no se convierte en un cajón de sastre.

Los módulos no importan internals de otros dominios, no acceden directamente a sus tablas/repositorios y no forman ciclos. Cruzan límites mediante la API pública del módulo propietario. Las transacciones se sitúan en el caso de uso que requiere atomicidad multi-escritura.

## Límites de confianza y errores

Valida configuración y entradas HTTP con Zod. El middleware central traduce errores tipados a respuestas públicas estables y no filtra stack traces, secretos ni detalles internos. Autoriza por operación y recurso; la autenticación solo se incorpora si el producto la necesita. Los logs estructurados redactan credenciales y datos sensibles. Migraciones SQL son explícitas y revisables.

## Pruebas y validación

Prueba reglas y casos de uso de forma unitaria; adaptadores y migraciones con integración; rutas, validación, permisos y formato de error a nivel API. Ejecuta `pnpm run check:architecture:backend`. dependency-cruiser detecta ciclos e imports prohibidos declarados; no demuestra aislamiento semántico, transacciones correctas ni autorización completa. Consulta [ADR-0010](../decisions/ADR-0010-backend-modular-monolith.md) y [ADR-0011](../decisions/ADR-0011-architecture-validation-tools.md).
