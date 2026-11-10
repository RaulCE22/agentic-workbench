# Compatibilidad entre CLI

## Matriz de integración del repositorio

| Proveedor | Comando | Modelo | Instrucciones | Skills |
|---|---|---|---|---|
| Cursor | agent | Composer | AGENTS.md; .cursor/rules/ para el editor | .agents/skills/ |
| Google | agy | Gemini | AGENTS.md | .agents/skills/ |
| OpenAI | codex | GPT/Codex | AGENTS.md | .agents/skills/ |
| Anthropic | claude | Claude | CLAUDE.md importa AGENTS.md | .claude/skills/ |

## Reglas

- AGENTS.md es la referencia canónica.
- CLAUDE.md importa AGENTS.md y solo añade configuración específica de Claude.
- GEMINI.md importa AGENTS.md.
- Cursor conserva una regla breve que remite a AGENTS.md.
- Codex utiliza AGENTS.md; no crear CODEX.md duplicado.
- Las skills siguen el formato Agent Skills en .agents/skills/.
- Claude Code descubre skills en .claude/skills/, enlazado a .agents/skills/.
- No asumas que todos los CLI interpretan igual permisos, hooks, subagentes, MCP o selección de modelo.
- Verifica nombres, rutas y capacidades contra la versión instalada antes de añadir configuraciones avanzadas.

## Integración en Agentic Workbench

La estrategia del producto está documentada en ADR-0006. Los adaptadores de Workbench no deben asumir que ACP, App Server y stream-json son equivalentes. Deben preservar eventos originales, normalizar solo los conceptos comunes y declarar capacidades específicas por proveedor.

## Modelos y facturación

Utiliza únicamente modelos propios del proveedor. Prioriza cuotas incluidas en la cuenta. No configures claves API, endpoints externos ni consumo de pago por uso como parte del flujo normal.
