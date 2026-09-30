import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { getCatalogSummary } from "@confia/product-data";
import { MCP_TOOL_NAMES } from "@confia/types";
import { createMcpServer } from "./mcp.js";

function json(res: ServerResponse, status: number, payload: unknown) { res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }).end(JSON.stringify(payload)); }
async function body(req: IncomingMessage) {
  const chunks: Buffer[] = []; let size = 0;
  for await (const chunk of req) {
    size += Buffer.byteLength(chunk);
    if (size > 32768) throw new Error("BODY_TOO_LARGE");
    chunks.push(Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export function createConfiaServer(options: { clock?: () => Date; publicOrigin?: string } = {}) {
  // Demo data is public; only a configured HTTPS origin can pass Host validation remotely.
  const origin = options.publicOrigin ? new URL(options.publicOrigin) : null;
  if (origin && origin.protocol !== "https:") throw new Error("CONFIA_PUBLIC_BASE_URL must be an HTTPS origin");
  const counts = new Map<string, { count: number; until: number }>();
  return createServer(async (req, res) => {
    const host = req.headers.host ?? "";
    const localHost = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
    if (!localHost && host !== origin?.host) { json(res, 403, { error: "HOST_NOT_ALLOWED" }); return; }
    if (req.headers.origin && req.headers.origin !== origin?.origin && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.origin)) { json(res, 403, { error: "ORIGIN_NOT_ALLOWED" }); return; }
    if (req.headers.origin) { res.setHeader("Access-Control-Allow-Origin", req.headers.origin); res.setHeader("Vary", "Origin"); }
    const path = req.url?.split("?")[0];
    if (req.method === "GET" && (path === "/" || path === "/health")) { json(res, 200, { status: "ok", service: "confia-demo", synthetic: true, endpoint: "/mcp" }); return; }
    if (req.method === "GET" && path === "/ready") { json(res, 200, { status: "ready", catalog: getCatalogSummary(), tools: MCP_TOOL_NAMES }); return; }
    if (path !== "/mcp") { json(res, 404, { error: "NOT_FOUND" }); return; }
    if (req.method === "OPTIONS") { res.writeHead(204, { "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, MCP-Protocol-Version, MCP-Session-Id", "Access-Control-Expose-Headers": "MCP-Session-Id" }).end(); return; }
    // Streamable HTTP uses POST for JSON-RPC messages and may use GET/DELETE
    // for the transport's streaming/session lifecycle. Let the SDK handle all
    // three methods so ChatGPT's connection probe succeeds.
    if (!["POST", "GET", "DELETE"].includes(req.method ?? "")) {
      res.setHeader("Allow", "POST, GET, DELETE, OPTIONS");
      json(res, 405, { error: "METHOD_NOT_ALLOWED" });
      return;
    }
    if (req.method === "POST" && !req.headers["content-type"]?.includes("application/json")) { json(res, 415, { error: "JSON_REQUIRED" }); return; }
    const ip = req.socket.remoteAddress ?? "unknown";
    const time = Date.now();
    for (const [key, value] of counts) if (value.until <= time) counts.delete(key);
    const counter = counts.get(ip) ?? { count: 0, until: time + 60000 };
    if (++counter.count > 120) { res.setHeader("Retry-After", "60"); json(res, 429, { error: "RATE_LIMITED" }); return; }
    counts.set(ip, counter);
    let parsed: unknown;
    req.setTimeout(10000, () => req.destroy());
    try { parsed = req.method === "POST" ? await body(req) : undefined; }
    catch (error) { if (!res.destroyed) json(res, error instanceof Error && error.message === "BODY_TOO_LARGE" ? 413 : 400, { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Invalid or oversized JSON request" } }); return; }
    const mcp = createMcpServer(options.clock);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    res.on("close", () => { void mcp.close(); });
    try {
      await mcp.connect(transport);
      await transport.handleRequest(req, res, parsed);
    } catch {
      if (!res.headersSent) json(res, 500, { error: "INTERNAL_ERROR" });
    }
  });
}
