
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, SubmitHandler } from 'react-hook-form';
import { addUser } from '@/lib/data';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';


type Inputs = Omit<User, 'id' | 'creationDate' | 'status'> & {
    confirmPassword?: string;
    consentTerms?: boolean;
    consentData?: boolean;
    consentVeracity?: boolean;
};


export default function UserCreationPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const router = useRouter();
    const { toast } = useToast();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const newUser: Omit<User, 'id'> = {
                name: `${data.name} ${data.apellidos}`,
                email: data.email,
                role: data.role,
                status: 'Active',
                creationDate: new Date().toISOString().split('T')[0],
                // Add other fields from your form that match the User type
                // For example:
                // tipoDocumento: data.tipoDocumento, 
                // numeroDocumento: data.numeroDocumento,
                // etc.
            };
            await addUser(newUser);
            toast({
                title: "Usuario Creado",
                description: "El nuevo usuario ha sido registrado exitosamente.",
            })
            router.push('/admin/usuarios');
        } catch (error) {
            console.error("Error creating user:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo crear el usuario.",
            })
        }
    };


  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Crear Nuevo Usuario</h2>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Datos Personales del Usuario</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres completos</Label>
                <Input id="nombres" {...register("name", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input id="apellidos" {...register("apellidos" as any, { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo-documento">Tipo de documento</Label>
                <Select>
                  <SelectTrigger id="tipo-documento">
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cc">CC</SelectItem>
                    <SelectItem value="ce">CE</SelectItem>
                    <SelectItem value="ti">TI</SelectItem>
                    <SelectItem value="pasaporte">Pasaporte</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero-documento">Número de documento</Label>
                <Input id="numero-documento" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha-nacimiento">Fecha de nacimiento</Label>
                <Input id="fecha-nacimiento" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                 <Select>
                  <SelectTrigger id="sexo">
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" {...register("email", { required: true })}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono móvil</Label>
                <Input id="telefono" type="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciudad-departamento">Ciudad / Departamento</Label>
                <Input id="ciudad-departamento" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="pais">País</Label>
                <Input id="pais" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Datos de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario (username)</Label>
                <Input id="username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="correo-recuperacion">Correo de recuperación (opcional)</Label>
                <Input id="correo-recuperacion" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" />
                 <p className="text-xs text-muted-foreground">Mínimo 8 caracteres, 1 número, 1 mayúscula, 1 símbolo.</p>
              </div>
               <div className="space-y-2">
                <Label htmlFor="confirmar-password">Confirmar contraseña</Label>
                <Input id="confirmar-password" type="password" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Rol en la Plataforma</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tipo-usuario">Tipo de usuario</Label>
                 <Select onValueChange={(value) => register("role").onChange({ target: { value } })}>
                  <SelectTrigger id="tipo-usuario">
                    <SelectValue placeholder="Seleccione un rol..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Médico">Médico</SelectItem>
                    <SelectItem value="Enfermero">Enfermero/a</SelectItem>
                    <SelectItem value="Paciente">Paciente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="id-centro-medico">ID del centro médico / IPS / Sede asignada</Label>
                <Input id="id-centro-medico" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento-area">Departamento / Área</Label>
                <Input id="departamento-area" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>4. Permisos y Accesos</CardTitle>
                <CardDescription>Estos permisos pueden depender del rol seleccionado.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2"><Checkbox id="perm-crear-hc" /><Label htmlFor="perm-crear-hc">Crear y editar historias clínicas</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="perm-ver-pacientes" /><Label htmlFor="perm-ver-pacientes">Ver solo sus pacientes</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="perm-acceso-total" /><Label htmlFor="perm-acceso-total">Acceso completo al sistema</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="perm-exportar" /><Label htmlFor="perm-exportar">Exportar información</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="perm-agendar" /><Label htmlFor="perm-agendar">Agendar citas</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="perm-reportes" /><Label htmlFor="perm-reportes">Generar reportes</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="perm-lab" /><Label htmlFor="perm-lab">Ver resultados de laboratorio</Label></div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>5. Consentimientos y Políticas</CardTitle>
            </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex items-start space-x-2">
                    <Checkbox id="consent-terminos" />
                    <Label htmlFor="consent-terminos" className="font-normal">Acepto los términos y condiciones de uso del sistema</Label>
                </div>
                <div className="flex items-start space-x-2">
                    <Checkbox id="consent-datos" />
                    <Label htmlFor="consent-datos" className="font-normal">Autorizo el tratamiento de mis datos personales según la ley</Label>
                </div>
                <div className="flex items-start space-x-2">
                    <Checkbox id="consent-veracidad" />
                    <Label htmlFor="consent-veracidad" className="font-normal">Confirmo que la información ingresada es verídica</Label>
                </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
                <CardTitle>6. Firma del Responsable del Registro</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="nombre-responsable">Nombre del responsable</Label>
                    <Input id="nombre-responsable" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cargo-responsable">Cargo</Label>
                    <Input id="cargo-responsable" />
                </div>
                <div className="space-y-2 col-span-full">
                    <Label>Firma</Label>
                     <div className="border bg-slate-100 rounded-md h-32">
                        {/* Signature Pad Component would go here */}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="fecha-creacion">Fecha de creación</Label>
                    <Input id="fecha-creacion" type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
                </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button size="lg" type="submit">Crear Usuario</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

    