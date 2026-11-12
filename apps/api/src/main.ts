import { serve } from "@hono/node-server";
import { app, host, port } from "./app.js";

const server = serve({ fetch: app.fetch, hostname: "127.0.0.1", port }, () => {
  console.log(`Agentic Workbench disponible en http://${host}`);
});

server.on("error", () => {
  console.error(`No se pudo iniciar Agentic Workbench en ${host}. Comprueba si el puerto está ocupado.`);
  process.exitCode = 1;
});

function shutdown() {
  server.close(() => process.exit(0));
}
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
