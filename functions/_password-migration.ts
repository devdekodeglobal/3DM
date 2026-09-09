import { upgradeLegacyHash } from './_password'
export async function backfillPasswords(db: D1Database, batchSize = 25) {
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 100) throw new Error('Invalid batch size')
  const { results } = await db.prepare("SELECT id,password_hash FROM users WHERE length(password_hash)=44 AND password_hash NOT LIKE 'pbkdf2-%' LIMIT ?")
    .bind(batchSize).all<{id:string;password_hash:string}>()
  let upgraded=0
  for (const row of results) {
    const hash=await upgradeLegacyHash(row.password_hash)
    const result=await db.prepare('UPDATE users SET password_hash=? WHERE id=? AND password_hash=?').bind(hash,row.id,row.password_hash).run()
    upgraded+=result.meta.changes
  }
  return { scanned:results.length, upgraded }
}
