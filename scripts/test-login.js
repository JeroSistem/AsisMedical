// Script para probar el login y verificar que el usuario existe
// Uso: node scripts/test-login.js

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

async function testLogin() {
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
    
    const testEmail = 'admin@asismedicare.com';
    const testPassword = 'admin123';
    
    // Buscar el usuario
    console.log(`\n🔍 Buscando usuario: ${testEmail}`);
    const userResult = await pool.query(
      'SELECT id, email, password, role, name, status FROM users WHERE email = $1',
      [testEmail.toLowerCase()]
    );
    
    if (userResult.rows.length === 0) {
      console.log('❌ Usuario no encontrado en la base de datos');
      console.log('\n💡 Ejecuta: npm run db:create-admin');
      await pool.end();
      return;
    }
    
    const user = userResult.rows[0];
    console.log('✅ Usuario encontrado:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nombre: ${user.name}`);
    console.log(`   Rol: ${user.role}`);
    console.log(`   Estado: ${user.status}`);
    console.log(`   Tiene contraseña: ${user.password ? 'Sí' : 'No'}`);
    
    if (!user.password) {
      console.log('\n❌ El usuario no tiene contraseña configurada');
      await pool.end();
      return;
    }
    
    // Verificar contraseña
    console.log(`\n🔐 Verificando contraseña...`);
    const passwordMatch = await bcrypt.compare(testPassword, user.password);
    
    if (passwordMatch) {
      console.log('✅ Contraseña correcta');
      console.log('\n✅ El usuario puede iniciar sesión correctamente');
    } else {
      console.log('❌ Contraseña incorrecta');
      console.log('\n💡 La contraseña en la BD no coincide con "admin123"');
      console.log('💡 Puedes actualizar la contraseña ejecutando:');
      console.log('   npm run db:create-admin');
    }
    
    // Verificar estado
    if (user.status !== 'Active') {
      console.log(`\n⚠️  ADVERTENCIA: El usuario está en estado "${user.status}"`);
      console.log('💡 El usuario debe estar "Active" para poder iniciar sesión');
    }
    
    await pool.end();
  } catch (err) {
    await pool.end();
    console.error('❌ Error:', err.message);
    console.error('Detalle:', err.detail);
    process.exit(1);
  }
}

testLogin();
