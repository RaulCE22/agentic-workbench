import {
  DocumentSchema,
  ErrorSchema,
  FileContentSchema,
  FileEntrySchema,
  GitStatusSchema,
  ProjectSchema,
  ProjectStoreSchema,
  RequirementListSchema,
} from "@agentic-workbench/contracts";

type RuntimeSchema<T> = { parse(input: unknown): T };

async function request<T>(url: string, schema: RuntimeSchema<T> | undefined, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers } });
  if (!response.ok) {
    const payload = ErrorSchema.safeParse(await response.json().catch(() => null));
    throw new Error(payload.success ? payload.data.error : `Error ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  const payload: unknown = await response.json();
  return schema ? schema.parse(payload) : payload as T;
}

const projectUrl = (id: string, endpoint: string) => `/api/projects/${encodeURIComponent(id)}/${endpoint}`;
export const api = {
  projects: () => request("/api/projects", ProjectStoreSchema),
  addProject: (path: string) => request("/api/projects", ProjectSchema, { method: "POST", body: JSON.stringify({ path }) }),
  removeProject: (id: string) => request<void>(`/api/projects/${encodeURIComponent(id)}`, undefined, { method: "DELETE" }),
  selectProject: (id: string) => request<void>(projectUrl(id, "select"), undefined, { method: "POST" }),
  tree: (id: string, path: string) => request(`${projectUrl(id, "tree")}?path=${encodeURIComponent(path)}`, FileEntrySchema.array()),
  file: (id: string, path: string) => request(`${projectUrl(id, "file")}?path=${encodeURIComponent(path)}`, FileContentSchema),
  documents: (id: string) => request(projectUrl(id, "documents"), DocumentSchema.array()),
  features: (id: string) => request(projectUrl(id, "features"), RequirementListSchema),
  git: (id: string) => request(projectUrl(id, "git"), GitStatusSchema),
};
