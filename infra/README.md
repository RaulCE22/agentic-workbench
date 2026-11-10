# Infraestructura

Agentic Workbench es una aplicación local-first. No necesita despliegue en Hetzner, Docker, Dockge, Traefik ni Cloudflare para funcionar.

La carpeta infra se conserva por herencia de la base agentic-engineering y no contiene infraestructura activa del producto. No añadas configuraciones de despliegue cloud salvo que se apruebe un caso de distribución remota distinto de la aplicación local.

La persistencia local se guarda en el directorio de datos de usuario, fuera de los repositorios registrados. El servidor solo escucha en loopback.
