import { createServer } from "node:http";
import { getCatalogSummary } from "@confia/product-data";
import { MCP_TOOL_NAMES } from "@confia/types";

// Transport bootstrap only: never claim MCP readiness before real tools exist.
export function createBootstrapServer() {
  return createServer((request, response) => {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    const path = request.url?.split("?")[0];
    if (request.method === "GET" && path === "/health") {
      response.writeHead(200).end(JSON.stringify({ status: "ok", service: "confia-mcp-server", implementation: "scaffold" }));
    } else if (request.method === "GET" && path === "/ready") {
      response.writeHead(503).end(JSON.stringify({ status: "not_ready", reason: "MCP_TOOLS_NOT_IMPLEMENTED", catalog: getCatalogSummary() }));
    } else if (path === "/mcp") {
      response.writeHead(501).end(JSON.stringify({ error: { code: "NOT_IMPLEMENTED", message: "MCP transport and tools are the next milestone." }, plannedTools: MCP_TOOL_NAMES }));
    } else {
      response.writeHead(404).end(JSON.stringify({ error: { code: "NOT_FOUND" } }));
    }
  });
}
