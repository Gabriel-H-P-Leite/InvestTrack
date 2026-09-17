// Catálogo estático da Academia (a definição das aulas é igual para todos os
// usuários; só o progresso — quais aulas foram concluídas — fica no banco).
export const MODULOS = [
  {
    id: 'mod1',
    emoji: '📚',
    titulo: 'Fundamentos',
    descricao: 'Base do conhecimento financeiro',
    aulas: [
      { id: 'a1', titulo: 'O que são investimentos?', duracaoMin: 8 },
      { id: 'a2', titulo: 'Juros compostos', duracaoMin: 12 },
      { id: 'a3', titulo: 'Inflação e poder de compra', duracaoMin: 10 },
      { id: 'a4', titulo: 'CDI e Selic', duracaoMin: 8 },
      { id: 'a5', titulo: 'Risco e retorno', duracaoMin: 15 },
    ],
  },
  {
    id: 'mod2',
    emoji: '🏦',
    titulo: 'Renda Fixa',
    descricao: 'Investimentos com retorno previsível',
    aulas: [
      { id: 'b1', titulo: 'Tesouro Direto', duracaoMin: 15 },
      { id: 'b2', titulo: 'CDB — O que é e como funciona', duracaoMin: 10 },
      { id: 'b3', titulo: 'LCI e LCA', duracaoMin: 10 },
      { id: 'b4', titulo: 'Debêntures', duracaoMin: 12 },
      { id: 'b5', titulo: 'Prefixados e pós-fixados', duracaoMin: 10 },
    ],
  },
  {
    id: 'mod3',
    emoji: '📈',
    titulo: 'Renda Variável',
    descricao: 'Ações, FIIs e muito mais',
    aulas: [
      { id: 'c1', titulo: 'O que são ações?', duracaoMin: 12 },
      { id: 'c2', titulo: 'Fundos Imobiliários (FIIs)', duracaoMin: 15 },
      { id: 'c3', titulo: 'ETFs — Fundos de índice', duracaoMin: 10 },
      { id: 'c4', titulo: 'Dividendos e proventos', duracaoMin: 12 },
      { id: 'c5', titulo: 'Análise fundamentalista', duracaoMin: 20 },
    ],
  },
  {
    id: 'mod4',
    emoji: '⚖️',
    titulo: 'Gestão de Carteira',
    descricao: 'Como montar e gerenciar sua carteira',
    aulas: [
      { id: 'd1', titulo: 'Diversificação', duracaoMin: 12 },
      { id: 'd2', titulo: 'Alocação de ativos', duracaoMin: 15 },
      { id: 'd3', titulo: 'Gestão de risco', duracaoMin: 12 },
      { id: 'd4', titulo: 'Rebalanceamento', duracaoMin: 10 },
      { id: 'd5', titulo: 'Perfil de investidor', duracaoMin: 8 },
    ],
  },
]

export const AULAS_VALIDAS = new Set(MODULOS.flatMap((m) => m.aulas.map((a) => a.id)))

function diasAtras(dias: number): string {
  const d = new Date()
  d.setDate(d.getDate() - dias)
  return d.toISOString().slice(0, 10)
}

// Dados iniciais ("Modo Demonstração") criados para cada nova conta.
export const SEED = {
  conta: {
    saldo: 12450,
    totalEntradas: 20000,
    totalSaidas: 7550,
    transferidoParaCarteira: 10000,
    resgatado: 0,
  },
  ativos: [
    { ticker: 'PETR4', nome: 'Petrobras PN', categoria: 'Ações', setor: 'Petróleo e Gás', quantidade: 200, precoMedio: 32.5, precoAtual: 36.8 },
    { ticker: 'MXRF11', nome: 'Maxi Renda FII', categoria: 'FIIs', setor: 'Fundos Imobiliários', quantidade: 300, precoMedio: 9.8, precoAtual: 10.25 },
    { ticker: 'BOVA11', nome: 'iShares Ibovespa ETF', categoria: 'ETFs', setor: 'ETF', quantidade: 50, precoMedio: 118, precoAtual: 124.5 },
    { ticker: 'TESOURO-SELIC', nome: 'Tesouro Selic 2027', categoria: 'Tesouro Direto', setor: 'Renda Fixa', quantidade: 1, precoMedio: 12000, precoAtual: 13250 },
    { ticker: 'CDB-INTER', nome: 'CDB Inter 110% CDI', categoria: 'CDB', setor: 'Renda Fixa', quantidade: 1, precoMedio: 10000, precoAtual: 10850 },
    { ticker: 'VALE3', nome: 'Vale ON', categoria: 'Ações', setor: 'Mineração', quantidade: 150, precoMedio: 61, precoAtual: 58.4 },
    { ticker: 'HGLG11', nome: 'CSHG Logística FII', categoria: 'FIIs', setor: 'Fundos Imobiliários', quantidade: 100, precoMedio: 155, precoAtual: 162.3 },
    { ticker: 'BTC', nome: 'Bitcoin', categoria: 'Cripto', setor: 'Criptomoedas', quantidade: 0.05, precoMedio: 280000, precoAtual: 295000 },
  ],
  transacoes: [
    { ticker: 'PETR4', tipo: 'Compra', quantidade: 100, precoUnitario: 32.5, taxas: 5, data: diasAtras(6) },
    { ticker: 'MXRF11', tipo: 'Compra', quantidade: 200, precoUnitario: 9.8, taxas: 2, data: diasAtras(11) },
    { ticker: 'BOVA11', tipo: 'Compra', quantidade: 30, precoUnitario: 118, taxas: 5, data: diasAtras(19) },
    { ticker: 'VALE3', tipo: 'Compra', quantidade: 150, precoUnitario: 61, taxas: 8, data: diasAtras(27) },
    { ticker: 'TESOURO-SELIC', tipo: 'Aporte', quantidade: 1, precoUnitario: 12000, taxas: 0, data: diasAtras(32) },
    { ticker: 'PETR4', tipo: 'Compra', quantidade: 100, precoUnitario: 32.5, taxas: 5, data: diasAtras(37) },
    { ticker: 'CDB-INTER', tipo: 'Aporte', quantidade: 1, precoUnitario: 10000, taxas: 0, data: diasAtras(46) },
    { ticker: 'HGLG11', tipo: 'Compra', quantidade: 50, precoUnitario: 155, taxas: 6.5, data: diasAtras(53) },
    { ticker: 'MXRF11', tipo: 'Dividendo', quantidade: 200, precoUnitario: 0.9, taxas: 0, data: diasAtras(68) },
    { ticker: 'HGLG11', tipo: 'Compra', quantidade: 50, precoUnitario: 155, taxas: 6.5, data: diasAtras(73) },
  ],
  movimentacoes: [
    { titulo: 'Depósito — Salário', tipo: 'Depósito', metodo: 'PIX', valor: 5000, data: diasAtras(0) },
    { titulo: 'Transferência para investimentos', tipo: 'Transferência para Invest.', metodo: null, valor: -2000, data: diasAtras(1) },
    { titulo: 'Depósito — Freelance', tipo: 'Depósito', metodo: 'TED', valor: 3000, data: diasAtras(2) },
    { titulo: 'Saque — Despesas pessoais', tipo: 'Saque', metodo: 'PIX', valor: -500, data: diasAtras(4) },
    { titulo: 'Dividendos — MXRF11', tipo: 'Dividendo', metodo: null, valor: 320, data: diasAtras(6) },
    { titulo: 'Transferência para investimentos', tipo: 'Transferência para Invest.', metodo: null, valor: -3000, data: diasAtras(11) },
    { titulo: 'Depósito — Salário', tipo: 'Depósito', metodo: 'TED', valor: 7000, data: diasAtras(15) },
    { titulo: 'Saque — Aluguel', tipo: 'Saque', metodo: 'PIX', valor: -2000, data: diasAtras(17) },
    { titulo: 'Resgate de investimentos — Tesouro Selic', tipo: 'Resgate de Invest.', metodo: null, valor: 1000, data: diasAtras(22) },
    { titulo: 'Depósito — Bônus', tipo: 'Depósito', metodo: 'PIX', valor: 5000, data: diasAtras(27) },
  ],
  proventos: [
    { ticker: 'MXRF11', tipo: 'Rendimento', valor: 320, yieldPct: 0.8, data: diasAtras(6) },
    { ticker: 'HGLG11', tipo: 'Rendimento', valor: 410, yieldPct: 0.65, data: diasAtras(6) },
    { ticker: 'PETR4', tipo: 'Dividendo', valor: 215, yieldPct: 1.2, data: diasAtras(17) },
    { ticker: 'VALE3', tipo: 'JCP', valor: 185, yieldPct: 0.9, data: diasAtras(32) },
    { ticker: 'MXRF11', tipo: 'Rendimento', valor: 310, yieldPct: 0.78, data: diasAtras(37) },
    { ticker: 'HGLG11', tipo: 'Rendimento', valor: 405, yieldPct: 0.63, data: diasAtras(37) },
    { ticker: 'PETR4', tipo: 'Dividendo', valor: 195, yieldPct: 1.1, data: diasAtras(48) },
    { ticker: 'MXRF11', tipo: 'Rendimento', valor: 305, yieldPct: 0.76, data: diasAtras(68) },
  ],
  metas: [
    { emoji: '🛡️', titulo: 'Reserva de Emergência', descricao: '6 meses de despesas', valorAtual: 13250, valorAlvo: 30000, prazoDias: 106, vinculo: null },
    { emoji: '🏆', titulo: 'Primeiro Milhão', descricao: 'Patrimônio acumulado de R$ 1 milhão', valorAtual: 0, valorAlvo: 1000000, prazoDias: 3393, vinculo: 'patrimonio' },
    { emoji: '💸', titulo: 'Renda Passiva', descricao: 'Patrimônio para gerar R$ 3.000/mês', valorAtual: 0, valorAlvo: 500000, prazoDias: 2298, vinculo: 'patrimonio' },
  ],
  notificacoes: [
    { icone: 'gift', titulo: 'Dividendo recebido', mensagem: 'MXRF11 creditou R$ 320,00 em proventos.', diasAtras: 6 },
    { icone: 'deposito', titulo: 'Depósito confirmado', mensagem: 'Depósito de R$ 5.000,00 confirmado com sucesso.', diasAtras: 0 },
    { icone: 'meta', titulo: 'Meta em progresso', mensagem: 'Sua reserva de emergência está 44% concluída. Continue aportando!', diasAtras: 8 },
    { icone: 'carteira', titulo: 'Carteira atualizada', mensagem: 'VALE3 recuou 4,26%. Verifique sua posição.', diasAtras: 9 },
  ],
  aulasConcluidas: ['a1', 'a2'],
}

export function dataFutura(dias: number): string {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}

export function dataPassadaISO(dias: number): string {
  const d = new Date()
  d.setDate(d.getDate() - dias)
  return d.toISOString()
}
