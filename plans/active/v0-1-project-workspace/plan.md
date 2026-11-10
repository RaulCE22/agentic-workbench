# Plan de implementación: V0.1 — Project Workspace

- Estado: Borrador
- Requisitos: REQ-001
- ADR relacionados: ADR-0005; ADR-0006 (referencia futura)
- Riesgo: Alto
- Aprobación: Pendiente

## Objetivo

Entregar una aplicación web local que permita registrar proyectos, explorar su estructura, leer documentación y código, consultar funcionalidades documentadas y revisar Git sin modificar los repositorios.

## Alcance

### Incluye

- Servidor local y frontend servidos desde un origen.
- Alta de proyectos y persistencia local.
- Explorador seguro de archivos.
- Visor Markdown con Mermaid.
- Catálogo de requisitos y planes.
- Vista Git de solo lectura.
- Verificación automatizada y pruebas de seguridad de rutas.

### No incluye

- Gestión de agentes o sesiones CLI.
- Escritura en archivos o documentos.
- Operaciones Git mutables.
- Terminal integrada.
- Worktrees.
- Multiusuario, cloud o telemetría.
- Empaquetado desktop.

## Situación actual

El repositorio hereda la estructura de agentic-engineering. Existen los workspaces apps/web, apps/api y packages/contracts, pero todavía no contienen una aplicación. La plantilla original proponía PostgreSQL, Better Auth y despliegue Hetzner; esas decisiones no aplican a este producto local.

## Diseño propuesto

- apps/web: SPA React con áreas Project, Documentation, Features y Git.
- apps/api: servidor Node/Hono, acceso al sistema de archivos, parser documental, consultas Git y persistencia.
- Persistencia: SQLite local; driver/ORM pendiente de prueba técnica.
- Contratos: Zod para los recursos expuestos por API.
- Comunicación: HTTP para consultas y comandos de lectura; SSE solo cuando exista una actualización asíncrona que lo justifique.
- Seguridad: loopback, validación de origen, autorización de raíces, resolución segura de rutas y endpoints de solo lectura.

## Fases de implementación

1. Decisiones técnicas y pruebas de concepto: DB-01/02, SEC-01, FS-01/02, GIT-01 y QA-01.
2. Esqueleto ejecutable: scripts de desarrollo, health check, configuración, cierre limpio, SPA y layout.
3. Registro y exploración: alta/selección, enumeración de directorios, lectura, límites y pruebas traversal/symlink.
4. Documentación y funcionalidades: visor Markdown/Mermaid, catálogo REQ y enlaces a planes.
5. Git de solo lectura: estado, rama, archivos modificados, diff y pruebas de ausencia de mutaciones.
6. Cierre: accesibilidad, errores, estados vacíos, rendimiento, pruebas y revisión independiente.

## Criterios de aceptación y relación con pruebas

| Criterio | Verificación prevista |
|---|---|
| REQ-001-AC-01 | Prueba API de registro + reinicio |
| REQ-001-AC-02 | Pruebas de traversal, symlink y raíces |
| REQ-001-AC-03 | Pruebas de lectura y snapshot del repositorio |
| REQ-001-AC-04 | Pruebas de renderizado/sanitización Markdown |
| REQ-001-AC-05 | Pruebas del parser de REQ y planes |
| REQ-001-AC-06 | Pruebas de estado y diff Git |
| REQ-001-AC-07 | Comprobación del estado Git antes/después |
| REQ-001-AC-08 | Pruebas de persistencia local y ausencia de llamadas externas |

## Riesgos y reversión

- Acceso local excesivo: limitar operaciones a raíces autorizadas y probar escapes.
- Markdown no confiable: sanitizar HTML y bloquear cargas remotas automáticas.
- Git con salidas inesperadas: usar formatos estables, codificación robusta y límites de salida.
- Dependencias nativas SQLite: validar instalación en macOS Apple Silicon y Linux antes de elegir driver.
- Procesos/puertos locales: validar Host/Origin y no escuchar en interfaces públicas.

La reversión de la V0.1 consiste en eliminar el directorio de datos de Workbench y desinstalar la aplicación; los repositorios originales no deben verse afectados.

## Decisiones que requieren aprobación

- Selección del driver y ORM SQLite.
- Modelo de seguridad de la instancia local.
- Política de symlinks, exclusiones y archivos sensibles.
- Estrategia de pruebas E2E.
- Confirmar si el primer visor muestra todos los archivos de texto o solo código/documentación detectados.

## Comandos de verificación

- pnpm run verify
- pnpm run typecheck
- pnpm run lint
- pnpm run test
- Pruebas de integración API + filesystem + Git.
- Prueba manual en macOS Apple Silicon.

Los comandos aún no existen todos en el repositorio; se incorporarán al crear las aplicaciones.

## Condiciones de entrega

REQ-001-AC-01 a REQ-001-AC-08 satisfechos, comprobaciones ejecutadas y resultados registrados, revisión independiente del diff completada y documentación actualizada.
