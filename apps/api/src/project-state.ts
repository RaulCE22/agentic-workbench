import path from "node:path";
import type { Project, ProjectMilestone, ProjectMilestoneStatus, ProjectStateIssue, ProjectPlan, ProjectPlanStatus, ProjectTask, ProjectTaskStatus } from "@agentic-workbench/contracts";
import { readProjectFile } from "./files.js";

type Document = { path: string; title: string };
type Issue = ProjectStateIssue;
type Plan = ProjectPlan;
type Task = ProjectTask;
type Milestone = ProjectMilestone;

const taskStatuses = new Map<string, ProjectTaskStatus>([["pendiente", "Pendiente"], ["en curso", "En curso"], ["bloqueada", "Bloqueada"], ["completada", "Completada"]]);
const planStatuses = new Map<string, ProjectPlanStatus>([["pendiente", "Pendiente"], ["en curso", "En curso"], ["bloqueado", "Bloqueado"], ["listo para revisión", "Listo para revisión"], ["completado", "Completado"]]);

export async function readProjectState(project: Project, documents: Document[]) {
  const issues: Issue[] = [];
  const roadmap = documents.find((document) => document.path === "docs/product/roadmap.md");
  if (!roadmap) {
    return { roadmapPath: null, milestones: [], issues: [{ kind: "incomplete", message: "No se encontró docs/product/roadmap.md.", path: "docs/product/roadmap.md" }] };
  }

  const roadmapFile = await readProjectFile(project, roadmap.path).catch(() => null);
  if (!roadmapFile) {
    return { roadmapPath: roadmap.path, milestones: [], issues: [issue("incomplete", "No se pudo leer la hoja de ruta del proyecto.", roadmap.path)] };
  }
  const documentByPath = new Map(documents.map((document) => [document.path, document]));
  const milestones: Milestone[] = [];
  const sections = [...roadmapFile.content.matchAll(/^##\s+(.+)\s*$/gm)];
  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index]!;
    const start = section.index! + section[0].length;
    const end = sections[index + 1]?.index ?? roadmapFile.content.length;
    const body = roadmapFile.content.slice(start, end);
    if (!/^\s*\*\*Objetivo:\*\*/m.test(body) && !/^\s*(?:Requisitos|Planes):/m.test(body)) continue;
    const milestoneIssues: Issue[] = [];
    const title = section[1]!.trim();
    const objective = body.match(/^\s*\*\*Objetivo:\*\*\s*(.+)$/m)?.[1]?.trim() ?? null;
    if (!objective) milestoneIssues.push(issue("incomplete", "Falta el objetivo del hito.", roadmap.path));

    const requirementsLine = body.match(/^\s*Requisitos:\s*(.*)$/mi);
    const plansLine = body.match(/^\s*Planes:\s*(.*)$/mi);
    if (!requirementsLine) milestoneIssues.push(issue("incomplete", "Falta la línea de enlaces a requisitos.", roadmap.path));
    if (!plansLine) milestoneIssues.push(issue("incomplete", "Falta la línea de enlaces a planes.", roadmap.path));

    const requirements: Array<{ title: string; path: string }> = [];
    for (const reference of markdownLinks(requirementsLine?.[1] ?? "")) {
      const target = resolveDocumentationLink(roadmap.path, reference);
      const document = target ? documentByPath.get(target) : undefined;
      if (!document || !/^docs\/requirements\/REQ-\d{3}.*\.md$/i.test(target ?? "")) {
        milestoneIssues.push(issue("broken-reference", `No se pudo resolver el requisito enlazado «${reference}».`, roadmap.path));
        continue;
      }
      requirements.push({ title: document.title, path: document.path });
    }
    if (requirementsLine && requirements.length === 0) milestoneIssues.push(issue("incomplete", "El hito no enlaza ningún requisito.", roadmap.path));

    const plans: Plan[] = [];
    for (const reference of markdownLinks(plansLine?.[1] ?? "")) {
      const target = resolveDocumentationLink(roadmap.path, reference);
      if (!target || !/^docs\/plans\/(?:active|completed)\/.+\/plan\.md$/i.test(target) || !documentByPath.has(target)) {
        milestoneIssues.push(issue("broken-reference", `No se pudo resolver el plan enlazado «${reference}».`, roadmap.path));
        continue;
      }
      try {
        plans.push(await readPlan(project, target, documentByPath.get(target)!.title));
      } catch {
        milestoneIssues.push(issue("incomplete", `No se pudo leer el plan enlazado «${reference}».`, target));
      }
    }
    if (plansLine && markdownLinks(plansLine[1] ?? "").length > 0 && plans.length === 0) {
      milestoneIssues.push(issue("incomplete", "El hito no tiene planes reconocidos.", roadmap.path));
    }

    const derivedStatus = deriveMilestoneStatus(plans, plansLine !== null, milestoneIssues);
    milestones.push({ title, objective, status: derivedStatus, path: roadmap.path, requirements, plans, issues: milestoneIssues });
  }

  if (milestones.length === 0) issues.push(issue("incomplete", "La hoja de ruta no contiene hitos con objetivo o referencias reconocibles.", roadmap.path));
  return { roadmapPath: roadmap.path, milestones, issues };
}

async function readPlan(project: Project, filePath: string, title: string): Promise<Plan> {
  const file = await readProjectFile(project, filePath);
  const issues: Issue[] = [];
  const rawStatus = file.content.match(/^\s*-\s*Estado:\s*(.+)$/mi)?.[1]?.trim() ?? "";
  const status = planStatuses.get(rawStatus.toLocaleLowerCase()) ?? null;
  if (!rawStatus) issues.push(issue("incomplete", "Falta el estado del plan.", filePath));
  else if (!status) issues.push(issue("unknown-status", `El estado de plan «${rawStatus}» no está reconocido.`, filePath));

  const tasks = parseTasks(file.content, filePath, issues);
  if (tasks.length === 0) issues.push(issue("incomplete", "El plan no declara tareas en una tabla reconocible.", filePath));
  const taskStates = tasks.map((task) => task.status);
  const recognizedTaskStates = taskStates.filter((taskStatus): taskStatus is ProjectTaskStatus => taskStatus !== null);
  if (status === "Completado" && recognizedTaskStates.some((taskStatus) => taskStatus !== "Completada")) {
    issues.push(issue("contradiction", "El plan figura completado, pero no todas sus tareas están completadas.", filePath));
  }
  if (status === "Pendiente" && recognizedTaskStates.some((taskStatus) => taskStatus !== "Pendiente")) {
    issues.push(issue("contradiction", "El plan figura pendiente, pero contiene tareas que no están pendientes.", filePath));
  }
  if (status !== "Bloqueado" && recognizedTaskStates.some((taskStatus) => taskStatus === "Bloqueada")) {
    issues.push(issue("contradiction", "El plan no figura bloqueado, pero contiene tareas bloqueadas.", filePath));
  }
  if (status === "Listo para revisión" && recognizedTaskStates.some((taskStatus) => taskStatus !== "Completada")) {
    issues.push(issue("contradiction", "El plan está listo para revisión, pero tiene tareas no completadas.", filePath));
  }
  if (status === "En curso" && recognizedTaskStates.length === taskStates.length && taskStates.length > 0 && recognizedTaskStates.every((taskStatus) => taskStatus === "Pendiente")) {
    issues.push(issue("contradiction", "El plan figura en curso, pero todas sus tareas están pendientes.", filePath));
  }
  return { title, status, path: filePath, tasks, issues };
}

function parseTasks(content: string, filePath: string, issues: Issue[]): Task[] {
  const lines = content.split(/\r?\n/);
  const sectionIndex = lines.findIndex((line) => /^##\s+Tareas\s*$/i.test(line.trim()));
  if (sectionIndex < 0) return [];
  const tasks: Task[] = [];
  for (let index = sectionIndex + 1; index < lines.length; index += 1) {
    const line = lines[index]!.trim();
    if (/^##\s+/.test(line)) break;
    if (!line.startsWith("|") || /^\|\s*[-:| ]+\|?$/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 2) continue;
    const normalized = cells.map((cell) => cleanMarkdown(cell).toLocaleLowerCase());
    const titleColumn = normalized.findIndex((cell) => cell === "tarea");
    const statusColumn = normalized.findIndex((cell) => cell === "estado");
    if (titleColumn >= 0 && statusColumn >= 0) continue;
    const title = cleanMarkdown(cells[0] ?? "");
    const rawStatus = cleanMarkdown(cells[1] ?? "");
    if (!title) continue;
    const status = taskStatuses.get(rawStatus.toLocaleLowerCase()) ?? null;
    if (!status) issues.push(issue(rawStatus ? "unknown-status" : "incomplete", rawStatus ? `El estado de tarea «${rawStatus}» no está reconocido.` : `La tarea «${title}» no tiene estado.`, filePath));
    tasks.push({ title, status, requirements: [...new Set((cells[2] ?? "").match(/REQ-\d{3}-AC-\d{2}/gi) ?? [])], path: filePath });
  }
  return tasks;
}

function deriveMilestoneStatus(plans: Plan[], hasPlansLine: boolean, issues: Issue[]): ProjectMilestoneStatus | null {
  if (issues.some((item) => item.kind === "contradiction" || item.kind === "broken-reference")) return null;
  if (!hasPlansLine) return null;
  if (plans.length === 0) return "Planificado";
  if (plans.some((plan) => plan.status === null || plan.issues.length > 0)) return null;
  if (plans.some((plan) => plan.status === "Bloqueado")) return "Bloqueado";
  if (plans.every((plan) => plan.status === "Completado")) return "Completado";
  if (plans.some((plan) => plan.status === "En curso" || plan.status === "Listo para revisión")) return "En curso";
  return "Planificado";
}

function markdownLinks(value: string): string[] {
  return [...value.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)].map((match) => match[1]!);
}

function resolveDocumentationLink(sourcePath: string, reference: string): string | null {
  if (!reference || reference.startsWith("/") || reference.includes("\\") || /^(?:[a-z]+:|#)/i.test(reference)) return null;
  const targetPath = reference.split(/[?#]/, 1)[0]!;
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), targetPath));
  if (!resolved.startsWith("docs/") || resolved.split("/").includes("..")) return null;
  return resolved;
}

function cleanMarkdown(value: string): string {
  return value.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*_~]/g, "").trim();
}

function issue(kind: Issue["kind"], message: string, filePath: string): Issue {
  return { kind, message, path: filePath };
}
