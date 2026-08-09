'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getNavigationByRole } from '@/lib/navigation';

export default function TestSubmenusPage() {
  const [selectedRole, setSelectedRole] = useState('Administrador');
  const navigation = getNavigationByRole(selectedRole);

  const roles = ['Administrador', 'Médico', 'Enfermero'];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">🧭 Prueba de Submenús</h1>
        <p className="text-muted-foreground">
          Demostración del sistema de navegación con submódulos jerárquicos
        </p>
      </div>

      {/* Selector de Rol */}
      <Card>
        <CardHeader>
          <CardTitle>👤 Seleccionar Rol</CardTitle>
          <CardDescription>
            Cambia el rol para ver diferentes módulos y submódulos disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {roles.map((role) => (
              <Button
                key={role}
                variant={selectedRole === role ? 'default' : 'outline'}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vista de Módulos */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grid">Vista de Tarjetas</TabsTrigger>
          <TabsTrigger value="list">Vista de Lista</TabsTrigger>
          <TabsTrigger value="tree">Vista de Árbol</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {navigation.map((module) => (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{module.icon}</span>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </div>
                    {module.children && module.children.length > 0 && (
                      <Badge variant="secondary">
                        {module.children.length} submódulos
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {module.children && module.children.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Submódulos disponibles:
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        {module.children.slice(0, 3).map((submodule) => (
                          <div
                            key={submodule.id}
                            className="flex items-center space-x-2 text-sm p-2 rounded bg-muted/50"
                          >
                            <span className="text-base">{submodule.icon}</span>
                            <span>{submodule.title}</span>
                          </div>
                        ))}
                        {module.children.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{module.children.length - 3} más...
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Sin submódulos disponibles
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-2">
            {navigation.map((module) => (
              <Card key={module.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{module.icon}</span>
                      <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {module.children && module.children.length > 0 && (
                        <Badge variant="outline">
                          {module.children.length}
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </div>
                  </div>
                  
                  {module.children && module.children.length > 0 && (
                    <div className="mt-4 pl-8 space-y-1">
                      {module.children.map((submodule) => (
                        <div
                          key={submodule.id}
                          className="flex items-center space-x-2 text-sm py-1"
                        >
                          <span className="text-base">{submodule.icon}</span>
                          <span>{submodule.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tree" className="space-y-4">
          <div className="space-y-2">
            {navigation.map((module) => (
              <div key={module.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">📁</span>
                  <span className="text-xl">{module.icon}</span>
                  <span className="font-semibold">{module.title}</span>
                  {module.children && module.children.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {module.children.length}
                    </Badge>
                  )}
                </div>
                
                {module.children && module.children.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {module.children.map((submodule) => (
                      <div
                        key={submodule.id}
                        className="flex items-center space-x-2 text-sm py-1"
                      >
                        <span className="text-base">📄</span>
                        <span className="text-base">{submodule.icon}</span>
                        <span>{submodule.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {navigation.length}
              </div>
              <div className="text-sm text-muted-foreground">Módulos Totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {navigation.reduce((acc, module) => acc + (module.children?.length || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Submódulos Totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {selectedRole}
              </div>
              <div className="text-sm text-muted-foreground">Rol Seleccionado</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
