# Puesta en marcha de los cuatro CLI

Los comandos de instalación cambian entre sistemas operativos y versiones. Utiliza siempre las instrucciones oficiales.

## Cursor CLI

- Documentación: https://docs.cursor.com/cli
- Instala Cursor CLI siguiendo la guía oficial.
- Ejecuta agent desde la raíz del repositorio.
- Inicia sesión con tu cuenta de Cursor.
- Selecciona Composer cuando el CLI permita elegir modelo.
- Comprueba que el agente ha leído AGENTS.md.

## Google Antigravity CLI

- Documentación: https://antigravity.google/docs/cli
- Instala agy siguiendo la guía oficial.
- Ejecuta agy desde la raíz del repositorio.
- Autentica con tu cuenta de Google.
- Selecciona Gemini.
- Comprueba que el agente ha leído AGENTS.md.

## OpenAI Codex CLI

- Documentación: https://developers.openai.com/codex/cli
- Instala Codex CLI siguiendo la guía oficial.
- Ejecuta codex desde la raíz del repositorio.
- Autentica mediante la opción de inicio de sesión con ChatGPT, no mediante una clave API.
- Selecciona un modelo GPT/Codex disponible en tu plan.
- Comprueba que Codex ha leído AGENTS.md.

## Anthropic Claude Code

- Documentación: https://docs.anthropic.com/en/docs/claude-code/overview
- Instala Claude Code siguiendo la guía oficial.
- Ejecuta claude desde la raíz del repositorio.
- Autentica con tu cuenta de Claude, no mediante una clave API.
- Selecciona un modelo disponible en tu plan.
- Comprueba que Claude Code ha cargado CLAUDE.md, que importa AGENTS.md, y que descubre .claude/skills/.

## Comprobación común

Desde la raíz del repositorio, pide a cada agente que resuma las reglas principales, enumere las skills, explique el flujo previo a cambios no triviales y confirme que no ha modificado archivos. Después ejecuta pnpm run verify.

## Política de costes

- Prioriza la capa incluida en cada cuenta.
- No configures API keys, proveedores externos ni recargas automáticas.
- Antes de una tarea extensa, consulta el uso restante en el CLI o panel del proveedor.
- Si se agota la cuota, cambia a otro agente admitido o espera a la renovación; no actives facturación API como solución automática.
