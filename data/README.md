# Demo fixtures

`demo-products.json` is the canonical product-data source for both applications. It currently contains **zero products** and status `scaffold`; do not mistake it for the requested 8–12-product demo.

Next milestone: define shared runtime schemas, add reviewed synthetic products/evidence covering the README scenarios, implement validation and scoring, then replace the strict scaffold guard in packages/product-data. Keep immutable IDs, catalog revisions, explicit observation/expiry dates, and synthetic labels. Do not add independent copies inside either app.

Web engagement analytics will use a separate, clearly labeled demonstration fixture owned by apps/web; product totals and score aggregates must be calculated from this shared catalog.
