// Copies the website's content files into the app so prices, services and photos have one source of truth.
// Edit them in ../Yuwa/content, then run: npm run sync
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = process.env.YUWA_WEB ?? join(root, "..", "Yuwa");
const to = join(root, "src", "content");
mkdirSync(to, { recursive: true });

for (const name of ["services", "images", "work", "story", "site", "booking", "policy", "legal"]) {
  const target = join(to, `${name}.ts`);
  copyFileSync(join(from, "content", `${name}.ts`), target);
  writeFileSync(target, `// SYNCED from the website (content/${name}.ts). Do not edit here: run \`npm run sync\`.\n${readFileSync(target, "utf8")}`);
  console.log(`synced ${name}.ts`);
}
