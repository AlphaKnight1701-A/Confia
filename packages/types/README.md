# @confia/types

Own domain types, DTOs, enums, and runtime validation schemas. No framework, environment, filesystem, or app imports. Stable contracts unblock both applications.

Catalog claims include fixed evidence fields for accuracy tracking: status, source label, optional source URL, observation time, and expiry time. Keep these contracts source-agnostic so both web and MCP surfaces can expose the same evidence without duplicating product data.

See [implementation plan](../../docs/IMPLEMENTATION.md). This private package exports TypeScript source; applications compile/bundle it. Run type checks and builds from the monorepo root.

