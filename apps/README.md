# Aplicaciones

Cada directorio de apps/ representa una aplicación del producto. El Workbench se distribuye inicialmente como una aplicación local con frontend y backend coordinados, no como servicios cloud independientes.

- web/: SPA React + Vite que se ejecuta en el navegador local.
- api/: servidor local Node.js + Hono; único componente con acceso al sistema de archivos, Git, procesos y persistencia.

Mantén separados los módulos de frontend y backend, pero evita tratarlos como microservicios. No añadas Dockerfiles ni configuración de despliegue remoto sin una necesidad aprobada.
