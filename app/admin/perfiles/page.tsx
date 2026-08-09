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

export default function PerfilesPage() {
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
    nivelAcceso: '',
    permisos: {
      administracion: false,
      facturacion: false,
      historias: false,
      triage: false,
      asistencial: false,
      inventario: false,
      auditoria: false,
      laboratorio: false,
      reportes: false,
      configuracion: false
    },
    restricciones: {
      horarioAcceso: '',
      ipPermitidas: '',
      dispositivosPermitidos: ''
    },
    configuracion: {
      sesionTimeout: '',
      intentosLogin: '',
      requiereAutenticacionDoble: false,
      notificacionesEmail: false,
      notificacionesSMS: false
    },
    estado: 'activo',
    fechaCreacion: '',
    fechaModificacion: '',
    creadoPor: '',
    modificadoPor: ''
  });

  // Datos de ejemplo
  const [perfiles, setPerfiles] = useState([
    {
      id: '1',
      codigo: 'ADMIN',
      nombre: 'Administrador del Sistema',
      descripcion: 'Acceso completo a todas las funcionalidades del sistema',
      tipo: 'Sistema',
      categoria: 'Administrativo',
      nivelAcceso: 'Alto',
      estado: 'activo',
      fechaCreacion: '2024-01-15',
      creadoPor: 'Sistema'
    },
    {
      id: '2',
      codigo: 'MEDICO',
      nombre: 'Médico',
      descripcion: 'Acceso a historias clínicas, triage y módulos asistenciales',
      tipo: 'Médico',
      categoria: 'Asistencial',
      nivelAcceso: 'Medio',
      estado: 'activo',
      fechaCreacion: '2024-01-15',
      creadoPor: 'Sistema'
    },
    {
      id: '3',
      codigo: 'ENFERMERO',
      nombre: 'Enfermero',
      descripcion: 'Acceso a triage, asistencial y módulos de enfermería',
      tipo: 'Enfermero',
      categoria: 'Asistencial',
      nivelAcceso: 'Medio',
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
      // Actualizar perfil existente
      setPerfiles(prev => prev.map(perfil => 
        perfil.id === editingId 
          ? { ...perfil, ...formData, fechaModificacion: new Date().toISOString().split('T')[0] }
          : perfil
      ));
      toast({
        title: "Perfil actualizado",
        description: "El perfil se ha actualizado correctamente.",
      });
    } else {
      // Crear nuevo perfil
      const nuevoPerfil = {
        id: Date.now().toString(),
        ...formData,
        fechaCreacion: new Date().toISOString().split('T')[0],
        creadoPor: 'Usuario Actual'
      };
      setPerfiles(prev => [...prev, nuevoPerfil]);
      toast({
        title: "Perfil creado",
        description: "El perfil se ha creado correctamente.",
      });
    }
    
    resetForm();
  };

  const handleEdit = (perfil: any) => {
    setFormData(perfil);
    setIsEditing(true);
    setEditingId(perfil.id);
    setIsFormVisible(true);
  };

  const handleDelete = (id: string) => {
    setPerfiles(prev => prev.filter(perfil => perfil.id !== id));
    toast({
      title: "Perfil eliminado",
      description: "El perfil se ha eliminado correctamente.",
    });
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      tipo: '',
      categoria: '',
      nivelAcceso: '',
      permisos: {
        administracion: false,
        facturacion: false,
        historias: false,
        triage: false,
        asistencial: false,
        inventario: false,
        auditoria: false,
        laboratorio: false,
        reportes: false,
        configuracion: false
      },
      restricciones: {
        horarioAcceso: '',
        ipPermitidas: '',
        dispositivosPermitidos: ''
      },
      configuracion: {
        sesionTimeout: '',
        intentosLogin: '',
        requiereAutenticacionDoble: false,
        notificacionesEmail: false,
        notificacionesSMS: false
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
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Perfiles</h1>
            <p className="text-gray-600 mt-2">
              Administra los perfiles de usuario y sus permisos en el sistema
            </p>
          </div>
          <Button onClick={() => setIsFormVisible(true)}>
            Nuevo Perfil
          </Button>
        </div>

        {isFormVisible && (
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Editar Perfil' : 'Nuevo Perfil'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Modifica la información del perfil' : 'Crea un nuevo perfil de usuario'}
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
                      placeholder="Ej: ADMIN, MEDICO"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Perfil</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      placeholder="Ej: Administrador del Sistema"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Perfil</Label>
                    <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sistema">Sistema</SelectItem>
                        <SelectItem value="Médico">Médico</SelectItem>
                        <SelectItem value="Enfermero">Enfermero</SelectItem>
                        <SelectItem value="Recepción">Recepción</SelectItem>
                        <SelectItem value="Contabilidad">Contabilidad</SelectItem>
                        <SelectItem value="Personalizado">Personalizado</SelectItem>
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
                        <SelectItem value="Administrativo">Administrativo</SelectItem>
                        <SelectItem value="Asistencial">Asistencial</SelectItem>
                        <SelectItem value="Financiero">Financiero</SelectItem>
                        <SelectItem value="Técnico">Técnico</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nivelAcceso">Nivel de Acceso</Label>
                    <Select value={formData.nivelAcceso} onValueChange={(value) => handleInputChange('nivelAcceso', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alto">Alto</SelectItem>
                        <SelectItem value="Medio">Medio</SelectItem>
                        <SelectItem value="Bajo">Bajo</SelectItem>
                        <SelectItem value="Solo Lectura">Solo Lectura</SelectItem>
                      </SelectContent>
                    </Select>
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
                    placeholder="Describe las funciones y responsabilidades del perfil"
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Permisos del Sistema</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(formData.permisos).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => handleInputChange(`permisos.${key}`, checked)}
                        />
                        <Label htmlFor={key} className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Restricciones de Acceso</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="horarioAcceso">Horario de Acceso</Label>
                      <Input
                        id="horarioAcceso"
                        value={formData.restricciones.horarioAcceso}
                        onChange={(e) => handleInputChange('restricciones.horarioAcceso', e.target.value)}
                        placeholder="Ej: 08:00-18:00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ipPermitidas">IPs Permitidas</Label>
                      <Input
                        id="ipPermitidas"
                        value={formData.restricciones.ipPermitidas}
                        onChange={(e) => handleInputChange('restricciones.ipPermitidas', e.target.value)}
                        placeholder="Ej: 192.168.1.0/24"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dispositivosPermitidos">Dispositivos Permitidos</Label>
                      <Input
                        id="dispositivosPermitidos"
                        value={formData.restricciones.dispositivosPermitidos}
                        onChange={(e) => handleInputChange('restricciones.dispositivosPermitidos', e.target.value)}
                        placeholder="Ej: PC, Tablet, Móvil"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configuración de Seguridad</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sesionTimeout">Timeout de Sesión (minutos)</Label>
                      <Input
                        id="sesionTimeout"
                        type="number"
                        value={formData.configuracion.sesionTimeout}
                        onChange={(e) => handleInputChange('configuracion.sesionTimeout', e.target.value)}
                        placeholder="30"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="intentosLogin">Intentos de Login</Label>
                      <Input
                        id="intentosLogin"
                        type="number"
                        value={formData.configuracion.intentosLogin}
                        onChange={(e) => handleInputChange('configuracion.intentosLogin', e.target.value)}
                        placeholder="3"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autenticacionDoble"
                        checked={formData.configuracion.requiereAutenticacionDoble}
                        onCheckedChange={(checked) => handleInputChange('configuracion.requiereAutenticacionDoble', checked)}
                      />
                      <Label htmlFor="autenticacionDoble">Requiere Autenticación Doble</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notificacionesEmail"
                        checked={formData.configuracion.notificacionesEmail}
                        onCheckedChange={(checked) => handleInputChange('configuracion.notificacionesEmail', checked)}
                      />
                      <Label htmlFor="notificacionesEmail">Notificaciones por Email</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notificacionesSMS"
                        checked={formData.configuracion.notificacionesSMS}
                        onCheckedChange={(checked) => handleInputChange('configuracion.notificacionesSMS', checked)}
                      />
                      <Label htmlFor="notificacionesSMS">Notificaciones por SMS</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {isEditing ? 'Actualizar Perfil' : 'Crear Perfil'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Perfiles Existentes</CardTitle>
            <CardDescription>
              Lista de todos los perfiles configurados en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {perfiles.map((perfil) => (
                <div key={perfil.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-semibold">{perfil.nombre}</h3>
                        <p className="text-sm text-gray-600">{perfil.descripcion}</p>
                      </div>
                      <Badge variant={perfil.estado === 'activo' ? 'default' : 'secondary'}>
                        {perfil.estado}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Código: {perfil.codigo}</span>
                      <span>Tipo: {perfil.tipo}</span>
                      <span>Categoría: {perfil.categoria}</span>
                      <span>Nivel: {perfil.nivelAcceso}</span>
                      <span>Creado: {perfil.fechaCreacion}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(perfil)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(perfil.id)}>
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
