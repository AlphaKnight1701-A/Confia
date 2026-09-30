import type { EvaluatedClaim, Product, Score } from "@confia/types";
export const TRUST_POLICY_V1 = Object.freeze({ version: "v1", weights: Object.freeze({ price: 20, availability: 20, specifications: 25, freshness: 20, supportingEvidence: 15 }) });
export function calculateTrustScore(product: Product, claims: EvaluatedClaim[], now: Date): Score {
  const common = { productId: product.id, revisionId: product.revisionId, methodologyVersion: "v1" as const, assessedAt: product.assessedAt };
  if (!product.assessedAt || product.category !== "power-tools") return { ...common, assessedAt: null, assessmentId: null, trustScore: null, verificationState: "unverified", components: {}, reasons: [], evidenceIds: [], validUntil: null };
  const components: Score["components"] = {};
  for (const group of ["price", "availability", "specifications", "supportingEvidence"] as const) {
    const required = claims.filter(c => c.claim.group === group);
    const eligible = required.filter(c => c.eligible).length;
    const maximum = TRUST_POLICY_V1.weights[group];
    components[group] = { points: required.length ? maximum * eligible / required.length : 0, maximum, eligible, required: required.length };
  }
  const fresh = claims.filter(c => c.fresh).length;
  components.freshness = { points: claims.length ? 20 * fresh / claims.length : 0, maximum: 20, eligible: fresh, required: claims.length };
  const total = Object.values(components).reduce((sum, c) => sum + c.points, 0);
  const verificationState = claims.some(c => c.claim.status === "conflicting") ? "conflicting" : claims.some(c => c.reason === "stale") ? "stale" : claims.every(c => c.eligible) ? "verified" : "partial";
  const expiries = claims.filter(c => c.fresh && c.claim.expiresAt && c.claim.observedAt).map(c => Math.min(Date.parse(c.claim.expiresAt!), Date.parse(c.claim.observedAt!) + (c.claim.group === "price" || c.claim.group === "availability" ? 1 : 30) * 86400000));
  return { ...common, assessmentId: `${product.id}-assessment`, trustScore: Math.round(total) / 10, verificationState, components,
    reasons: claims.filter(c => !c.eligible).map(c => ({ claimKey: c.claim.key, status: c.reason, evidenceIds: [c.claim.evidenceId] })),
    evidenceIds: claims.map(c => c.claim.evidenceId), validUntil: expiries.length ? new Date(Math.min(...expiries)).toISOString() : null,
  };
}
