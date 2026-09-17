import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth.js'
import { dadosRouter } from './routes/dados.js'
import { pool } from './db.js'

const app = express()
const PORT = Number(process.env.PORT ?? 3333)

app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }))
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('select 1')
    res.json({ ok: true, db: 'conectado' })
  } catch {
    res.status(503).json({ ok: false, db: 'indisponível' })
  }
})

app.use('/api/auth', authRouter)
app.use('/api', dadosRouter)

app.use((_req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }))

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Erro não tratado:', err)
  res.status(500).json({ erro: 'Erro interno do servidor.' })
})

app.listen(PORT, () => {
  console.log(`🚀 API do INVESTTRACK rodando em http://localhost:${PORT}`)
})
