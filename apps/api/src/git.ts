import { spawn } from "node:child_process";
import os from "node:os";
import type { Project } from "@agentic-workbench/contracts";

const MAX_OUTPUT = 1024 * 1024;

function runGit(project: Project, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn("git", args, {
      cwd: project.path,
      shell: false,
      windowsHide: true,
      env: {
        PATH: process.env.PATH ?? "/usr/bin:/bin",
        LANG: "C",
        GIT_CONFIG_NOSYSTEM: "1",
        GIT_CONFIG_GLOBAL: os.devNull,
        GIT_OPTIONAL_LOCKS: "0",
        GIT_TERMINAL_PROMPT: "0",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const chunks: Buffer[] = [];
    let size = 0;
    let errorSize = 0;
    let settled = false;
    const timer = setTimeout(() => child.kill("SIGKILL"), 5000);
    const collect = (chunk: Buffer) => {
      size += chunk.byteLength;
      if (size > MAX_OUTPUT) child.kill("SIGKILL");
      else chunks.push(chunk);
    };
    child.stdout.on("data", collect);
    child.stderr.on("data", (chunk: Buffer) => {
      errorSize += chunk.byteLength;
      if (errorSize > MAX_OUTPUT) child.kill("SIGKILL");
    });
    child.on("error", (error) => {
      if (!settled) { settled = true; clearTimeout(timer); reject(error); }
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      if (size > MAX_OUTPUT) return reject(new Error("La salida de Git superó el límite."));
      if (code !== 0) return reject(new Error("Git no pudo completar la consulta."));
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
  });
}

export async function getGitStatus(project: Project) {
  if (!project.isGitRepository) throw new Error("Este proyecto no contiene un repositorio Git.");
  const [branchResult, statusResult, diff] = await Promise.all([
    runGit(project, ["branch", "--show-current"]),
    runGit(project, ["-c", "core.fsmonitor=false", "status", "--porcelain=v1", "-z", "--no-renames", "--untracked-files=all"]),
    runGit(project, ["diff", "--no-ext-diff", "--no-textconv", "--no-color", "--no-renames", "--unified=3"]),
  ]);
  const changedFiles = statusResult.split("\0").filter(Boolean).map((item) => ({
    status: item.slice(0, 2).trim() || "??",
    path: item.slice(3),
  }));
  return { branch: branchResult.trim() || "HEAD desacoplado", clean: changedFiles.length === 0, changedFiles, diff };
}
