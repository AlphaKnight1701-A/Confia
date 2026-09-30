import { notFound } from "next/navigation";
const sections: Record<string, { title: string; description: string }> = {
  products: { title: "Products", description: "The shared catalog is empty. The next milestone adds 8–12 synthetic products with canonical bilingual facts." },
  verification: { title: "Verification results", description: "Evidence, freshness, and deterministic score breakdowns will come from the shared verification and trust-engine packages." },
  discrepancies: { title: "Potential discrepancies", description: "Claim comparison will distinguish mismatches from unknown or stale evidence. No comparisons are implemented yet." },
  analytics: { title: "Demonstration analytics", description: "Synthetic impressions, click-through rates, and language trends will be labeled explicitly. MCP calls do not establish real impressions or conversions." },
};
export function generateStaticParams() { return Object.keys(sections).map(section => ({ section })); }
export default async function Section({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const content = Object.hasOwn(sections, section) ? sections[section] : undefined;
  if (!content) notFound();
  return <><p className="eyebrow">IMPLEMENTATION WORKSPACE</p><h1>{content.title}</h1><p className="lead">{content.description}</p></>;
}
