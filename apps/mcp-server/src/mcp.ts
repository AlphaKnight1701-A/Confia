import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SearchInputSchema, ProductInputSchema, ClaimsInputSchema, SearchOutputSchema, ProductOutputSchema, ScoreOutputSchema, ComparisonOutputSchema } from "@confia/types";
import { searchProducts, getProduct, getTrustScore, verifyProductClaim, DomainError } from "@confia/product-data";

function result(payload: Record<string, unknown>) { return { content: [{ type: "text" as const, text: JSON.stringify(payload) }], structuredContent: payload }; }
function run(output: z.ZodType, operation: () => unknown) {
  try { return result(output.parse(operation()) as Record<string, unknown>); }
  catch (error) {
    const payload = { error: { code: error instanceof DomainError ? error.code : error instanceof z.ZodError ? "VALIDATION_ERROR" : "INTERNAL_ERROR", message: error instanceof DomainError ? error.message : "The tool request could not be completed. Check its arguments.", requestId: randomUUID(), retryable: false } };
    return { content: [{ type: "text" as const, text: JSON.stringify(payload) }], isError: true };
  }
}
export function createMcpServer(clock: () => Date = () => new Date()) {
  const server = new McpServer({ name: "confia-demo", version: "0.1.0" }, { instructions: "A null priceMinor means price unavailable, never free or zero. Products with unknown prices cannot satisfy a budget. Confĩa is a read-only SYNTHETIC product-information demo. Always label results synthetic, preserve numerical scores, currency, evidence timestamps and uncertainty. A Trust Score measures confidence in information, not product quality. Never claim a real offer or certification. Use explicit currency and minor-unit budget fields. Use get_product for supporting evidence. No write or certification actions exist. Only render productUrl and verificationUrl as links when supplied and non-null. Null means not available; never invent a URL. A verification link is a report, not independent certification." });
  const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
  server.registerTool("search_products", { title: "Search Confĩa demo products", description: "Find synthetic power tools by keywords (English or Spanish), budget and minimum information Trust Score. For 200 USD pass maxPriceMinor=20000 and currency=USD. Returns applied filters and uncertainty; does not search the internet.", inputSchema: SearchInputSchema, outputSchema: SearchOutputSchema, annotations }, args => run(SearchOutputSchema, () => searchProducts(args, clock())));
  server.registerTool("get_product", { title: "Inspect product facts and evidence", description: "Retrieve a product ID from search, with canonical facts, synthetic evidence, timestamps and verification state. Preserve stale/conflicting warnings. Use locale es for Spanish text.", inputSchema: ProductInputSchema, outputSchema: ProductOutputSchema, annotations }, args => run(ProductOutputSchema, () => getProduct(args, clock())));
  server.registerTool("get_trust_score", { title: "Explain a Confĩa Trust Score", description: "Retrieve the deterministic score and exact weighted breakdown for a product ID. Unassessed means null, not zero. The score describes product information, not product quality.", inputSchema: ProductInputSchema, outputSchema: ScoreOutputSchema, annotations }, args => run(ScoreOutputSchema, () => getTrustScore(args, clock())));
  server.registerTool("verify_product_claim", { title: "Compare a product claim", description: "Read-only comparison of supplied price/currency or availability to eligible stored observations. 199.99 USD is priceMinor=19999, currency=USD. Reports match, potential discrepancy, or unknown; never certifies or updates a product.", inputSchema: ClaimsInputSchema, outputSchema: ComparisonOutputSchema, annotations }, args => run(ComparisonOutputSchema, () => verifyProductClaim(args, clock())));
  return server;
}

