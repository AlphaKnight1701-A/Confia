import test from "node:test";
import assert from "node:assert/strict";
import catalog from "../data/demo-products.json";
import { getProduct, getTrustScore, searchProducts, verifyProductClaim } from "@confia/product-data";
import { CatalogSchema } from "@confia/types";
const now = new Date(catalog.generatedAt);

test("v1 scores reflect evidence and keep null distinct from zero", () => {
  assert.equal(getTrustScore({ productId: "drill-001" }, now).trustScore, 10);
  assert.equal(getTrustScore({ productId: "drill-conflict" }, now).trustScore, 9.5);
  assert.equal(getTrustScore({ productId: "drill-conflict" }, now).verificationState, "conflicting");
  assert.equal(getTrustScore({ productId: "drill-unassessed" }, now).trustScore, null);
  assert.equal(getTrustScore({ productId: "drill-stale" }, now).trustScore, 0);
  assert.equal(getTrustScore({ productId: "drill-stale" }, now).verificationState, "stale");
});
test("price and stock expire exactly at their evidence boundary", () => {
  const expiry = new Date(catalog.products[0].claims[0].expiresAt!);
  assert.equal(getTrustScore({ productId: "drill-001" }, new Date(+expiry - 1)).trustScore, 10);
  const result = getTrustScore({ productId: "drill-001" }, expiry);
  assert.equal(result.verificationState, "stale");
  assert.equal(result.components.price.points, 0);
  assert.equal(result.components.availability.points, 0);
});
test("comparison distinguishes differences from unavailable or incompatible evidence", () => {
  const input = { productId: "drill-001", claims: { priceMinor: 19999, currency: "USD" } };
  assert.equal(verifyProductClaim(input, now).results[0].status, "discrepancy");
  assert.equal(verifyProductClaim({ ...input, claims: { priceMinor: 14999, currency: "USD" } }, now).results[0].status, "match");
  assert.equal(verifyProductClaim({ ...input, claims: { priceMinor: 14999, currency: "EUR" } }, now).results[0].status, "unknown");
  assert.equal(verifyProductClaim({ ...input, productId: "drill-stale" }, now).results[0].status, "unknown");
  assert.equal(verifyProductClaim({ ...input, productId: "drill-unassessed" }, now).results[0].status, "unknown");
});
test("English and Spanish share facts and enforce budget and score constraints", () => {
  const en = searchProducts({ query: "drill", maxPriceMinor: 15000, currency: "USD", minimumTrustScore: 8 }, now);
  const es = searchProducts({ query: "taladro", locale: "es", maxPriceMinor: 15000, currency: "USD", minimumTrustScore: 8 }, now);
  assert.deepEqual(en.products.map(p => p.id), es.products.map(p => p.id));
  assert.ok(en.products.every(p => p.priceMinor <= 15000 && p.trustScore !== null && p.trustScore >= 8));
  const a = getProduct({ productId: "drill-001", locale: "en" }, now);
  const b = getProduct({ productId: "drill-001", locale: "es" }, now);
  assert.equal(a.priceMinor, b.priceMinor); assert.equal(a.trustScore, b.trustScore); assert.notEqual(a.name, b.name);
  assert.deepEqual(searchProducts({ query: "refrigerator" }, now).products, []);
});
test("pagination rejects different filters and never freezes score time", () => {
  const first = searchProducts({ query: "drill", limit: 2 }, now);
  assert.ok(first.nextCursor);
  const second = searchProducts({ query: "drill", limit: 2, cursor: first.nextCursor }, now);
  assert.ok(second.products.every(p => !first.products.some(q => q.id === p.id)));
  assert.throws(() => searchProducts({ query: "saw", limit: 2, cursor: first.nextCursor! }, now));
  assert.throws(() => searchProducts({ query: "drill", limit: 2, cursor: first.nextCursor! }, new Date(+now + 300001)));
});
test("schemas reject invalid money, missing currency, deleted manifest claims and wrong revisions", () => {
  assert.throws(() => searchProducts({ query: "drill", maxPriceMinor: -1, currency: "USD" }, now));
  assert.throws(() => searchProducts({ query: "drill", maxPriceMinor: 100 }, now));
  assert.throws(() => getProduct({ productId: "drill-001", revisionId: "not-this-revision" }, now));
  const altered = structuredClone(catalog); altered.products[0].claims.pop();
  assert.equal(CatalogSchema.safeParse(altered).success, false);
});
