# Build en GitHub Actions (RAM suficiente). Render solo ejecuta la imagen.
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
ENV DATABASE_URL="mysql://build:build@127.0.0.1:3306/build"
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_FORCE_SPANISH=true
ENV NEXT_PUBLIC_DEFAULT_LOCALE=es
ENV NEXT_PUBLIC_AVAILABLE_LOCALES=es
# Placeholder para prisma generate en build (no conecta en generate)
ENV DATABASE_URL="mysql://build:build@127.0.0.1:3306/build"
RUN npx prisma generate && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache libc6-compat openssl \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
# Prisma / mysql2 suelen quedar fuera del trace standalone
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/mysql2 ./node_modules/mysql2
COPY --from=builder /app/node_modules/mariadb ./node_modules/mariadb
COPY --from=builder /app/node_modules/@prisma/adapter-mariadb ./node_modules/@prisma/adapter-mariadb
COPY --from=builder /app/node_modules/@prisma/driver-adapter-utils ./node_modules/@prisma/driver-adapter-utils

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
