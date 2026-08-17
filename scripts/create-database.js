const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

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

async function createDatabase() {
  const connectionString =
    process.env.DATABASE_URL ||
    'mysql://asis:asis_mysql_dev@127.0.0.1:3307/asis_medical';
  const url = new URL(connectionString);
  const dbName = url.pathname.replace(/^\//, '') || 'asis_medical';

  const conn = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port || '3306', 10),
    user: url.username,
    password: decodeURIComponent(url.password || ''),
  });

  try {
    console.log('Conectando a MySQL/MariaDB...');
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`Base de datos "${dbName}" lista`);
  } finally {
    await conn.end();
  }
}

createDatabase().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
