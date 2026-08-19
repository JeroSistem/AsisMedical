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

const hubRoutes = [...hrefs].filter((route) => {
  const file = pagePath(route);
  if (!fs.existsSync(file)) return false;
  const text = fs.readFileSync(file, 'utf8');
  const hasForm =
    text.includes('SubmoduleFormPage') ||
    text.includes('<Input') ||
    text.includes('StitchMockPage') ||
    text.includes('PatientForm');
  return !hasForm;
});

const embedSnippet = (route) => `
      <ModuleCard title="Formulario del módulo" description="Registro y parametrización">
        <SubmoduleFormPage href="${route}" embedded />
      </ModuleCard>`;

let updated = 0;

for (const route of hubRoutes) {
  const file = pagePath(route);
  let text = fs.readFileSync(file, 'utf8');

  if (text.includes('SubmoduleFormPage')) continue;

  if (!text.includes("from '@/components/shared/submodule-form-page'")) {
    if (text.includes("from '@/components/shared/module-page-layout'")) {
      text = text.replace(
        "from '@/components/shared/module-page-layout'",
        "from '@/components/shared/module-page-layout'\nimport { SubmoduleFormPage } from '@/components/shared/submodule-form-page'"
      );
    } else if (text.includes('ModulePageLayout')) {
      text = `import { SubmoduleFormPage } from '@/components/shared/submodule-form-page';\n${text}`;
    } else {
      continue;
    }
  }

  if (!text.includes('ModuleCard') && text.includes('ModulePageLayout')) {
    text = text.replace(
      "from '@/components/shared/module-page-layout'",
      "from '@/components/shared/module-page-layout'"
    );
    if (!text.includes('ModuleCard')) {
      text = text.replace(
        /import \{ ModulePageLayout(?:, ModuleCard)? \}/,
        'import { ModulePageLayout, ModuleCard }'
      );
    }
  }

  const closingPatterns = [
    /(\s*)<\/ModulePageLayout>\s*\);\s*\}\s*$/,
    /(\s*)<\/div>\s*\);\s*\}\s*$/,
  ];

  let patched = false;
  for (const pattern of closingPatterns) {
    if (pattern.test(text)) {
      text = text.replace(pattern, `${embedSnippet(route)}$1</ModulePageLayout>\n  );\n}\n`);
      patched = true;
      break;
    }
  }

  if (!patched) continue;

  fs.writeFileSync(file, text, 'utf8');
  updated += 1;
}

console.log(JSON.stringify({ updated, hubRoutes }, null, 2));
