import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createBootstrapServer } from "../apps/mcp-server/src/app.ts";
import { getCatalogSummary } from "@confia/product-data";

test("service liveness does not claim unimplemented MCP readiness", async () => {
  const server = createBootstrapServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const origin = `http://127.0.0.1:${address.port}`;
  try {
    const health = await fetch(`${origin}/health`);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).implementation, "scaffold");
    const ready = await fetch(`${origin}/ready`);
    assert.equal(ready.status, 503);
    const readiness = await ready.json();
    assert.equal(readiness.reason, "MCP_TOOLS_NOT_IMPLEMENTED");
    assert.deepEqual(readiness.catalog, getCatalogSummary());
    const mcp = await fetch(`${origin}/mcp`, { method: "POST" });
    assert.equal(mcp.status, 501);
    assert.equal((await mcp.json()).error.code, "NOT_IMPLEMENTED");
    assert.equal((await fetch(`${origin}/missing`)).status, 404);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
