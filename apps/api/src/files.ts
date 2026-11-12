import { opendir, open, realpath, stat } from "node:fs/promises";
import { constants } from "node:fs";
import type { Dirent } from "node:fs";
import path from "node:path";
import type { FileEntry } from "@agentic-workbench/contracts";
import type { Project } from "@agentic-workbench/contracts";

const ignoredDirectories = new Set([".git", "node_modules", "dist", "build", ".next", ".turbo", ".cache", ".venv", "venv", "target", "coverage", "vendor", "Pods", "DerivedData"]);
const sensitiveNames = /^(?:\.env(?:\..*)?|\.npmrc|\.pypirc|\.netrc|\.git-credentials|credentials(?:\.(?:json|ya?ml))?|secrets?(?:\.(?:json|ya?ml))?|id_(?:rsa|dsa|ecdsa|ed25519)|authorized_keys|known_hosts|terraform\.tfstate(?:\.backup)?)$/i;
const sensitiveExtension = /\.(?:pem|key|p12|pfx|keystore|secret|tfstate|asc|gpg)$/i;
const MAX_FILE_SIZE = 512 * 1024;
const MAX_DIRECTORY_ENTRIES = 500;
const MAX_DEPTH = 16;

function isSensitive(name: string): boolean {
  return sensitiveNames.test(name) || sensitiveExtension.test(name);
}

function resolveRelative(root: string, relativePath: string): string {
  if (relativePath.includes("\0") || path.isAbsolute(relativePath) || relativePath.includes("\\")) {
    throw new Error("Ruta no válida.");
  }
  const normalized = path.posix.normalize(relativePath || ".");
  if (normalized === ".." || normalized.startsWith("../")) throw new Error("Ruta fuera del proyecto.");
  const candidate = path.resolve(root, normalized);
  const relative = path.relative(root, candidate);
  if (relative.startsWith(`..${path.sep}`) || relative === ".." || path.isAbsolute(relative)) {
    throw new Error("Ruta fuera del proyecto.");
  }
  if (relative.split(path.sep).some(isSensitive)) throw new Error("Archivo excluido por seguridad.");
  return candidate;
}

async function resolveAuthorized(project: Project, relativePath: string): Promise<string> {
  const root = await realpath(project.path);
  if (root !== project.path) throw new Error("La carpeta registrada ha cambiado de ubicación.");
  const candidate = resolveRelative(root, relativePath);
  const canonical = await realpath(candidate);
  const relative = path.relative(root, canonical);
  if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error("La ruta resuelta queda fuera del proyecto.");
  }
  return canonical;
}

export async function listDirectory(project: Project, relativePath: string): Promise<FileEntry[]> {
  const directoryPath = await resolveAuthorized(project, relativePath);
  const root = await realpath(project.path);
  if (root !== project.path) throw new Error("La carpeta registrada ha cambiado de ubicación.");
  const depth = path.relative(root, directoryPath).split(path.sep).filter(Boolean).length;
  if (depth > MAX_DEPTH) throw new Error("Se alcanzó el límite de profundidad.");
  if (!(await stat(directoryPath)).isDirectory()) throw new Error("La ruta no es una carpeta.");
  const directory = await opendir(directoryPath);
  const entries: Dirent[] = [];
  for await (const entry of directory) {
    entries.push(entry);
    if (entries.length >= MAX_DIRECTORY_ENTRIES) break;
  }
  const currentPath = await realpath(directoryPath);
  const currentRoot = await realpath(project.path);
  if (currentRoot !== project.path || currentPath !== directoryPath) {
    throw new Error("La ruta de la carpeta cambió durante la lectura.");
  }
  return entries.flatMap((entry): FileEntry[] => {
    if (entry.isSymbolicLink() || ignoredDirectories.has(entry.name) || isSensitive(entry.name)) return [];
    const entryPath = path.posix.join(relativePath === "." ? "" : relativePath, entry.name);
    if (entry.isDirectory()) return [{ name: entry.name, path: entryPath, kind: "directory" }];
    if (!entry.isFile()) return [];
    return [{ name: entry.name, path: entryPath, kind: "file" }];
  }).sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === "directory" ? -1 : 1));
}

export async function readProjectFile(project: Project, relativePath: string): Promise<{ content: string; size: number }> {
  const filePath = await resolveAuthorized(project, relativePath);
  const handle = await open(filePath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const metadata = await handle.stat();
    if (!metadata.isFile()) throw new Error("Solo se pueden abrir archivos normales.");
    if (metadata.size > MAX_FILE_SIZE) throw new Error(`El archivo supera el límite de ${MAX_FILE_SIZE / 1024} KB.`);
    const currentPath = await realpath(filePath);
    const currentMetadata = await stat(currentPath);
    const root = await realpath(project.path);
    if (root !== project.path) throw new Error("La carpeta registrada ha cambiado de ubicación.");
    const relative = path.relative(root, currentPath);
    if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)
      || currentMetadata.dev !== metadata.dev || currentMetadata.ino !== metadata.ino) {
      throw new Error("La ruta resuelta queda fuera del proyecto.");
    }
    const chunks: Buffer[] = [];
    let size = 0;
    const chunk = Buffer.alloc(64 * 1024);
    while (true) {
      const { bytesRead } = await handle.read(chunk, 0, chunk.byteLength, null);
      if (bytesRead === 0) break;
      size += bytesRead;
      if (size > MAX_FILE_SIZE) throw new Error(`El archivo supera el límite de ${MAX_FILE_SIZE / 1024} KB.`);
      chunks.push(Buffer.from(chunk.subarray(0, bytesRead)));
    }
    const buffer = Buffer.concat(chunks, size);
    if (buffer.includes(0)) throw new Error("El archivo parece binario y no se muestra como texto.");
    return { content: buffer.toString("utf8"), size: buffer.byteLength };
  } finally {
    await handle.close();
  }
}
