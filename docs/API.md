# MCP tool contracts

Status: proposed, not implemented. MCP is the primary public API. These contracts replace the earlier shopper REST design. There is no `/api/v1/search` or merchant-write requirement for the MVP.

## Transport and registration

Expose the four tools through SDK-managed Streamable HTTP at `/mcp`. Clients initialize, discover via `tools/list`, then invoke `tools/call`; they do not POST the domain examples below directly to `/mcp`. The SDK owns JSON-RPC/protocol envelopes.

| Tool | Description for the model |
| --- | --- |
| `search_products` | Search the bounded Confĩa demo catalog by terms and explicit budget/currency/trust constraints. Returns facts, synthetic labels, and verification states; does not search the web. |
| `get_product` | Retrieve a returned product ID and its published facts and evidence. Preserve unknown/conflicting states and timestamps. |
| `get_trust_score` | Explain the stored assessment using deterministic scoring. A score measures information confidence, not product quality. |
| `verify_product_claim` | Compare supplied price/availability against eligible observations. Read-only; does not certify, publish, or update a product. |

Each definition has a title, inputSchema, outputSchema, and annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`, `openWorldHint: false`. These hints match the bounded read-only fixture behavior; revisit them if tools later fetch external data. Idempotent means no mutation, not an eternally identical score when evidence expires. Annotations do not replace server authorization.

## Shared schemas

Object schemas reject unknown fields. Validate strings, enums, integer money, and pagination at runtime. Use UTC ISO timestamps, integer minor units, currency codes, and locale `en` or `es`. Cap query length at 500 characters, product/revision IDs at 128 characters, and cursor size at 2048 characters. Limit search pages to 1–50 products, default 20. Proposed body limit is 32 KiB, result budget 64 KiB, and deadline 10 seconds. Bound evidence summaries and return `hasMoreEvidence: true` if summaries are truncated; never omit conflict state, score components, or timestamps to fit the budget.

A successful MCP result carries an object in `structuredContent` and matching serialized JSON in a text content block for compatibility. The JSON examples below are the structuredContent payload, not the complete MCP envelope. Validate successful payloads against outputSchema. Each output schema must also allow the error object described below.

Unknown scores are JSON null. Include `catalogRevision`, `evaluatedAt`, and `synthetic` in every successful domain payload (as illustrated below). Product-specific tools accept optional revisionId; absent it, use the active published revision. A requested revision must belong to the product and be published. Never silently substitute a newer revision.

## Error semantics

Tool/domain failures return `isError: true`, safe explanatory text, and structuredContent such as:

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "No published product matches that identifier.",
    "requestId": "req-demo-001",
    "retryable": false
  }
}
```

Codes include `VALIDATION_ERROR`, `PRODUCT_NOT_FOUND`, `REVISION_NOT_FOUND`, `CURSOR_EXPIRED`, `CATALOG_UNAVAILABLE`, and `INTERNAL_ERROR`. Missing evidence, null scores, empty searches, and genuine discrepancies are successful domain results, not tool failures. Return no stack traces.

Malformed JSON-RPC, unsupported protocol methods, and invalid protocol-level parameters use the SDK's protocol errors. HTTP middleware may return 413 for oversized bodies, 429 with Retry-After for rate limits, or 503 for unavailable transport. An HTTP success alone does not prove a successful tool result: inspect `isError`. Future authenticated transport must follow its authorization protocol; do not encode a login failure as an empty catalog.

Proposed demo rate limit: 60 calls/minute/IP plus a bounded global concurrency limit. ChatGPT may share egress addresses, so tune this during rehearsal rather than treating IP identity as a user account.

## search_products

Read-only catalog search. Example tool arguments:

```json
{
  "query": "cordless drill",
  "locale": "en",
  "maxPriceMinor": 20000,
  "currency": "USD",
  "minimumTrustScore": 8,
  "includeUnverified": false,
  "limit": 20
}
```

`query` is required and nonempty. Defaults: locale `en`, minimum score 0, includeUnverified true, limit 20. Currency is required with a budget. Minimum score must be between 0 and 10. A positive minimum excludes null scores regardless of includeUnverified. `cursor` is an optional opaque pagination token; reject invalid tokens or tokens reused with different filters.

```json
{
  "synthetic": true,
  "products": [{
    "id": "drill-001",
    "revisionId": "drill-001-v1",
    "name": "20V Cordless Drill",
    "priceMinor": 14999,
    "currency": "USD",
    "availability": "InStock",
    "trustScore": 9.5,
    "verificationState": "conflicting",
    "synthetic": true
  }],
  "appliedFilters": {
    "maxPriceMinor": 20000,
    "currency": "USD",
    "minimumTrustScore": 8,
    "includeUnverified": false
  },
  "nextCursor": null,
  "warnings": [],
  "catalogRevision": "demo-catalog-v1",
  "evaluatedAt": "2026-09-30T12:00:00.000Z"
}
```

This example intentionally shows a high score alongside a specification conflict; the score must not hide unresolved claims. Sort by relevance then ID. Cursor implementation must preserve a catalog revision and evaluation time, expire before evidence expiry, and reject expired cursors with tool error `CURSOR_EXPIRED`. The client restarts search on expiry. No currency conversion is performed.

## get_product

Arguments: required `productId` string, optional `locale` (`en` or `es`, default `en`), optional `revisionId` to pin a published revision. Return product identity, localized name/description, `priceMinor`, currency, availability, typed specifications, revisionId, synthetic flag, verification summary, public evidence summaries, and evaluatedAt. Return tool error `PRODUCT_NOT_FOUND` for an unknown or unpublished product. Private evidence and merchant account details must not appear.

## get_trust_score

Arguments: required `productId`, optional `revisionId`. Calculate from stored decisions, never caller-provided verification booleans.

```json
{
  "productId": "drill-001",
  "revisionId": "drill-001-v1",
  "assessmentId": "assessment-demo-001",
  "methodologyVersion": "v1",
  "trustScore": 9.5,
  "verificationState": "conflicting",
  "components": {
    "price": { "points": 20, "maximum": 20 },
    "availability": { "points": 20, "maximum": 20 },
    "specifications": { "points": 20, "maximum": 25, "eligible": 4, "required": 5 },
    "freshness": { "points": 20, "maximum": 20, "fresh": 9, "required": 9 },
    "supportingEvidence": { "points": 15, "maximum": 15, "eligible": 2, "required": 2 }
  },
  "reasons": [{ "claimKey": "specifications.batteryIncluded", "status": "conflicting", "evidenceIds": ["ev-battery-1", "ev-battery-2"] }],
  "evidenceIds": ["ev-price", "ev-stock", "ev-voltage", "ev-motor", "ev-speed", "ev-weight", "ev-battery-1", "ev-battery-2", "ev-warranty", "ev-returns"],
  "assessedAt": "2026-09-30T10:00:00.000Z",
  "catalogRevision": "demo-catalog-v1",
  "evaluatedAt": "2026-09-30T12:00:00.000Z",
  "validUntil": "2026-10-01T09:00:00.000Z",
  "synthetic": true
}
```

Example IDs and timestamps are illustrative. Full evidence summaries belong to the product response. For an unassessed revision return a successful tool result with null score, null assessmentId/methodologyVersion/assessedAt/validUntil, state `unverified`, empty components/reasons/evidenceIds, and the actual evaluatedAt. An unknown product returns `PRODUCT_NOT_FOUND`.

## verify_product_claim

Read-only comparison; this tool does not create verification. Arguments: required `productId` and `claims`, optional `revisionId`. Support price/currency and availability initially; reject unsupported claim keys with `VALIDATION_ERROR`.

```json
{
  "productId": "drill-001",
  "claims": { "priceMinor": 19999, "currency": "USD", "availability": "InStock" }
}
```

```json
{
  "productId": "drill-001",
  "revisionId": "drill-001-v1",
  "results": [
    { "field": "priceMinor", "status": "discrepancy", "provided": 19999, "observed": 14999, "currency": "USD", "observedAt": "2026-09-30T09:00:00.000Z", "evidenceIds": ["ev-price"] },
    { "field": "availability", "status": "match", "provided": "InStock", "observed": "InStock", "observedAt": "2026-09-30T09:00:00.000Z", "evidenceIds": ["ev-stock"] }
  ],
  "catalogRevision": "demo-catalog-v1",
  "evaluatedAt": "2026-09-30T12:00:00.000Z",
  "synthetic": true
}
```

Require at least one comparable field; currency accompanies price. Compare exact minor units only for the same currency. Expired, conflicting, missing, or currency-incompatible evidence returns `unknown` with a machine-readable `reason`; do not describe it as a mismatch.


## Evidence presentation

Public product evidence entries include id, claimKey, sourceLabel, sourceKind, sourceUrl (nullable), observedAt, expiresAt, status, and a bounded explanation. Synthetic sources remain labeled synthetic, with no fabricated links. Tool descriptions ask ChatGPT to reference real source URLs when available and otherwise name the evidence and timestamps without inventing citations.

## Health and future admin interfaces

`GET /health` returns `{"status":"ok"}` when the process is live. `GET /ready` returns 200 only when configuration and the published catalog are usable; otherwise 503 with a safe reason code.

There are no public merchant mutation tools or routes in the MVP. A later merchant adapter must authenticate ownership, use idempotent submissions, keep drafts private, and publish only after trusted assessment. It reuses domain services rather than changing these four shopper tool contracts.

## Contract acceptance

Exercise initialization, tools/list, and tools/call through the real transport. Assert exact tool names, descriptions, schemas, annotations, structured/text parity, output validation, null scores, expired evidence, invalid arguments, error envelopes, and payload limits. Inspect every tool with MCP Inspector before the ChatGPT rehearsal. No custom UI resource is required for this design.

Protocol-facing design follows [OpenAI's MCP server guidance](https://developers.openai.com/plugins/build/mcp-server); exact SDK types and transport options must be pinned and tested when the server is implemented.
