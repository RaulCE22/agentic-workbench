# ADR-0011: Validación automatizada de límites arquitectónicos

- Estado: Aceptado
- Fecha: 2026-11-16
- Responsable de la decisión: Propietario del proyecto

## Contexto
Los estándares necesitan comprobaciones repetibles de fronteras, imports y ciclos. La herramienta debe detectar reglas estructurales sin presentarse como evaluador de cohesión o calidad semántica.

## Decisión
Se acepta una comprobación frontend `check:architecture:frontend` con Steiger y el plugin FSD oficial, usando reglas recomendadas con configuración mínima explícita y revisada, confirmada por el piloto. Se acepta comprobar backend mediante `dependency-cruiser` con reglas de imports prohibidos entre dominios/capas y ciclos. Ambos comandos se integran en scripts de calidad de los proyectos que adopten el estándar. No se agrega ninguna dependencia a Workbench en esta fase.

En la implementación se hará un piloto determinista sobre las estructuras iniciales; se fijarán versiones, configuración, alcance y modo de fallo. Si Steiger beta no cubre límites necesarios o resulta inestable, la aprobación de la herramienta queda pendiente y se reconsidera una comprobación basada en ESLint existente. Un validador no puede decidir si un módulo es cohesivo, si una abstracción está justificada, si una feature merece existir ni si una regla de negocio está en la capa correcta.

## Opciones consideradas
1. Steiger + plugin oficial FSD y dependency-cruiser — reglas especializadas y configurables; introduce dependencias, Steiger está en beta y ninguna solución determina semántica de diseño.
2. Solo ESLint/no-restricted-imports — reutiliza stack existente y es determinista; los límites entre módulos derivados de paths requieren más configuración y no cubre con la misma facilidad estructura FSD/ciclos.
3. Scripts propios — sin dependencia nueva, pero aumenta código de mantenimiento y riesgo de parser incompleto.

## Justificación
Steiger está mantenido por la organización FSD y ofrece reglas FSD; dependency-cruiser expresa reglas prohibidas y ciclos. La selección es provisional hasta el piloto, que limita el riesgo y permite medir falsos positivos y configuración.

## Consecuencias
- Positivas: verificaciones separadas, comandos claros y feedback temprano.
- Negativas: deps de desarrollo adicionales en proyectos nuevos y configuración que debe versionarse.
- Riesgos: APIs beta de Steiger y sobreestimación de cobertura de análisis estático.

## Restricciones y seguimiento
La decisión fue aceptada por el propietario el 2026-11-17 y los pilotos se completaron el 2026-11-21. El backend con dependency-cruiser 18.6.0 permite la API pública entre módulos y detecta imports internos entre dominios (exit 1). El frontend con Steiger 0.10.0 y plugin FSD 0.8.2 supera el preset recomendado sobre el esqueleto conforme (exit 0) y detecta un import ascendente `shared`→`pages` (exit 1, `fsd/forbidden-imports`). En macOS el watcher de chokidar puede agotar descriptores (`EMFILE: too many open files, watch`); el paquete inicial fija `CHOKIDAR_USEPOLLING=1` para usar polling. Los validadores cubren reglas estructurales e imports declarados; no evalúan cohesión, criterio de dominio ni calidad funcional.

## Referencias
- https://github.com/feature-sliced/steiger
- https://github.com/sverweij/dependency-cruiser
- Requisitos relacionados: REQ-003.
- ADR relacionados: ADR-0009, ADR-0010.
