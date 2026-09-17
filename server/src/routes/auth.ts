import { Router } from 'express'
import { query, transaction } from '../db.js'
import { conferirSenha, gerarToken, hashSenha, requireAuth, type AuthRequest } from '../auth.js'
import { semearUsuario } from '../state.js'

export const authRouter = Router()

authRouter.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body ?? {}

  if (!nome?.trim() || !email?.trim() || !senha) {
    return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' })
  }
  if (String(senha).length < 8) {
    return res.status(400).json({ erro: 'A senha precisa ter pelo menos 8 caracteres.' })
  }

  const emailNormalizado = String(email).trim().toLowerCase()
  const existente = await query('select id from users where email = $1', [emailNormalizado])
  if (existente.length > 0) {
    return res.status(409).json({ erro: 'Já existe uma conta com este e-mail.' })
  }

  try {
    const userId = await transaction(async (client) => {
      const { rows } = await client.query(
        `insert into users (nome, email, senha_hash) values ($1, $2, $3) returning id`,
        [String(nome).trim(), emailNormalizado, await hashSenha(String(senha))]
      )
      const id = rows[0].id as string
      await semearUsuario(client, id)
      return id
    })

    const [user] = await query(
      `select id, nome, email, perfil_risco as "perfilRisco" from users where id = $1`,
      [userId]
    )
    return res.status(201).json({ token: gerarToken(userId), user })
  } catch (err) {
    console.error('Erro no cadastro:', err)
    return res.status(500).json({ erro: 'Não foi possível criar a conta.' })
  }
})

authRouter.post('/login', async (req, res) => {
  const { email, senha } = req.body ?? {}
  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha.' })
  }

  const [user] = await query<{ id: string; senha_hash: string; nome: string; email: string }>(
    'select id, nome, email, senha_hash from users where email = $1',
    [String(email).trim().toLowerCase()]
  )

  if (!user || !(await conferirSenha(String(senha), user.senha_hash))) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' })
  }

  return res.json({
    token: gerarToken(user.id),
    user: { id: user.id, nome: user.nome, email: user.email },
  })
})

authRouter.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const [user] = await query(
    `select id, nome, email, perfil_risco as "perfilRisco" from users where id = $1`,
    [req.userId]
  )
  if (!user) return res.status(404).json({ erro: 'Usuário não encontrado.' })
  return res.json({ user })
})
