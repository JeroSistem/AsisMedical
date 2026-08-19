const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');
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

async function createAdminUser() {
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

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@asismedicare.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Administrador';

  try {
    console.log('Conectando a MySQL/MariaDB...');
    const [rows] = await conn.query('SELECT id, email FROM users WHERE email = ?', [
      adminEmail,
    ]);
    if (rows.length > 0) {
      console.log('El usuario administrador ya existe:', rows[0].email);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await conn.query(
      `INSERT INTO users (id, name, email, password, role, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [randomUUID(), adminName, adminEmail, hashedPassword, 'SUPER_ADMIN', 'Active']
    );
    console.log('Usuario administrador creado');
    console.log('Email:', adminEmail);
    console.log('Contraseña:', adminPassword);
  } finally {
    await conn.end();
  }
}

createAdminUser().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
