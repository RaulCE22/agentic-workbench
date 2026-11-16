import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  path: z.string().min(1),
  isGitRepository: z.boolean(),
  addedAt: z.string().datetime(),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ProjectInputSchema = z.object({
  path: z.string().trim().min(1).max(4096),
  name: z.string().trim().min(1).max(120).optional(),
});

export const FileEntrySchema = z.object({
  name: z.string(),
  path: z.string(),
  kind: z.enum(["directory", "file"]),
  size: z.number().nonnegative().optional(),
});
export type FileEntry = z.infer<typeof FileEntrySchema>;

export const FileContentSchema = z.object({ path: z.string(), content: z.string(), size: z.number() });
export const RequirementSchema = z.object({
  id: z.string(), title: z.string(), status: z.string(), priority: z.string().optional(), path: z.string(), plans: z.array(z.string()),
});
export const RequirementListSchema = z.array(RequirementSchema);
export const DocumentSchema = z.object({ path: z.string(), title: z.string() });
export const ProjectStateIssueSchema = z.object({
  kind: z.enum(["incomplete", "unknown-status", "broken-reference", "contradiction"]),
  message: z.string(),
  path: z.string(),
});
export type ProjectStateIssue = z.infer<typeof ProjectStateIssueSchema>;
export const ProjectTaskStatusSchema = z.enum(["Pendiente", "En curso", "Bloqueada", "Completada"]);
export type ProjectTaskStatus = z.infer<typeof ProjectTaskStatusSchema>;
export const ProjectPlanStatusSchema = z.enum(["Pendiente", "En curso", "Bloqueado", "Listo para revisión", "Completado"]);
export type ProjectPlanStatus = z.infer<typeof ProjectPlanStatusSchema>;
export const ProjectMilestoneStatusSchema = z.enum(["Planificado", "En curso", "Bloqueado", "Completado"]);
export type ProjectMilestoneStatus = z.infer<typeof ProjectMilestoneStatusSchema>;
export const ProjectTaskSchema = z.object({
  title: z.string(),
  status: ProjectTaskStatusSchema.nullable(),
  requirements: z.array(z.string()),
  path: z.string(),
});
export type ProjectTask = z.infer<typeof ProjectTaskSchema>;
export const ProjectPlanSchema = z.object({
  title: z.string(),
  status: ProjectPlanStatusSchema.nullable(),
  path: z.string(),
  tasks: z.array(ProjectTaskSchema),
  issues: z.array(ProjectStateIssueSchema),
});
export type ProjectPlan = z.infer<typeof ProjectPlanSchema>;
export const ProjectMilestoneSchema = z.object({
  title: z.string(),
  objective: z.string().nullable(),
  status: ProjectMilestoneStatusSchema.nullable(),
  path: z.string(),
  requirements: z.array(z.object({ title: z.string(), path: z.string() })),
  plans: z.array(ProjectPlanSchema),
  issues: z.array(ProjectStateIssueSchema),
});
export type ProjectMilestone = z.infer<typeof ProjectMilestoneSchema>;
export const ProjectStateSchema = z.object({
  roadmapPath: z.string().nullable(),
  milestones: z.array(ProjectMilestoneSchema),
  issues: z.array(ProjectStateIssueSchema),
});
export type ProjectState = z.infer<typeof ProjectStateSchema>;
export const GitStatusSchema = z.object({
  branch: z.string(),
  clean: z.boolean(),
  changedFiles: z.array(z.object({ path: z.string(), status: z.string() })),
  diff: z.string(),
});
export const ErrorSchema = z.object({ error: z.string() });

export const ProjectStoreSchema = z.object({
  version: z.literal(1),
  projects: z.array(ProjectSchema),
  selectedProjectId: z.string().uuid().nullable(),
});
export type ProjectStore = z.infer<typeof ProjectStoreSchema>;
