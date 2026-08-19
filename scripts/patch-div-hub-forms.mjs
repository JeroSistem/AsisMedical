import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const targets = [
  { file: 'app/asistencial/page.tsx', href: '/asistencial' },
  { file: 'app/calidad/page.tsx', href: '/calidad' },
  { file: 'app/cartera/page.tsx', href: '/cartera' },
  { file: 'app/auditoria/page.tsx', href: '/auditoria' },
  { file: 'app/contabilidad/page.tsx', href: '/contabilidad' },
  { file: 'app/presupuesto/page.tsx', href: '/presupuesto' },
  { file: 'app/nomina/page.tsx', href: '/nomina' },
  { file: 'app/imagenes-diagnosticas/page.tsx', href: '/imagenes-diagnosticas' },
  { file: 'app/farmacia/page.tsx', href: '/farmacia' },
  { file: 'app/laboratorio/page.tsx', href: '/laboratorio' },
  { file: 'app/configuracion/page.tsx', href: '/configuracion' },
  { file: 'app/furips/page.tsx', href: '/facturacion/administracion/furips' },
  { file: 'app/furtran/page.tsx', href: '/facturacion/administracion/furtran' },
  { file: 'app/grupos-etareos/page.tsx', href: '/facturacion/administracion/grupos-etareos' },
  { file: 'app/homologaciones-proc/page.tsx', href: '/facturacion/administracion/homologaciones-proc' },
  { file: 'app/recibos-caja/page.tsx', href: '/facturacion/administracion/recibos-caja' },
  { file: 'app/resolucion-202/page.tsx', href: '/facturacion/administracion/resolucion-202' },
  { file: 'app/traslados/page.tsx', href: '/facturacion/administracion/traslados' },
  { file: 'app/anexo-tecnico-autorizaciones/page.tsx', href: '/facturacion/administracion/anexo-autorizaciones' },
  { file: 'app/anexo-tecnico-inconsistencia/page.tsx', href: '/facturacion/administracion/anexo-inconsistencia' },
  { file: 'app/anexo-tecnico-informe-urgencia/page.tsx', href: '/facturacion/administracion/anexo-urgencia' },
  { file: 'app/reportes/page.tsx', href: '/dashboard/reportes' },
];

const embedBlock = (href) => `
      <Card>
        <CardHeader>
          <CardTitle>Formulario del módulo</CardTitle>
          <CardDescription>Registro y parametrización</CardDescription>
        </CardHeader>
        <CardContent>
          <SubmoduleFormPage href="${href}" embedded />
        </CardContent>
      </Card>`;

let updated = 0;

for (const { file, href } of targets) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) continue;

  let text = fs.readFileSync(filePath, 'utf8');
  if (text.includes('SubmoduleFormPage')) continue;

  if (!text.includes("from '@/components/shared/submodule-form-page'")) {
    text = text.replace(
      /^('use client';\s*\n)/,
      "$1import { SubmoduleFormPage } from '@/components/shared/submodule-form-page';\n"
    );
  }

  text = text.replace(
    /(\s*)<\/div>\s*\);\s*\}\s*$/,
    `${embedBlock(href)}$1</div>\n  );\n}\n`
  );

  fs.writeFileSync(filePath, text, 'utf8');
  updated += 1;
}

console.log(JSON.stringify({ updated }, null, 2));
