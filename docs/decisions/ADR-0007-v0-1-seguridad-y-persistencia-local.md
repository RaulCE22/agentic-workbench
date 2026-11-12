# ADR-0007: Seguridad simple y persistencia local para V0.1

- Estado: Aceptado
- Fecha: 2026-11-11
- Responsable de la decisión: Propietario del proyecto

## Contexto

La primera entrega se ejecutará por una única persona en su portátil. Workbench necesita leer proyectos registrados explícitamente y guardar una lista pequeña de rutas y preferencias. Una base de datos, autenticación multiusuario, CORS y un despliegue de red no aportan valor a este flujo inicial.

## Decisiones

1. El servidor escucha exclusivamente en `127.0.0.1` y sirve la SPA y la API desde el mismo origen.
2. No se habilita CORS. Se rechazan `Host` y `Origin` que no correspondan al origen local activo.
3. El backend solo accede a carpetas registradas explícitamente por el usuario. Las rutas se canonicalizan y cualquier destino fuera de la raíz autorizada, incluido por symlink, se rechaza.
4. La lista de proyectos y preferencias se guarda como JSON en el directorio de datos de Workbench, fuera de los repositorios. No se añade SQLite ni ORM en V0.1.
5. Los cambios del registro local se limitan a añadir/retirar proyectos y guardar preferencias. No se escriben archivos en proyectos ni se muta Git.
6. Se excluyen nombres conocidos de secretos y se aplican límites de tamaño, profundidad y volumen a las operaciones de lectura.
7. Git se consulta con el ejecutable instalado mediante argumentos separados, sin shell y solo con subcomandos de lectura.
8. Las pruebas de API, filesystem y Git cubren los límites relevantes. No se añade una herramienta E2E de navegador a esta entrega.

## Consecuencias

- No hay servidor de base de datos, esquema, migraciones ni dependencia ORM que instalar y mantener.
- El backend sigue siendo un proceso privilegiado respecto a los archivos que el usuario registre; el binding loopback y las validaciones de origen son controles obligatorios.
- La política de exclusiones y límites se implementa con valores conservadores documentados y pruebas.
- Si el producto añade usuarios, acceso desde otros dispositivos o escritura en proyectos, esta decisión debe revisarse antes de ampliar la API.

## Relación con decisiones anteriores

Este ADR concreta la V0.1 de ADR-0005. Sustituye para el registro inicial la previsión de SQLite, sin descartar una base local si el volumen o los requisitos de persistencia crecen.
