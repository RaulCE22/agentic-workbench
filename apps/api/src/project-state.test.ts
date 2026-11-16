import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

let temporaryDirectory = "";
afterEach(async () => {
  delete process.env.WORKBENCH_DATA_DIR;
  vi.resetModules();
  if (temporaryDirectory) await rm(temporaryDirectory, { recursive: true, force: true });
});

async function setupProject(planStatus: string, taskStatus: string, planLink = "../plans/active/sample/plan.md") {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "workbench-state-"));
  const projectPath = path.join(temporaryDirectory, "project");
  const planDirectory = path.join(projectPath, "docs", "plans", "active", "sample");
  await mkdir(path.join(projectPath, "docs", "product"), { recursive: true });
  await mkdir(path.join(projectPath, "docs", "requirements"), { recursive: true });
  await mkdir(planDirectory, { recursive: true });
  await writeFile(path.join(projectPath, "docs", "product", "roadmap.md"), [
    "# Roadmap",
    "## V1 — Muestra",
    "**Objetivo:** comprobar el estado declarado.",
    "Requisitos: [REQ-001](../requirements/REQ-001-sample.md).",
    `Planes: [Plan de muestra](${planLink}).`,
  ].join("\n\n"));
  await writeFile(path.join(projectPath, "docs", "requirements", "REQ-001-sample.md"), "# REQ-001: Requisito de muestra\n\n- Estado: Aprobado\n");
  await writeFile(path.join(planDirectory, "plan.md"), [
    "# Plan de muestra",
    `- Estado: ${planStatus}`,
    "- Requisitos: REQ-001",
    "## Tareas",
    "| Tarea | Estado | Criterios relacionados |",
    "|---|---|---|",
    `| Entregar la muestra | ${taskStatus} | REQ-001-AC-01 |`,
  ].join("\n"));
  process.env.WORKBENCH_DATA_DIR = path.join(temporaryDirectory, "workbench-data");
  vi.resetModules();
  const { app } = await import("./app.js");
  const headers = { host: "127.0.0.1:4173", origin: "http://127.0.0.1:4173", "content-type": "application/json" };
  const added = await app.request("http://127.0.0.1:4173/api/projects", { method: "POST", headers, body: JSON.stringify({ path: projectPath }) });
  const project = await added.json() as { id: string };
  return { app, headers, projectId: project.id, projectPath };
}

describe("estado declarado del proyecto", () => {
  it("lee la convención del propio Workbench además de los proyectos fixture", async () => {
    temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "workbench-self-state-"));
    process.env.WORKBENCH_DATA_DIR = path.join(temporaryDirectory, "workbench-data");
    vi.resetModules();
    const { app } = await import("./app.js");
    const headers = { host: "127.0.0.1:4173", origin: "http://127.0.0.1:4173", "content-type": "application/json" };
    const projectPath = path.resolve(process.cwd(), "../..");
    const added = await app.request("http://127.0.0.1:4173/api/projects", { method: "POST", headers, body: JSON.stringify({ path: projectPath }) });
    const project = await added.json() as { id: string };
    const response = await app.request(`http://127.0.0.1:4173/api/projects/${project.id}/state`, { headers });
    const state = await response.json() as { milestones: Array<{ title: string; status: string | null }> };
    expect(response.status).toBe(200);
    expect(state.milestones.find((milestone) => milestone.title.startsWith("V0.1"))?.status).toBe("Completado");
    expect(state.milestones.find((milestone) => milestone.title.startsWith("V0.2"))?.status).toBe("Completado");
  });

  it("deriva el hito de los planes enlazados y devuelve las tareas con sus fuentes", async () => {
    const { app, headers, projectId } = await setupProject("Completado", "Completada");
    const response = await app.request(`http://127.0.0.1:4173/api/projects/${projectId}/state`, { headers });
    expect(response.status).toBe(200);
    const state = await response.json() as { milestones: Array<{ status: string; plans: Array<{ tasks: Array<{ status: string; requirements: string[] }> }> }> };
    expect(state.milestones[0]?.status).toBe("Completado");
    expect(state.milestones[0]?.plans[0]?.tasks[0]).toMatchObject({ status: "Completada", requirements: ["REQ-001-AC-01"] });
  });

  it("expone estados desconocidos sin derivar un estado de hito", async () => {
    const { app, headers, projectId } = await setupProject("Done", "En curso");
    const response = await app.request(`http://127.0.0.1:4173/api/projects/${projectId}/state`, { headers });
    const state = await response.json() as { milestones: Array<{ status: string | null; issues: Array<{ kind: string }> }> };
    expect(state.milestones[0]?.status).toBeNull();
    expect(state.milestones[0]?.plans[0]?.issues.some((item) => item.kind === "unknown-status")).toBe(true);
  });

  it("marca los estados ausentes como información incompleta", async () => {
    const { app, headers, projectId } = await setupProject("", "");
    const response = await app.request(`http://127.0.0.1:4173/api/projects/${projectId}/state`, { headers });
    const state = await response.json() as { milestones: Array<{ status: string | null; plans: Array<{ status: string | null; issues: Array<{ kind: string }> }> }> };
    expect(state.milestones[0]?.status).toBeNull();
    expect(state.milestones[0]?.plans[0]?.status).toBeNull();
    expect(state.milestones[0]?.plans[0]?.issues.some((item) => item.kind === "incomplete")).toBe(true);
  });

  it("señala los estados de plan y tarea contradictorios", async () => {
    const { app, headers, projectId } = await setupProject("Completado", "En curso");
    const response = await app.request(`http://127.0.0.1:4173/api/projects/${projectId}/state`, { headers });
    const state = await response.json() as { milestones: Array<{ status: string | null; plans: Array<{ issues: Array<{ kind: string }> }> }> };
    expect(state.milestones[0]?.status).toBeNull();
    expect(state.milestones[0]?.plans[0]?.issues.some((item) => item.kind === "contradiction")).toBe(true);
  });

  it("señala un plan en curso que contiene una tarea bloqueada", async () => {
    const { app, headers, projectId } = await setupProject("En curso", "Bloqueada");
    const response = await app.request(`http://127.0.0.1:4173/api/projects/${projectId}/state`, { headers });
    const state = await response.json() as { milestones: Array<{ status: string | null; plans: Array<{ issues: Array<{ kind: string }> }> }> };
    expect(state.milestones[0]?.status).toBeNull();
    expect(state.milestones[0]?.plans[0]?.issues.some((item) => item.kind === "contradiction")).toBe(true);
  });

  it("señala las referencias a planes inexistentes", async () => {
    const { app, headers, projectId } = await setupProject("Completado", "Completada", "../plans/active/missing/plan.md");
    const response = await app.request(`http://127.0.0.1:4173/api/projects/${projectId}/state`, { headers });
    const state = await response.json() as { milestones: Array<{ status: string | null; issues: Array<{ kind: string }> }> };
    expect(state.milestones[0]?.status).toBeNull();
    expect(state.milestones[0]?.issues.some((item) => item.kind === "broken-reference")).toBe(true);
  });

  it("vuelve a leer los documentos cuando el resumen se solicita tras cambios externos", async () => {
    const { app, headers, projectId, projectPath } = await setupProject("En curso", "En curso");
    const url = `http://127.0.0.1:4173/api/projects/${projectId}/state`;
    const first = await app.request(url, { headers });
    expect((await first.json() as { milestones: Array<{ status: string }> }).milestones[0]?.status).toBe("En curso");
    await writeFile(path.join(projectPath, "docs", "plans", "active", "sample", "plan.md"), [
      "# Plan de muestra", "- Estado: Completado", "## Tareas", "| Tarea | Estado | Criterios |", "|---|---|---|", "| Entregar la muestra | Completada | REQ-001-AC-01 |",
    ].join("\n"));
    const refreshed = await app.request(url, { headers });
    expect((await refreshed.json() as { milestones: Array<{ status: string }> }).milestones[0]?.status).toBe("Completado");
  });
});
