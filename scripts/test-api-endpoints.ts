import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:9002/api/configuracion';

async function testAPIEndpoints() {
  try {
    console.log('🧪 Probando endpoints de la API...');
    
    // Test 1: Obtener entidades
    console.log('\n📋 Test 1: Obtener entidades');
    const entitiesResponse = await fetch(`${BASE_URL}/entities`);
    const entitiesData = await entitiesResponse.json();
    console.log('Status:', entitiesResponse.status);
    console.log('Success:', entitiesData.success);
    console.log('Entidades encontradas:', entitiesData.data?.length || 0);
    
    // Test 2: Obtener usuarios
    console.log('\n👥 Test 2: Obtener usuarios');
    const usersResponse = await fetch(`${BASE_URL}/users`);
    const usersData = await usersResponse.json();
    console.log('Status:', usersResponse.status);
    console.log('Success:', usersData.success);
    console.log('Usuarios encontrados:', usersData.data?.length || 0);
    
    // Test 3: Obtener módulos
    console.log('\n📦 Test 3: Obtener módulos');
    const modulesResponse = await fetch(`${BASE_URL}/modules`);
    const modulesData = await modulesResponse.json();
    console.log('Status:', modulesResponse.status);
    console.log('Success:', modulesData.success);
    console.log('Módulos encontrados:', modulesData.data?.length || 0);
    
    // Test 4: Crear entidad (si el servidor está corriendo)
    console.log('\n🏥 Test 4: Crear entidad');
    const createEntityData = {
      name: 'Clínica de Prueba API',
      type: 'CLINICA',
      status: 'ACTIVE',
      adminUser: 'Dr. María García',
      adminEmail: 'maria.garcia@clinicaprueba.com',
      adminPassword: 'admin123',
      modules: ['Historias Clínicas', 'Triage']
    };
    
    try {
      const createResponse = await fetch(`${BASE_URL}/entities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createEntityData)
      });
      
      const createData = await createResponse.json();
      console.log('Status:', createResponse.status);
      console.log('Success:', createData.success);
      if (createData.success) {
        console.log('✅ Entidad creada via API');
      } else {
        console.log('❌ Error:', createData.error);
      }
    } catch (error) {
      console.log('❌ Error al crear entidad (servidor no disponible):', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
}

testAPIEndpoints();
