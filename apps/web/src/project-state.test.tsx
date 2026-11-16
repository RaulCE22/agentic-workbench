// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProjectStateSchema } from "@agentic-workbench/contracts";
import { ProjectStateSummary } from "./App";

let root: Root | undefined;
let container: HTMLDivElement | undefined;
afterEach(async () => {
  if (root) await act(async () => root?.unmount());
  container?.remove();
});

describe("resumen del estado del proyecto", () => {
  it("muestra estados declarados y navega a la fuente seleccionada", async () => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    const state = ProjectStateSchema.parse({
      roadmapPath: "docs/product/roadmap.md",
      issues: [],
      milestones: [{
        title: "V1 — Muestra", objective: "Consultar el estado declarado.", status: "En curso", path: "docs/product/roadmap.md", issues: [],
        requirements: [{ title: "REQ-001: Ejemplo", path: "docs/requirements/REQ-001-sample.md" }],
        plans: [{
          title: "Plan de muestra", status: "En curso", path: "docs/plans/active/sample/plan.md", issues: [],
          tasks: [{ title: "Implementar resumen", status: "En curso", requirements: ["REQ-001-AC-01"], path: "docs/plans/active/sample/plan.md" }],
        }],
      }],
    });
    const onOpen = vi.fn();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    await act(async () => root?.render(<ProjectStateSummary state={state} loading={false} error={null} onRefresh={() => undefined} onOpen={onOpen} />));
    expect(container.textContent).toContain("V1 — Muestra");
    expect(container.textContent).toContain("Implementar resumen");
    const planLink = [...container.querySelectorAll("button")].find((button) => button.textContent?.includes("Plan de muestra"));
    await act(async () => planLink?.click());
    expect(onOpen).toHaveBeenCalledWith("docs/plans/active/sample/plan.md");
    const roadmapLink = [...container.querySelectorAll("button")].find((button) => button.textContent?.includes("Abrir roadmap"));
    await act(async () => roadmapLink?.click());
    expect(onOpen).toHaveBeenLastCalledWith("docs/product/roadmap.md");
    const requirementLink = [...container.querySelectorAll("button")].find((button) => button.textContent?.includes("REQ-001: Ejemplo"));
    await act(async () => requirementLink?.click());
    expect(onOpen).toHaveBeenLastCalledWith("docs/requirements/REQ-001-sample.md");
    const taskSource = container.querySelector<HTMLButtonElement>('button[aria-label="Abrir fuente de Implementar resumen"]');
    await act(async () => taskSource?.click());
    expect(onOpen).toHaveBeenLastCalledWith("docs/plans/active/sample/plan.md");
  });

  it("expone las incidencias de datos con acceso a su documento fuente", async () => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    const state = ProjectStateSchema.parse({
      roadmapPath: "docs/product/roadmap.md",
      issues: [{ kind: "incomplete", message: "No se encontró el roadmap.", path: "docs/product/roadmap.md" }],
      milestones: [],
    });
    const onOpen = vi.fn();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    await act(async () => root?.render(<ProjectStateSummary state={state} loading={false} error={null} onRefresh={() => undefined} onOpen={onOpen} />));
    expect(container.textContent).toContain("No se encontró el roadmap.");
    const sourceLink = [...container.querySelectorAll("button")].find((button) => button.textContent?.includes("Fuente"));
    await act(async () => sourceLink?.click());
    expect(onOpen).toHaveBeenCalledWith("docs/product/roadmap.md");
  });
});
