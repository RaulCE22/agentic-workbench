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
- Interpretar la convención documental acordada y devolver una vista derivada del estado del proyecto.
- Consultar Git y producir resúmenes/diffs.
- Persistir el registro pequeño de proyectos y preferencias locales.

## Stack

- Node.js 24 (24.15.0).
- Hono con adaptador Node.
- TypeScript estricto.
- Zod para validar entradas y salidas en límites de confianza.
- Archivo JSON local para el registro pequeño de proyectos y preferencias; sin ORM ni servicio de base de datos en V0.1.
- No se usan eventos asíncronos en V0.1; evaluar SSE cuando exista una vista que necesite recibir actividad en vivo.

No se utiliza PostgreSQL ni Better Auth en la arquitectura inicial: no hay servidor remoto ni usuarios multiusuario. Workbench no ejecuta agentes ni gestiona sus credenciales.

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
    project-state/         # solo cuando se implemente el lector definido por REQ-002
    git/
    settings/
  infrastructure/
    database/
    filesystem/
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

## Git

Git se consulta inicialmente en modo de solo lectura. Las operaciones de escritura se incorporarán por fases y con confirmación explícita.

## API y eventos

La API se organiza por módulos y contratos Zod. La vista de estado se deriva de documentos del proyecto y Git, sin persistir una copia de los estados. La actualización se solicita mediante las consultas existentes; no hay un canal de eventos en el alcance actual.

## Seguridad del servidor local

La instancia debe:
- Escuchar únicamente en 127.0.0.1 o ::1.
- Rechazar encabezados Host y orígenes no permitidos.
- Rechazar peticiones de otros orígenes y validar Host para reducir CSRF y DNS rebinding en el servidor local.
- Para V0.1, limitar acceso a loopback, Host/Origin exactos y mismo origen; sin CORS ni autenticación multiusuario.
- Evitar CORS abierto.
- No exponer consola de depuración ni endpoints de administración.
- Mantener logs locales sin credenciales ni secretos.

## Persistencia

El registro JSON se guarda en el directorio de datos de usuario de Workbench, fuera de los repositorios gestionados. Los archivos de código y documentación siguen en su ubicación original y no se copian al registro.
