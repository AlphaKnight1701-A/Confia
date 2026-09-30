import rawCatalog from "../../../data/demo-products.json";
import { CatalogSchema, SearchInputSchema, ProductInputSchema, ClaimsInputSchema, type Product, type SearchInput, type ProductInput, type ClaimsInput, type CatalogSummary } from "@confia/types";
import { evaluateClaim, compareClaim } from "@confia/verification";
import { calculateTrustScore } from "@confia/trust-engine";

const catalog = CatalogSchema.parse(rawCatalog);
export class DomainError extends Error { constructor(public readonly code: string, message: string) { super(message); } }
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
function base(now: Date) { return { catalogRevision: catalog.catalogRevision, evaluatedAt: now.toISOString(), synthetic: true as const }; }
function findProduct(id: string, revisionId?: string) {
  const product = catalog.products.find(p => p.id === id);
  if (!product) throw new DomainError("PRODUCT_NOT_FOUND", "No published product matches that identifier.");
  if (revisionId && product.revisionId !== revisionId) throw new DomainError("REVISION_NOT_FOUND", "The requested published revision is unavailable.");
  return product;
}
function score(product: Product, now: Date) {
  if (product.assessedAt && Date.parse(product.assessedAt) > now.getTime()) throw new DomainError("INVALID_EVALUATION_TIME", "Assessment is later than the evaluation clock.");
  const evidence = calculateTrustScore(product, product.claims.map(c => evaluateClaim(c, now)), now);
  if (product.demoScore === undefined) return { ...evidence, scoreBasis: "evidence" as const };
  return { ...evidence, trustScore: product.demoScore, evidenceTrustScore: evidence.trustScore, scoreBasis: "fictional-demo" as const, methodologyVersion: "demo-v1" as const, assessmentId: `${product.id}-demo-score`, components: {} };
}
export function getCatalogSummary(): CatalogSummary { return { catalogRevision: catalog.catalogRevision, synthetic: true, productCount: catalog.products.length, status: "ready" }; }
export function getTrustScore(input: ProductInput, now = new Date()) { const args = ProductInputSchema.parse(input); return { ...base(now), ...score(findProduct(args.productId, args.revisionId), now), links: findProduct(args.productId, args.revisionId).links }; }
export function getProduct(input: ProductInput, now = new Date()) {
  const args = ProductInputSchema.parse(input);
  const product = findProduct(args.productId, args.revisionId);
  return { ...base(now), ...score(product, now), links: product.links, name: product.name[args.locale], description: product.description[args.locale], brand: product.brand, sku: product.sku, category: product.category, locale: args.locale,
    priceMinor: product.priceMinor, currency: product.currency, availability: product.availability,
    evidence: product.claims.map(claim => ({ id: claim.evidenceId, claimKey: claim.key, value: claim.value, status: evaluateClaim(claim, now).reason, sourceLabel: claim.sourceLabel, sourceKind: "synthetic" as const, sourceUrl: claim.sourceUrl ?? null, observedAt: claim.observedAt, expiresAt: claim.expiresAt, explanation: claim.reason[args.locale] })),
  };
}
export function searchProducts(input: SearchInput, now = new Date()) {
  const args = SearchInputSchema.parse(input);
  const { cursor, ...filters } = args;
  const signature = JSON.stringify(filters);
  let offset = 0;
  // Tokens cannot set the evaluation clock: every page uses the server's current time.
  if (cursor) {
    try {
      const token = JSON.parse(decodeURIComponent(cursor));
      if (token.revision !== catalog.catalogRevision || token.filters !== signature || !Number.isInteger(token.offset) || token.offset < 0 || token.offset > catalog.products.length || !Number.isFinite(token.expires) || now.getTime() >= token.expires) throw new Error();
      offset = token.offset;
    } catch { throw new DomainError("CURSOR_EXPIRED", "Cursor is invalid, expired, or belongs to different filters. Restart the search."); }
  }
  const categoryAliases: Record<string, string> = {
    "power-tools": "tools drills saws sanders herramientas taladros sierras lijadoras",
    "video-game": "video games videogames videos games gaming videojuegos juegos",
    "computers": "computers computer laptops laptop notebooks portatiles computadoras",
    "cybersecurity-service": "cybersecurity security software antivirus services ciberseguridad servicios",
    "marketplace-service": "marketplace selling seller ecommerce services mercados ventas servicios",
    "financial-service": "financial finance planning services finanzas planificacion servicios"
  };
  const browseAll = /^(all|all products|products|catalog|everything|todos|todos los productos|productos|catalogo)$/.test(normalize(args.query));
  const terms = normalize(args.query).split(/[^a-z0-9]+/).filter(Boolean);
  const ranked = catalog.products.map(product => {
    const haystack = normalize([product.id, product.brand, product.category, categoryAliases[product.category] ?? "", product.name.en, product.name.es, ...product.keywords].join(" "));
    return { product, result: score(product, now), relevance: browseAll ? 1 : terms.filter(term => haystack.includes(term)).length };
  }).filter(({ product, result, relevance }) => relevance > 0 && (!args.currency || args.currency === product.currency) && (args.maxPriceMinor === undefined || (product.priceMinor !== null && product.priceMinor <= args.maxPriceMinor)) && (result.trustScore === null ? args.includeUnverified && args.minimumTrustScore === 0 : result.trustScore >= args.minimumTrustScore))
    .sort((a, b) => b.relevance - a.relevance || a.product.id.localeCompare(b.product.id));
  const page = ranked.slice(offset, offset + args.limit);
  const expiry = Math.min(now.getTime() + 300000, ...ranked.filter(r => r.result.validUntil).map(r => Date.parse(r.result.validUntil!)));
  return { ...base(now),
    products: page.map(({ product, result }) => ({ category: product.category, scoreBasis: result.scoreBasis, links: product.links, id: product.id, revisionId: product.revisionId, name: product.name[args.locale], priceMinor: product.priceMinor, currency: product.currency, availability: product.availability, trustScore: result.trustScore, verificationState: result.verificationState, synthetic: true as const })),
    appliedFilters: { maxPriceMinor: args.maxPriceMinor ?? null, currency: args.currency ?? null, minimumTrustScore: args.minimumTrustScore, includeUnverified: args.includeUnverified, locale: args.locale },
    nextCursor: offset + args.limit < ranked.length ? encodeURIComponent(JSON.stringify({ revision: catalog.catalogRevision, filters: signature, offset: offset + args.limit, expires: expiry })) : null,
    warnings: ["Synthetic demonstration catalog. Scores labeled fictional-demo are made-up presentation values, not verification, quality, or certification. Evidence verification states remain separate. Prices are not real offers."],
  };
}
export function verifyProductClaim(input: ClaimsInput, now = new Date()) {
  const args = ClaimsInputSchema.parse(input);
  const product = findProduct(args.productId, args.revisionId);
  score(product, now); // Validate assessment clock before comparing.
  const results = [];
  if (args.claims.priceMinor !== undefined) results.push(compareClaim(product, "priceMinor", args.claims.priceMinor, args.claims.currency, now));
  if (args.claims.availability !== undefined) results.push(compareClaim(product, "availability", args.claims.availability, undefined, now));
  return { ...base(now), productId: product.id, revisionId: product.revisionId, links: product.links, results };
}
export function getDashboard(locale: "en" | "es" = "en", now = new Date()) {
  const products = catalog.products.map(p => getProduct({ productId: p.id, locale }, now));
  const assessed = products.filter(p => p.trustScore !== null);
  return { ...base(now), products, averageTrustScore: assessed.length ? Math.round(assessed.reduce((sum, p) => sum + p.trustScore!, 0) / assessed.length * 10) / 10 : null, verifiedCount: products.filter(p => p.verificationState === "verified").length };
}
