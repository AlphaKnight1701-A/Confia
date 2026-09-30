# ChatGPT developer-mode setup and rehearsal

Status: connection runbook for the future MCP tool implementation. The monorepo and server process are scaffolded, but `/mcp` returns 501 and `/ready` returns 503. Complete tools and transport before attempting this connection. This guide chooses a public HTTPS development/deployment endpoint; it does not provision hosting or connect an account automatically.

## Prerequisites

- A ChatGPT account/workspace that exposes developer mode and allows the connection; confirm access before demo day.
- An implemented Node.js server with the four contracts in [API.md](API.md).
- A reviewed public synthetic catalog. No real merchant data or secrets in no-auth mode.
- A reachable HTTPS endpoint ending in `/mcp` for this chosen connection path.

## Local verification

1. From the monorepo root, run `npm ci` and `npm run setup:env`. The MCP app loads `apps/mcp-server/.env.local`, not the root legacy file.
2. Run `npm run check` and `npm run dev:mcp`. Add and run catalog/MCP contract tests when those features are implemented.
3. Check `http://localhost:3001/health` and `/ready`. Readiness is intentionally 503 in the scaffold; the following connection steps require a future 200-ready implementation.
4. Start MCP Inspector and connect with Streamable HTTP to `http://localhost:3001/mcp`.
5. Confirm initialization, exactly four tools, valid schemas, and representative successful and failing calls.

The workspace scripts exist; tool transport tests and Inspector setup remain to be added. Select and pin the Inspector version during MCP implementation; use its official installation instructions rather than assuming it is bundled with this repository.

## Connect in ChatGPT

Expose the running service through a development tunnel or deploy it to a compatible host, then use that service origin for the connection. Add any transport-specific public-origin validation in the MCP configuration milestone; the current bootstrap consumes only PORT. Use the full HTTPS URL including `/mcp` when creating the developer-mode connection. Use no authentication only for the public synthetic read-only demo. Enable/select the connection in the demo chat before asking questions.

Exact labels and account/workspace availability can change; follow the [official connection guide](https://developers.openai.com/plugins/deploy/connect-chatgpt). That guide also describes Secure MCP Tunnel for private development. Plain localhost is not the chosen remote connection path. No OpenAI API credential belongs in the connection form for this architecture.

After changing tool names or schemas, refresh/reconnect the tool catalog as supported by the client and recheck discovery. A changed tunnel URL requires updating the connection. Do not assume old chats have adopted new tool definitions.

## Rehearsal matrix

| Prompt/action | Expected behavior to inspect |
| --- | --- |
| “Use Confĩa to find a cordless drill under 200 USD.” | search_products receives explicit maxPriceMinor 20000 and USD; result respects both |
| “Why did that product receive this score?” | get_trust_score uses the returned product ID; exact numerical breakdown preserved |
| “Compare a claimed price of 199.99 USD for this product.” | verify_product_claim receives 19999; returns discrepancy only with eligible same-currency evidence |
| “Necesito un taladro por menos de 200 dólares estadounidenses.” | Spanish presentation; same canonical IDs and money for equivalent constraints |
| Ask about an unassessed item | Null score is described as unassessed, never invented or treated as product quality |
| Ask about a conflicting/stale item | State and timestamps remain visible even when a score is high |
| Ask to certify or edit a product | No write tool exists; no fabricated successful update |
| Interrupt a request / stop the server | Clear tool failure; no invented fresh evidence |

Save sanitized tool arguments/results and final answers for regression review. Mark failures where prose hides a conflict, changes a score, invents evidence, or implies real certification. ChatGPT output is not guaranteed by the server's deterministic unit tests.

## Troubleshooting and fallback

| Symptom | Check |
| --- | --- |
| Cannot connect | Full `/mcp` URL, HTTPS reachability, tunnel uptime, proxy behavior, and account access |
| Tools missing | tools/list in Inspector, connection selection, refreshed schemas |
| Tool calls fail | MCP error envelope and requestId in logs, schema constraints, catalog readiness |
| Everything appears stale | Actual observation/expiry times; create a newly labeled demo fixture, never disable expiry |
| Budget ignored | Actual tool arguments, currency and appliedFilters; do not rely on prose-only constraints |
| English/Spanish disagree | Compare structured payloads for identical filters and evaluation time |

Once MCP tools exist, use Inspector to demonstrate their underlying results if ChatGPT is unavailable. A local domain runner can be added later; no `npm run demo` script exists today. Clearly describe this as backend verification, not a successful ChatGPT integration. The business dashboard in apps/web is the second required MVP deliverable and also supports the business-side demo. Its default port is 3000; do not register that website origin as the MCP endpoint.
