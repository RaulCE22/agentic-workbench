import { mkdtemp, mkdir, realpath, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

let temporaryDirectory = "";
afterEach(async () => {
  delete process.env.WORKBENCH_DATA_DIR;
  vi.resetModules();
  if (temporaryDirectory) await rm(temporaryDirectory, { recursive: true, force: true });
});

describe("registro local de proyectos", () => {
  it("persiste rutas entre cargas y retirar un proyecto no toca su carpeta", async () => {
    temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "workbench-store-"));
    const dataDirectory = path.join(temporaryDirectory, "data");
    const projectDirectory = path.join(temporaryDirectory, "project");
    await mkdir(projectDirectory);
    process.env.WORKBENCH_DATA_DIR = dataDirectory;
    vi.resetModules();

    const firstStore = await import("./store.js");
    const project = await firstStore.addProject(projectDirectory);
    vi.resetModules();
    const secondStore = await import("./store.js");
    expect((await secondStore.listProjects()).projects.map((item) => item.path)).toEqual([await realpath(projectDirectory)]);
    await secondStore.removeProject(project.id);
    expect((await secondStore.listProjects()).projects).toEqual([]);
    expect((await stat(projectDirectory)).isDirectory()).toBe(true);
  });
});
