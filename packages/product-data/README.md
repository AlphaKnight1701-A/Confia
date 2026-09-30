# @confia/product-data

Own catalog access and the shared application-service facade: search, product retrieval, score retrieval, comparison, and dashboard product aggregates. Compose trust-engine and verification. Both apps use this entry point; no per-app catalog copies. Only the empty catalog summary is implemented today.

See [implementation plan](../../docs/IMPLEMENTATION.md). This private package exports TypeScript source; applications compile/bundle it. Run type checks and builds from the monorepo root.

