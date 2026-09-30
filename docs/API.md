# Proposed API contracts

Status: design only; no endpoints are implemented. All timestamps are UTC ISO 8601, money uses integer minor units, and locale is `en` or `es`. Unknown scores are JSON null. Responses identify synthetic data explicitly.

## Shared conventions

Use JSON request/response bodies and `/api/v1` versioning. Reject unknown mutation fields. Limit bodies to 32 KiB, search queries to 500 characters, and page size to 1–50 (default 20). Proposed public read limits are 60 requests/minute/IP; authenticated writes are 10/minute/user. These are initial implementation targets, not deployed guarantees.

Errors use an HTTP status and this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "maxPriceMinor must be a nonnegative integer",
    "requestId": "req-demo-001",
    "fields": [{ "path": "maxPriceMinor", "code": "invalid_integer" }]
  }
}
```

Statuses: 400 invalid input; 401 missing authentication; 403 forbidden operation; 404 absent or inaccessible product; 409 idempotency conflict; 413 oversized body; 429 rate limit with `Retry-After`; 503 required storage unavailable. Never expose stack traces or credentials. Optional AI failure returns a successful deterministic result with a warning.

## GET /health

Return 200 with `{"status":"ok"}` when the process is live. This is liveness, not a promise that database or AI connections work. Add a separate internal readiness check when persistence is implemented.

## POST /api/v1/search

Public read operation. Example request:

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
  "interpretation": "deterministic",
  "warnings": [],
  "evaluatedAt": "2026-09-30T12:00:00.000Z"
}
```

This example intentionally shows a high score alongside a specification conflict; the score must not hide unresolved claims. Sort by relevance then ID. Cursor implementation must preserve a catalog revision and evaluation time, expire before evidence expiry, and reject expired cursors with 400 `CURSOR_EXPIRED`. The client restarts search on expiry. No currency conversion is performed.

## GET /api/v1/products/{id}

Public read of the active published revision. Optional `locale` query parameter defaults to `en`. Return product identity, localized name/description, `priceMinor`, currency, availability, typed specifications, revisionId, synthetic flag, verification summary, public evidence summaries, and evaluatedAt. Return 404 for an unknown or unpublished product. Private evidence and merchant account details must not appear.

## GET /api/v1/products/{id}/trust-score

Public read; calculate from stored decisions, never caller-provided verification booleans.

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
  "evaluatedAt": "2026-09-30T12:00:00.000Z",
  "validUntil": "2026-10-01T09:00:00.000Z",
  "synthetic": true
}
```

Example IDs and timestamps are illustrative. Full evidence summaries belong to the product response. For an unassessed revision return 200 with null score, null assessmentId/methodologyVersion/assessedAt/validUntil, state `unverified`, empty components/reasons/evidenceIds, and the actual evaluatedAt. An unknown product remains 404.

## POST /api/v1/verify

Public comparison operation; this endpoint does not create verification. Support price/currency and availability initially; reject unsupported claim keys with 400.

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
  "evaluatedAt": "2026-09-30T12:00:00.000Z",
  "synthetic": true
}
```

Require at least one comparable field; currency accompanies price. Compare exact minor units only for the same currency. Expired, conflicting, missing, or currency-incompatible evidence returns `unknown` with a machine-readable `reason`; do not describe it as a mismatch.

## POST /api/v1/merchant/products

Authenticated merchant member required in durable mode. Accept `Idempotency-Key` (1–128 characters); scope it to the merchant, retain it for 24 hours, and return the same submission for identical retries. Reusing it with a different body returns 409. Derive merchantId from the session, never from the body.

```json
{
  "sku": "DRILL-001",
  "name": { "en": "20V Cordless Drill", "es": "Taladro inalámbrico de 20 V" },
  "description": { "en": "Demo tool", "es": "Herramienta de demostración" },
  "category": "power-tools",
  "priceMinor": 14999,
  "currency": "USD",
  "availability": "InStock",
  "specifications": [{ "key": "voltage", "value": 20, "unit": "V" }],
  "evidence": [{ "claimKey": "price", "sourceUrl": "https://example.com/drill", "observedAt": "2026-09-30T09:00:00.000Z" }]
}
```

Return 202 with productId, revisionId, `assessmentStatus: "pending"`, `trustScore: null`, and `persistence: "durable"` or `"ephemeral"`. New submissions create a pending revision; they do not overwrite the active published revision until assessed. Reject caller-supplied scores, verified flags, or assessor identity. Evidence URLs are metadata only and are not fetched by this endpoint.

Local demo mode may use a fixed demo identity only with writes explicitly enabled and must label data synthetic and ephemeral. Public demo hosting leaves writes disabled (403 `DEMO_WRITES_DISABLED`). Demo mode must never be used to authorize durable storage.

## Optional MCP tools

| Tool | Input | Output |
| --- | --- | --- |
| `search_products` | Search request schema | Search response schema |
| `get_product` | productId, optional locale | Public product DTO |
| `get_trust_score` | productId | Score breakdown DTO |

Reuse service validation, limits, ownership boundaries, and error codes. Expose no merchant-write or assessor tools in the first integration. Select the MCP SDK, transport, and supported authentication mechanism during implementation and test them against the intended client. No working assistant integration is implied by this contract.
