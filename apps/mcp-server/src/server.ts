import { createConfiaServer } from "./app.js";
const port = Number(process.env.PORT ?? 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be an integer from 1 to 65535.");
const server = createConfiaServer({ publicOrigin: process.env.CONFIA_PUBLIC_BASE_URL || undefined });
server.listen(port, "127.0.0.1", () => console.log(`Confia synthetic MCP demo ready: http://localhost:${port}/mcp`));
function shutdown() { server.close(() => process.exit(0)); server.closeIdleConnections(); }
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
