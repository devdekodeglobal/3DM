const fs = require('fs');

const replacements = [
  ['kreatekaro.co', 'krafc.com'],
  ['Kreate Karo', 'Krafc'],
  ['kreatekaro —', 'Krafc —'],
  ['kreatekaro |', 'Krafc |'],
  ['>kreatekaro<', '>Krafc<'],
  ['kreatekaro ', 'Krafc '],
  [' kreatekaro', ' Krafc'],
  ['KreateKaro', 'Krafc'],
  ['kreatekaro', 'Krafc'] // fallback for other matches except for internal IDs where possible, but actually we can just replace all text occurrences.
];

const files = [
  'index.html',
  'src/components/AnimatedHeaderLogo.tsx',
  'src/components/InteriorDesignLogo.tsx',
  'src/components/Footer.tsx',
  'src/components/CookieConsent.tsx',
  'src/routes/about.tsx',
  'src/routes/privacy.tsx',
  'src/routes/terms.tsx',
  'src/routes/cookie-policy.tsx',
  'src/routes/index.tsx',
  'src/routes/editor.tsx',
  'src/routes/sys-control-889.tsx',
  'functions/_auth-utils.ts',
  'README.md',
  'pitch.txt'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');
  
  // We want to avoid replacing "kreatekaro-db" and "kreatekaro_assets_db"
  // So let's temporarily mask them
  content = content.replace(/kreatekaro-db/g, '__DB_MASK__');
  content = content.replace(/kreatekaro_assets_db/g, '__DB_ASSETS_MASK__');
  content = content.replace(/kreatekaro-analytics/g, '__ANALYTICS_MASK__');
  content = content.replace(/kreatekaro:cookie/g, '__COOKIE_MASK__:cookie');
  content = content.replace(/kreatekaro:open/g, '__COOKIE_MASK2__:open');
  
  content = content.replace(/Kreate Karo/g, 'Krafc');
  content = content.replace(/KreateKaro/g, 'Krafc');
  content = content.replace(/kreatekaro\.co/g, 'krafc.com');
  content = content.replace(/kreatekaro/g, 'Krafc');
  content = content.replace(/Krafc's/g, "Krafc's");

  // Unmask
  content = content.replace(/__DB_MASK__/g, 'kreatekaro-db');
  content = content.replace(/__DB_ASSETS_MASK__/g, 'kreatekaro_assets_db');
  content = content.replace(/__ANALYTICS_MASK__/g, 'kreatekaro-analytics');
  content = content.replace(/__COOKIE_MASK__/g, 'kreatekaro');
  content = content.replace(/__COOKIE_MASK2__/g, 'kreatekaro');
  
  fs.writeFileSync(f, content, 'utf-8');
});

console.log('Renaming complete.');
