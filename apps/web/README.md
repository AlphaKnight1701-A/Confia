# Business platform

Required half of the Confĩa MVP. Own the landing page, dashboard, products, verification, discrepancies, and clearly labeled demonstration analytics. Current pages are starter shells, not completed product workflows.

From the repo root: `npm run dev:web`. Default URL: http://localhost:3000. Run `npm run setup:env` to create app-local configuration without overwriting it. Never put server credentials into NEXT_PUBLIC variables.

Use @confia/product-data from server components/adapters and @confia/ui for presentation. Do not call the MCP process to reuse domain logic. Shared data is currently empty; product detail, bilingual presentation, real score views, and synthetic analytics remain work items in [the plan](../../docs/IMPLEMENTATION.md).
