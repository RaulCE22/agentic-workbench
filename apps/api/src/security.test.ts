import { describe, expect, it } from "vitest";
import { app } from "./app.js";

describe("protección del origen local", () => {
  it("rechaza un Host ajeno", async () => {
    const response = await app.request("http://127.0.0.1:4173/api/health", { headers: { host: "attacker.example" } });
    expect(response.status).toBe(403);
  });

  it("rechaza orígenes cruzados", async () => {
    const response = await app.request("http://127.0.0.1:4173/api/health", {
      headers: { host: "127.0.0.1:4173", origin: "https://attacker.example" },
    });
    expect(response.status).toBe(403);
  });

  it("requiere origen exacto para cambios del registro", async () => {
    const response = await app.request("http://127.0.0.1:4173/api/projects", {
      method: "POST", headers: { host: "127.0.0.1:4173", "content-type": "application/json" }, body: JSON.stringify({ path: "/tmp" }),
    });
    expect(response.status).toBe(403);
  });

  it("sirve la SPA compilada desde el mismo servidor", async () => {
    const response = await app.request("http://127.0.0.1:4173/");
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Agentic Workbench");
  });
});
