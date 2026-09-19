const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const designPath = path.join(__dirname, '../exported_projects/AFTERGLOW___Chill___Social_Club_9e0ada04.json');
const data = JSON.parse(fs.readFileSync(designPath, 'utf8'));

const userIds = [
  'b1b8c15a74094f2ca6a6c12904010093', // vanssh.parikh@dekodeglobal.com
  '71a2e6f25e0d4e9cb9607c9284cf52d8', // parikharyan30@gmail.com
  'f8fa57ef26584539a37f8005bb613e02', // dev.dekodeglobal@gmail.com
  '852528125e86437eadca63e1af65c56d', // vansshparikhofficial@gmail.com
  'eb754bc19e744f3f8ee1327751fadfa5', // vansshparikhone@gmail.com
  'bfca91620686471cbb80dc043980f720', // vanssh.ug20@nsut.ac.in
];

let parsedConfig = data.config;
while (typeof parsedConfig === 'string') {
  try {
    parsedConfig = JSON.parse(parsedConfig);
  } catch {
    break;
  }
}

let parsedElements = data.elements;
while (typeof parsedElements === 'string') {
  try {
    parsedElements = JSON.parse(parsedElements);
  } catch {
    break;
  }
}

const name = (data.name || 'AFTERGLOW — Chill & Social Club').replace(/'/g, "''");
const configStr = JSON.stringify(parsedConfig).replace(/'/g, "''");
const elementsStr = JSON.stringify(parsedElements).replace(/'/g, "''");

let sqlStatements = [];

userIds.forEach((uid) => {
  const designId = 'afterglow_' + uid.slice(0, 8);
  sqlStatements.push(`INSERT OR REPLACE INTO designs (id, user_id, project_id, name, config, elements, created_at, updated_at) VALUES ('${designId}', '${uid}', NULL, '${name}', '${configStr}', '${elementsStr}', datetime('now'), datetime('now'));`);
});

const fullSql = sqlStatements.join('\n');
const sqlFilePath = path.join(__dirname, '../sync_afterglow.sql');
fs.writeFileSync(sqlFilePath, fullSql);
console.log('Written sync_afterglow.sql');

console.log('--- Executing on LOCAL D1 ---');
try {
  execSync('npx wrangler d1 execute DB --local --file=sync_afterglow.sql', { stdio: 'inherit' });
  console.log('Local D1 updated successfully!');
} catch (e) {
  console.error('Local D1 error:', e.message);
}

console.log('--- Executing on REMOTE D1 ---');
try {
  execSync('npx wrangler d1 execute DB --remote -y --file=sync_afterglow.sql', { stdio: 'inherit' });
  console.log('Remote D1 updated successfully!');
} catch (e) {
  console.error('Remote D1 error:', e.message);
}
