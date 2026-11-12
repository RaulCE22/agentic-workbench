import { useEffect, useMemo, useRef } from "react";
import { sanitizeMarkdown } from "./markdown";

export function MarkdownView({ content, currentPath, onNavigate }: {
  content: string;
  currentPath: string;
  onNavigate: (path: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const html = useMemo(() => sanitizeMarkdown(content), [content]);

  useEffect(() => {
    if (!root.current) return;
    root.current.innerHTML = html;
    const diagrams: HTMLElement[] = [];
    root.current.querySelectorAll("code.language-mermaid").forEach((code) => {
      const block = document.createElement("pre");
      block.className = "mermaid-diagram";
      block.textContent = code.textContent || "";
      code.closest("pre")?.replaceWith(block);
      diagrams.push(block);
    });
    if (diagrams.length) {
      void import("mermaid").then(({ default: mermaid }) => {
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict", flowchart: { htmlLabels: false } });
        return mermaid.run({ nodes: diagrams });
      }).catch(() => undefined);
    }
    return () => { root.current?.replaceChildren(); };
  }, [html]);

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const anchor = (event.target as HTMLElement).closest("a");
    const href = anchor?.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    if (/^(?:https?:)?\/\//i.test(href) || /^[a-z][a-z\d+.-]*:/i.test(href)) {
      anchor?.setAttribute("target", "_blank");
      anchor?.setAttribute("rel", "noreferrer noopener");
      return;
    }
    event.preventDefault();
    try {
      onNavigate(resolveMarkdownPath(currentPath, decodeURIComponent(href.split("#")[0]!)));
    } catch {
      return;
    }
  }

  return <div className="markdown-body" ref={root} onClick={handleClick} />;
}

function resolveMarkdownPath(currentPath: string, href: string): string {
  const parts = currentPath.split("/").slice(0, -1);
  for (const segment of href.split("/")) {
    if (!segment || segment === ".") continue;
    if (segment === "..") parts.pop();
    else parts.push(segment);
  }
  return parts.join("/");
}
