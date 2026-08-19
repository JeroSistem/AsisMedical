const password = process.argv[2];

if (!password) {
  console.error('Debes proporcionar una contraseña');
  console.log('\nUso: node scripts/encode-password.js "tu contraseña"');
  process.exit(1);
}

const encoded = encodeURIComponent(password);
console.log('\nContraseña codificada:');
console.log(encoded);
console.log('\nÚsala en tu DATABASE_URL así:');
console.log(
  `DATABASE_URL=mysql://asis:${encoded}@127.0.0.1:3307/asis_medical\n`
);
