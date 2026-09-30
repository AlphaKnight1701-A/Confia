import type { VerificationState } from "@confia/types";

// Shared vocabulary. Evidence assessment and claim comparison are not implemented yet.
export const VERIFICATION_STATES: readonly VerificationState[] = Object.freeze([
  "verified", "partial", "conflicting", "stale", "unverified",
]);
