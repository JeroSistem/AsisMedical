const { config } = require('dotenv');
const { resolve } = require('path');
const mysql = require('mysql2/promise');

config({ path: resolve('.env') });
config({ path: resolve('.env.local'), override: true });

async function main() {
  const u = new URL(process.env.DATABASE_URL);
  const conn = await mysql.createConnection({
    host: u.hostname,
    port: Number(u.port) || 3306,
    user: u.username,
    password: decodeURIComponent(u.password || ''),
    database: u.pathname.replace(/^\//, ''),
  });

  const [cols] = await conn.query(
    `SELECT COLUMN_NAME AS column_name
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'patients'
     ORDER BY ORDINAL_POSITION`
  );
  console.log(
    'COLUMNS:',
    cols.map((r) => r.column_name).join(', ')
  );

  const [count] = await conn.query('SELECT COUNT(*) AS c FROM patients');
  console.log('PATIENTS_COUNT:', count[0].c);
  await conn.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
