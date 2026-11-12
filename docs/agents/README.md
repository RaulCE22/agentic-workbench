# Herramientas de programación agéntica

Este repositorio mantiene una única fuente de verdad para las instrucciones de ingeniería: AGENTS.md. Los archivos CLAUDE.md, GEMINI.md y las reglas de Cursor son adaptadores mínimos para los mecanismos de descubrimiento de cada herramienta; no deben contener copias de las reglas compartidas.

## Herramientas admitidas

| Proveedor | CLI | Archivo de entrada | Skills compartidas |
|---|---|---|---|
| Cursor | agent | AGENTS.md; el editor también usa .cursor/rules/ | .agents/skills/ |
| Google Antigravity | agy | AGENTS.md | .agents/skills/ |
| OpenAI Codex | codex | AGENTS.md | .agents/skills/ |
| Anthropic Claude Code | claude | CLAUDE.md importa AGENTS.md | .claude/skills/ (enlace a .agents/skills/) |

Consulta compatibilidad.md y puesta-en-marcha.md para diferencias de versión y configuración.

## Principios

1. No dupliques las reglas de ingeniería en adaptadores de proveedores.
2. Mantén los procedimientos reutilizables en .agents/skills/<nombre>/SKILL.md.
3. Las configuraciones específicas de proveedor solo deben contener ajustes sin equivalente compartido.
4. No configures claves API ni proveedores externos: utiliza autenticación nativa de cada CLI.
5. La autenticación con una cuenta no garantiza acceso ilimitado ni gratuito; los límites dependen del plan.
6. Los CLI se usan como herramientas de desarrollo fuera de Workbench. El producto no los ejecuta ni llama directamente a APIs de modelos.
