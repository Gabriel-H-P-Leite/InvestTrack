import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool } from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main() {
  const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf-8')
  await pool.query(sql)
  console.log('✅ Schema aplicado com sucesso.')
  await pool.end()
}

main().catch((err) => {
  console.error('❌ Erro ao aplicar schema:', err)
  process.exit(1)
})
