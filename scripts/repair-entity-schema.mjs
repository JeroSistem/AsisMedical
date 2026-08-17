import { config } from 'dotenv';
import { resolve } from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const execFileAsync = promisify(execFile);

config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local'), override: true });

const url = new URL(process.env.DATABASE_URL);
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: url.username,
    password: decodeURIComponent(url.password || ''),
    database: url.pathname.replace(/^\//, ''),
  }),
});

function buildUrl(databaseName) {
  return `mysql://${url.username}:${encodeURIComponent(decodeURIComponent(url.password || ''))}@${url.hostname}:${url.port || 3306}/${databaseName}`;
}

const entities = await prisma.entity.findMany({
  where: { databaseName: { not: null } },
});

for (const e of entities) {
  console.log('repair', e.name, e.databaseName);
  try {
    await execFileAsync(
      'npx',
      ['prisma', 'db', 'push', '--accept-data-loss'],
      {
        env: { ...process.env, DATABASE_URL: buildUrl(e.databaseName) },
        windowsHide: true,
      }
    );
    console.log(e.name, 'ok');
  } catch (err) {
    console.error(e.name, err.message);
  }
}

await prisma.$disconnect();
console.log('done');
