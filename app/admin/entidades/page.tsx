'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function EntidadesPage() {
  const { toast } = useToast();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo: '',
    categoria: '',
    nit: '',
    regimen: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    codigoPostal: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    contacto: {
      nombre: '',
      cargo: '',
      telefono: '',
      email: ''
    },
    informacionFinanciera: {
      banco: '',
      tipoCuenta: '',
      numeroCuenta: '',
      titular: '',
      codigoSwift: '',
      codigoIban: ''
    },
    configuracion: {
      porcentajeCobertura: '',
      copago: '',
      deducible: '',
      topeAnual: '',
      autorizacionPrevia: false,
      redPrestadores: false,
      coberturaMedicamentos: false,
      coberturaProcedimientos: false
    },
    documentos: {
      certificadoCamara: '',
      certificadoRut: '',
      certificadoRepresentacion: '',
      certificadoBancario: '',
      otrosDocumentos: ''
    },
    estado: 'activo',
    fechaCreacion: '',
    fechaModificacion: '',
    creadoPor: '',
    modificadoPor: ''
  });

  // Datos de ejemplo
  const [entidades, setEntidades] = useState([
    {
      id: '1',
      codigo: 'EPS001',
      nombre: 'EPS Sura',
      descripcion: 'Entidad Promotora de Salud Sura',
      tipo: 'EPS',
      categoria: 'Aseguradora',
      nit: '890903938-8',
      regimen: 'Contributivo',
      ciudad: 'Medellín',
      departamento: 'Antioquia',
      telefono: '01 8000 519 519',
      email: 'contacto@sura.com',
      estado: 'activo',
      fechaCreacion: '2024-01-15',
      creadoPor: 'Sistema'
    },
    {
      id: '2',
      codigo: 'EPS002',
      nombre: 'EPS Famisanar',
      descripcion: 'Entidad Promotora de Salud Famisanar',
      tipo: 'EPS',
      categoria: 'Aseguradora',
      nit: '900123456-7',
      regimen: 'Contributivo',
      ciudad: 'Bogotá',
      departamento: 'Cundinamarca',
      telefono: '01 8000 123 456',
      email: 'contacto@famisanar.com',
      estado: 'activo',
      fechaCreacion: '2024-01-15',
      creadoPor: 'Sistema'
    },
    {
      id: '3',
      codigo: 'IPS001',
      nombre: 'Clínica Las Américas',
      descripcion: 'Institución Prestadora de Servicios de Salud',
      tipo: 'IPS',
      categoria: 'Prestador',
      nit: '890123456-1',
      regimen: 'Contributivo',
      ciudad: 'Medellín',
      departamento: 'Antioquia',
      telefono: '604 444 4444',
      email: 'contacto@clinicasamericas.com',
      estado: 'activo',
      fechaCreacion: '2024-01-15',
      creadoPor: 'Sistema'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [section, key] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [key]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && editingId) {
      // Actualizar entidad existente
      setEntidades(prev => prev.map(entidad => 
        entidad.id === editingId 
          ? { ...entidad, ...formData, fechaModificacion: new Date().toISOString().split('T')[0] }
          : entidad
      ));
      toast({
        title: "Entidad actualizada",
        description: "La entidad se ha actualizado correctamente.",
      });
    } else {
      // Crear nueva entidad
      const nuevaEntidad = {
        id: Date.now().toString(),
        ...formData,
        fechaCreacion: new Date().toISOString().split('T')[0],
        creadoPor: 'Usuario Actual'
      };
      setEntidades(prev => [...prev, nuevaEntidad]);
      toast({
        title: "Entidad creada",
        description: "La entidad se ha creado correctamente.",
      });
    }
    
    resetForm();
  };

  const handleEdit = (entidad: any) => {
    setFormData(entidad);
    setIsEditing(true);
    setEditingId(entidad.id);
    setIsFormVisible(true);
  };

  const handleDelete = (id: string) => {
    setEntidades(prev => prev.filter(entidad => entidad.id !== id));
    toast({
      title: "Entidad eliminada",
      description: "La entidad se ha eliminado correctamente.",
    });
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      tipo: '',
      categoria: '',
      nit: '',
      regimen: '',
      direccion: '',
      ciudad: '',
      departamento: '',
      codigoPostal: '',
      telefono: '',
      email: '',
      sitioWeb: '',
      contacto: {
        nombre: '',
        cargo: '',
        telefono: '',
        email: ''
      },
      informacionFinanciera: {
        banco: '',
        tipoCuenta: '',
        numeroCuenta: '',
        titular: '',
        codigoSwift: '',
        codigoIban: ''
      },
      configuracion: {
        porcentajeCobertura: '',
        copago: '',
        deducible: '',
        topeAnual: '',
        autorizacionPrevia: false,
        redPrestadores: false,
        coberturaMedicamentos: false,
        coberturaProcedimientos: false
      },
      documentos: {
        certificadoCamara: '',
        certificadoRut: '',
        certificadoRepresentacion: '',
        certificadoBancario: '',
        otrosDocumentos: ''
      },
      estado: 'activo',
      fechaCreacion: '',
      fechaModificacion: '',
      creadoPor: '',
      modificadoPor: ''
    });
    setIsEditing(false);
    setEditingId(null);
    setIsFormVisible(false);
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Entidades</h1>
            <p className="text-gray-600 mt-2">
              Administra las entidades de salud, aseguradoras y prestadores de servicios
            </p>
          </div>
          <Button onClick={() => setIsFormVisible(true)}>
            Nueva Entidad
          </Button>
        </div>

        {isFormVisible && (
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Editar Entidad' : 'Nueva Entidad'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Modifica la información de la entidad' : 'Crea una nueva entidad'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código</Label>
                    <Input
                      id="codigo"
                      value={formData.codigo}
                      onChange={(e) => handleInputChange('codigo', e.target.value)}
                      placeholder="Ej: EPS001, IPS001"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre de la Entidad</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      placeholder="Ej: EPS Sura"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Entidad</Label>
                    <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EPS">EPS</SelectItem>
                        <SelectItem value="IPS">IPS</SelectItem>
                        <SelectItem value="ARS">ARS</SelectItem>
                        <SelectItem value="ESE">ESE</SelectItem>
                        <SelectItem value="Clínica">Clínica</SelectItem>
                        <SelectItem value="Hospital">Hospital</SelectItem>
                        <SelectItem value="Laboratorio">Laboratorio</SelectItem>
                        <SelectItem value="Farmacia">Farmacia</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aseguradora">Aseguradora</SelectItem>
                        <SelectItem value="Prestador">Prestador</SelectItem>
                        <SelectItem value="Público">Público</SelectItem>
                        <SelectItem value="Privado">Privado</SelectItem>
                        <SelectItem value="Mixto">Mixto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nit">NIT</Label>
                    <Input
                      id="nit"
                      value={formData.nit}
                      onChange={(e) => handleInputChange('nit', e.target.value)}
                      placeholder="Ej: 890903938-8"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regimen">Régimen</Label>
                    <Select value={formData.regimen} onValueChange={(value) => handleInputChange('regimen', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el régimen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Contributivo">Contributivo</SelectItem>
                        <SelectItem value="Subsidiado">Subsidiado</SelectItem>
                        <SelectItem value="Vinculado">Vinculado</SelectItem>
                        <SelectItem value="Particular">Particular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      placeholder="Ej: 01 8000 519 519"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Ej: contacto@entidad.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sitioWeb">Sitio Web</Label>
                    <Input
                      id="sitioWeb"
                      value={formData.sitioWeb}
                      onChange={(e) => handleInputChange('sitioWeb', e.target.value)}
                      placeholder="Ej: https://www.entidad.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="suspendido">Suspendido</SelectItem>
                        <SelectItem value="en_revision">En Revisión</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    placeholder="Describe la entidad y sus servicios"
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información de Ubicación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        value={formData.direccion}
                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                        placeholder="Dirección completa"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input
                        id="ciudad"
                        value={formData.ciudad}
                        onChange={(e) => handleInputChange('ciudad', e.target.value)}
                        placeholder="Ciudad"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="departamento">Departamento</Label>
                      <Input
                        id="departamento"
                        value={formData.departamento}
                        onChange={(e) => handleInputChange('departamento', e.target.value)}
                        placeholder="Departamento"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="codigoPostal">Código Postal</Label>
                      <Input
                        id="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
                        placeholder="Código postal"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información de Contacto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactoNombre">Nombre del Contacto</Label>
                      <Input
                        id="contactoNombre"
                        value={formData.contacto.nombre}
                        onChange={(e) => handleInputChange('contacto.nombre', e.target.value)}
                        placeholder="Nombre completo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactoCargo">Cargo</Label>
                      <Input
                        id="contactoCargo"
                        value={formData.contacto.cargo}
                        onChange={(e) => handleInputChange('contacto.cargo', e.target.value)}
                        placeholder="Cargo o puesto"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactoTelefono">Teléfono de Contacto</Label>
                      <Input
                        id="contactoTelefono"
                        value={formData.contacto.telefono}
                        onChange={(e) => handleInputChange('contacto.telefono', e.target.value)}
                        placeholder="Teléfono del contacto"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactoEmail">Email de Contacto</Label>
                      <Input
                        id="contactoEmail"
                        type="email"
                        value={formData.contacto.email}
                        onChange={(e) => handleInputChange('contacto.email', e.target.value)}
                        placeholder="Email del contacto"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información Financiera</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="banco">Banco</Label>
                      <Input
                        id="banco"
                        value={formData.informacionFinanciera.banco}
                        onChange={(e) => handleInputChange('informacionFinanciera.banco', e.target.value)}
                        placeholder="Nombre del banco"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tipoCuenta">Tipo de Cuenta</Label>
                      <Select value={formData.informacionFinanciera.tipoCuenta} onValueChange={(value) => handleInputChange('informacionFinanciera.tipoCuenta', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ahorros">Ahorros</SelectItem>
                          <SelectItem value="Corriente">Corriente</SelectItem>
                          <SelectItem value="Empresarial">Empresarial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="numeroCuenta">Número de Cuenta</Label>
                      <Input
                        id="numeroCuenta"
                        value={formData.informacionFinanciera.numeroCuenta}
                        onChange={(e) => handleInputChange('informacionFinanciera.numeroCuenta', e.target.value)}
                        placeholder="Número de cuenta bancaria"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="titular">Titular de la Cuenta</Label>
                      <Input
                        id="titular"
                        value={formData.informacionFinanciera.titular}
                        onChange={(e) => handleInputChange('informacionFinanciera.titular', e.target.value)}
                        placeholder="Nombre del titular"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configuración de Cobertura</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="porcentajeCobertura">Porcentaje de Cobertura (%)</Label>
                      <Input
                        id="porcentajeCobertura"
                        type="number"
                        value={formData.configuracion.porcentajeCobertura}
                        onChange={(e) => handleInputChange('configuracion.porcentajeCobertura', e.target.value)}
                        placeholder="80"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="copago">Copago</Label>
                      <Input
                        id="copago"
                        value={formData.configuracion.copago}
                        onChange={(e) => handleInputChange('configuracion.copago', e.target.value)}
                        placeholder="Ej: $5,000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deducible">Deducible</Label>
                      <Input
                        id="deducible"
                        value={formData.configuracion.deducible}
                        onChange={(e) => handleInputChange('configuracion.deducible', e.target.value)}
                        placeholder="Ej: $50,000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="topeAnual">Tope Anual</Label>
                      <Input
                        id="topeAnual"
                        value={formData.configuracion.topeAnual}
                        onChange={(e) => handleInputChange('configuracion.topeAnual', e.target.value)}
                        placeholder="Ej: $5,000,000"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autorizacionPrevia"
                        checked={formData.configuracion.autorizacionPrevia}
                        onCheckedChange={(checked) => handleInputChange('configuracion.autorizacionPrevia', checked)}
                      />
                      <Label htmlFor="autorizacionPrevia">Requiere Autorización Previa</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="redPrestadores"
                        checked={formData.configuracion.redPrestadores}
                        onCheckedChange={(checked) => handleInputChange('configuracion.redPrestadores', checked)}
                      />
                      <Label htmlFor="redPrestadores">Red de Prestadores</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="coberturaMedicamentos"
                        checked={formData.configuracion.coberturaMedicamentos}
                        onCheckedChange={(checked) => handleInputChange('configuracion.coberturaMedicamentos', checked)}
                      />
                      <Label htmlFor="coberturaMedicamentos">Cobertura de Medicamentos</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="coberturaProcedimientos"
                        checked={formData.configuracion.coberturaProcedimientos}
                        onCheckedChange={(checked) => handleInputChange('configuracion.coberturaProcedimientos', checked)}
                      />
                      <Label htmlFor="coberturaProcedimientos">Cobertura de Procedimientos</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {isEditing ? 'Actualizar Entidad' : 'Crear Entidad'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Entidades Existentes</CardTitle>
            <CardDescription>
              Lista de todas las entidades registradas en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entidades.map((entidad) => (
                <div key={entidad.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-semibold">{entidad.nombre}</h3>
                        <p className="text-sm text-gray-600">{entidad.descripcion}</p>
                      </div>
                      <Badge variant={entidad.estado === 'activo' ? 'default' : 'secondary'}>
                        {entidad.estado}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Código: {entidad.codigo}</span>
                      <span>Tipo: {entidad.tipo}</span>
                      <span>Categoría: {entidad.categoria}</span>
                      <span>NIT: {entidad.nit}</span>
                      <span>Régimen: {entidad.regimen}</span>
                      <span>Ciudad: {entidad.ciudad}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(entidad)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(entidad.id)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
