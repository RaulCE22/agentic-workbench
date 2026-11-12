import { randomUUID } from "node:crypto";
import { constants } from "node:fs";
import { mkdir, open, realpath, rename, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { ProjectStoreSchema, type Project, type ProjectStore } from "@agentic-workbench/contracts";

const dataDirectory = process.env.WORKBENCH_DATA_DIR ?? path.join(os.homedir(), ".agentic-workbench");
const storePath = path.join(dataDirectory, "projects.json");
const emptyStore: ProjectStore = { version: 1, projects: [], selectedProjectId: null };

export async function readStore(): Promise<ProjectStore> {
  try {
    const handle = await open(storePath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    try {
      const content = await handle.readFile("utf8");
      return ProjectStoreSchema.parse(JSON.parse(content));
    } finally {
      await handle.close();
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyStore;
    throw error;
  }
}

async function writeStore(store: ProjectStore): Promise<void> {
  await mkdir(dataDirectory, { recursive: true, mode: 0o700 });
  const temporaryPath = path.join(dataDirectory, `.projects-${randomUUID()}.tmp`);
  const handle = await open(temporaryPath, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL, 0o600);
  try {
    await handle.writeFile(`${JSON.stringify(ProjectStoreSchema.parse(store), null, 2)}\n`, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
  try {
    await rename(temporaryPath, storePath);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    throw error;
  }
}

export async function addProject(inputPath: string, requestedName?: string): Promise<Project> {
  if (!path.isAbsolute(inputPath)) throw new Error("La ruta debe ser absoluta.");
  const canonicalPath = await realpath(inputPath);
  const projectInfo = await stat(canonicalPath);
  if (!projectInfo.isDirectory()) throw new Error("La ruta debe ser una carpeta.");
  const store = await readStore();
  const existing = store.projects.find((project) => project.path === canonicalPath);
  if (existing) return existing;
  const project: Project = {
    id: randomUUID(),
    name: requestedName?.trim() || path.basename(canonicalPath) || canonicalPath,
    path: canonicalPath,
    isGitRepository: await isGitRepository(canonicalPath),
    addedAt: new Date().toISOString(),
  };
  await writeStore({ ...store, projects: [...store.projects, project], selectedProjectId: project.id });
  return project;
}

async function isGitRepository(projectPath: string): Promise<boolean> {
  try {
    const gitPath = await realpath(path.join(projectPath, ".git"));
    return gitPath.startsWith(`${projectPath}${path.sep}`) || gitPath === projectPath;
  } catch {
    return false;
  }
}

export async function removeProject(id: string): Promise<void> {
  const store = await readStore();
  const projects = store.projects.filter((project) => project.id !== id);
  await writeStore({
    ...store,
    projects,
    selectedProjectId: store.selectedProjectId === id ? (projects[0]?.id ?? null) : store.selectedProjectId,
  });
}

export async function selectProject(id: string): Promise<void> {
  const store = await readStore();
  if (!store.projects.some((project) => project.id === id)) throw new Error("Proyecto no registrado.");
  await writeStore({ ...store, selectedProjectId: id });
}

export async function getProject(id: string): Promise<Project> {
  const project = (await readStore()).projects.find((item) => item.id === id);
  if (!project) throw new Error("Proyecto no encontrado.");
  const canonical = await realpath(project.path);
  if (canonical !== project.path) throw new Error("La ruta del proyecto ha cambiado.");
  return project;
}

export async function listProjects(): Promise<ProjectStore> {
  const store = await readStore();
  const projects = await Promise.all(store.projects.map(async (project) => {
    try { return (await realpath(project.path)) === project.path ? project : null; } catch { return null; }
  }));
  const availableProjects = projects.filter((project): project is Project => project !== null);
  const selectedProjectId = availableProjects.some((project) => project.id === store.selectedProjectId)
    ? store.selectedProjectId
    : availableProjects[0]?.id ?? null;
  return { ...store, projects: availableProjects, selectedProjectId };
}
