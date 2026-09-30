import { z } from "zod";
export const LocaleSchema = z.enum(["en", "es"]);
export type Locale = z.infer<typeof LocaleSchema>;
export const VerificationStateSchema = z.enum(["verified", "partial", "conflicting", "stale", "unverified"]);
export type VerificationState = z.infer<typeof VerificationStateSchema>;
export const AvailabilitySchema = z.enum(["InStock", "OutOfStock", "Unknown"]);
const id = z.string().min(1).max(128);
const timestamp = z.iso.datetime();
const localized = z.object({ en: z.string().min(1), es: z.string().min(1) }).strict();
export const ClaimSchema = z.object({
  key: id,
  group: z.enum(["price", "availability", "specifications", "supportingEvidence"]),
  value: z.union([z.string().max(500), z.number().finite(), z.boolean()]),
  status: z.enum(["verified", "conflicting", "missing", "unsupported"]),
  observedAt: timestamp.nullable(),
  expiresAt: timestamp.nullable(),
  evidenceId: id,
  sourceLabel: z.string().min(1),
  reason: localized,
}).strict().refine(c => (c.observedAt === null) === (c.expiresAt === null), "Observation and expiry must both exist or both be null")
  .refine(c => !c.observedAt || !c.expiresAt || Date.parse(c.expiresAt) > Date.parse(c.observedAt), "Expiry must follow observation")
  .refine(c => c.status !== "verified" || c.observedAt !== null, "Verified claims require observations");
export type Claim = z.infer<typeof ClaimSchema>;
export const ProductLinksSchema = z.object({
  productUrl: z.url({ protocol: /^https$/ }).nullable().default(null),
  verificationUrl: z.url({ protocol: /^https$/ }).nullable().default(null),
}).strict();
export const ProductSchema = z.object({
  id, revisionId: id, sku: id, brand: z.string(), category: z.literal("power-tools"),
  links: ProductLinksSchema.default({ productUrl: null, verificationUrl: null }),
  name: localized, description: localized, keywords: z.array(z.string()).min(1),
  priceMinor: z.number().int().nonnegative().safe(), currency: z.literal("USD"),
  availability: AvailabilitySchema, synthetic: z.literal(true),
  assessedAt: timestamp.nullable(), claims: z.array(ClaimSchema).length(9),
}).strict();
export type Product = z.infer<typeof ProductSchema>;
export const REQUIRED_CLAIMS = {
  price: "price", availability: "availability", voltage: "specifications", motor: "specifications",
  speed: "specifications", weight: "specifications", batteryIncluded: "specifications",
  warranty: "supportingEvidence", returns: "supportingEvidence",
} as const;
export const CatalogSchema = z.object({
  catalogRevision: id, synthetic: z.literal(true), status: z.literal("ready"),
  generatedAt: timestamp, products: z.array(ProductSchema).min(1).max(50),
}).strict().superRefine((catalog, ctx) => {
  const ids = new Set<string>();
  for (const [index, product] of catalog.products.entries()) {
    if (ids.has(product.id)) ctx.addIssue({ code: "custom", message: "Duplicate product ID", path: ["products", index] });
    ids.add(product.id);
    const keys = product.claims.map(c => c.key);
    if (new Set(keys).size !== 9 || Object.keys(REQUIRED_CLAIMS).some(key => !keys.includes(key))) ctx.addIssue({ code: "custom", message: "Required claim manifest does not match policy v1", path: ["products", index] });
    for (const claim of product.claims) {
      if (REQUIRED_CLAIMS[claim.key as keyof typeof REQUIRED_CLAIMS] !== claim.group) ctx.addIssue({ code: "custom", message: "Claim group does not match policy", path: ["products", index] });
      if (claim.key === "price" && claim.value !== product.priceMinor) ctx.addIssue({ code: "custom", message: "Price observation differs from catalog", path: ["products", index] });
      if (claim.key === "availability" && claim.value !== product.availability) ctx.addIssue({ code: "custom", message: "Availability differs from catalog", path: ["products", index] });
    }
  }
});
export type CatalogSummary = { catalogRevision: string; synthetic: true; productCount: number; status: "ready" };
export const SearchInputSchema = z.object({
  query: z.string().trim().min(1).max(500).describe("Product keywords, e.g. cordless drill or taladro inalámbrico. Use explicit price/currency fields for a budget."),
  locale: LocaleSchema.default("en"),
  maxPriceMinor: z.number().int().nonnegative().safe().optional().describe("Maximum price in minor units: 200 USD = 20000."),
  currency: z.string().regex(/^[A-Z]{3}$/).optional(),
  minimumTrustScore: z.number().min(0).max(10).default(0),
  includeUnverified: z.boolean().default(true),
  limit: z.number().int().min(1).max(50).default(20),
  cursor: z.string().max(2048).optional(),
}).strict().refine(v => v.maxPriceMinor === undefined || v.currency !== undefined, "A budget requires currency");
export const ProductInputSchema = z.object({ productId: id, revisionId: id.optional(), locale: LocaleSchema.default("en") }).strict();
export const ClaimsInputSchema = z.object({
  productId: id, revisionId: id.optional(),
  claims: z.object({ priceMinor: z.number().int().nonnegative().safe().optional(), currency: z.string().regex(/^[A-Z]{3}$/).optional(), availability: AvailabilitySchema.optional() }).strict()
    .refine(v => v.priceMinor !== undefined || v.availability !== undefined, "Provide price or availability")
    .refine(v => (v.priceMinor !== undefined) === (v.currency !== undefined), "Price and currency must be provided together"),
}).strict();
export type SearchInput = z.input<typeof SearchInputSchema>;
export type ProductInput = z.input<typeof ProductInputSchema>;
export type ClaimsInput = z.input<typeof ClaimsInputSchema>;
export interface EvaluatedClaim { claim: Claim; fresh: boolean; eligible: boolean; reason: "verified" | "conflicting" | "missing" | "unsupported" | "stale" | "future" }
export const MCP_TOOL_NAMES = ["search_products", "get_product", "get_trust_score", "verify_product_claim"] as const;
export const ErrorSchema = z.object({ error: z.object({ code: z.string(), message: z.string(), requestId: z.string(), retryable: z.boolean() }).strict() }).strict();
export const ResponseBaseSchema = z.object({ catalogRevision: z.string(), evaluatedAt: timestamp, synthetic: z.literal(true) });
const component = z.object({ points: z.number().min(0), maximum: z.number().positive(), eligible: z.number().int().nonnegative(), required: z.number().int().nonnegative() }).strict();
export const ScoreSchema = z.object({
  productId: id, revisionId: id, assessmentId: id.nullable(), methodologyVersion: z.literal("v1"),
  trustScore: z.number().min(0).max(10).nullable(), verificationState: VerificationStateSchema,
  components: z.record(z.string(), component),
  reasons: z.array(z.object({ claimKey: z.string(), status: z.string(), evidenceIds: z.array(z.string()) }).strict()),
  evidenceIds: z.array(z.string()), assessedAt: timestamp.nullable(), validUntil: timestamp.nullable(),
}).strict();
export const ScoreOutputSchema = ResponseBaseSchema.extend(ScoreSchema.shape).extend({ links: ProductLinksSchema }).strict();
export const ProductOutputSchema = ScoreOutputSchema.extend({
  name: z.string(), description: z.string(), brand: z.string(), sku: z.string(), category: z.string(), locale: LocaleSchema,
  priceMinor: z.number().int(), currency: z.string(), availability: AvailabilitySchema,
  evidence: z.array(z.object({ id: z.string(), claimKey: z.string(), value: z.union([z.string(), z.number(), z.boolean()]), status: z.string(), sourceLabel: z.string(), sourceKind: z.literal("synthetic"), sourceUrl: z.null(), observedAt: timestamp.nullable(), expiresAt: timestamp.nullable(), explanation: z.string() }).strict()),
}).strict();
export const SearchOutputSchema = ResponseBaseSchema.extend({
  products: z.array(z.object({ links: ProductLinksSchema, id, revisionId: id, name: z.string(), priceMinor: z.number().int(), currency: z.string(), availability: AvailabilitySchema, trustScore: z.number().nullable(), verificationState: VerificationStateSchema, synthetic: z.literal(true) }).strict()),
  appliedFilters: z.object({ maxPriceMinor: z.number().nullable(), currency: z.string().nullable(), minimumTrustScore: z.number(), includeUnverified: z.boolean(), locale: LocaleSchema }).strict(),
  nextCursor: z.string().nullable(), warnings: z.array(z.string()),
}).strict();
export const ComparisonOutputSchema = ResponseBaseSchema.extend({
  links: ProductLinksSchema,
  productId: id, revisionId: id,
  results: z.array(z.object({ field: z.string(), status: z.enum(["match", "discrepancy", "unknown"]), provided: z.union([z.number(), z.string()]), observed: z.union([z.number(), z.string()]).nullable(), currency: z.string().optional(), reason: z.string(), observedAt: timestamp.nullable(), evidenceIds: z.array(z.string()) }).strict()),
}).strict();
export type Score = z.infer<typeof ScoreSchema>;
