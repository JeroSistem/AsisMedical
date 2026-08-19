import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const navPath = path.join(root, 'lib', 'navigation.ts');
const appDir = path.join(root, 'app');

const content = fs.readFileSync(navPath, 'utf8');
const hrefs = new Set();

for (const match of content.matchAll(/href:\s*['"]([^#'"]+)['"]/g)) {
  const href = match[1].split('?')[0].replace(/\/$/, '');
  if (href) hrefs.add(href);
}

function pagePath(route) {
  return path.join(appDir, route.replace(/^\//, ''), 'page.tsx');
}

function pageExists(route) {
  return fs.existsSync(pagePath(route));
}

function componentName(route) {
  const parts = route.split('/').filter(Boolean);
  const base = parts.map((p) => p.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\s/g, '')).join('');
  return `${base || 'Root'}Page`;
}

function generatePageContent(route) {
  const name = componentName(route);
  return `'use client';

import { SubmoduleFormPage } from '@/components/shared/submodule-form-page';

export default function ${name}() {
  return <SubmoduleFormPage href="${route}" showBackButton />;
}
`;
}

const missing = [...hrefs].filter((route) => !pageExists(route)).sort();
let created = 0;
let skipped = 0;

for (const route of missing) {
  const filePath = pagePath(route);
  const dir = path.dirname(filePath);

  if (pageExists(route)) {
    skipped += 1;
    continue;
  }

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, generatePageContent(route), 'utf8');
  created += 1;
}

console.log(JSON.stringify({ created, skipped, totalMissing: missing.length, routes: missing }, null, 2));
