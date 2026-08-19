const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match && !process.env[match[1].trim()]) {
        process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
      }
    });
  }
}

loadEnv();

async function testLogin() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida');
  }
  const url = new URL(connectionString);
  const conn = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port || '3306', 10),
    user: url.username,
    password: decodeURIComponent(url.password || ''),
    database: url.pathname.replace(/^\//, ''),
  });

  const testEmail = 'admin@asismedicare.com';
  const testPassword = 'admin123';

  try {
    console.log('Conectando a MySQL/MariaDB...');
    const [rows] = await conn.query(
      'SELECT id, email, password, role, name, status FROM users WHERE email = ?',
      [testEmail.toLowerCase()]
    );
    if (!rows.length) {
      console.log('Usuario no encontrado. Ejecuta: npm run db:seed');
      return;
    }
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(testPassword, user.password || '');
    console.log('Usuario:', user.email, user.role, user.status);
    console.log('Contraseña admin123:', passwordMatch ? 'OK' : 'NO coincide');
  } finally {
    await conn.end();
  }
}

testLogin().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
