# Infraestructura y ejecución local

Estado: aplicación local; no existe infraestructura cloud prevista para el producto inicial.

## Modelo de despliegue

El usuario inicia un proceso local en su equipo y abre la interfaz en el navegador. El backend y el frontend se sirven desde el mismo origen local. No se requiere Docker, Hetzner, Dockge, Traefik ni Cloudflare para el desarrollo o uso personal.

## Datos

- Los repositorios permanecen en sus rutas originales.
- La base de datos y las preferencias viven en el directorio de datos de usuario del sistema operativo.
- Los logs locales no deben incluir credenciales ni secretos.
- No se sincronizan datos con servicios externos.
- No se almacenan claves API de modelos: cada CLI gestiona su autenticación.

## Red

- El servidor escucha únicamente en loopback.
- No se publica el puerto en LAN ni en Internet.
- No se configura reverse proxy ni DNS público.
- No se expone la base de datos local en un puerto TCP.

## Arranque y ciclo de vida

La experiencia final deberá ofrecer un comando de inicio simple y abrir el navegador. Durante el desarrollo se podrán ejecutar frontend y backend por separado. La estrategia de empaquetado y actualización automática no forma parte de V0.1 y necesita una decisión propia.

## Distribución futura

No se adopta todavía Tauri, Electron ni un empaquetador nativo. La primera versión se validará como aplicación web servida por un proceso local. Una envoltura desktop solo se considerará si aporta valor claro en selección de carpetas, notificaciones, terminal o ciclo de vida del proceso.

## Instalación reproducible

Se mantiene pnpm workspaces y Node.js 26. Las dependencias, scripts y requisitos del runtime deben quedar fijados en el lockfile y la documentación del repositorio.
