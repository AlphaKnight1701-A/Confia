import { createBootstrapServer } from "./app.js";
const port = Number(process.env.PORT ?? 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be an integer from 1 to 65535.");
const server = createBootstrapServer();
server.listen(port, () => console.log(`Confia service scaffold: http://localhost:${port} (MCP not implemented)`));
function shutdown() { server.close(() => process.exit(0)); server.closeIdleConnections(); }
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
