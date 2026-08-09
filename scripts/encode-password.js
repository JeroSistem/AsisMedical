// Script para codificar contraseñas para DATABASE_URL
// Uso: node scripts/encode-password.js "tu contraseña aquí"

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Debes proporcionar una contraseña');
  console.log('\nUso: node scripts/encode-password.js "tu contraseña"');
  console.log('\nEjemplo:');
  console.log('  node scripts/encode-password.js "JR2026@@"');
  process.exit(1);
}

const encoded = encodeURIComponent(password);
console.log('\n✅ Contraseña codificada:');
console.log(encoded);
console.log('\n📝 Úsala en tu DATABASE_URL así:');
console.log(`DATABASE_URL=postgresql://postgres:${encoded}@localhost:5432/asis_medical\n`);
