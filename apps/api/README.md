# Backend local

Servidor Node.js + Hono que sirve la SPA y la API desde `127.0.0.1:4173`.

Este backend es el proceso local que conecta la interfaz con el sistema de archivos, Git y el registro JSON de Workbench. No es una API remota multiusuario.

Consulta la [arquitectura del backend](../../docs/architecture/backend.md), la [visión general](../../docs/architecture/overview.md) y la [línea base de seguridad](../../docs/quality/security-baseline.md).

La API valida los documentos Markdown del repositorio como datos no confiables y solo devuelve campos derivados necesarios para la interfaz. No escribe en los proyectos registrados.

Inicia desde la raíz del monorepo con `pnpm dev`. El comando compila la SPA y el servidor antes de levantar la aplicación local.
