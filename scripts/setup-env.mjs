import { copyFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
for (const app of ["web", "mcp-server"]) {
  const template = new URL(`../apps/${app}/.env.example`, import.meta.url);
  const target = new URL(`../apps/${app}/.env.local`, import.meta.url);
  try {
    await access(target);
    console.log(`Preserved ${fileURLToPath(target)}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await copyFile(template, target, constants.COPYFILE_EXCL);
    console.log(`Created ${fileURLToPath(target)}`);
  }
}
