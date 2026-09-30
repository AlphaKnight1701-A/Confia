// Policy metadata only. Assessment calculation is a separate implementation milestone.
export const TRUST_POLICY_V1 = Object.freeze({
  version: "v1",
  weights: Object.freeze({ price: 20, availability: 20, specifications: 25, freshness: 20, supportingEvidence: 15 }),
});
