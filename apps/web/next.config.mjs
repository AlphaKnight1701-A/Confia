import { fileURLToPath } from "node:url";

export default {
  transpilePackages: ["@confia/types", "@confia/product-data", "@confia/trust-engine", "@confia/verification", "@confia/ui"],
  outputFileTracingRoot: fileURLToPath(new URL("../..", import.meta.url)),
  turbopack: { root: fileURLToPath(new URL("../..", import.meta.url)) },
};
