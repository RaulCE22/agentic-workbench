import { mkdtemp, mkdir, realpath, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { Project } from "@agentic-workbench/contracts";
import { listDirectory, readProjectFile } from "./files.js";

const temporaryDirectories: string[] = [];
async function makeProject(): Promise<Project> {
  const temporaryPath = await mkdtemp(path.join(os.tmpdir(), "workbench-files-"));
  temporaryDirectories.push(temporaryPath);
  const projectPath = await realpath(temporaryPath);
  return { id: "7352b6aa-1234-4c23-b2f1-123456789abc", name: "test", path: projectPath, isGitRepository: false, addedAt: new Date().toISOString() };
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("acceso de solo lectura al filesystem", () => {
  it("lista los archivos normales y oculta metadatos y secretos comunes", async () => {
    const project = await makeProject();
    await mkdir(path.join(project.path, ".git"));
    await mkdir(path.join(project.path, "docs"));
    await writeFile(path.join(project.path, ".env"), "TOKEN=secreto");
    await writeFile(path.join(project.path, "docs", "guia.md"), "# Guía");
    const entries = await listDirectory(project, ".");
    expect(entries.map((entry) => entry.name)).toEqual(["docs"]);
    await expect(readProjectFile(project, ".env")).rejects.toThrow(/excluido/);
  });

  it("rechaza traversal y enlaces simbólicos que escapan del proyecto", async () => {
    const project = await makeProject();
    const temporaryOutside = await mkdtemp(path.join(os.tmpdir(), "workbench-outside-"));
    temporaryDirectories.push(temporaryOutside);
    const outside = await realpath(temporaryOutside);
    await writeFile(path.join(outside, "secreto.txt"), "privado");
    await symlink(outside, path.join(project.path, "escape"));
    await expect(readProjectFile(project, "../outside.txt")).rejects.toThrow();
    await expect(readProjectFile(project, "escape/secreto.txt")).rejects.toThrow(/fuera del proyecto/);
    expect(await listDirectory(project, ".")).toEqual([]);
    const aliasPath = path.join(temporaryDirectories[0]!, "project-alias");
    await symlink(outside, aliasPath);
    await expect(listDirectory({ ...project, path: aliasPath }, ".")).rejects.toThrow(/ha cambiado/);
  });

  it("rechaza archivos binarios y mayores que el límite", async () => {
    const project = await makeProject();
    await writeFile(path.join(project.path, "image.bin"), Buffer.from([0, 1, 2]));
    await writeFile(path.join(project.path, "large.txt"), "x".repeat(513 * 1024));
    await expect(readProjectFile(project, "image.bin")).rejects.toThrow(/binario/);
    await expect(readProjectFile(project, "large.txt")).rejects.toThrow(/límite/);
  });
});
