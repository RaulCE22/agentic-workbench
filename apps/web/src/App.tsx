import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import type { Project } from "@agentic-workbench/contracts";
import { api } from "./api";
import { MarkdownView } from "./MarkdownView";

type Section = "overview" | "files" | "documentation" | "features" | "git";
const sections: Array<{ id: Section; label: string; icon: string }> = [
  { id: "overview", label: "Resumen", icon: "◫" },
  { id: "files", label: "Archivos", icon: "⌘" },
  { id: "documentation", label: "Documentación", icon: "▤" },
  { id: "features", label: "Requisitos", icon: "◇" },
  { id: "git", label: "Git", icon: "⑂" },
];

export function App() {
  const client = useQueryClient();
  const navigate = useNavigate();
  const { section: routeSection } = useParams();
  const section: Section = sections.some((item) => item.id === routeSection) ? routeSection as Section : "overview";
  const setSection = (next: Section) => navigate(next === "overview" ? "/" : `/${next}`);
  const [notice, setNotice] = useState("");
  const [folderPath, setFolderPath] = useState("");
  const [documentPath, setDocumentPath] = useState("");
  const projectsQuery = useQuery({ queryKey: ["projects"], queryFn: api.projects });
  const store = projectsQuery.data;
  const project = store?.projects.find((item) => item.id === store.selectedProjectId);
  const addProject = useMutation({
    mutationFn: api.addProject,
    onSuccess: async () => { setFolderPath(""); await client.invalidateQueries({ queryKey: ["projects"] }); setNotice("Proyecto registrado correctamente."); },
    onError: (error: Error) => setNotice(error.message),
  });
  const selectProject = useMutation({
    mutationFn: api.selectProject,
    onSuccess: async () => { setFolderPath(""); setDocumentPath(""); await client.invalidateQueries({ queryKey: ["projects"] }); },
    onError: (error: Error) => setNotice(error.message),
  });
  const removeProject = useMutation({
    mutationFn: api.removeProject,
    onSuccess: async () => { await client.invalidateQueries({ queryKey: ["projects"] }); setNotice("Se retiró el registro; la carpeta no se modificó."); },
    onError: (error: Error) => setNotice(error.message),
  });

  const errors = [projectsQuery.error, addProject.error, selectProject.error, removeProject.error];
  const visibleError = notice || errors.find(Boolean)?.message || "";

  return (
    <div className="workbench-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); setSection("overview"); }}>
          <span className="brand-mark">w<span>.</span></span>
          <span className="brand-copy"><b>workbench</b><small>LOCAL PROJECT STUDIO</small></span>
        </a>
        <div className="sidebar-label">ESPACIO DE TRABAJO</div>
        <nav className="main-nav" aria-label="Secciones del proyecto">
          {sections.map((item) => <button className={`nav-item ${section === item.id ? "active" : ""}`} key={item.id} onClick={() => setSection(item.id)}>
            <span className="nav-icon">{item.icon}</span><span>{item.label}</span>
            {section === item.id && <span className="nav-active-mark" />}
          </button>)}
        </nav>
        <div className="project-list-heading"><span>PROYECTOS</span><span className="count-pill">{store?.projects.length ?? 0}</span></div>
        <div className="projects-list">
          {store?.projects.map((item) => <button key={item.id} className={`project-row ${project?.id === item.id ? "selected" : ""}`} onClick={() => selectProject.mutate(item.id)} title={item.path}>
            <span className="project-dot" /> <span className="project-row-name">{item.name}</span>{item.isGitRepository && <span className="git-mini">git</span>}
          </button>)}
          {!store?.projects.length && !projectsQuery.isLoading && <p className="sidebar-empty">Aún no hay proyectos</p>}
        </div>
        <form className="add-project" onSubmit={(event) => { event.preventDefault(); if (folderPath.trim()) addProject.mutate(folderPath.trim()); }}>
          <label htmlFor="folder-path">Registrar carpeta local</label>
          <input id="folder-path" value={folderPath} onChange={(event) => setFolderPath(event.target.value)} placeholder="/Users/tu/proyecto" />
          <button className="add-button" type="submit" disabled={!folderPath.trim() || addProject.isPending}>
            <span>＋</span>{addProject.isPending ? "Registrando…" : "Añadir proyecto"}
          </button>
        </form>
        <div className="sidebar-footer"><span className="online-dot" /> Solo en este equipo <span className="version-label">V0.1</span></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Workbench</span><span className="crumb-separator">/</span><b>{project?.name ?? "Sin proyecto"}</b></div>
          <div className="topbar-right"><span className="local-badge"><span /> LOCAL</span><span className="avatar">R</span></div>
        </header>
        {visibleError && <div className="notice" role="status"><span>{visibleError}</span><button onClick={() => { setNotice(""); addProject.reset(); selectProject.reset(); removeProject.reset(); }}>×</button></div>}
        {!project ? <EmptyState onAdd={() => document.getElementById("folder-path")?.focus()} /> : <>
          <div className="page-heading">
            <div><div className="eyebrow">{section === "overview" ? "TU ESPACIO LOCAL" : project.name}</div><h1>{sections.find((item) => item.id === section)?.label}</h1></div>
            <div className="heading-actions">
              <span className="read-only"><span>◉</span> Solo lectura</span>
              <button className="icon-button" title="Actualizar" onClick={() => void client.invalidateQueries()} aria-label="Actualizar">↻</button>
              <button className="more-button" title="Retirar proyecto" onClick={() => {
                if (window.confirm(`¿Retirar “${project.name}” de Workbench? Sus archivos permanecerán intactos.`)) removeProject.mutate(project.id);
              }}>•••</button>
            </div>
          </div>
          {section === "overview" && <Overview project={project} onSection={setSection} />}
          {section === "files" && <FilesPage project={project} />}
          {section === "documentation" && <DocumentationPage project={project} initialPath={documentPath} onPath={setDocumentPath} />}
          {section === "features" && <FeaturesPage project={project} onOpen={(path) => { setDocumentPath(path); setSection("documentation"); }} />}
          {section === "git" && <GitPage project={project} />}
        </>}
      </main>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return <div className="empty-workspace"><div className="empty-illustration"><div className="empty-orbit orbit-one"/><div className="empty-orbit orbit-two"/><div className="empty-folder"><span>⌂</span></div><i className="spark spark-a">✳</i><i className="spark spark-b">✦</i></div><div className="eyebrow">EMPIEZA EN LOCAL</div><h1>Tu proyecto,<br />en un solo espacio.</h1><p>Registra una carpeta de tu equipo para explorar sus archivos, documentación, requisitos y estado de Git.</p><button className="primary-button" onClick={onAdd}>＋ Registrar un proyecto</button><small>Los archivos permanecen en su ubicación original.</small></div>;
}

function Overview({ project, onSection }: { project: Project; onSection: (section: Section) => void }) {
  const tree = useQuery({ queryKey: ["tree", project.id, "."], queryFn: () => api.tree(project.id, ".") });
  const git = useQuery({ queryKey: ["git", project.id], queryFn: () => api.git(project.id), enabled: project.isGitRepository });
  const documents = useQuery({ queryKey: ["documents", project.id], queryFn: () => api.documents(project.id) });
  const folders = tree.data?.filter((entry) => entry.kind === "directory").length ?? 0;
  const files = tree.data?.filter((entry) => entry.kind === "file").length ?? 0;
  return <div className="page-content overview-page">
    <section className="welcome-card"><div><div className="welcome-kicker"><span className="sparkle">✦</span> ESPACIO LOCAL</div><h2>{project.name}</h2><p>{project.path}</p><div className="welcome-tags"><span><i className="status-dot"/> Registrado</span>{project.isGitRepository && <span>⌘ Repositorio Git</span>}<span>⌑ Solo lectura</span></div></div><div className="welcome-glyph">{project.name.slice(0, 1).toUpperCase()}</div><div className="welcome-grid"/></section>
    <div className="metric-grid">
      <Metric label="ARCHIVOS EN RAÍZ" value={tree.isLoading ? "—" : files} note="Elementos visibles" icon="▤" tone="blue" />
      <Metric label="CARPETAS" value={tree.isLoading ? "—" : folders} note="Directorios del proyecto" icon="▰" tone="purple" />
      <Metric label="DOCUMENTOS" value={documents.data?.length ?? "—"} note="Markdown detectados" icon="◈" tone="green" />
      <Metric label="ESTADO GIT" value={!project.isGitRepository ? "—" : git.isLoading ? "…" : git.data?.clean ? "Limpio" : `${git.data?.changedFiles.length ?? 0} cambios`} note={git.data?.branch ?? (project.isGitRepository ? "Repositorio" : "Sin repositorio")} icon="⑂" tone="orange" />
    </div>
    <div className="overview-columns"><section className="panel recent-panel"><PanelHeading title="ACCESO RÁPIDO" link="Explorar" onClick={() => onSection("files")} /><button className="quick-link" onClick={() => onSection("files")}><span className="quick-icon folder-icon">▰</span><span><b>Explorar archivos</b><small>Navega por la estructura del proyecto</small></span><span className="arrow">↗</span></button><button className="quick-link" onClick={() => onSection("documentation")}><span className="quick-icon doc-icon">▤</span><span><b>Leer documentación</b><small>{documents.data?.length ?? 0} documentos Markdown encontrados</small></span><span className="arrow">↗</span></button><button className="quick-link" onClick={() => onSection("features")}><span className="quick-icon feature-icon">◇</span><span><b>Ver requisitos</b><small>Consulta el catálogo de funcionalidades</small></span><span className="arrow">↗</span></button></section>
      <section className="panel safety-panel"><PanelHeading title="ESTE PROYECTO ESTÁ SEGURO" /><div className="safety-mark">✓</div><p>Workbench solo puede leer la carpeta que registraste. No modifica tus archivos ni realiza cambios en Git.</p><div className="safety-meta"><span>⌾</span> Acceso local y explícito</div></section></div>
  </div>;
}

function Metric({ label, value, note, icon, tone }: { label: string; value: string | number; note: string; icon: string; tone: string }) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}>{icon}</span></div><strong>{value}</strong><small>{note}</small></div>;
}

function PanelHeading({ title, link, onClick }: { title: string; link?: string; onClick?: () => void }) {
  return <div className="panel-heading"><span>{title}</span>{link && <button onClick={onClick}>{link} <i>↗</i></button>}</div>;
}

function FilesPage({ project }: { project: Project }) {
  const [activeFile, setActiveFile] = useState("");
  return <div className="page-content split-browser"><section className="panel file-tree-panel"><PanelHeading title="ARCHIVOS DEL PROYECTO" /><div className="tree-root"><span className="tree-root-icon">▰</span><b>{project.name}</b></div><TreeDirectory project={project} path="." name={project.name} depth={0} onFile={setActiveFile} /></section>
    <section className="panel file-view-panel">{activeFile ? <FilePreview project={project} filePath={activeFile} /> : <div className="file-placeholder"><div>⌘</div><b>Selecciona un archivo</b><p>El contenido aparecerá aquí en modo de solo lectura.</p></div>}</section></div>;
}

function TreeDirectory({ project, path, name, depth, onFile }: { project: Project; path: string; name: string; depth: number; onFile: (path: string) => void }) {
  const [open, setOpen] = useState(depth === 0);
  const query = useQuery({ queryKey: ["tree", project.id, path], queryFn: () => api.tree(project.id, path), enabled: open });
  return <div className="tree-branch"><button className={`tree-node directory-node ${open ? "open" : ""}`} style={{ paddingLeft: `${12 + depth * 15}px` }} onClick={() => setOpen(!open)}><span className="chevron">{open ? "⌄" : "›"}</span><span className="folder-symbol">▰</span><span>{name}</span></button>
    {open && <div>{query.data?.map((entry) => entry.kind === "directory" ? <TreeDirectory key={entry.path} project={project} path={entry.path} name={entry.name} depth={depth + 1} onFile={onFile} /> : <button key={entry.path} className="tree-node file-node" style={{ paddingLeft: `${30 + depth * 15}px` }} onClick={() => onFile(entry.path)}><span className="file-symbol">{fileGlyph(entry.name)}</span><span>{entry.name}</span></button>)}{query.error && <small className="tree-error">{(query.error as Error).message}</small>}</div>}
  </div>;
}

function FilePreview({ project, filePath }: { project: Project; filePath: string }) {
  const query = useQuery({ queryKey: ["file", project.id, filePath], queryFn: () => api.file(project.id, filePath) });
  const markdown = filePath.toLowerCase().endsWith(".md");
  return <><div className="file-preview-heading"><div><span className="file-symbol">{fileGlyph(filePath)}</span><b>{filePath}</b></div><span>{query.data ? formatBytes(query.data.size) : ""}</span></div>{query.isLoading ? <div className="loading-state">Leyendo archivo…</div> : query.error ? <div className="inline-error">{(query.error as Error).message}</div> : query.data && (markdown ? <div className="file-markdown"><MarkdownView content={query.data.content} currentPath={filePath} onNavigate={() => undefined} /></div> : <pre className="code-content"><code>{query.data.content}</code></pre>)}</>;
}

function DocumentationPage({ project, initialPath, onPath }: { project: Project; initialPath: string; onPath: (path: string) => void }) {
  const documents = useQuery({ queryKey: ["documents", project.id], queryFn: () => api.documents(project.id) });
  const selectedPath = initialPath || documents.data?.[0]?.path || "";
  const file = useQuery({ queryKey: ["file", project.id, selectedPath], queryFn: () => api.file(project.id, selectedPath), enabled: !!selectedPath });
  return <div className="page-content split-browser docs-browser"><section className="panel docs-list-panel"><PanelHeading title="DOCUMENTACIÓN" /><p className="subtle-copy">Markdown dentro de docs/ y plans/</p>{documents.data?.map((document) => <button key={document.path} className={`doc-item ${selectedPath === document.path ? "selected" : ""}`} onClick={() => onPath(document.path)}><span className="doc-item-icon">▤</span><span><b>{document.title}</b><small>{document.path}</small></span></button>)}{documents.data?.length === 0 && <div className="empty-inline">No se encontraron documentos Markdown.</div>}</section><section className="panel doc-content-panel">{file.data ? <><div className="file-preview-heading"><div><span className="doc-item-icon">▤</span><b>{file.data.path}</b></div><span>MARKDOWN</span></div><div className="markdown-scroll"><MarkdownView content={file.data.content} currentPath={selectedPath} onNavigate={onPath} /></div></> : file.isLoading ? <div className="loading-state">Cargando documento…</div> : file.error ? <div className="inline-error">{(file.error as Error).message}</div> : <div className="file-placeholder"><div>▤</div><b>Elige un documento</b></div>}</section></div>;
}

function FeaturesPage({ project, onOpen }: { project: Project; onOpen: (path: string) => void }) {
  const features = useQuery({ queryKey: ["features", project.id], queryFn: () => api.features(project.id) });
  return <div className="page-content feature-page"><div className="section-intro"><p>Catálogo de requisitos documentados en el proyecto.</p><span>{features.data?.length ?? 0} requisitos</span></div><section className="panel feature-list">{features.data?.map((feature) => <div className="feature-row" key={feature.id}><button className="feature-open" onClick={() => onOpen(feature.path)}><span className="feature-id">{feature.id}</span><span className="feature-title"><b>{feature.title}</b><small>{feature.path}</small></span></button>{feature.plans.map((plan) => <button className="plan-link" key={plan} onClick={() => onOpen(plan)} title={plan}>Plan ↗</button>)}{feature.priority && <span className="priority-chip">{feature.priority}</span>}<span className="status-chip">{feature.status}</span><span className="arrow">↗</span></div>)}{features.data?.length === 0 && <div className="empty-inline">No se encontraron archivos REQ-### dentro de docs/requirements.</div>}</section></div>;
}

function GitPage({ project }: { project: Project }) {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["git", project.id], queryFn: () => api.git(project.id), enabled: project.isGitRepository });
  if (!project.isGitRepository) return <div className="page-content"><div className="panel git-empty"><span>⑂</span><h2>Este proyecto no usa Git</h2><p>Workbench solo muestra el estado de repositorios Git existentes.</p></div></div>;
  return <div className="page-content git-page"><section className="git-summary panel"><div className="branch-icon">⑂</div><div><small>RAMA ACTUAL</small><b>{query.data?.branch ?? (query.isLoading ? "Consultando…" : "—")}</b></div><div className="git-status"><span className={query.data?.clean ? "clean-dot" : "dirty-dot"} />{query.data?.clean ? "Sin cambios" : `${query.data?.changedFiles.length ?? 0} archivos modificados`}</div><button className="icon-button" onClick={() => void client.invalidateQueries({ queryKey: ["git", project.id] })} aria-label="Actualizar Git">↻</button></section>
    {query.error && <div className="inline-error">{(query.error as Error).message}</div>}
    <section className="panel changed-files"><PanelHeading title="ARCHIVOS AFECTADOS" />{query.data?.changedFiles.map((file, index) => <div className="changed-file" key={`${file.path}-${index}`}><code>{file.status}</code><span>{file.path}</span></div>)}{query.data?.clean && <div className="empty-inline success-copy">El árbol de trabajo está limpio.</div>}</section>
    <section className="panel diff-panel"><PanelHeading title="DIFF SIN CONFIRMAR" /><pre>{query.data?.diff || "No hay diferencias de archivos versionados."}</pre></section></div>;
}

function fileGlyph(name: string) { return name.toLowerCase().endsWith(".md") ? "M" : name.includes(".") ? "·" : "▤"; }
function formatBytes(bytes: number) { return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`; }
