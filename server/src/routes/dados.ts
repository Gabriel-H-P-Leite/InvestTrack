import { Router } from 'express'
import { query, transaction } from '../db.js'
import { requireAuth, type AuthRequest } from '../auth.js'
import { carregarEstado, semearUsuario } from '../state.js'
import { AULAS_VALIDAS } from '../catalog.js'

export const dadosRouter = Router()
dadosRouter.use(requireAuth)

const hoje = () => new Date().toISOString().slice(0, 10)

function valorPositivo(v: unknown): number | null {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : null
}

/** Estado completo do usuário — o front chama isso depois de cada alteração. */
dadosRouter.get('/state', async (req: AuthRequest, res) => {
  res.json(await carregarEstado(req.userId!))
})

/* ---------------------------- Conta financeira ---------------------------- */

dadosRouter.post('/conta/deposito', async (req: AuthRequest, res) => {
  const valor = valorPositivo(req.body?.valor)
  const metodo = String(req.body?.metodo ?? 'PIX')
  if (!valor) return res.status(400).json({ erro: 'Valor inválido.' })

  await transaction(async (client) => {
    await client.query(
      `update contas_financeiras set saldo = saldo + $2, total_entradas = total_entradas + $2 where user_id = $1`,
      [req.userId, valor]
    )
    await client.query(
      `insert into movimentacoes (user_id, titulo, tipo, metodo, data, valor) values ($1, $2, 'Depósito', $3, $4, $5)`,
      [req.userId, `Depósito — ${metodo}`, metodo, hoje(), valor]
    )
  })
  res.json(await carregarEstado(req.userId!))
})

dadosRouter.post('/conta/saque', async (req: AuthRequest, res) => {
  const valor = valorPositivo(req.body?.valor)
  const metodo = String(req.body?.metodo ?? 'PIX')
  if (!valor) return res.status(400).json({ erro: 'Valor inválido.' })

  const [conta] = await query<{ saldo: number }>(
    'select saldo from contas_financeiras where user_id = $1',
    [req.userId]
  )
  if (!conta || conta.saldo < valor) {
    return res.status(400).json({ erro: 'Saldo insuficiente.' })
  }

  await transaction(async (client) => {
    await client.query(
      `update contas_financeiras set saldo = saldo - $2, total_saidas = total_saidas + $2 where user_id = $1`,
      [req.userId, valor]
    )
    await client.query(
      `insert into movimentacoes (user_id, titulo, tipo, metodo, data, valor) values ($1, $2, 'Saque', $3, $4, $5)`,
      [req.userId, `Saque — ${metodo}`, metodo, hoje(), -valor]
    )
  })
  res.json(await carregarEstado(req.userId!))
})

dadosRouter.post('/conta/transferir', async (req: AuthRequest, res) => {
  const valor = valorPositivo(req.body?.valor)
  if (!valor) return res.status(400).json({ erro: 'Valor inválido.' })

  const [conta] = await query<{ saldo: number }>(
    'select saldo from contas_financeiras where user_id = $1',
    [req.userId]
  )
  if (!conta || conta.saldo < valor) {
    return res.status(400).json({ erro: 'Saldo insuficiente.' })
  }

  await transaction(async (client) => {
    await client.query(
      `update contas_financeiras
       set saldo = saldo - $2, transferido_para_carteira = transferido_para_carteira + $2
       where user_id = $1`,
      [req.userId, valor]
    )
    await client.query(
      `insert into movimentacoes (user_id, titulo, tipo, data, valor)
       values ($1, 'Transferência para investimentos', 'Transferência para Invest.', $2, $3)`,
      [req.userId, hoje(), -valor]
    )
  })
  res.json(await carregarEstado(req.userId!))
})

dadosRouter.post('/conta/resgatar', async (req: AuthRequest, res) => {
  const valor = valorPositivo(req.body?.valor)
  if (!valor) return res.status(400).json({ erro: 'Valor inválido.' })

  await transaction(async (client) => {
    await client.query(
      `update contas_financeiras set saldo = saldo + $2, resgatado = resgatado + $2 where user_id = $1`,
      [req.userId, valor]
    )
    await client.query(
      `insert into movimentacoes (user_id, titulo, tipo, data, valor)
       values ($1, 'Resgate de investimentos', 'Resgate de Invest.', $2, $3)`,
      [req.userId, hoje(), valor]
    )
  })
  res.json(await carregarEstado(req.userId!))
})

/* --------------------------------- Ativos --------------------------------- */

dadosRouter.post('/ativos', async (req: AuthRequest, res) => {
  const { ticker, nome, categoria, setor, quantidade, precoMedio, precoAtual } = req.body ?? {}
  const qtd = valorPositivo(quantidade)
  const pm = valorPositivo(precoMedio)
  if (!ticker?.trim() || !nome?.trim() || !qtd || !pm) {
    return res.status(400).json({ erro: 'Preencha ticker, nome, quantidade e preço médio.' })
  }

  await query(
    `insert into ativos (user_id, ticker, nome, categoria, setor, quantidade, preco_medio, preco_atual)
     values ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      req.userId,
      String(ticker).toUpperCase(),
      nome,
      categoria ?? 'Ações',
      setor || categoria || 'Outros',
      qtd,
      pm,
      valorPositivo(precoAtual) ?? pm,
    ]
  )
  res.status(201).json(await carregarEstado(req.userId!))
})

/* ------------------------------- Transações ------------------------------- */

dadosRouter.post('/transacoes', async (req: AuthRequest, res) => {
  const { ativoId, tipo, quantidade, precoUnitario, taxas, data } = req.body ?? {}
  const qtd = valorPositivo(quantidade)
  const preco = valorPositivo(precoUnitario)
  const taxasNum = Math.max(0, Number(taxas) || 0)

  if (!ativoId || !qtd || !preco) {
    return res.status(400).json({ erro: 'Informe ativo, quantidade e preço unitário.' })
  }

  const [ativo] = await query<{ id: string; ticker: string; quantidade: number; precoMedio: number }>(
    `select id, ticker, quantidade, preco_medio as "precoMedio" from ativos where id = $1 and user_id = $2`,
    [ativoId, req.userId]
  )
  if (!ativo) return res.status(404).json({ erro: 'Ativo não encontrado.' })

  const total = qtd * preco
  const dataOperacao = data || hoje()

  await transaction(async (client) => {
    if (tipo === 'Compra' || tipo === 'Aporte') {
      const novaQtd = Number(ativo.quantidade) + qtd
      const novoPrecoMedio =
        (Number(ativo.quantidade) * Number(ativo.precoMedio) + qtd * preco) / (novaQtd || 1)
      await client.query('update ativos set quantidade = $2, preco_medio = $3 where id = $1', [
        ativo.id,
        novaQtd,
        novoPrecoMedio,
      ])
      await client.query(
        'update contas_financeiras set saldo = saldo - $2 where user_id = $1',
        [req.userId, total + taxasNum]
      )
    } else if (tipo === 'Venda' || tipo === 'Resgate') {
      await client.query('update ativos set quantidade = greatest(0, quantidade - $2) where id = $1', [
        ativo.id,
        qtd,
      ])
      await client.query('update contas_financeiras set saldo = saldo + $2 where user_id = $1', [
        req.userId,
        total - taxasNum,
      ])
    } else if (tipo === 'Dividendo') {
      const base = Number(ativo.quantidade) * Number(ativo.precoMedio)
      await client.query(
        `insert into proventos (user_id, ticker, tipo, data, valor, yield_pct) values ($1, $2, 'Dividendo', $3, $4, $5)`,
        [req.userId, ativo.ticker, dataOperacao, total, base > 0 ? Number(((total / base) * 100).toFixed(2)) : 0]
      )
      await client.query('update contas_financeiras set saldo = saldo + $2 where user_id = $1', [
        req.userId,
        total,
      ])
    }

    await client.query(
      `insert into transacoes (user_id, ativo_id, ticker, tipo, quantidade, preco_unitario, taxas, data)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [req.userId, ativo.id, ativo.ticker, tipo, qtd, preco, taxasNum, dataOperacao]
    )
  })

  res.status(201).json(await carregarEstado(req.userId!))
})

/* --------------------------------- Metas ---------------------------------- */

dadosRouter.post('/metas', async (req: AuthRequest, res) => {
  const { emoji, titulo, descricao, valorAlvo, prazoISO, valorAtual } = req.body ?? {}
  const alvo = valorPositivo(valorAlvo)
  if (!titulo?.trim() || !alvo || !prazoISO) {
    return res.status(400).json({ erro: 'Informe título, valor alvo e prazo.' })
  }

  await query(
    `insert into metas (user_id, emoji, titulo, descricao, valor_atual, valor_alvo, prazo, vinculo_automatico)
     values ($1, $2, $3, $4, $5, $6, $7, null)`,
    [req.userId, emoji || '🎯', titulo, descricao || titulo, Math.max(0, Number(valorAtual) || 0), alvo, prazoISO]
  )
  res.status(201).json(await carregarEstado(req.userId!))
})

dadosRouter.post('/metas/:id/aporte', async (req: AuthRequest, res) => {
  const valor = valorPositivo(req.body?.valor)
  if (!valor) return res.status(400).json({ erro: 'Valor inválido.' })

  const [meta] = await query('select id from metas where id = $1 and user_id = $2', [
    req.params.id,
    req.userId,
  ])
  if (!meta) return res.status(404).json({ erro: 'Meta não encontrada.' })

  await transaction(async (client) => {
    await client.query('update metas set valor_atual = valor_atual + $2 where id = $1', [
      req.params.id,
      valor,
    ])
    await client.query('update contas_financeiras set saldo = saldo - $2 where user_id = $1', [
      req.userId,
      valor,
    ])
  })
  res.json(await carregarEstado(req.userId!))
})

/* ------------------------------ Notificações ------------------------------ */

dadosRouter.patch('/notificacoes/:id/lida', async (req: AuthRequest, res) => {
  await query('update notificacoes set lida = true where id = $1 and user_id = $2', [
    req.params.id,
    req.userId,
  ])
  res.json(await carregarEstado(req.userId!))
})

dadosRouter.post('/notificacoes/ler-todas', async (req: AuthRequest, res) => {
  await query('update notificacoes set lida = true where user_id = $1', [req.userId])
  res.json(await carregarEstado(req.userId!))
})

/* -------------------------------- Academia -------------------------------- */

dadosRouter.post('/academia/aulas/:aulaId/toggle', async (req: AuthRequest, res) => {
  const { aulaId } = req.params
  if (!AULAS_VALIDAS.has(aulaId)) {
    return res.status(404).json({ erro: 'Aula não encontrada.' })
  }

  const existente = await query(
    'select 1 from aulas_concluidas where user_id = $1 and aula_id = $2',
    [req.userId, aulaId]
  )
  if (existente.length > 0) {
    await query('delete from aulas_concluidas where user_id = $1 and aula_id = $2', [req.userId, aulaId])
  } else {
    await query('insert into aulas_concluidas (user_id, aula_id) values ($1, $2)', [req.userId, aulaId])
  }
  res.json(await carregarEstado(req.userId!))
})

/* --------------------------------- Perfil --------------------------------- */

dadosRouter.patch('/perfil', async (req: AuthRequest, res) => {
  const { nome, email, perfilRisco, moeda, idioma, tema } = req.body ?? {}

  if (email) {
    const emailNormalizado = String(email).trim().toLowerCase()
    const duplicado = await query('select id from users where email = $1 and id <> $2', [
      emailNormalizado,
      req.userId,
    ])
    if (duplicado.length > 0) {
      return res.status(409).json({ erro: 'Este e-mail já está em uso.' })
    }
  }

  await query(
    `update users set
       nome = coalesce($2, nome),
       email = coalesce($3, email),
       perfil_risco = coalesce($4, perfil_risco),
       moeda = coalesce($5, moeda),
       idioma = coalesce($6, idioma),
       tema = coalesce($7, tema)
     where id = $1`,
    [
      req.userId,
      nome ?? null,
      email ? String(email).trim().toLowerCase() : null,
      perfilRisco ?? null,
      moeda ?? null,
      idioma ?? null,
      tema ?? null,
    ]
  )
  res.json(await carregarEstado(req.userId!))
})

/* ------------------------- Restaurar dados de demo ------------------------ */

dadosRouter.post('/demo/restaurar', async (req: AuthRequest, res) => {
  await transaction(async (client) => {
    await semearUsuario(client, req.userId!)
  })
  res.json(await carregarEstado(req.userId!))
})
