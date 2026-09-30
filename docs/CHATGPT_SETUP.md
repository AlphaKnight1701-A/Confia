# ChatGPT developer-mode setup and rehearsal

Status: the synthetic MCP demo implements all four tools. MCP Inspector is optional diagnostics; it does not activate Streamable HTTP or connect the product catalog.

## Prerequisites

- A ChatGPT account/workspace that exposes developer mode and allows the connection; confirm access before demo day.
- An implemented Node.js server with the four contracts in [API.md](API.md).
- A reviewed public synthetic catalog. No real merchant data or secrets in no-auth mode.
- A reachable HTTPS endpoint ending in `/mcp` for this chosen connection path.

## Local verification

1. From the monorepo root, run `npm ci` and `npm run setup:env`. The MCP app loads `apps/mcp-server/.env.local`, not the root legacy file.
2. Run `npm run check` and `npm run dev:mcp`. Use npm run demo for a local MCP round trip.
3. Check `http://localhost:3001/health` and `/ready`. Both endpoints should return 200 when the catalog is ready.
4. Start MCP Inspector and connect with Streamable HTTP to `http://localhost:3001/mcp`.
5. Confirm initialization, exactly four tools, valid schemas, and representative successful and failing calls.

Inspector is optional for normal use.

## Connect in ChatGPT

Expose the running service through a development tunnel or deploy it to a compatible host, then use that service origin for the connection. Set CONFIA_PUBLIC_BASE_URL to the public HTTPS origin; demo:start sets it automatically for its tunnel. Use the full HTTPS URL including `/mcp` when creating the developer-mode connection. Use no authentication only for the public synthetic read-only demo. Enable/select the connection in the demo chat before asking questions.

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

Use npm run demo for a local MCP demonstration if ChatGPT is unavailable. The business dashboard runs on port 3000; the MCP service runs on port 3001.

## Using another computer

Run npm run demo:start on one hosting computer only. VS Code is optional; PowerShell in the repository works. The script starts background processes, so keep the host awake and those processes running. Other computers connect to the same public MCP URL. Inspector need not run. Use the existing connection in the same ChatGPT account/workspace if available; a different account needs its own connection/access.

A quick tunnel may receive a different URL after restart. For ongoing use, deploy the MCP service to an always-on host with stable HTTPS and configure CONFIA_PUBLIC_BASE_URL. Each account connects to that stable endpoint once; hosting is not provisioned by this repository.

## Product and verification links

Products accept an optional links object with productUrl and verificationUrl. Both default to null and, when populated, require absolute HTTPS URLs. All four tools return links. productUrl identifies a product page; verificationUrl identifies its evidence/assessment report. Null means unavailable, not a clickable placeholder. Synthetic evidence sourceUrl remains null. Adding a link does not change the Trust Score or constitute certification.

Populate links only when the corresponding public pages exist. Demo reseeding replaces catalog fixtures, so persistent fixture changes belong in scripts/seed-demo.mjs too. The current tunnel exposes only MCP, not the local dashboard; localhost dashboard links cannot serve other users. Rebuild/restart after source changes and refresh tool discovery in ChatGPT.
