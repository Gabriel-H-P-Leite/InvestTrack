import type pg from 'pg'
import { query } from './db.js'
import { MODULOS, SEED, dataFutura } from './catalog.js'

/** Cria (ou recria) todos os dados de demonstração de um usuário. */
export async function semearUsuario(client: pg.PoolClient, userId: string) {
  // limpa o que já existir (usado também pelo "restaurar dados demonstrativos")
  await client.query('delete from transacoes where user_id = $1', [userId])
  await client.query('delete from ativos where user_id = $1', [userId])
  await client.query('delete from movimentacoes where user_id = $1', [userId])
  await client.query('delete from proventos where user_id = $1', [userId])
  await client.query('delete from metas where user_id = $1', [userId])
  await client.query('delete from notificacoes where user_id = $1', [userId])
  await client.query('delete from aulas_concluidas where user_id = $1', [userId])

  const c = SEED.conta
  await client.query(
    `insert into contas_financeiras (user_id, saldo, total_entradas, total_saidas, transferido_para_carteira, resgatado)
     values ($1, $2, $3, $4, $5, $6)
     on conflict (user_id) do update set
       saldo = excluded.saldo,
       total_entradas = excluded.total_entradas,
       total_saidas = excluded.total_saidas,
       transferido_para_carteira = excluded.transferido_para_carteira,
       resgatado = excluded.resgatado`,
    [userId, c.saldo, c.totalEntradas, c.totalSaidas, c.transferidoParaCarteira, c.resgatado]
  )

  const tickerParaId = new Map<string, string>()
  for (const a of SEED.ativos) {
    const { rows } = await client.query(
      `insert into ativos (user_id, ticker, nome, categoria, setor, quantidade, preco_medio, preco_atual)
       values ($1, $2, $3, $4, $5, $6, $7, $8) returning id`,
      [userId, a.ticker, a.nome, a.categoria, a.setor, a.quantidade, a.precoMedio, a.precoAtual]
    )
    tickerParaId.set(a.ticker, rows[0].id)
  }

  for (const t of SEED.transacoes) {
    await client.query(
      `insert into transacoes (user_id, ativo_id, ticker, tipo, quantidade, preco_unitario, taxas, data)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, tickerParaId.get(t.ticker) ?? null, t.ticker, t.tipo, t.quantidade, t.precoUnitario, t.taxas, t.data]
    )
  }

  for (const m of SEED.movimentacoes) {
    await client.query(
      `insert into movimentacoes (user_id, titulo, tipo, metodo, data, valor, status)
       values ($1, $2, $3, $4, $5, $6, 'Concluído')`,
      [userId, m.titulo, m.tipo, m.metodo, m.data, m.valor]
    )
  }

  for (const p of SEED.proventos) {
    await client.query(
      `insert into proventos (user_id, ticker, tipo, data, valor, yield_pct) values ($1, $2, $3, $4, $5, $6)`,
      [userId, p.ticker, p.tipo, p.data, p.valor, p.yieldPct]
    )
  }

  for (const m of SEED.metas) {
    await client.query(
      `insert into metas (user_id, emoji, titulo, descricao, valor_atual, valor_alvo, prazo, vinculo_automatico)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, m.emoji, m.titulo, m.descricao, m.valorAtual, m.valorAlvo, dataFutura(m.prazoDias), m.vinculo]
    )
  }

  for (const n of SEED.notificacoes) {
    const data = new Date()
    data.setDate(data.getDate() - n.diasAtras)
    await client.query(
      `insert into notificacoes (user_id, icone, titulo, mensagem, data, lida) values ($1, $2, $3, $4, $5, $6)`,
      [userId, n.icone, n.titulo, n.mensagem, data.toISOString(), n.diasAtras > 7]
    )
  }

  for (const aulaId of SEED.aulasConcluidas) {
    await client.query(
      `insert into aulas_concluidas (user_id, aula_id) values ($1, $2) on conflict do nothing`,
      [userId, aulaId]
    )
  }
}

/** Monta o estado completo do usuário no mesmo formato que o front espera. */
export async function carregarEstado(userId: string) {
  const [perfilRows, contaRows, ativos, transacoes, movimentacoes, proventos, metas, notificacoes, aulas] =
    await Promise.all([
      query(
        `select nome, email, perfil_risco as "perfilRisco", moeda, idioma, tema from users where id = $1`,
        [userId]
      ),
      query(
        `select saldo, total_entradas as "totalEntradas", total_saidas as "totalSaidas",
                transferido_para_carteira as "transferidoParaCarteira", resgatado
         from contas_financeiras where user_id = $1`,
        [userId]
      ),
      query(
        `select id, ticker, nome, categoria, setor, quantidade,
                preco_medio as "precoMedio", preco_atual as "precoAtual"
         from ativos where user_id = $1 order by criado_em asc`,
        [userId]
      ),
      query(
        `select id, coalesce(ativo_id::text, '') as "ativoId", ticker, tipo, quantidade,
                preco_unitario as "precoUnitario", taxas, to_char(data, 'YYYY-MM-DD') as data
         from transacoes where user_id = $1 order by data desc`,
        [userId]
      ),
      query(
        `select id, titulo, tipo, metodo, to_char(data, 'YYYY-MM-DD') as data, valor, status
         from movimentacoes where user_id = $1 order by data desc, criado_em desc`,
        [userId]
      ),
      query(
        `select id, ticker, tipo, to_char(data, 'YYYY-MM-DD') as data, valor, yield_pct as "yieldPct"
         from proventos where user_id = $1 order by data desc`,
        [userId]
      ),
      query(
        `select id, emoji, titulo, descricao, valor_atual as "valorAtual", valor_alvo as "valorAlvo",
                to_char(prazo, 'YYYY-MM-DD') as "prazoISO", vinculo_automatico as "vinculoAutomatico"
         from metas where user_id = $1 order by criado_em asc`,
        [userId]
      ),
      query(
        `select id, icone, titulo, mensagem, data as "dataISO", lida
         from notificacoes where user_id = $1 order by data desc`,
        [userId]
      ),
      query<{ aula_id: string }>(`select aula_id from aulas_concluidas where user_id = $1`, [userId]),
    ])

  const concluidas = new Set(aulas.map((a) => a.aula_id))

  return {
    perfil: perfilRows[0],
    contaFinanceira: contaRows[0] ?? {
      saldo: 0,
      totalEntradas: 0,
      totalSaidas: 0,
      transferidoParaCarteira: 0,
      resgatado: 0,
    },
    ativos,
    transacoes,
    movimentacoes,
    proventos,
    metas,
    notificacoes: notificacoes.map((n: any) => ({
      ...n,
      dataISO: new Date(n.dataISO).toISOString(),
    })),
    modulos: MODULOS.map((m) => ({
      ...m,
      aulas: m.aulas.map((a) => ({ ...a, concluida: concluidas.has(a.id) })),
    })),
  }
}
