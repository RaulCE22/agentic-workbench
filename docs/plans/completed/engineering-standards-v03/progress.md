# Progreso: Estándares de ingeniería V0.3

- Requisitos: REQ-003
- Plan: ./plan.md
- Última actualización: 2026-11-21

## Resumen de progreso
REQ-003, ADR-0009..0011 y el plan fueron aprobados por el propietario. Los estándares, las skills, los paquetes iniciales, la guía de adopción y la validación automatizada están publicados. Los pilotos backend y frontend confirmaron el modo de fallo determinista de ambos validadores; el esqueleto frontend se ajustó para superar su propio preset y el script fija `CHOKIDAR_USEPOLLING=1` en macOS. No se añadieron dependencias al workspace de Workbench. Plan completado.

## Trabajo completado
- Inspección de documentación, árbol, arquitectura y estado Git actuales.
- Investigación de documentación oficial FSD, Steiger, Node, Hono, React Router, Drizzle y dependency-cruiser.
- Generación y redacción de REQ-003, ADR-0009..0011, plan y registro de progreso.
- Aprobación humana registrada el 2026-11-17; ADR-0010 mantiene pendiente el stack de ADR-0003.
- Estándares canónicos, skills portables, paquetes iniciales y guía de adopción añadidos.
- Configuración backend probada con fixture conforme y fixture infractor; import público permitido e import interno entre dominios rechazado.
- Piloto frontend completado con Steiger 0.10.0 y plugin FSD 0.8.2: el esqueleto se corrigió para tener segmentos en `pages/home` y supera el preset; un import ascendente `shared`→`pages` falla con `fsd/forbidden-imports`.
- Script frontend fijado con `CHOKIDAR_USEPOLLING=1` y nota de macOS en el README del esqueleto.
- Verificación final, revisión del diff y cierre de trazabilidad documental.

## Cambios realizados
- Cambiados los documentos REQ/ADR, estándares, arquitectura e índices; añadidos skills y archivos bajo `templates/standards/`.
- Esqueleto frontend: `pages/home` reorganizado con segmento `ui/`; script `check:architecture:frontend` con polling; README con nota de macOS.
- ADR-0011 actualizado con el resultado de ambos pilotos; roadmap e índices reflejan V0.3 entregada y el plan se archivó en `completed/`.
- No se modificó código de producto ni manifiestos/lockfiles del workspace.

## Verificación
| Comando/comprobación | Resultado | Notas |
|---|---|---|
| `pnpm run new:requirement -- engineering-standards-frontend-backend` | Falló | El script recibe `--` como slug por diferencia entre mensaje de uso y parser. |
| `pnpm run new:requirement engineering-standards-frontend-backend` | Correcto | Creó REQ-003; mismo ajuste operativo usado para ADR y plan. |
| `pnpm run new:adr ...` y `pnpm run new:plan ...` | Correcto | Slug sin `--`; IDs generados por el script. |
| `pnpm run verify` (antes de cerrar) | Correcto | 81 archivos Markdown y workspace correctos; no se volvió a ejecutar tras los últimos ajustes hasta el cierre. |
| `pnpm run check:architecture:frontend` (Steiger 0.10.0 + plugin 0.8.2, fixture aislado) | Correcto | Conforme: `No problems found`, exit 0; resultado idéntico con `CHOKIDAR_USEPOLLING=1`. |
| `pnpm run check:architecture:frontend` (import ascendente `shared`→`pages`) | Falló como se esperaba | `fsd/forbidden-imports`, exit 1. |
| `pnpm run check:architecture:backend` (fixture conforme) | Correcto | `No se encontraron infracciones de dependencias backend`, exit 0. |
| `pnpm run check:architecture:backend` (import interno entre dominios) | Falló como se esperaba | `modules-use-public-api: orders/http → invoices/application`, exit 1. |
| `pnpm run verify` (cierre) | Correcto | 81 archivos Markdown; 21 obligatorios; workspace correcto. |
| `git diff --check` | Correcto | Sin errores de whitespace. |
| Revisión final del diff | Correcta | Sin cambios fuera de alcance; no se modificó código de producto ni el workspace. |

## Decisiones y descubrimientos
- Node.js 26 aparece LTS al 16-11-2026; no modifica el Node 24.15 fijado para Workbench.
- Steiger ofrece plugin oficial FSD, está en beta y la configuración 0.5 tuvo cambio incompatible.
- El EMFILE del piloto anterior no se reprodujo en el fixture aislado con `ulimit -n 1048576` y solo `src`; apuntaba al scope de escaneo del entorno anterior. El script fija `CHOKIDAR_USEPOLLING=1` como salvaguarda en macOS.
- El preset `recommended` de Steiger 0.10.0 detecta slices sin segmentos (`fsd/no-segmentless-slices`) e imports ascendentes entre capas (`fsd/forbidden-imports`); por eso el esqueleto se corrigió con `pages/home/ui/`.
- Steiger en macOS puede usar `fs.watch` vía chokidar y agotar descriptores; `CHOKIDAR_USEPOLLING=1` es el workaround estable documentado.
- dependency-cruiser 18.6.0 detectó el acceso a internals entre módulos y permitió el import público; los validadores no demuestran semántica de diseño.
- ADR-0003 continúa con decisiones/POC abiertas; no bloquea la estructura backend documentada.

## Preguntas abiertas / bloqueos
- Ninguno para V0.3. La POC del stack de ADR-0003 sigue fuera de este plan.

## Siguiente paso
Ninguno; plan completado y archivado tras la revisión final del diff.
