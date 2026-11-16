import { DocumentSchema, type Project } from "@agentic-workbench/contracts";
import { listDirectory, readProjectFile } from "./files.js";

const excludedMarkdownDirs = new Set([".git", "node_modules", "dist", "build", ".next", ".turbo", "coverage"]);

export async function listMarkdown(project: Project) {
  const result: Array<{ path: string; title: string }> = [];
  let scannedEntries = 0;
  async function walk(relativeDirectory: string, depth: number): Promise<void> {
    if (depth > 6 || result.length >= 300 || scannedEntries >= 1000) return;
    const entries = await listDirectory(project, relativeDirectory || ".").catch(() => []);
    for (const entry of entries) {
      scannedEntries += 1;
      if (result.length >= 300 || scannedEntries >= 1000) break;
      if (entry.kind === "directory" && excludedMarkdownDirs.has(entry.name)) continue;
      if (entry.kind === "directory") await walk(entry.path, depth + 1);
      else if (entry.name.toLowerCase().endsWith(".md")) {
        const document = await readProjectFile(project, entry.path).catch(() => null);
        if (document) {
          const heading = document.content.match(/^#\s+(.+)$/m)?.[1]?.trim();
          result.push(DocumentSchema.parse({ path: entry.path, title: heading || entry.name.replace(/\.md$/i, "") }));
        }
      }
    }
  }
  await walk("docs", 0);
  return result.sort((a, b) => a.path.localeCompare(b.path));
}
