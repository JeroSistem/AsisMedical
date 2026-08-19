import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local'), override: true });

const url = new URL(process.env.DATABASE_URL);
const p = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: url.username,
    password: decodeURIComponent(url.password || ''),
    database: url.pathname.replace(/^\//, ''),
  }),
});

try {
  const entities = await p.entity.findMany({
    select: { id: true, name: true, adminUserId: true },
  });
  console.log('entities', JSON.stringify(entities, null, 2));

  for (const e of entities) {
    const em = await p.entityModule.findMany({
      where: { entityId: e.id },
      include: { module: { select: { name: true } } },
    });
    console.log(
      e.name,
      'modules:',
      em.map((x) => ({ name: x.module.name, enabled: x.enabled }))
    );
    if (e.adminUserId) {
      const u = await p.user.findUnique({
        where: { id: e.adminUserId },
        select: {
          email: true,
          username: true,
          role: true,
          entityId: true,
          status: true,
        },
      });
      console.log('admin', u);
    }
  }
} finally {
  await p.$disconnect();
}
