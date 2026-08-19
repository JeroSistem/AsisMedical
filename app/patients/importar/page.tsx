'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/shared/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Download, 
  FileText, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  FileSpreadsheet,
  FileCsv
} from 'lucide-react';

export default function ImportarPacientesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [importSettings, setImportSettings] = useState({
    // Configuración del archivo
    fileType: 'csv',
    hasHeaders: true,
    delimiter: ',',
    encoding: 'utf-8',
    
    // Configuración de mapeo
    skipFirstRow: false,
    validateData: true,
    createMissingFields: false,
    updateExisting: false,
    
    // Configuración de notificaciones
    notifyOnComplete: true,
    notifyEmail: '',
    sendReport: true,
    
    // Configuración de errores
    stopOnError: false,
    maxErrors: '10',
    logErrors: true
  });

  // Estado para el archivo seleccionado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<{[key: string]: string}>({});
  const [importResults, setImportResults] = useState<{
    total: number;
    imported: number;
    errors: number;
    skipped: number;
    errorsList: string[];
  } | null>(null);

  // Columnas disponibles para mapeo
  const availableColumns = [
    'identification_number',
    'identification_type',
    'first_name',
    'last_name',
    'birth_date',
    'gender',
    'email',
    'phone',
    'address',
    'city',
    'state',
    'country',
    'blood_type',
    'allergies',
    'emergency_contact_name',
    'emergency_contact_phone',
    'insurance_provider',
    'insurance_number',
    'occupation',
    'marital_status'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setImportSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simular preview de datos
      setPreviewData([
        {
          'Número de Identificación': '12345678',
          'Tipo de Identificación': 'CC',
          'Nombres': 'Juan Carlos',
          'Apellidos': 'García López',
          'Fecha de Nacimiento': '1985-03-15',
          'Género': 'Masculino',
          'Email': 'juan.garcia@email.com',
          'Teléfono': '3001234567',
          'Dirección': 'Calle 123 # 45-67',
          'Ciudad': 'Bogotá'
        },
        {
          'Número de Identificación': '87654321',
          'Tipo de Identificación': 'CC',
          'Nombres': 'María Elena',
          'Apellidos': 'Rodríguez Silva',
          'Fecha de Nacimiento': '1990-07-22',
          'Género': 'Femenino',
          'Email': 'maria.rodriguez@email.com',
          'Teléfono': '3109876543',
          'Dirección': 'Carrera 78 # 12-34',
          'Ciudad': 'Medellín'
        }
      ]);
    }
  };

  const handleColumnMapping = (fileColumn: string, systemColumn: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [fileColumn]: systemColumn
    }));
  };

  const handlePreview = () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo primero.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Vista previa generada",
      description: "Se ha generado la vista previa de los datos.",
    });
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo primero.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    try {
      // Simular proceso de importación
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Simular resultados
      setImportResults({
        total: 150,
        imported: 142,
        errors: 5,
        skipped: 3,
        errorsList: [
          "Fila 23: Email inválido",
          "Fila 45: Fecha de nacimiento inválida",
          "Fila 67: Número de identificación duplicado",
          "Fila 89: Teléfono inválido",
          "Fila 112: Dirección requerida"
        ]
      });

      toast({
        title: "Importación completada",
        description: "Se han importado 142 de 150 pacientes exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error durante la importación.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Simular descarga de plantilla
    toast({
      title: "Plantilla descargada",
      description: "Se ha descargado la plantilla de importación.",
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setColumnMapping({});
    setImportResults(null);
    setImportProgress(0);
    
    toast({
      title: "Formulario restablecido",
      description: "Todos los campos se han restablecido.",
    });
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            <Upload className="mr-2 h-8 w-8 text-blue-600" />
            Importar Pacientes
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de configuración */}
          <div className="lg:col-span-1 space-y-6">
            {/* Configuración del archivo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Configuración del Archivo
                </CardTitle>
                <CardDescription>
                  Configura los parámetros de importación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-type">Tipo de Archivo</Label>
                  <Select
                    value={importSettings.fileType}
                    onValueChange={(value) => handleInputChange('fileType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="excel-old">Excel (.xls)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delimiter">Delimitador (CSV)</Label>
                  <Select
                    value={importSettings.delimiter}
                    onValueChange={(value) => handleInputChange('delimiter', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=",">Coma (,)</SelectItem>
                      <SelectItem value=";">Punto y coma (;)</SelectItem>
                      <SelectItem value="\t">Tab</SelectItem>
                      <SelectItem value="|">Pipe (|)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="encoding">Codificación</Label>
                  <Select
                    value={importSettings.encoding}
                    onValueChange={(value) => handleInputChange('encoding', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utf-8">UTF-8</SelectItem>
                      <SelectItem value="latin1">Latin-1</SelectItem>
                      <SelectItem value="iso-8859-1">ISO-8859-1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={importSettings.hasHeaders}
                    onCheckedChange={(checked) => handleInputChange('hasHeaders', checked)}
                  />
                  <Label>El archivo tiene encabezados</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={importSettings.skipFirstRow}
                    onCheckedChange={(checked) => handleInputChange('skipFirstRow', checked)}
                  />
                  <Label>Saltar primera fila</Label>
                </div>
              </CardContent>
            </Card>

            {/* Configuración de validación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Configuración de Validación
                </CardTitle>
                <CardDescription>
                  Configura las opciones de validación de datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={importSettings.validateData}
                    onCheckedChange={(checked) => handleInputChange('validateData', checked)}
                  />
                  <Label>Validar datos antes de importar</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={importSettings.createMissingFields}
                    onCheckedChange={(checked) => handleInputChange('createMissingFields', checked)}
                  />
                  <Label>Crear campos faltantes</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={importSettings.updateExisting}
                    onCheckedChange={(checked) => handleInputChange('updateExisting', checked)}
                  />
                  <Label>Actualizar registros existentes</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-errors">Máximo de errores permitidos</Label>
                  <Input
                    id="max-errors"
                    type="number"
                    value={importSettings.maxErrors}
                    onChange={(e) => handleInputChange('maxErrors', e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={importSettings.stopOnError}
                    onCheckedChange={(checked) => handleInputChange('stopOnError', checked)}
                  />
                  <Label>Detener en el primer error</Label>
                </div>
              </CardContent>
            </Card>

            {/* Configuración de notificaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Notificaciones
                </CardTitle>
                <CardDescription>
                  Configura las notificaciones de importación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={importSettings.notifyOnComplete}
                    onCheckedChange={(checked) => handleInputChange('notifyOnComplete', checked)}
                  />
                  <Label>Notificar al completar</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={importSettings.sendReport}
                    onCheckedChange={(checked) => handleInputChange('sendReport', checked)}
                  />
                  <Label>Enviar reporte por email</Label>
                </div>

                {importSettings.sendReport && (
                  <div className="space-y-2">
                    <Label htmlFor="notify-email">Email para notificaciones</Label>
                    <Input
                      id="notify-email"
                      type="email"
                      value={importSettings.notifyEmail}
                      onChange={(e) => handleInputChange('notifyEmail', e.target.value)}
                      placeholder="admin@asismedicare.com"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selección de archivo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileSpreadsheet className="mr-2 h-5 w-5" />
                  Seleccionar Archivo
                </CardTitle>
                <CardDescription>
                  Sube el archivo CSV o Excel con los datos de los pacientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500 font-medium">
                        Haz clic para seleccionar un archivo
                      </span>
                      <span className="text-gray-500"> o arrastra y suelta</span>
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    CSV, Excel (.xlsx, .xls) hasta 10MB
                  </p>
                </div>

                {selectedFile && (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">{selectedFile.name}</p>
                        <p className="text-sm text-green-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    onClick={handleDownloadTemplate}
                    variant="outline"
                    className="flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Plantilla
                  </Button>
                  <Button
                    onClick={handlePreview}
                    disabled={!selectedFile}
                    className="flex items-center"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Vista Previa
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mapeo de columnas */}
            {previewData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Mapeo de Columnas
                  </CardTitle>
                  <CardDescription>
                    Mapea las columnas del archivo con los campos del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(previewData[0] || {}).map((fileColumn) => (
                      <div key={fileColumn} className="space-y-2">
                        <Label className="text-sm font-medium">{fileColumn}</Label>
                        <Select
                          value={columnMapping[fileColumn] || ''}
                          onValueChange={(value) => handleColumnMapping(fileColumn, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar campo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-- Ignorar columna --</SelectItem>
                            {availableColumns.map((systemColumn) => (
                              <SelectItem key={systemColumn} value={systemColumn}>
                                {systemColumn.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vista previa de datos */}
            {previewData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="mr-2 h-5 w-5" />
                    Vista Previa de Datos
                  </CardTitle>
                  <CardDescription>
                    Muestra las primeras filas del archivo seleccionado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          {Object.keys(previewData[0] || {}).map((column) => (
                            <th key={column} className="text-left p-2 font-medium">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className="p-2">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progreso de importación */}
            {isImporting && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="mr-2 h-5 w-5" />
                    Importando Pacientes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={importProgress} className="w-full" />
                  <p className="text-sm text-gray-600">
                    Progreso: {importProgress}% completado
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Resultados de importación */}
            {importResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Resultados de la Importación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{importResults.total}</p>
                      <p className="text-sm text-blue-600">Total</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{importResults.imported}</p>
                      <p className="text-sm text-green-600">Importados</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{importResults.errors}</p>
                      <p className="text-sm text-red-600">Errores</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{importResults.skipped}</p>
                      <p className="text-sm text-yellow-600">Omitidos</p>
                    </div>
                  </div>

                  {importResults.errorsList.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Errores encontrados:</Label>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {importResults.errorsList.map((error, index) => (
                          <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={isImporting}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Restablecer
              </Button>
              <Button
                onClick={handleImport}
                disabled={!selectedFile || isImporting}
                className="flex items-center"
              >
                {isImporting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Iniciar Importación
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
