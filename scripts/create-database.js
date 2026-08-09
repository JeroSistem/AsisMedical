// Script para crear la base de datos asis_medical
// Uso: node scripts/create-database.js

const { Pool } = require('pg');
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

async function createDatabase() {
  // Conectarse a la base de datos 'postgres' por defecto para crear la nueva
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:JR2026%40%40@localhost:5433/postgres';
  
  let poolConfig;
  try {
    const url = new URL(connectionString);
    const password = decodeURIComponent(url.password || '');
    
    poolConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 5433,
      database: 'postgres', // Conectarse a 'postgres' para crear la nueva base de datos
      user: url.username,
      password: password,
      connectionTimeoutMillis: 10000,
    };
  } catch (parseError) {
    poolConfig = {
      connectionString: connectionString.replace(/\/[^\/]+$/, '/postgres'), // Cambiar a 'postgres'
      connectionTimeoutMillis: 10000,
    };
  }

  const pool = new Pool(poolConfig);

  try {
    console.log('🔌 Conectando a PostgreSQL...');
    
    // Verificar si la base de datos ya existe
    const checkResult = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'asis_medical'"
    );
    
    if (checkResult.rows.length > 0) {
      console.log('✅ La base de datos "asis_medical" ya existe');
      await pool.end();
      return;
    }
    
    // Crear la base de datos
    console.log('📦 Creando base de datos "asis_medical"...');
    await pool.query('CREATE DATABASE asis_medical');
    
    console.log('✅ Base de datos "asis_medical" creada exitosamente');
    
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
    }
    process.exit(1);
  }
}

createDatabase();
