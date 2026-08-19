"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type SystemSettings = {
  organizationName: string;
  timezone: string;
  locale: string;
  theme: 'light' | 'dark';
  loginAllowRegistration: boolean;
  loginRequire2FA: boolean;
  emailFrom: string;
  emailHost: string;
  emailPort: number;
  emailUser: string;
};

const DEFAULTS: SystemSettings = {
  organizationName: 'AsisMediCare',
  timezone: 'America/Bogota',
  locale: 'es-CO',
  theme: 'light',
  loginAllowRegistration: false,
  loginRequire2FA: false,
  emailFrom: 'no-reply@asismedicare.com',
  emailHost: '',
  emailPort: 587,
  emailUser: '',
};

export function SystemSettingsForm() {
  const [values, setValues] = useState<SystemSettings>(DEFAULTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/configuracion/sistema');
        const json = await res.json();
        if (json?.success && json?.data) {
          setValues((prev) => ({ ...prev, ...(json.data as SystemSettings) }));
        }
      } catch {}
    })();
  }, []);

  const save = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/configuracion/sistema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Error');
      // Aplicar tema global inmediatamente
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', values.theme);
      }
      alert('Configuración guardada');
    } catch (e: any) {
      alert(e?.message || 'Error al guardar configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración del Sistema</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nombre de la organización</Label>
            <Input value={values.organizationName} onChange={(e) => setValues({ ...values, organizationName: e.target.value })} />
          </div>
          <div>
            <Label>Zona horaria</Label>
            <Input value={values.timezone} onChange={(e) => setValues({ ...values, timezone: e.target.value })} />
          </div>
          <div>
            <Label>Locale</Label>
            <Input value={values.locale} onChange={(e) => setValues({ ...values, locale: e.target.value })} />
          </div>
          <div>
            <Label>Tema (light/dark)</Label>
            <Input value={values.theme} onChange={(e) => setValues({ ...values, theme: e.target.value as any })} />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Permitir registro</Label>
              <p className="text-xs text-muted-foreground">Permite crear cuentas desde login</p>
            </div>
            <Switch checked={values.loginAllowRegistration} onCheckedChange={(v) => setValues({ ...values, loginAllowRegistration: Boolean(v) })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Requerir 2FA</Label>
              <p className="text-xs text-muted-foreground">Requiere segundo factor en login</p>
            </div>
            <Switch checked={values.loginRequire2FA} onCheckedChange={(v) => setValues({ ...values, loginRequire2FA: Boolean(v) })} />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Email from</Label>
            <Input value={values.emailFrom} onChange={(e) => setValues({ ...values, emailFrom: e.target.value })} />
          </div>
          <div>
            <Label>SMTP host</Label>
            <Input value={values.emailHost} onChange={(e) => setValues({ ...values, emailHost: e.target.value })} />
          </div>
          <div>
            <Label>SMTP port</Label>
            <Input type="number" value={values.emailPort} onChange={(e) => setValues({ ...values, emailPort: Number(e.target.value) })} />
          </div>
          <div>
            <Label>SMTP user</Label>
            <Input value={values.emailUser} onChange={(e) => setValues({ ...values, emailUser: e.target.value })} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={save} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


