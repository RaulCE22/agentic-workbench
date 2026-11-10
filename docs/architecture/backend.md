# Arquitectura del backend local

Estado: dirección arquitectónica aceptada; detalles de implementación pendientes de pruebas técnicas.

## Responsabilidad

El backend no es una API de negocio remota. Es el proceso de confianza local que conecta la interfaz con los recursos del sistema operativo.

Responsabilidades:
- Servir la SPA y la API desde un mismo origen local.
- Validar identidad de la instancia, origen y permisos de las peticiones.
- Mantener el registro de proyectos y preferencias locales.
- Leer archivos y enumerar directorios dentro de raíces autorizadas.
- Renderizar datos seguros para el visor de documentación.
- Consultar Git y producir resúmenes/diffs.
- Gestionar procesos CLI y sus flujos de entrada/salida en las fases que lo habiliten.
- Persistir metadatos, sesiones y eventos locales.

## Stack

- Node.js 26.
- Hono con adaptador Node.
- TypeScript estricto.
- Zod para validar entradas y salidas en límites de confianza.
- SQLite como persistencia local prevista; ORM y driver pendientes.
- Server-Sent Events (SSE) como primera opción para transmitir actividad del backend a la SPA; confirmar en prueba técnica.

No se utiliza PostgreSQL ni Better Auth en la arquitectura inicial: no hay servidor remoto ni usuarios multiusuario. La autenticación de los agentes permanece en sus respectivos CLI.

## Organización propuesta

```text
apps/api/src/
  app/
  config/
  modules/
    projects/
    files/
    documentation/
    features/
    git/
    agents/                # V0.2
    settings/
  infrastructure/
    database/
    filesystem/
    processes/
  shared/
    errors/
    security/
    utils/
```

No crees carpetas vacías para capas teóricas. Añade cada módulo cuando tenga una responsabilidad implementada.

## Acceso al sistema de archivos

- Solo se accede a proyectos que el usuario haya registrado explícitamente.
- Canonicaliza la raíz autorizada y cada ruta solicitada.
- Resuelve enlaces simbólicos y comprueba que el destino sigue dentro de la raíz permitida.
- Bloquea traversal, rutas absolutas inesperadas y dispositivos especiales.
- Ignora por defecto directorios voluminosos como .git, node_modules, dist, build, .next, .turbo y coverage.
- Aplica límites de tamaño, profundidad y número de entradas.
- No lee secretos por defecto; define política explícita para archivos como .env, claves y credenciales.
- No permite escritura durante V0.1.

## Procesos y Git

Los procesos deben iniciarse mediante APIs de proceso con ejecutable y argumentos separados. No se usa shell: true, interpolación ni comandos arbitrarios proporcionados por el navegador. Cada proceso debe tener directorio de trabajo validado, timeout, límites de stdout/stderr, gestión de señales y registro de código de salida.

Git se consulta inicialmente en modo de solo lectura. Las operaciones de escritura se incorporarán por fases y con confirmación explícita.

## API y eventos

La API se organiza por módulos y contratos Zod. Los eventos asíncronos (por ejemplo, cambios de estado de un agente) pueden transmitirse por SSE. Los eventos de los CLI se conservan con su identificador de proveedor y versión, además de cualquier representación común.

## Seguridad del servidor local

La instancia debe:
- Escuchar únicamente en 127.0.0.1 o ::1.
- Rechazar encabezados Host y orígenes no permitidos.
- Proteger operaciones mutables frente a CSRF y DNS rebinding.
- Usar un mecanismo de sesión local no reutilizable entre instancias; la solución exacta queda pendiente de ADR.
- Evitar CORS abierto.
- No exponer consola de depuración ni endpoints de administración.
- Mantener logs locales sin credenciales ni secretos.

## Persistencia

Se prevé una base SQLite en el directorio de datos de usuario del sistema operativo, fuera del repositorio gestionado. Los archivos de código y documentación siguen perteneciendo a cada proyecto y no se copian a la base de datos. La selección de driver, ORM, migraciones y política de backup requiere una prueba técnica antes de implementarse.
