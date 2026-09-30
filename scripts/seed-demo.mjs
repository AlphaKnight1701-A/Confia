import { readFile, writeFile } from "node:fs/promises";
// Explicit fixture generation only. Runtime never refreshes evidence automatically.
const now = new Date();
const iso = (ms) => new Date(ms).toISOString();
const items = [
  ["drill-001", "20V Cordless Drill", "Taladro inalámbrico de 20 V", 14999, "full"],
  ["drill-002", "Compact Home Drill", "Taladro compacto para el hogar", 9499, "full"],
  ["drill-003", "Brushless Workshop Drill", "Taladro sin escobillas", 18499, "mostly"],
  ["drill-004", "Compact Impact Drill", "Taladro de impacto compacto", 12499, "mostly"],
  ["drill-005", "Starter Cordless Drill", "Taladro inalámbrico básico", 7499, "partial"],
  ["saw-001", "Compact Circular Saw", "Sierra circular compacta", 14499, "partial"],
  ["drill-stale", "Older Catalog Drill", "Taladro con datos antiguos", 11499, "stale"],
  ["drill-unassessed", "Unassessed Budget Drill", "Taladro económico sin evaluar", 6499, "unassessed"],
  ["drill-conflict", "Conflicting Battery Drill", "Taladro con batería en conflicto", 16499, "conflicting"],
  ["sander-001", "Professional Orbital Sander", "Lijadora orbital profesional", 23999, "full"],
];
const products = items.map(([id, en, es, priceMinor, scenario]) => {
  const values = { price: priceMinor, availability: "InStock", voltage: "20 V", motor: "brushless", speed: "0–1500 rpm", weight: "1.4 kg", batteryIncluded: true, warranty: "1 year (synthetic)", returns: "30 days (synthetic)" };
  const groups = { price: "price", availability: "availability", voltage: "specifications", motor: "specifications", speed: "specifications", weight: "specifications", batteryIncluded: "specifications", warranty: "supportingEvidence", returns: "supportingEvidence" };
  const claims = Object.entries(values).map(([key, value]) => {
    const missing = scenario === "unassessed" || (scenario === "mostly" && key === "weight") || (scenario === "partial" && ["speed", "weight", "warranty", "returns"].includes(key));
    const conflicting = scenario === "conflicting" && key === "batteryIncluded";
    const observed = now.getTime() - (scenario === "stale" ? 40 * 86400000 : 60000);
    return { key, group: groups[key], value, status: missing ? "missing" : conflicting ? "conflicting" : "verified",
      observedAt: missing ? null : iso(observed), expiresAt: missing ? null : iso(observed + (["price", "availability"].includes(key) ? 1 : 30) * 86400000),
      evidenceId: `${id}-${key}`, sourceLabel: "Confĩa synthetic demonstration fixture",
      reason: { en: missing ? "No supporting observation in this synthetic example." : conflicting ? "Synthetic sources disagree about whether a battery is included." : "Synthetic observation for demonstration; not an independent certification.", es: missing ? "Este ejemplo sintético no incluye evidencia de respaldo." : conflicting ? "Las fuentes sintéticas no coinciden sobre la batería incluida." : "Observación sintética de demostración; no es una certificación independiente." },
    };
  });
  return { id, revisionId: `${id}-v1`, sku: id.toUpperCase(), brand: "Demo Brand", category: "power-tools", name: { en, es },
    description: { en: "Synthetic power-tool product for the Confĩa hackathon demo. Not a real retailer offer.", es: "Herramienta sintética para la demostración de Confĩa. No es una oferta real." },
    keywords: id.startsWith("drill") ? ["drill", "cordless", "home", "taladro", "inalambrico", "casa"] : id.startsWith("saw") ? ["saw", "circular", "sierra"] : ["sander", "orbital", "lijadora"],
    priceMinor, currency: "USD", availability: "InStock", synthetic: true, assessedAt: scenario === "unassessed" ? null : now.toISOString(), claims };
});
// Preserve additional catalog records and their evidence when refreshing base fixtures.
const existing = JSON.parse(await readFile(new URL("../data/demo-products.json", import.meta.url), "utf8"));
for (const product of products) {
  product.demoScore = existing.products.find(p => p.id === product.id)?.demoScore ?? 8.5;
}
const generatedIds = new Set(products.map(p => p.id));
products.push(...existing.products.filter(p => !generatedIds.has(p.id)));
const catalog = { catalogRevision: `demo-${now.toISOString().replace(/[:.]/g, "-")}`, synthetic: true, status: "ready", generatedAt: now.toISOString(), products };
await writeFile(new URL("../data/demo-products.json", import.meta.url), JSON.stringify(catalog, null, 2) + "\n");
console.log(`Generated ${products.length} explicitly synthetic products at ${now.toISOString()}. Restart/rebuild both apps to load the new revision.`);
