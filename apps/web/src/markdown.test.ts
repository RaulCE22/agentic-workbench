// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { sanitizeMarkdown } from "./markdown";

describe("visor Markdown", () => {
  it("elimina HTML ejecutable y recursos remotos automáticos", () => {
    const html = sanitizeMarkdown('<script>alert(1)</script><img src="https://example.com/track"><h1>Hola</h1>');
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<img");
    expect(html).toContain("Hola");
  });
});
