# Estándares de ingeniería

Agentic Workbench mantiene dos estándares reutilizables para proyectos personales. No son plantillas obligatorias para este repositorio ni un generador de aplicaciones.

- [Frontend: Feature-Sliced Design](frontend.md)
- [Backend: monolito modular](backend.md)
- [Cómo adoptar los estándares](adopting-standards.md)

Cada estándar tiene una skill portable en `.agents/skills/` y un esqueleto copiable bajo `templates/standards/`. La documentación es la fuente normativa; los esqueletos muestran únicamente una aplicación mínima.

En un proyecto full-stack se adoptan ambos estándares y cada uno mantiene sus límites dentro de su aplicación. El estándar backend define la estructura, pero el stack concreto permanece condicionado a ADR-0003.
