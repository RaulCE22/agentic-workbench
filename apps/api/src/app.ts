import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DocumentSchema, GitStatusSchema, ProjectInputSchema, RequirementListSchema, FileEntrySchema, FileContentSchema, type Project } from "@agentic-workbench/contracts";
import { listDirectory, readProjectFile } from "./files.js";
import { getGitStatus } from "./git.js";
import { addProject, getProject, listProjects, removeProject, selectProject } from "./store.js";

const app = new Hono();
const port = Number(process.env.PORT ?? 4173);
const origin = `http://127.0.0.1:${port}`;
const host = `127.0.0.1:${port}`;
const excludedMarkdownDirs = new Set([".git", "node_modules", "dist", "build", ".next", ".turbo", "coverage"]);

app.use("*", async (context, next) => {
  context.header("X-Content-Type-Options", "nosniff");
  context.header("Referrer-Policy", "no-referrer");
  context.header("X-Frame-Options", "DENY");
  context.header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  await next();
});

app.use("/api/*", async (context, next) => {
  if (context.req.header("host") !== host) return context.json({ error: "Host no permitido." }, 403);
  const requestOrigin = context.req.header("origin");
  if (requestOrigin && requestOrigin !== origin) return context.json({ error: "Origen no permitido." }, 403);
  if (context.req.header("sec-fetch-site") === "cross-site") return context.json({ error: "Origen no permitido." }, 403);
  if (["POST", "DELETE", "PUT", "PATCH"].includes(context.req.method) && requestOrigin !== origin) {
    return context.json({ error: "La petición debe proceder de la aplicación local." }, 403);
  }
  await next();
});

app.get("/api/health", (context) => context.json({ status: "ok" }));
app.get("/api/projects", async (context) => context.json(await listProjects()));
app.post("/api/projects", async (context) => {
  try {
    const parsed = ProjectInputSchema.safeParse(await context.req.json());
    if (!parsed.success) return context.json({ error: "Indica una ruta absoluta válida y un nombre de hasta 120 caracteres." }, 400);
    const input = parsed.data;
    return context.json(await addProject(input.path, input.name), 201);
  } catch (error) { return context.json({ error: message(error) }, 400); }
});
app.delete("/api/projects/:id", async (context) => {
  try { await removeProject(context.req.param("id")); return context.body(null, 204); }
  catch (error) { return context.json({ error: message(error) }, 400); }
});
app.post("/api/projects/:id/select", async (context) => {
  try { await selectProject(context.req.param("id")); return context.body(null, 204); }
  catch (error) { return context.json({ error: message(error) }, 400); }
});

app.get("/api/projects/:id/tree", async (context) => {
  try {
    const project = await getProject(context.req.param("id"));
    const relativePath = context.req.query("path") || ".";
    return context.json(FileEntrySchema.array().parse(await listDirectory(project, relativePath)));
  } catch (error) { return context.json({ error: message(error) }, 400); }
});
app.get("/api/projects/:id/file", async (context) => {
  try {
    const project = await getProject(context.req.param("id"));
    const filePath = context.req.query("path");
    if (!filePath) return context.json({ error: "Falta la ruta del archivo." }, 400);
    const file = await readProjectFile(project, filePath);
    return context.json(FileContentSchema.parse({ path: filePath, ...file }));
  } catch (error) { return context.json({ error: message(error) }, 400); }
});
app.get("/api/projects/:id/documents", async (context) => {
  try {
    const project = await getProject(context.req.param("id"));
    return context.json(await listMarkdown(project));
  } catch (error) { return context.json({ error: message(error) }, 400); }
});
app.get("/api/projects/:id/features", async (context) => {
  try {
    const project = await getProject(context.req.param("id"));
    const documents = await listMarkdown(project);
    const requirements: Array<{ id: string; title: string; status: string; priority?: string; path: string; plans: string[] }> = [];
    const planDocuments = documents.filter((document) => document.path.startsWith("plans/"));
    const relatedPlans = new Map<string, string[]>();
    for (const plan of planDocuments) {
      const planFile = await readProjectFile(project, plan.path).catch(() => null);
      if (!planFile) continue;
      for (const reference of new Set(planFile.content.match(/\bREQ-\d{3}\b/gi) ?? [])) {
        relatedPlans.set(reference.toUpperCase(), [...(relatedPlans.get(reference.toUpperCase()) ?? []), plan.path]);
      }
    }
    for (const document of documents) {
      if (!/^docs\/requirements\/REQ-\d{3}.*\.md$/i.test(document.path)) continue;
      const { content } = await readProjectFile(project, document.path);
      const id = content.match(/^#\s+(REQ-\d{3})\s*:?\s*(.*)$/m);
      if (!id) continue;
      requirements.push({
        id: id[1]!, title: id[2]?.trim() || document.title,
        status: content.match(/^-\s*Estado:\s*(.+)$/mi)?.[1]?.trim() || "Sin estado",
        priority: content.match(/^-\s*Prioridad:\s*(.+)$/mi)?.[1]?.trim(), path: document.path,
        plans: relatedPlans.get(id[1]!.toUpperCase()) ?? [],
      });
    }
    return context.json(RequirementListSchema.parse(requirements.sort((a, b) => a.id.localeCompare(b.id))));
  } catch (error) { return context.json({ error: message(error) }, 400); }
});
app.get("/api/projects/:id/git", async (context) => {
  try { return context.json(GitStatusSchema.parse(await getGitStatus(await getProject(context.req.param("id"))))); }
  catch (error) { return context.json({ error: message(error) }, 400); }
});

const webDist = fileURLToPath(new URL("../../web/dist/", import.meta.url));
app.use("/assets/*", serveStatic({ root: webDist }));
app.get("*", async (context) => {
  try {
    const indexPath = path.join(webDist, "index.html");
    if ((await stat(indexPath)).isFile()) return context.html(await readFile(indexPath, "utf8"));
  } catch { /* The web bundle has not been built yet. */ }
  return context.text("Workbench aún no está compilado. Ejecuta pnpm run build.", 503);
});

app.onError((error, context) => {
  console.error("Error en petición local:", error.name);
  return context.json({ error: "No se pudo completar la petición." }, 500);
});

async function listMarkdown(project: Project) {
  const result: Array<{ path: string; title: string }> = [];
  let scannedEntries = 0;
  async function walk(relativeDirectory: string, depth: number): Promise<void> {
    if (depth > 6 || result.length >= 300 || scannedEntries >= 1000) return;
    const entries = await listDirectory(project, relativeDirectory || ".").catch(() => []);
    for (const entry of entries) {
      scannedEntries += 1;
      if (result.length >= 300 || scannedEntries >= 1000) break;
      if (entry.kind === "directory" && excludedMarkdownDirs.has(entry.name)) continue;
      const child = entry.path;
      if (entry.kind === "directory") await walk(child, depth + 1);
      else if (entry.name.toLowerCase().endsWith(".md")) {
        const document = await readProjectFile(project, child).catch(() => null);
        if (document) {
          const heading = document.content.match(/^#\s+(.+)$/m)?.[1]?.trim();
          result.push(DocumentSchema.parse({ path: child, title: heading || entry.name.replace(/\.md$/i, "") }));
        }
      }
    }
  }
  await walk("docs", 0);
  await walk("plans", 0);
  return result.sort((a, b) => a.path.localeCompare(b.path));
}

function message(error: unknown): string {
  if (error instanceof Error && "code" in error) return "No se pudo acceder al recurso local solicitado.";
  return error instanceof Error ? error.message : "Petición no válida.";
}

export { app, host, origin, port };
