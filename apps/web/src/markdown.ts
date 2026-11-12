import DOMPurify from "dompurify";
import { marked } from "marked";

export function sanitizeMarkdown(content: string): string {
  return DOMPurify.sanitize(marked.parse(content) as string, {
    FORBID_TAGS: ["img", "iframe", "video", "audio", "object", "embed"],
  });
}
