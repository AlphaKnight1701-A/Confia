import type { Claim, EvaluatedClaim, Product } from "@confia/types";
export const VERIFICATION_STATES = ["verified", "partial", "conflicting", "stale", "unverified"] as const;
export function evaluateClaim(claim: Claim, now: Date): EvaluatedClaim {
  const time = now.getTime();
  if (!Number.isFinite(time)) throw new Error("Invalid evaluation time");
  const observed = claim.observedAt ? Date.parse(claim.observedAt) : NaN;
  const expiry = claim.expiresAt ? Date.parse(claim.expiresAt) : NaN;
  const maxAge = (claim.group === "price" || claim.group === "availability" ? 1 : 30) * 86400000;
  const fresh = observed <= time && time < Math.min(expiry, observed + maxAge);
  const reason = claim.status === "conflicting" ? "conflicting"
    : claim.status === "missing" || !Number.isFinite(observed) ? "missing"
    : observed > time ? "future" : !fresh ? "stale" : claim.status;
  return { claim, fresh, eligible: claim.status === "verified" && fresh, reason };
}
export function compareClaim(product: Product, field: "priceMinor" | "availability", provided: number | string, currency: string | undefined, now: Date) {
  const claim = product.claims.find(c => c.key === (field === "priceMinor" ? "price" : field));
  if (!claim) throw new Error("Required claim missing from validated catalog");
  const evaluated = evaluateClaim(claim, now);
  const reason = !product.assessedAt ? "unassessed" : currency && currency !== product.currency ? "currency_mismatch" : evaluated.reason;
  const known = product.assessedAt !== null && reason === "verified";
  const observed = field === "priceMinor" ? product.priceMinor : product.availability;
  return {
    field, status: known ? (provided === observed ? "match" : "discrepancy") : "unknown",
    provided, observed: known ? observed : null,
    ...(field === "priceMinor" ? { currency } : {}),
    reason: known ? (provided === observed ? "matches_observation" : "potential_information_discrepancy") : reason,
    observedAt: claim.observedAt, evidenceIds: [claim.evidenceId],
  };
}
