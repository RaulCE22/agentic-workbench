import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { Project } from "@agentic-workbench/contracts";
import { getGitStatus } from "./git.js";

const execFileAsync = promisify(execFile);
const directories: string[] = [];
afterEach(async () => Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true }))));

describe("consultas Git", () => {
  it("informa cambios usando consultas de solo lectura", async () => {
    const projectPath = await mkdtemp(path.join(os.tmpdir(), "workbench-git-"));
    directories.push(projectPath);
    await execFileAsync("git", ["init", "--quiet", projectPath]);
    await execFileAsync("git", ["-C", projectPath, "config", "user.name", "Workbench Test"]);
    await execFileAsync("git", ["-C", projectPath, "config", "user.email", "workbench@example.invalid"]);
    await writeFile(path.join(projectPath, "nota.txt"), "versión inicial\n");
    await execFileAsync("git", ["-C", projectPath, "add", "nota.txt"]);
    await execFileAsync("git", ["-C", projectPath, "commit", "--quiet", "-m", "initial"]);
    await writeFile(path.join(projectPath, "nota.txt"), "cambio local\n");
    const project: Project = { id: "7352b6aa-1234-4c23-b2f1-123456789abc", name: "test", path: projectPath, isGitRepository: true, addedAt: new Date().toISOString() };
    const before = await execFileAsync("git", ["-C", projectPath, "status", "--porcelain=v1", "-z"]);
    const status = await getGitStatus(project);
    const after = await execFileAsync("git", ["-C", projectPath, "status", "--porcelain=v1", "-z"]);
    expect(status.clean).toBe(false);
    expect(status.changedFiles).toEqual([{ path: "nota.txt", status: "M" }]);
    expect(status.diff).toContain("+cambio local");
    expect(after.stdout).toBe(before.stdout);
    expect(await readFile(path.join(projectPath, "nota.txt"), "utf8")).toBe("cambio local\n");
  });
});
