"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save, Plus } from 'lucide-react';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  onSubmit?: (data: any) => void;
  submitText?: string;
  submitIcon?: React.ReactNode;
}

export function ModalForm({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitText = "Guardar",
  submitIcon = <Save className="h-4 w-4" />
}: ModalFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      setIsLoading(true);
      try {
        await onSubmit(new FormData(e.target as HTMLFormElement));
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {children}
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {submitIcon}
              {isLoading ? "Guardando..." : submitText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componentes de formulario específicos para diferentes submódulos
export function PatientForm({ isOpen, onClose, onSubmit, patient }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  patient?: any;
}) {
  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Paciente"
      subtitle="Complete la información del paciente"
      onSubmit={onSubmit}
      submitText="Crear Paciente"
      submitIcon={<Plus className="h-4 w-4" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre Completo</Label>
          <Input
            id="name"
            name="name"
            defaultValue={patient?.name || ""}
            placeholder="Ingrese el nombre completo"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dni">DNI</Label>
          <Input
            id="dni"
            name="dni"
            defaultValue={patient?.dni || ""}
            placeholder="Ingrese el DNI"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={patient?.email || ""}
            placeholder="Ingrese el email"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={patient?.phone || ""}
            placeholder="Ingrese el teléfono"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            defaultValue={patient?.birthDate || ""}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Género</Label>
          <Select name="gender" defaultValue={patient?.gender || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Masculino</SelectItem>
              <SelectItem value="female">Femenino</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Textarea
            id="address"
            name="address"
            defaultValue={patient?.address || ""}
            placeholder="Ingrese la dirección completa"
            rows={3}
          />
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={patient?.notes || ""}
            placeholder="Notas adicionales sobre el paciente"
            rows={3}
          />
        </div>
      </div>
    </ModalForm>
  );
}

export function TriageForm({ isOpen, onClose, onSubmit, triage }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  triage?: any;
}) {
  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Triage"
      subtitle="Complete la información del triage"
      onSubmit={onSubmit}
      submitText="Crear Triage"
      submitIcon={<Plus className="h-4 w-4" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patientId">Paciente</Label>
          <Select name="patientId" defaultValue={triage?.patientId || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el paciente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Juan Pérez</SelectItem>
              <SelectItem value="2">María García</SelectItem>
              <SelectItem value="3">Carlos López</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority">Prioridad</Label>
          <Select name="priority" defaultValue={triage?.priority || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione la prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="critical">Crítica</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="symptoms">Síntomas Principales</Label>
          <Input
            id="symptoms"
            name="symptoms"
            defaultValue={triage?.symptoms || ""}
            placeholder="Ingrese los síntomas principales"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vitalSigns">Signos Vitales</Label>
          <Input
            id="vitalSigns"
            name="vitalSigns"
            defaultValue={triage?.vitalSigns || ""}
            placeholder="Temperatura, presión, etc."
          />
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="observations">Observaciones</Label>
          <Textarea
            id="observations"
            name="observations"
            defaultValue={triage?.observations || ""}
            placeholder="Observaciones del triage"
            rows={4}
          />
        </div>
      </div>
    </ModalForm>
  );
}

export function UserForm({ isOpen, onClose, onSubmit, user }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  user?: any;
}) {
  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Usuario"
      subtitle="Complete la información del usuario"
      onSubmit={onSubmit}
      submitText="Crear Usuario"
      submitIcon={<Plus className="h-4 w-4" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre Completo</Label>
          <Input
            id="name"
            name="name"
            defaultValue={user?.name || ""}
            placeholder="Ingrese el nombre completo"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user?.email || ""}
            placeholder="Ingrese el email"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Rol</Label>
          <Select name="role" defaultValue={user?.role || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="nurse">Enfermero/a</SelectItem>
              <SelectItem value="receptionist">Recepcionista</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department">Departamento</Label>
          <Select name="department" defaultValue={user?.department || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emergency">Emergencias</SelectItem>
              <SelectItem value="pediatrics">Pediatría</SelectItem>
              <SelectItem value="surgery">Cirugía</SelectItem>
              <SelectItem value="internal">Medicina Interna</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Ingrese la contraseña"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirme la contraseña"
            required
          />
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={user?.notes || ""}
            placeholder="Notas adicionales sobre el usuario"
            rows={3}
          />
        </div>
      </div>
    </ModalForm>
  );
} 