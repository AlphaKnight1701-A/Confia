import test from "node:test";
import assert from "node:assert/strict";
import catalog from "../data/demo-products.json";
import { getProduct, getTrustScore, searchProducts, verifyProductClaim } from "@confia/product-data";
import { calculateTrustScore } from "@confia/trust-engine";
import { evaluateClaim } from "@confia/verification";
import { CatalogSchema } from "@confia/types";
function evidenceScore(input: { productId: string }, at: Date) {
  const product = CatalogSchema.parse(catalog).products.find(p => p.id === input.productId)!;
  return calculateTrustScore(product, product.claims.map(c => evaluateClaim(c, at)), at);
}
const now = new Date(catalog.generatedAt);

test("v1 scores reflect evidence and keep null distinct from zero", () => {
  assert.equal(evidenceScore({ productId: "drill-001" }, now).trustScore, 10);
  assert.equal(evidenceScore({ productId: "drill-conflict" }, now).trustScore, 9.5);
  assert.equal(evidenceScore({ productId: "drill-conflict" }, now).verificationState, "conflicting");
  assert.equal(evidenceScore({ productId: "drill-unassessed" }, now).trustScore, null);
  assert.equal(evidenceScore({ productId: "drill-stale" }, now).trustScore, 0);
  assert.equal(evidenceScore({ productId: "drill-stale" }, now).verificationState, "stale");
});
test("price and stock expire exactly at their evidence boundary", () => {
  const expiry = new Date(catalog.products[0].claims[0].expiresAt!);
  assert.equal(evidenceScore({ productId: "drill-001" }, new Date(+expiry - 1)).trustScore, 10);
  const result = evidenceScore({ productId: "drill-001" }, expiry);
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
  assert.ok(en.products.every(p => p.priceMinor !== null && p.priceMinor <= 15000 && p.trustScore !== null && p.trustScore >= 8));
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

test("fictional prices support budgets without becoming verified claims", () => {
  const product = getProduct({ productId: "dewalt-dcd771c2" }, now);
  assert.equal(product.priceMinor, 12999);
  assert.equal(product.evidence.find(e => e.claimKey === "price")?.value, 12999);
  assert.equal(product.evidence.find(e => e.claimKey === "price")?.sourceUrl, null);
  assert.ok(searchProducts({ query: "dewalt" }, now).products.some(p => p.id === product.productId));
  assert.ok(searchProducts({ query: "dewalt", maxPriceMinor: 20000, currency: "USD" }, now).products.some(p => p.id === product.productId));
  assert.equal(verifyProductClaim({ productId: product.productId, claims: { priceMinor: 12999, currency: "USD" } }, now).results[0].status, "unknown");
  const altered = structuredClone(catalog);
  const claim = altered.products.find(p => p.id === product.productId)!.claims.find(c => c.key === "price")!;
  claim.value = null;
  altered.products.find(p => p.id === product.productId)!.priceMinor = null;
  claim.status = "verified";
  claim.observedAt = catalog.generatedAt;
  claim.expiresAt = new Date(+now + 86400000).toISOString();
  assert.equal(CatalogSchema.safeParse(altered).success, false);
});

test("additional categories load without borrowing the power-tool scoring policy", () => {
  assert.equal(getProduct({ productId: "dell-xps-13" }, now).evidenceTrustScore, null);
  assert.equal(getProduct({ productId: "ea-sports-fc-26" }, now).priceMinor, 5999);
  assert.equal(verifyProductClaim({ productId: "crowdstrike-falcon-prevent", claims: { availability: "InStock" } }, now).results[0].status, "unknown");
});

test("every demo category is searchable and every product has a fictional score", () => {
  const all = searchProducts({ query: "all products", limit: 50 }, now).products;
  assert.equal(all.length, catalog.products.length);
  for (const product of all) {
    assert.equal(product.scoreBasis, "fictional-demo");
    assert.ok(product.trustScore !== null && product.trustScore >= 0 && product.trustScore <= 10);
    assert.equal(getTrustScore({ productId: product.id }, now).trustScore, product.trustScore);
    assert.ok(searchProducts({ query: product.category, limit: 50 }, now).products.some(p => p.id === product.id));
  }
  for (const query of ["video games", "videos=games", "videogames", "video-game", "videojuegos"]) {
    const games = searchProducts({ query, maxPriceMinor: 10000, currency: "USD", minimumTrustScore: 8 }, now).products;
    assert.equal(games.length, 3, query);
    assert.ok(games.every(p => p.category === "video-game"));
  }
});
