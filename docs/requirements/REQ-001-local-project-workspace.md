# REQ-001: Espacio de trabajo local de proyectos

- Estado: Aprobado
- Prioridad: Alta
- Responsable: Propietario del proyecto
- ADR relacionados: ADR-0005, ADR-0007

## Propósito

Permitir que el usuario registre y navegue sus repositorios locales desde una aplicación web local, consulte su documentación y funcionalidades y revise el estado Git sin cambiar los archivos del proyecto.

## Alcance

### Incluye

- Registro, selección y eliminación del registro de proyectos locales.
- Exploración de carpetas y archivos dentro de proyectos autorizados.
- Lectura de archivos de texto y código en modo de solo lectura.
- Visualización de Markdown y diagramas Mermaid.
- Catálogo de requisitos y planes conforme a las convenciones documentales del repositorio.
- Estado Git de solo lectura, archivos modificados y diff.
- Persistencia local de los proyectos registrados y preferencias básicas.

### No incluye

- Lanzar o controlar agentes CLI.
- Editar código o documentos.
- Crear, borrar o mover archivos.
- Stage, commit, push, pull, merge, rebase o checkout.
- Crear o eliminar ramas y worktrees.
- Terminal integrada ni ejecución arbitraria de comandos.
- Sincronización, colaboración, autenticación remota ni telemetría.

## Actores y permisos

Un único usuario local controla la instancia. El usuario registra explícitamente cada carpeta de proyecto. La interfaz solo puede consultar los recursos a los que el backend haya concedido acceso.

## Requisitos funcionales

### RF-01 — Registro de proyectos

El usuario puede registrar un proyecto proporcionando una ruta local existente. El backend valida y canonicaliza la ruta, detecta si contiene un repositorio Git y guarda el registro localmente.

### RF-02 — Selección y gestión

El usuario puede seleccionar un proyecto registrado, cambiar entre proyectos y retirar un proyecto del listado. Retirar un registro no elimina ni modifica los archivos originales.

### RF-03 — Exploración de estructura

El usuario puede navegar por carpetas y archivos del proyecto. El explorador excluye directorios voluminosos y metadatos Git de la vista normal. La API no permite acceder a rutas fuera de la raíz autorizada.

### RF-04 — Lectura de archivos

El usuario puede abrir archivos de texto y código en modo de solo lectura. Los archivos binarios, demasiado grandes o identificados como sensibles no se muestran como texto. La V0.1 no ofrece edición.

### RF-05 — Documentación

El usuario puede consultar documentos Markdown con formato, navegación por enlaces internos y diagramas Mermaid. El contenido se trata como no confiable: no se ejecuta HTML arbitrario ni se cargan recursos externos automáticamente.

### RF-06 — Catálogo de funcionalidades

El usuario puede consultar los requisitos identificados mediante el patrón REQ-###, con título, prioridad, estado documental y enlaces a planes relacionados. La aplicación no modifica los documentos para actualizar sus estados.

### RF-07 — Estado Git

Para proyectos Git, el usuario puede consultar rama actual, estado de limpieza, archivos modificados y diff. Las operaciones son de solo lectura.

### RF-08 — Persistencia

Los proyectos registrados y las preferencias básicas sobreviven al reinicio de Workbench y se almacenan fuera de los repositorios gestionados.

### RF-09 — Actualización de vistas

El usuario puede refrescar la información del proyecto y detectar cambios realizados externamente en el repositorio.

## Requisitos no funcionales y de seguridad

- El backend escucha solo en loopback.
- Las peticiones del navegador se validan por Host y Origin exactos; el servidor acepta únicamente su origen local.
- Las rutas se canonicalizan y se comprueban tras resolver enlaces simbólicos.
- Se aplican límites de tamaño, profundidad y volumen en exploración y lectura.
- Los endpoints de V0.1 no escriben en los proyectos.
- No se envía código ni documentación a servicios externos.
- El visor no ejecuta scripts ni HTML arbitrario presente en Markdown.
- Las operaciones Git usan argumentos estructurados y no interpolan comandos en un shell.
- Los errores no exponen rutas internas innecesarias ni secretos.

## Criterios de aceptación

### REQ-001-AC-01 — Registrar un repositorio
Dado que existe una carpeta local válida, cuando el usuario la registra, entonces aparece en la lista de proyectos y queda disponible tras reiniciar la aplicación.

### REQ-001-AC-02 — Rechazar rutas no autorizadas
Dado un proyecto registrado, cuando se solicita un archivo fuera de su raíz (incluyendo un escape mediante symlink), entonces el backend rechaza la petición.

### REQ-001-AC-03 — Explorar sin modificar
Dado un proyecto con archivos, cuando el usuario navega por su estructura y abre un archivo, entonces puede consultar su contenido sin que Workbench modifique el repositorio.

### REQ-001-AC-04 — Visualizar documentación
Dado un Markdown que contiene encabezados, enlaces y un diagrama Mermaid, cuando se abre en el visor, entonces se muestra su contenido y el diagrama sin ejecutar HTML o scripts arbitrarios.

### REQ-001-AC-05 — Consultar funcionalidades
Dado un proyecto con requisitos y planes documentados, cuando el usuario abre el catálogo, entonces ve los identificadores, títulos, estados documentales y enlaces que puedan resolverse.

### REQ-001-AC-06 — Consultar Git
Dado un repositorio con cambios sin confirmar, cuando el usuario abre su vista Git, entonces se muestran la rama, los archivos afectados y un diff coherente con el estado actual.

### REQ-001-AC-07 — No alterar Git
Dada cualquier consulta disponible en la V0.1, cuando se ejecuta, entonces no cambia rama, índice, commits ni archivos del repositorio.

### REQ-001-AC-08 — Mantener los datos locales
Dado un proyecto registrado, cuando se reinicia Workbench, entonces se conserva su registro sin copiar sus archivos a otro directorio ni transmitirlos fuera del equipo.

### REQ-001-AC-09 — Navegar la documentación en árbol
Dado un proyecto con documentos Markdown dentro de `docs/` y `plans/`, cuando el usuario abre Documentación, entonces ve los documentos organizados por carpeta y puede desplegar o contraer carpetas. Cuando selecciona un documento, se muestra en el visor.

### REQ-001-AC-10 — Buscar documentación
Dado un proyecto con documentos Markdown dentro de `docs/` y `plans/`, cuando el usuario introduce una consulta en el buscador de Documentación, entonces se muestran los documentos cuyo título o ruta coincide con la consulta, sin buscar en el contenido. Cuando borra la consulta, vuelve a mostrarse el árbol completo.

## Decisiones técnicas

Las decisiones de persistencia JSON, acceso local, rutas, límites de lectura, Git y pruebas de V0.1 están aprobadas en [ADR-0007](../decisions/ADR-0007-v0-1-seguridad-y-persistencia-local.md). La implementación aplica límites conservadores y no habilita acceso remoto.

## Trazabilidad

- Plan: ../../plans/active/v0-1-project-workspace/plan.md
- ADR: ../decisions/ADR-0005-arquitectura-local-first.md
