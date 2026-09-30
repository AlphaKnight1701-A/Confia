# Demo fixtures

`demo-products.json` is the canonical product-data source for both applications. It currently contains a ready synthetic catalog plus sourced reference records for real power-tool pages. Do not add independent product copies inside either app.

Accuracy is tracked per claim with immutable evidence IDs, source labels, optional `sourceUrl` values, explicit observation dates, expiry dates for verified observations, and statuses (`verified`, `missing`, `unsupported`, or `conflicting`). Manufacturer pages that do not publish price, live availability, or return policy data must keep those claims unverified instead of inventing offer data.

The official-page reference records currently include DEWALT DCD771C2, Makita XFD131, Milwaukee 2801-22CT, and Milwaukee 2730-20. Their product specifications are grounded in public manufacturer pages reviewed on 2026-09-30; price and retailer-specific claims remain unsupported unless a dated source is added.

Web engagement analytics will use a separate, clearly labeled demonstration fixture owned by apps/web; product totals and score aggregates must be calculated from this shared catalog.
