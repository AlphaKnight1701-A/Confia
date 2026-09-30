import { readFile, readdir } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
const allowed = {
  "@confia/types": [],
  "@confia/trust-engine": ["@confia/types"],
  "@confia/verification": ["@confia/types"],
  "@confia/product-data": ["@confia/types", "@confia/trust-engine", "@confia/verification"],
  "@confia/ui": ["@confia/types"],
  "@confia/web": ["@confia/types", "@confia/product-data", "@confia/ui"],
  "@confia/mcp-server": ["@confia/types", "@confia/product-data"],
};
async function* sourceFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) yield* sourceFiles(path);
    else if (/\.[cm]?[jt]sx?$/.test(entry.name)) yield path;
  }
}
for (const group of ["apps", "packages"]) {
  for (const entry of await readdir(resolve(root, group), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = resolve(root, group, entry.name);
    const manifest = JSON.parse(await readFile(resolve(dir, "package.json"), "utf8"));
    const edges = allowed[manifest.name];
    if (!edges) throw new Error(`Unregistered workspace ${manifest.name}`);
    const dependencies = { ...manifest.dependencies, ...manifest.peerDependencies, ...manifest.devDependencies };
    for (const dependency of Object.keys(dependencies)) {
      if (dependency.startsWith("@confia/") && !edges.includes(dependency)) throw new Error(`Forbidden dependency: ${manifest.name} -> ${dependency}`);
      if (["@confia/types", "@confia/trust-engine", "@confia/verification", "@confia/product-data", "@confia/mcp-server"].includes(manifest.name) && /^(react|react-dom|next)$/.test(dependency)) throw new Error(`Server/domain workspace depends on UI: ${manifest.name}`);
    }
    for await (const file of sourceFiles(resolve(dir, "src"))) {
      const text = await readFile(file, "utf8");
      for (const match of text.matchAll(/(?:from\s*|import\s*\(\s*|import\s*)["']([^"']+)["']/g)) {
        const specifier = match[1];
        if (specifier.startsWith("@confia/") && (!edges.includes(specifier) || !dependencies[specifier])) throw new Error(`Undeclared or forbidden import in ${relative(root, file)}: ${specifier}`);
        if (specifier.startsWith(".")) {
          const target = resolve(file, "..", specifier);
          const within = relative(dir, target);
          if (within.startsWith("..") && !(manifest.name === "@confia/product-data" && target.startsWith(resolve(root, "data") + "/")) && !(manifest.name === "@confia/product-data" && target.startsWith(resolve(root, "data") + "\\"))) throw new Error(`Cross-workspace relative import: ${relative(root, file)}`);
        }
      }
    }
  }
}
console.log("Workspace dependency boundaries passed.");
