#!/usr/bin/env node

/**
 * Script de prueba para verificar la configuración de autenticación
 * Ejecutar con: node scripts/test-auth.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de autenticación...\n');

// Verificar archivos necesarios
const requiredFiles = [
  'middleware.ts',
  'app/login/page.tsx',
  'lib/auth.ts',
  'app/api/auth/[...nextauth]/route.ts'
];

console.log('📁 Verificando archivos necesarios:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - NO ENCONTRADO`);
  }
});

// Verificar variables de entorno
console.log('\n🔧 Verificando variables de entorno:');
const envFile = '.env.local';
if (fs.existsSync(envFile)) {
  console.log(`  ✅ ${envFile} existe`);
  const envContent = fs.readFileSync(envFile, 'utf8');
  const requiredVars = ['NEXTAUTH_URL', 'NEXTAUTH_SECRET'];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`  ✅ ${varName} configurada`);
    } else {
      console.log(`  ⚠️  ${varName} no encontrada`);
    }
  });
} else {
  console.log(`  ❌ ${envFile} no existe - Crea este archivo con las variables necesarias`);
}

// Verificar dependencias
console.log('\n📦 Verificando dependencias:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['next-auth'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`  ✅ ${dep} instalada`);
    } else {
      console.log(`  ❌ ${dep} no instalada - Ejecuta: npm install ${dep}`);
    }
  });
} catch (error) {
  console.log('  ❌ No se pudo leer package.json');
}

console.log('\n🚀 Instrucciones para probar:');
console.log('1. Asegúrate de tener un archivo .env.local configurado');
console.log('2. Ejecuta: npm run dev');
console.log('3. Ve a http://localhost:3000');
console.log('4. Deberías ser redirigido automáticamente a /login');
console.log('5. Usa las credenciales de desarrollo: admin@hospital.com / admin123');
console.log('6. Después del login, deberías ir al dashboard');

console.log('\n✅ Verificación completada!');
