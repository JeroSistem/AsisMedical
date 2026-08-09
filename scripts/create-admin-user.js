// Script para crear un usuario administrador inicial
// Uso: node scripts/create-admin-user.js

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Cargar variables de entorno desde .env.local
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnv();

async function createAdminUser() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:JR2026%40%40@localhost:5433/asis_medical';
  
  let poolConfig;
  try {
    const url = new URL(connectionString);
    const password = decodeURIComponent(url.password || '');
    
    poolConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 5433,
      database: url.pathname.slice(1),
      user: url.username,
      password: password,
      connectionTimeoutMillis: 10000,
    };
  } catch (parseError) {
    poolConfig = {
      connectionString: connectionString,
      connectionTimeoutMillis: 10000,
    };
  }

  const pool = new Pool(poolConfig);

  try {
    console.log('🔌 Conectando a PostgreSQL...');
    
    // Datos del usuario administrador
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@asismedicare.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Administrador';
    
    // Verificar si el usuario ya existe
    const checkResult = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      [adminEmail]
    );
    
    if (checkResult.rows.length > 0) {
      console.log('✅ El usuario administrador ya existe:');
      console.log(`   Email: ${checkResult.rows[0].email}`);
      console.log(`   ID: ${checkResult.rows[0].id}`);
      console.log('\n💡 Si quieres cambiar la contraseña, elimina el usuario y vuelve a ejecutar este script.');
      await pool.end();
      return;
    }
    
    // Hashear la contraseña
    console.log('🔐 Hasheando contraseña...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Crear el usuario
    console.log('📦 Creando usuario administrador...');
    const result = await pool.query(
      `INSERT INTO users (id, name, email, password, role, status, created_at, updated_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, email, name, role`,
      [adminName, adminEmail, hashedPassword, 'SUPER_ADMIN', 'Active']
    );
    
    const user = result.rows[0];
    
    console.log('\n✅ Usuario administrador creado exitosamente:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nombre: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Rol: ${user.role}`);
    console.log(`\n📝 Credenciales de acceso:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Contraseña: ${adminPassword}`);
    console.log('\n⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro.');
    
    await pool.end();
  } catch (err) {
    await pool.end();
    console.error('❌ Error:', err.message);
    if (err.code === '28P01') {
      console.error('\n💡 Error de autenticación. Verifica las credenciales en .env.local');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('\n💡 No se puede conectar a PostgreSQL. Verifica que esté corriendo.');
    } else {
      console.error('\n💡 Código de error:', err.code);
      console.error('Detalle:', err.detail);
    }
    process.exit(1);
  }
}

createAdminUser();
