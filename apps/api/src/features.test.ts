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

describe("catálogo de requisitos", () => {
  it("lee identificador, título, estado y plan relacionado", async () => {
    temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "workbench-features-"));
    const projectPath = path.join(temporaryDirectory, "project");
    await mkdir(path.join(projectPath, "docs", "requirements"), { recursive: true });
    await mkdir(path.join(projectPath, "plans", "active", "sample"), { recursive: true });
    await mkdir(path.join(projectPath, "plans", "active", "unrelated"), { recursive: true });
    await writeFile(path.join(projectPath, "docs", "requirements", "REQ-001-sample.md"), "# REQ-001: Requisito de prueba\n\n- Estado: Aprobado\n- Prioridad: Alta\n");
    await writeFile(path.join(projectPath, "plans", "active", "sample", "plan.md"), "# Plan de muestra\n\nRequisitos: REQ-001\n");
    await writeFile(path.join(projectPath, "plans", "active", "unrelated", "plan.md"), "# Plan no relacionado\n\nRequisito: REQ-0010\n");
    process.env.WORKBENCH_DATA_DIR = path.join(temporaryDirectory, "workbench-data");
    vi.resetModules();
    const { app } = await import("./app.js");
    const headers = { host: "127.0.0.1:4173", origin: "http://127.0.0.1:4173", "content-type": "application/json" };
    const added = await app.request("http://127.0.0.1:4173/api/projects", { method: "POST", headers, body: JSON.stringify({ path: projectPath }) });
    expect(added.status).toBe(201);
    const project = await added.json() as { id: string };
    const response = await app.request(`http://127.0.0.1:4173/api/projects/${project.id}/features`, { headers });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([{
      id: "REQ-001", title: "Requisito de prueba", status: "Aprobado", priority: "Alta",
      path: "docs/requirements/REQ-001-sample.md", plans: ["plans/active/sample/plan.md"],
    }]);
  });
});
