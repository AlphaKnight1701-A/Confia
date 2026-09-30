import { once } from "node:events";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createConfiaServer } from "../apps/mcp-server/src/app.ts";
const remote = process.argv[2];
const server = remote ? undefined : createConfiaServer();
if (server) { server.listen(0, "127.0.0.1"); await once(server, "listening"); }
const address = server?.address();
const endpoint = remote ?? `http://127.0.0.1:${address && typeof address !== "string" ? address.port : 3001}/mcp`;
const client = new Client({ name: "confia-demo-runner", version: "1.0.0" });
try {
  await client.connect(new StreamableHTTPClientTransport(new URL(endpoint)));
  console.log("Connected:", endpoint);
  console.log("Tools:", (await client.listTools()).tools.map(t => t.name).join(", "));
  for (const [name, args] of [
    ["search_products", { query: "cordless drill", maxPriceMinor: 20000, currency: "USD", minimumTrustScore: 8 }],
    ["get_trust_score", { productId: "drill-001" }],
    ["verify_product_claim", { productId: "drill-001", claims: { priceMinor: 19999, currency: "USD" } }],
    ["get_product", { productId: "drill-001", locale: "es" }],
  ] as const) {
    const result = await client.callTool({ name, arguments: args });
    if (result.isError) throw new Error(JSON.stringify(result));
    console.log(`\n${name}:\n${JSON.stringify(result.structuredContent, null, 2)}`);
  }
} finally { await client.close(); if (server) { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); } }
