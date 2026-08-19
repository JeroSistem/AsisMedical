#!/usr/bin/env bash
# Script opcional de build para Render (más verbose en logs)
set -euo pipefail
echo "==> Node $(node -v) / npm $(npm -v)"
echo "==> Installing deps"
npm install
echo "==> Prisma generate"
npx prisma generate
echo "==> Next build"
npm run build
echo "==> Build OK"
