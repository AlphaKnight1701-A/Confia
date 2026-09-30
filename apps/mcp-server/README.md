# MCP service

Required AI-shopping half of the MVP. Current implementation is an HTTP bootstrap, not a working MCP server: GET /health is 200, GET /ready is 503, and /mcp is 501.

From the repo root: `npm run dev:mcp`. Default origin: http://localhost:3001. Run `npm run setup:env` to create app-local configuration. The future SDK adapter calls @confia/product-data; React/Next.js and web source imports are forbidden.

Implement the four read-only tools and transport tests before attempting ChatGPT connection. See [contracts](../../docs/API.md), [connection guide](../../docs/CHATGPT_SETUP.md), and [milestones](../../docs/IMPLEMENTATION.md). Never report readiness for unimplemented tools.
