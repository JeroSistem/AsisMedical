import { testDatabaseConnection, getPatients, getUsers } from '@/lib/data';

export default async function TestDBPage() {
  const isConnected = await testDatabaseConnection();
  const patients = await getPatients();
  const users = await getUsers();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Prueba de Base de Datos PostgreSQL</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Estado de Conexión</h2>
          <p className={isConnected ? "text-green-600" : "text-red-600"}>
            {isConnected ? "✅ Conectado a PostgreSQL" : "❌ Error de conexión"}
          </p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Pacientes ({patients.length})</h2>
          <div className="space-y-2">
            {patients.map(patient => (
              <div key={patient.id} className="p-2 bg-gray-50 rounded">
                <p><strong>Nombre:</strong> {patient.name}</p>
                <p><strong>Fecha de Nacimiento:</strong> {patient.dateOfBirth}</p>
                <p><strong>Género:</strong> {patient.gender}</p>
                <p><strong>Contacto:</strong> {patient.contact}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Usuarios ({users.length})</h2>
          <div className="space-y-2">
            {users.map(user => (
              <div key={user.id} className="p-2 bg-gray-50 rounded">
                <p><strong>Nombre:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rol:</strong> {user.role}</p>
                <p><strong>Estado:</strong> {user.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 