# @confia/product-data

Own catalog access and the shared application-service facade: search, product retrieval, score retrieval, comparison, and dashboard product aggregates. Compose trust-engine and verification. Both apps use this entry point; no per-app catalog copies.

The package loads `data/demo-products.json`, validates each product through `@confia/types`, and returns evidence with `sourceLabel`, `sourceUrl`, `observedAt`, `expiresAt`, and verification status. Official manufacturer pages can verify stable specifications such as voltage, motor type, speed, weight, battery inclusion, and warranty; price, live availability, and return policy claims stay `unsupported` unless a dated page actually publishes them.

See [implementation plan](../../docs/IMPLEMENTATION.md). This private package exports TypeScript source; applications compile/bundle it. Run type checks and builds from the monorepo root.

