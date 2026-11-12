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
