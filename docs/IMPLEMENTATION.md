# Implementation plan

The workspace scaffold is complete; the product described in README is not. This checklist assigns ownership and makes the two halves independently actionable without duplicating business rules.

## 1. Foundation — scaffolded

- [x] npm workspaces, lockfile, Turborepo, shared TypeScript config.
- [x] apps/web on port 3000; apps/mcp-server bootstrap on port 3001.
- [x] Five shared packages, entry points, explicit dependency boundaries.
- [x] App-local environment templates and non-overwriting setup command.
- [x] CI for boundary checks, type checks, bootstrap test, and builds.
- [ ] Add feature-level domain and adapter tests as implementations arrive.

## 2. Shared domain — blocks both applications

| Work | Owner | Acceptance |
| --- | --- | --- |
| Canonical product, evidence, assessment, score, comparison DTOs and runtime schemas | packages/types | Unknown fields and invalid money/timestamps rejected; en/es facts represented once |
| 8–12 synthetic products and evidence | data + packages/product-data | Fixtures validate, IDs/references resolve, all README scenarios represented |
| Repository and localized search | packages/product-data | Budget/currency/trust constraints, deterministic ordering, empty results, stable revision IDs |
| Evidence eligibility and comparison | packages/verification | Missing/stale/conflicting evidence stays unknown; same-currency eligible differences are discrepancies |
| v1 scoring | packages/trust-engine | Exact weights, zero denominators, no assessment = null, expiry boundaries, reproducible clock injection |
| Shared use-case facade | packages/product-data | Both adapters retrieve identical facts and breakdowns for the same revision/time |

Keep orchestration in product-data. The two apps must not independently implement search, scoring, or claim comparisons. The existing empty catalog deliberately fails if someone inserts products without first implementing validation.

## 3. MCP half — main shopper path

- [ ] Add and pin the TypeScript MCP SDK and runtime schema dependency.
- [ ] Implement Streamable HTTP at /mcp and four contracts from API.md.
- [ ] Replace the 501 bootstrap response only when real tools and domain services exist.
- [ ] Readiness becomes 200 only after configuration, catalog, and tool registration are usable.
- [ ] Exercise initialize, tools/list, all four tools, output validation, errors, cancellation, and bounds through the transport.
- [ ] Deploy/tunnel and connect the actual ChatGPT demo account.
- [ ] Rehearse English/Spanish search, explanation, unknown evidence, and a deliberate discrepancy; inspect final prose and tool traces.

No shopper web frontend or backend OpenAI API key is required. Documentation alone does not satisfy the connection milestone.

## 4. Web half — equally required MVP deliverable

- [ ] Polish the landing page and add bilingual content with clear trust limitations.
- [ ] Decide the real demo-request destination or label a demo-only flow; do not silently discard forms.
- [ ] Implement dashboard product totals, average non-null score, states, and discrepancy counts from shared services.
- [ ] Implement product table and /dashboard/products/[id] detail page.
- [ ] Render evidence, timestamps, freshness, score components, and verification uncertainty.
- [ ] Add the supplied-vs-observed discrepancy experience through the shared comparison use case.
- [ ] Add visibly synthetic engagement analytics without presenting them as measured ChatGPT activity.
- [ ] Add locale navigation, keyboard interaction, responsive layouts, and empty/error/loading states.
- [ ] Add Tailwind/shadcn only when implementing reusable UI that needs them; current shell uses ordinary CSS.

Keep React in web/ui. Keep catalog access in server components or a server-only adapter. The initial public dashboard shows synthetic data only; authentication is deferred, not simulated as secure.

## 5. Integration and judging

- [ ] Build and deploy both applications from the same catalog/policy revision.
- [ ] Parity test: web read model and MCP output match for identical input and injected time.
- [ ] Browser journey: landing → dashboard → products → evidence → discrepancy → synthetic analytics.
- [ ] ChatGPT journey: search → score explanation → comparison → Spanish query.
- [ ] Show null, stale, and conflicting records truthfully in both halves.
- [ ] Use MCP Inspector as the fallback if ChatGPT fails; use the web dashboard for the business story.
- [ ] Record sanitized demo prompts and results; keep secrets and live customer data out of fixtures.

## Deferred scope

Real merchant onboarding/authentication, payments, durable writes, database adapters, evidence fetchers, retailer feeds, production analytics, attribution, and recurring verification. None is necessary to restructure or scaffold this monorepo. Add them with explicit authorization and data models before exposing real merchant information.
