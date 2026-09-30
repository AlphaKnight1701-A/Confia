# Business platform

Required half of the Confĩa MVP. Own the landing page, dashboard, products, verification, discrepancies, and clearly labeled demonstration analytics. The dashboard and product routes read the shared catalog from `@confia/product-data`; analytics remain demonstration-only.

From the repo root: `npm run dev:web`. Default URL: http://localhost:3000. Run `npm run setup:env` to create app-local configuration without overwriting it. Never put server credentials into NEXT_PUBLIC variables.

Use @confia/product-data from server components/adapters and @confia/ui for presentation. Do not call the MCP process to reuse domain logic. Product facts, evidence status, source URLs, observation timestamps, and expiry dates come from the shared catalog; unsupported website facts must stay visibly unverified instead of being filled in by the web app.
