
'use client';

import React, { useEffect, useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Save, Building2, User, Calculator, FileText, Settings } from 'lucide-react';
import { toast } from 'sonner';
import {
  getMyInstitution,
  getMyInstitutionExtras,
  updateMyInstitution,
} from '@/lib/actions/my-institution';

interface InstitutionFormData {
  // Información Institucional
  institutionName: string;
  institutionNIT: string;
  institutionType: string;
  institutionCode: string;
  institutionLogo: File | null;
  institutionAddress: string;
  institutionDepartment: string;
  institutionCity: string;
  institutionPhone: string;
  institutionEmail: string;
  institutionWebsite: string;

  // Representante Legal
  legalTitle: string;
  legalName: string;
  legalId: string;
  legalPosition: string;
  legalEmail: string;
  legalPhone: string;
  legalSignature: File | null;

  // Cuentas Contables
  accountEmergency: string;
  accountReceiptDebit: string;
  accountReceiptCredit: string;
  accountCopays: string;
  accountModeratingFee: string;
  accountDiscounts: string;
  accountVAT: string;
  accountDonations: string;

  // Centros de Costos
  costCenterEmergency: string;
  serviceCenterEmergency: string;
  costCenterDentistry: string;
  serviceCenterDentistry: string;
  costCenterPediatrics: string;
  costCenterSurgery: string;

  // Documentos Contables
  docReceipts: string;
  docInvoicesPosted: string;
  docInvoicesPending: string;
  docPurchases: string;
  docInventoryIn: string;
  docInventoryOut: string;
  docAmbulatoryDelivery: string;

  // Parámetros Operativos
  paramBudgetItem: string;
  paramLockHours: number;
  paramPaymentOrders: string;
  paramPYM202: string;
  paramMandatoryAccounts: string;
  paramAppointmentReminder: string;
  paramEditWindow: number;
}

export default function InstitutionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<InstitutionFormData>({
    // Información Institucional
    institutionName: '',
    institutionNIT: '',
    institutionType: 'hospital',
    institutionCode: '',
    institutionLogo: null,
    institutionAddress: '',
    institutionDepartment: '',
    institutionCity: '',
    institutionPhone: '',
    institutionEmail: '',
    institutionWebsite: '',

    // Representante Legal
    legalTitle: 'dr',
    legalName: '',
    legalId: '',
    legalPosition: '',
    legalEmail: '',
    legalPhone: '',
    legalSignature: null,

    // Cuentas Contables
    accountEmergency: '',
    accountReceiptDebit: '',
    accountReceiptCredit: '',
    accountCopays: '',
    accountModeratingFee: '',
    accountDiscounts: '',
    accountVAT: '',
    accountDonations: '',

    // Centros de Costos
    costCenterEmergency: '',
    serviceCenterEmergency: '',
    costCenterDentistry: '',
    serviceCenterDentistry: '',
    costCenterPediatrics: '',
    costCenterSurgery: '',

    // Documentos Contables
    docReceipts: '',
    docInvoicesPosted: '',
    docInvoicesPending: '',
    docPurchases: '',
    docInventoryIn: '',
    docInventoryOut: '',
    docAmbulatoryDelivery: '',

    // Parámetros Operativos
    paramBudgetItem: '',
    paramLockHours: 24,
    paramPaymentOrders: '',
    paramPYM202: '',
    paramMandatoryAccounts: '',
    paramAppointmentReminder: 'none',
    paramEditWindow: 24,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [inst, extrasRes] = await Promise.all([
          getMyInstitution(),
          getMyInstitutionExtras(),
        ]);
        if (cancelled) return;
        if (!inst.success || !inst.data) {
          toast.error(inst.error || 'No se pudieron cargar los datos de la institución');
          return;
        }
        const extras = extrasRes.data || {};
        const typeLower = String(inst.data.type || 'HOSPITAL').toLowerCase();
        setFormData((prev) => ({
          ...prev,
          institutionName: inst.data!.name || '',
          institutionNIT: inst.data!.nit || '',
          institutionType:
            typeLower === 'clinic'
              ? 'clinic'
              : typeLower === 'ips'
                ? 'ips'
                : typeLower === 'other'
                  ? 'other'
                  : 'hospital',
          institutionDepartment: inst.data!.department || '',
          institutionCity: inst.data!.city || '',
          institutionPhone: inst.data!.phone || '',
          institutionEmail: inst.data!.email || '',
          institutionAddress: String(extras.address || ''),
          institutionWebsite: String(extras.website || ''),
          institutionCode: String(extras.code || ''),
          legalTitle: String(extras.legalTitle || prev.legalTitle),
          legalName: String(extras.legalName || inst.data!.adminName || ''),
          legalId: String(extras.legalId || ''),
          legalPosition: String(extras.legalPosition || ''),
          legalEmail: String(extras.legalEmail || inst.data!.email || ''),
          legalPhone: String(extras.legalPhone || inst.data!.phone || ''),
          accountEmergency: String(extras.accountEmergency || ''),
          accountReceiptDebit: String(extras.accountReceiptDebit || ''),
          accountReceiptCredit: String(extras.accountReceiptCredit || ''),
          accountCopays: String(extras.accountCopays || ''),
          accountModeratingFee: String(extras.accountModeratingFee || ''),
          accountDiscounts: String(extras.accountDiscounts || ''),
          accountVAT: String(extras.accountVAT || ''),
          accountDonations: String(extras.accountDonations || ''),
          costCenterEmergency: String(extras.costCenterEmergency || ''),
          serviceCenterEmergency: String(extras.serviceCenterEmergency || ''),
          costCenterDentistry: String(extras.costCenterDentistry || ''),
          serviceCenterDentistry: String(extras.serviceCenterDentistry || ''),
          costCenterPediatrics: String(extras.costCenterPediatrics || ''),
          costCenterSurgery: String(extras.costCenterSurgery || ''),
          docReceipts: String(extras.docReceipts || ''),
          docInvoicesPosted: String(extras.docInvoicesPosted || ''),
          docInvoicesPending: String(extras.docInvoicesPending || ''),
          docPurchases: String(extras.docPurchases || ''),
          docInventoryIn: String(extras.docInventoryIn || ''),
          docInventoryOut: String(extras.docInventoryOut || ''),
          docAmbulatoryDelivery: String(extras.docAmbulatoryDelivery || ''),
          paramBudgetItem: String(extras.paramBudgetItem || ''),
          paramLockHours: Number(extras.paramLockHours || 24),
          paramPaymentOrders: String(extras.paramPaymentOrders || ''),
          paramPYM202: String(extras.paramPYM202 || ''),
          paramMandatoryAccounts: String(extras.paramMandatoryAccounts || ''),
          paramAppointmentReminder: String(
            extras.paramAppointmentReminder || 'none'
          ),
          paramEditWindow: Number(extras.paramEditWindow || 24),
        }));
      } catch {
        if (!cancelled) toast.error('Error al cargar la institución');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleInputChange = (field: keyof InstitutionFormData, value: string | number | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: 'institutionLogo' | 'legalSignature', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.institutionName.trim() ||
      !formData.institutionNIT.trim() ||
      !formData.institutionDepartment.trim() ||
      !formData.institutionCity.trim() ||
      !formData.institutionPhone.trim()
    ) {
      toast.error('Complete nombre, NIT, departamento, ciudad y teléfono');
      return;
    }

    setSaving(true);
    try {
      const result = await updateMyInstitution({
        name: formData.institutionName,
        nit: formData.institutionNIT,
        city: formData.institutionCity,
        department: formData.institutionDepartment,
        phone: formData.institutionPhone,
        type: formData.institutionType,
        email: formData.institutionEmail,
        address: formData.institutionAddress,
        website: formData.institutionWebsite,
        code: formData.institutionCode,
        extras: {
          legalTitle: formData.legalTitle,
          legalName: formData.legalName,
          legalId: formData.legalId,
          legalPosition: formData.legalPosition,
          legalEmail: formData.legalEmail,
          legalPhone: formData.legalPhone,
          accountEmergency: formData.accountEmergency,
          accountReceiptDebit: formData.accountReceiptDebit,
          accountReceiptCredit: formData.accountReceiptCredit,
          accountCopays: formData.accountCopays,
          accountModeratingFee: formData.accountModeratingFee,
          accountDiscounts: formData.accountDiscounts,
          accountVAT: formData.accountVAT,
          accountDonations: formData.accountDonations,
          costCenterEmergency: formData.costCenterEmergency,
          serviceCenterEmergency: formData.serviceCenterEmergency,
          costCenterDentistry: formData.costCenterDentistry,
          serviceCenterDentistry: formData.serviceCenterDentistry,
          costCenterPediatrics: formData.costCenterPediatrics,
          costCenterSurgery: formData.costCenterSurgery,
          docReceipts: formData.docReceipts,
          docInvoicesPosted: formData.docInvoicesPosted,
          docInvoicesPending: formData.docInvoicesPending,
          docPurchases: formData.docPurchases,
          docInventoryIn: formData.docInventoryIn,
          docInventoryOut: formData.docInventoryOut,
          docAmbulatoryDelivery: formData.docAmbulatoryDelivery,
          paramBudgetItem: formData.paramBudgetItem,
          paramLockHours: formData.paramLockHours,
          paramPaymentOrders: formData.paramPaymentOrders,
          paramPYM202: formData.paramPYM202,
          paramMandatoryAccounts: formData.paramMandatoryAccounts,
          paramAppointmentReminder: formData.paramAppointmentReminder,
          paramEditWindow: formData.paramEditWindow,
        },
      });

      if (!result.success) {
        toast.error(result.error || 'No se pudo guardar');
        return;
      }
      toast.success('Datos de la institución guardados');
    } catch {
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const actions = (
    <Button type="submit" form="institution-form" disabled={saving || loading}>
      <Save className="h-4 w-4 mr-2" />
      {saving ? 'Guardando…' : 'Guardar Configuración'}
    </Button>
  );

  return (
    <ModulePageLayout
      title="Configuración de Institución"
      description="Datos de su institución (prellenados desde el alta en plataforma)"
      actions={actions}
      maxWidth="7xl"
      showBackButton={true}
    >
      {loading ? (
        <p className="text-sm text-gray-500 py-8">Cargando datos de la institución…</p>
      ) : (
      <form id="institution-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Sección 1: Información Institucional */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información Institucional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="institutionName" className="flex items-center gap-1">
                  Nombre de la Institución
                  <Badge variant="destructive" className="text-xs">*</Badge>
                </Label>
                <Input
                  id="institutionName"
                  value={formData.institutionName}
                  onChange={(e) => handleInputChange('institutionName', e.target.value)}
                  placeholder="Nombre de la institución"
                  required
                  className="bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionNIT" className="flex items-center gap-1">
                  NIT
                  <Badge variant="destructive" className="text-xs">*</Badge>
                </Label>
                <Input
                  id="institutionNIT"
                  value={formData.institutionNIT}
                  onChange={(e) => handleInputChange('institutionNIT', e.target.value)}
                  placeholder="NIT de la institución"
                  required
                  className="bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionType">Tipo de Institución</Label>
                <Select value={formData.institutionType} onValueChange={(value) => handleInputChange('institutionType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="clinic">Clínica Privada</SelectItem>
                    <SelectItem value="ips">IPS</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionCode" className="flex items-center gap-1">
                  Código IPS
                  <Badge variant="destructive" className="text-xs">*</Badge>
                </Label>
                <Input
                  id="institutionCode"
                  value={formData.institutionCode}
                  onChange={(e) => handleInputChange('institutionCode', e.target.value)}
                  placeholder="Código IPS"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Logo Institucional</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('institutionLogo', e.target.files?.[0] || null)}
                    className="hidden"
                    id="institutionLogo"
                  />
                  <Label htmlFor="institutionLogo" className="cursor-pointer text-blue-600 hover:text-blue-700">
                    Arrastra o selecciona un archivo
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionAddress" className="flex items-center gap-1">
                  Dirección
                  <Badge variant="destructive" className="text-xs">*</Badge>
                </Label>
                <Input
                  id="institutionAddress"
                  value={formData.institutionAddress}
                  onChange={(e) => handleInputChange('institutionAddress', e.target.value)}
                  placeholder="Dirección completa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionDepartment" className="flex items-center gap-1">
                  Departamento
                  <Badge variant="destructive" className="text-xs">*</Badge>
                </Label>
                <Input
                  id="institutionDepartment"
                  value={formData.institutionDepartment}
                  onChange={(e) => handleInputChange('institutionDepartment', e.target.value)}
                  placeholder="Departamento"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionCity" className="flex items-center gap-1">
                  Ciudad
                  <Badge variant="destructive" className="text-xs">*</Badge>
                </Label>
                <Input
                  id="institutionCity"
                  value={formData.institutionCity}
                  onChange={(e) => handleInputChange('institutionCity', e.target.value)}
                  placeholder="Ciudad"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionPhone" className="flex items-center gap-1">
                  Teléfono
                  <Badge variant="destructive" className="text-xs">*</Badge>
                </Label>
                <Input
                  id="institutionPhone"
                  type="tel"
                  value={formData.institutionPhone}
                  onChange={(e) => handleInputChange('institutionPhone', e.target.value)}
                  placeholder="Teléfono"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionEmail" className="flex items-center gap-1">
                  Email
                  <Badge variant="destructive" className="text-xs">*</Badge>
                </Label>
                <Input
                  id="institutionEmail"
                  type="email"
                  value={formData.institutionEmail}
                  onChange={(e) => handleInputChange('institutionEmail', e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionWebsite">Página Web</Label>
                <Input
                  id="institutionWebsite"
                  value={formData.institutionWebsite}
                  onChange={(e) => handleInputChange('institutionWebsite', e.target.value)}
                  placeholder="https://www.ejemplo.com"
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Sección 2: Representante Legal */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Representante Legal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="legalTitle">Tratamiento</Label>
                <Select value={formData.legalTitle} onValueChange={(value) => handleInputChange('legalTitle', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr">Dr.</SelectItem>
                    <SelectItem value="dra">Dra.</SelectItem>
                    <SelectItem value="sr">Sr.</SelectItem>
                    <SelectItem value="sra">Sra.</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalName" className="flex items-center gap-1">
                  Nombre Completo
                  <Badge variant="destructive" className="text-xs">*</Badge>
                </Label>
                <Input
                  id="legalName"
                  value={formData.legalName}
                  onChange={(e) => handleInputChange('legalName', e.target.value)}
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalId" className="flex items-center gap-1">
                  Documento de Identidad
                  <Badge variant="destructive" className="text-xs">*</Badge>
                </Label>
                <Input
                  id="legalId"
                  value={formData.legalId}
                  onChange={(e) => handleInputChange('legalId', e.target.value)}
                  placeholder="Número de documento"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalPosition" className="flex items-center gap-1">
                  Cargo
                  <Badge variant="destructive" className="text-xs">*</Badge>
                </Label>
                <Input
                  id="legalPosition"
                  value={formData.legalPosition}
                  onChange={(e) => handleInputChange('legalPosition', e.target.value)}
                  placeholder="Cargo del representante"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalEmail">Email</Label>
                <Input
                  id="legalEmail"
                  type="email"
                  value={formData.legalEmail}
                  onChange={(e) => handleInputChange('legalEmail', e.target.value)}
                  placeholder="Email del representante"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalPhone">Teléfono</Label>
                <Input
                  id="legalPhone"
                  type="tel"
                  value={formData.legalPhone}
                  onChange={(e) => handleInputChange('legalPhone', e.target.value)}
                  placeholder="Teléfono del representante"
                />
              </div>

              <div className="space-y-2">
                <Label>Firma Digital</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('legalSignature', e.target.files?.[0] || null)}
                    className="hidden"
                    id="legalSignature"
                  />
                  <Label htmlFor="legalSignature" className="cursor-pointer text-blue-600 hover:text-blue-700">
                    Seleccionar archivo
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Sección 3: Cuentas Contables */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Cuentas Contables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="accountEmergency">Urgencias</Label>
                <Input
                  id="accountEmergency"
                  value={formData.accountEmergency}
                  onChange={(e) => handleInputChange('accountEmergency', e.target.value)}
                  placeholder="Código de cuenta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountReceiptDebit">Recibos de Caja Débito</Label>
                <Input
                  id="accountReceiptDebit"
                  value={formData.accountReceiptDebit}
                  onChange={(e) => handleInputChange('accountReceiptDebit', e.target.value)}
                  placeholder="Código de cuenta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountReceiptCredit">Recibos de Caja Crédito</Label>
                <Input
                  id="accountReceiptCredit"
                  value={formData.accountReceiptCredit}
                  onChange={(e) => handleInputChange('accountReceiptCredit', e.target.value)}
                  placeholder="Código de cuenta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountCopays">Copagos</Label>
                <Input
                  id="accountCopays"
                  value={formData.accountCopays}
                  onChange={(e) => handleInputChange('accountCopays', e.target.value)}
                  placeholder="Código de cuenta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountModeratingFee">Cuota Moderadora</Label>
                <Input
                  id="accountModeratingFee"
                  value={formData.accountModeratingFee}
                  onChange={(e) => handleInputChange('accountModeratingFee', e.target.value)}
                  placeholder="Código de cuenta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountDiscounts">Descuentos</Label>
                <Input
                  id="accountDiscounts"
                  value={formData.accountDiscounts}
                  onChange={(e) => handleInputChange('accountDiscounts', e.target.value)}
                  placeholder="Código de cuenta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountVAT">IVA Compras</Label>
                <Input
                  id="accountVAT"
                  value={formData.accountVAT}
                  onChange={(e) => handleInputChange('accountVAT', e.target.value)}
                  placeholder="Código de cuenta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountDonations">Donaciones/Subsidios</Label>
                <Input
                  id="accountDonations"
                  value={formData.accountDonations}
                  onChange={(e) => handleInputChange('accountDonations', e.target.value)}
                  placeholder="Código de cuenta"
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Sección 4: Centros de Costos */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Centros de Costos/Servicios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="costCenterEmergency">Urgencias</Label>
                <Input
                  id="costCenterEmergency"
                  value={formData.costCenterEmergency}
                  onChange={(e) => handleInputChange('costCenterEmergency', e.target.value)}
                  placeholder="Código"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceCenterEmergency">Servicio Urgencias</Label>
                <Input
                  id="serviceCenterEmergency"
                  value={formData.serviceCenterEmergency}
                  onChange={(e) => handleInputChange('serviceCenterEmergency', e.target.value)}
                  placeholder="Código"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costCenterDentistry">Odontología</Label>
                <Input
                  id="costCenterDentistry"
                  value={formData.costCenterDentistry}
                  onChange={(e) => handleInputChange('costCenterDentistry', e.target.value)}
                  placeholder="Código"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceCenterDentistry">Servicio Odontología</Label>
                <Input
                  id="serviceCenterDentistry"
                  value={formData.serviceCenterDentistry}
                  onChange={(e) => handleInputChange('serviceCenterDentistry', e.target.value)}
                  placeholder="Código"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costCenterPediatrics">Pediatría</Label>
                <Input
                  id="costCenterPediatrics"
                  value={formData.costCenterPediatrics}
                  onChange={(e) => handleInputChange('costCenterPediatrics', e.target.value)}
                  placeholder="Código"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costCenterSurgery">Cirugía</Label>
                <Input
                  id="costCenterSurgery"
                  value={formData.costCenterSurgery}
                  onChange={(e) => handleInputChange('costCenterSurgery', e.target.value)}
                  placeholder="Código"
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Sección 5: Documentos Contables */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos Contables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="docReceipts">Recibos de Caja</Label>
                <Input
                  id="docReceipts"
                  value={formData.docReceipts}
                  onChange={(e) => handleInputChange('docReceipts', e.target.value)}
                  placeholder="Formato RC-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="docInvoicesPosted">Facturas Radicadas</Label>
                <Input
                  id="docInvoicesPosted"
                  value={formData.docInvoicesPosted}
                  onChange={(e) => handleInputChange('docInvoicesPosted', e.target.value)}
                  placeholder="Formato"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="docInvoicesPending">Facturas Sin Radicar</Label>
                <Input
                  id="docInvoicesPending"
                  value={formData.docInvoicesPending}
                  onChange={(e) => handleInputChange('docInvoicesPending', e.target.value)}
                  placeholder="Formato"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="docPurchases">Compras</Label>
                <Input
                  id="docPurchases"
                  value={formData.docPurchases}
                  onChange={(e) => handleInputChange('docPurchases', e.target.value)}
                  placeholder="Formato"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="docInventoryIn">Notas Ingreso Inventario</Label>
                <Input
                  id="docInventoryIn"
                  value={formData.docInventoryIn}
                  onChange={(e) => handleInputChange('docInventoryIn', e.target.value)}
                  placeholder="Formato"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="docInventoryOut">Notas Salida Inventario</Label>
                <Input
                  id="docInventoryOut"
                  value={formData.docInventoryOut}
                  onChange={(e) => handleInputChange('docInventoryOut', e.target.value)}
                  placeholder="Formato"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="docAmbulatoryDelivery">Entrega Ambulatoria</Label>
                <Input
                  id="docAmbulatoryDelivery"
                  value={formData.docAmbulatoryDelivery}
                  onChange={(e) => handleInputChange('docAmbulatoryDelivery', e.target.value)}
                  placeholder="Formato"
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Sección 6: Parámetros Operativos */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Parámetros Operativos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="paramBudgetItem">Rubro Presupuestal Recibos</Label>
                <Input
                  id="paramBudgetItem"
                  value={formData.paramBudgetItem}
                  onChange={(e) => handleInputChange('paramBudgetItem', e.target.value)}
                  placeholder="Rubro presupuestal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paramLockHours">Horas para Bloquear Documentos</Label>
                <Input
                  id="paramLockHours"
                  type="number"
                  min="1"
                  value={formData.paramLockHours}
                  onChange={(e) => handleInputChange('paramLockHours', parseInt(e.target.value) || 24)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paramPaymentOrders">Interface Órdenes de Pago</Label>
                <Input
                  id="paramPaymentOrders"
                  value={formData.paramPaymentOrders}
                  onChange={(e) => handleInputChange('paramPaymentOrders', e.target.value)}
                  placeholder="Interface"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paramPYM202">Interface PYM 202</Label>
                <Input
                  id="paramPYM202"
                  value={formData.paramPYM202}
                  onChange={(e) => handleInputChange('paramPYM202', e.target.value)}
                  placeholder="Interface"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paramMandatoryAccounts">Cuentas Contables Obligatorias</Label>
                <Textarea
                  id="paramMandatoryAccounts"
                  value={formData.paramMandatoryAccounts}
                  onChange={(e) => handleInputChange('paramMandatoryAccounts', e.target.value)}
                  placeholder="Lista de cuentas obligatorias"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paramAppointmentReminder">Recordatorio de Citas</Label>
                <Select value={formData.paramAppointmentReminder} onValueChange={(value) => handleInputChange('paramAppointmentReminder', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No enviar</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="both">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paramEditWindow">Editar Documentos (horas)</Label>
                <Input
                  id="paramEditWindow"
                  type="number"
                  min="1"
                  value={formData.paramEditWindow}
                  onChange={(e) => handleInputChange('paramEditWindow', parseInt(e.target.value) || 24)}
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>
      </form>
      )}
    </ModulePageLayout>
  );
}

