import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const navPath = path.join(root, 'lib', 'navigation.ts');
const content = fs.readFileSync(navPath, 'utf8');
const hrefs = new Set();

for (const m of content.matchAll(/href:\s*['"]([^#'"]+)['"]/g)) {
  const href = m[1].split('?')[0].replace(/\/$/, '');
  if (href) hrefs.add(href);
}

const appDir = path.join(root, 'app');

function pageExists(route) {
  const p = path.join(appDir, route.replace(/^\//, ''), 'page.tsx');
  return fs.existsSync(p);
}

const missing = [...hrefs].filter((h) => !pageExists(h)).sort();
const existing = [...hrefs].filter((h) => pageExists(h)).sort();

console.log(JSON.stringify({ total: hrefs.size, existing: existing.length, missing: missing.length, routes: missing }, null, 2));
