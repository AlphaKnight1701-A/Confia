import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createConfiaServer } from "../apps/mcp-server/src/app.ts";
import { getProduct } from "@confia/product-data";
import catalog from "../data/demo-products.json";

export async function withDemo(operation: (client: Client, origin: string) => Promise<void>) {
  const now = new Date(catalog.generatedAt);
  const server = createConfiaServer({ clock: () => now });
  server.listen(0, "127.0.0.1"); await once(server, "listening");
  const address = server.address(); assert.ok(address && typeof address !== "string");
  const origin = `http://127.0.0.1:${address.port}`;
  const client = new Client({ name: "confia-integration-test", version: "1.0.0" });
  try { await client.connect(new StreamableHTTPClientTransport(new URL(`${origin}/mcp`))); await operation(client, origin); }
  finally { await client.close(); server.closeAllConnections(); await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())); }
}

test("MCP initialization, discovery, four tools, schemas, errors and shared web parity", async () => {
  await withDemo(async (client, origin) => {
    assert.equal((await fetch(`${origin}/ready`)).status, 200);
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map(t => t.name).sort(), ["get_product", "get_trust_score", "search_products", "verify_product_claim"]);
    assert.ok(tools.every(t => t.annotations?.readOnlyHint && t.outputSchema));
    const calls = [
      ["search_products", { query: "drill", maxPriceMinor: 20000, currency: "USD" }],
      ["get_product", { productId: "drill-001", locale: "es" }],
      ["get_trust_score", { productId: "drill-001" }],
      ["verify_product_claim", { productId: "drill-001", claims: { priceMinor: 19999, currency: "USD" } }],
    ] as const;
    for (const [name, args] of calls) {
      const result = await client.callTool({ name, arguments: args });
      assert.notEqual(result.isError, true, JSON.stringify(result));
      assert.equal(result.structuredContent?.synthetic, true);
      const content = result.content as Array<{type: string; text: string}>;
      assert.deepEqual(JSON.parse(content[0].text), result.structuredContent);
      if (name === "get_product") assert.deepEqual(result.structuredContent, getProduct({ productId: "drill-001", locale: "es" }, new Date(catalog.generatedAt)));
    }
    const missing = await client.callTool({ name: "get_product", arguments: { productId: "missing" } });
    assert.equal(missing.isError, true);
    const invalid = await client.callTool({ name: "search_products", arguments: { query: "drill", maxPriceMinor: -1 } });
    assert.equal(invalid.isError, true);
    assert.equal((await fetch(`${origin}/mcp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" })).status, 400);
    assert.equal((await fetch(`${origin}/mcp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ oversized: "a".repeat(40000) }) })).status, 413);
    assert.equal((await fetch(`${origin}/health`, { headers: { Origin: "https://untrusted.example" } })).status, 403);
  });
});
