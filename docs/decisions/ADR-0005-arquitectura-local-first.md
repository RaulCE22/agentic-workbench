# ADR-0005: Arquitectura local-first para Agentic Workbench

- Estado: Aceptado
- Fecha: 2026-11-10
- Responsable de la decisión: Propietario del proyecto

## Contexto

Workbench debe inspeccionar repositorios del usuario, consultar Git y, en fases posteriores, iniciar procesos CLI instalados en el equipo. La aplicación no necesita ofrecer una API pública ni almacenar datos de varios usuarios. Una arquitectura cloud introduciría despliegue, autenticación remota, exposición de código y costes sin aportar valor al caso de uso inicial.

La interfaz se utilizará desde un navegador, pero necesita capacidades que el navegador no debe recibir directamente, como acceso a directorios arbitrarios y creación de procesos.

## Decisión

1. El producto se ejecutará como una aplicación web local servida por un proceso Node.js.
2. El frontend React se servirá desde el mismo origen que la API local Hono.
3. El backend escuchará exclusivamente en loopback y será el único componente con acceso al sistema de archivos, Git, procesos CLI y persistencia.
4. Los repositorios se registrarán de forma explícita y sus archivos permanecerán en su ubicación original.
5. Los metadatos propios de Workbench se almacenarán localmente en SQLite. El driver y el ORM se decidirán mediante prueba técnica.
6. No se implementarán cuentas cloud, autenticación multiusuario, sincronización remota, telemetría ni llamadas directas a APIs de modelos.
7. La autenticación y las cuotas de los agentes seguirán bajo el control de sus CLI nativos.
8. La V0.1 será de solo lectura: exploración de archivos, documentación y Git; sin edición, operaciones Git mutables ni lanzamiento de agentes.

## Seguridad exigida

- Binding exclusivo a loopback.
- Validación de Host y Origin, protección CSRF y mitigación de DNS rebinding.
- Autorización por raíces de proyectos registradas.
- Canonicalización de rutas y control de enlaces simbólicos.
- Ejecución de procesos sin shell, con argumentos validados, límites y cancelación.
- Confirmación humana para operaciones que escriban archivos, modifiquen Git o cambien permisos.

## Consecuencias

- La aplicación puede inspeccionar código y herramientas instaladas sin subirlos a un servidor remoto.
- El backend necesita controles de seguridad equivalentes a una herramienta local privilegiada.
- La persistencia es específica del equipo; no existe sincronización ni colaboración en esta etapa.
- El desarrollo puede validarse sin Docker, PostgreSQL, Better Auth, Hetzner ni un dominio público.
- Un empaquetado desktop podrá evaluarse más adelante sin alterar los límites de dominio.

## Alternativas descartadas

- Aplicación cloud: innecesaria para un único usuario local y amplía la superficie de exposición.
- Solo frontend en navegador: no puede gestionar de forma fiable directorios arbitrarios ni procesos CLI locales.
- Tauri/Electron desde el inicio: añade una decisión de empaquetado antes de validar el producto; se mantiene el navegador local como primera experiencia.
