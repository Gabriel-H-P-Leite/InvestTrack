import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

// Numeric do Postgres volta como string por padrão — converte para number.
pg.types.setTypeParser(1700, (v) => (v === null ? null : Number(v)))

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/investtrack',
})

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const res = await pool.query(text, params)
  return res.rows as T[]
}

export async function transaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('begin')
    const result = await fn(client)
    await client.query('commit')
    return result
  } catch (err) {
    await client.query('rollback')
    throw err
  } finally {
    client.release()
  }
}
