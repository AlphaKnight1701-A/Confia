# MCP service

Required AI-shopping half of the MVP. Current implementation exposes the read-only MCP tools over HTTP: GET /health reports process health, GET /ready returns the shared catalog summary and tool names, and POST /mcp handles tool calls.

From the repo root: `npm run dev:mcp`. Default origin: http://localhost:3001. Run `npm run setup:env` to create app-local configuration. The future SDK adapter calls @confia/product-data; React/Next.js and web source imports are forbidden.

The four read-only tools (`search_products`, `get_product`, `get_trust_score`, and `verify_product_claim`) all read from `@confia/product-data`. Preserve returned source URLs, timestamps, unsupported statuses, and synthetic labels when wiring ChatGPT connection. See [contracts](../../docs/API.md), [connection guide](../../docs/CHATGPT_SETUP.md), and [milestones](../../docs/IMPLEMENTATION.md).
