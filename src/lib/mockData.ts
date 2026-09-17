import type {
  Ativo,
  ContaFinanceira,
  Meta,
  Modulo,
  Movimentacao,
  Notificacao,
  Perfil,
  Provento,
  Transacao,
} from '@/types'

export const seedPerfil: Perfil = {
  nome: 'João Silva',
  email: 'joao.silva@email.com',
  perfilRisco: 'Moderado',
  moeda: 'BRL — Real Brasileiro',
  idioma: 'Português (Brasil)',
  tema: 'Escuro',
}

export const seedContaFinanceira: ContaFinanceira = {
  saldo: 12450,
  totalEntradas: 20000,
  totalSaidas: 7550,
  transferidoParaCarteira: 10000,
  resgatado: 0,
}

export const seedAtivos: Ativo[] = [
  {
    id: 'petr4',
    ticker: 'PETR4',
    nome: 'Petrobras PN',
    categoria: 'Ações',
    quantidade: 200,
    precoMedio: 32.5,
    precoAtual: 36.8,
    setor: 'Petróleo e Gás',
  },
  {
    id: 'mxrf11',
    ticker: 'MXRF11',
    nome: 'Maxi Renda FII',
    categoria: 'FIIs',
    quantidade: 300,
    precoMedio: 9.8,
    precoAtual: 10.25,
    setor: 'Fundos Imobiliários',
  },
  {
    id: 'bova11',
    ticker: 'BOVA11',
    nome: 'iShares Ibovespa ETF',
    categoria: 'ETFs',
    quantidade: 50,
    precoMedio: 118.0,
    precoAtual: 124.5,
    setor: 'ETF',
  },
  {
    id: 'tesouro-selic',
    ticker: 'TESOURO-SELIC',
    nome: 'Tesouro Selic 2027',
    categoria: 'Tesouro Direto',
    quantidade: 1,
    precoMedio: 12000,
    precoAtual: 13250,
    setor: 'Renda Fixa',
  },
  {
    id: 'cdb-inter',
    ticker: 'CDB-INTER',
    nome: 'CDB Inter 110% CDI',
    categoria: 'CDB',
    quantidade: 1,
    precoMedio: 10000,
    precoAtual: 10850,
    setor: 'Renda Fixa',
  },
  {
    id: 'vale3',
    ticker: 'VALE3',
    nome: 'Vale ON',
    categoria: 'Ações',
    quantidade: 150,
    precoMedio: 61.0,
    precoAtual: 58.4,
    setor: 'Mineração',
  },
  {
    id: 'hglg11',
    ticker: 'HGLG11',
    nome: 'CSHG Logística FII',
    categoria: 'FIIs',
    quantidade: 100,
    precoMedio: 155.0,
    precoAtual: 162.3,
    setor: 'Fundos Imobiliários',
  },
  {
    id: 'btc',
    ticker: 'BTC',
    nome: 'Bitcoin',
    categoria: 'Cripto',
    quantidade: 0.05,
    precoMedio: 280000,
    precoAtual: 295000,
    setor: 'Criptomoedas',
  },
]

export const seedTransacoes: Transacao[] = [
  { id: 't1', ativoId: 'petr4', ticker: 'PETR4', tipo: 'Compra', quantidade: 100, precoUnitario: 32.5, taxas: 5, data: '2026-09-10' },
  { id: 't2', ativoId: 'mxrf11', ticker: 'MXRF11', tipo: 'Compra', quantidade: 200, precoUnitario: 9.8, taxas: 2, data: '2026-09-05' },
  { id: 't3', ativoId: 'bova11', ticker: 'BOVA11', tipo: 'Compra', quantidade: 30, precoUnitario: 118, taxas: 5, data: '2026-08-28' },
  { id: 't4', ativoId: 'vale3', ticker: 'VALE3', tipo: 'Compra', quantidade: 150, precoUnitario: 61, taxas: 8, data: '2026-08-20' },
  { id: 't5', ativoId: 'tesouro-selic', ticker: 'TESOURO-SELIC', tipo: 'Aporte', quantidade: 1, precoUnitario: 12000, taxas: 0, data: '2026-08-15' },
  { id: 't6', ativoId: 'petr4', ticker: 'PETR4', tipo: 'Compra', quantidade: 100, precoUnitario: 32.5, taxas: 5, data: '2026-08-10' },
  { id: 't7', ativoId: 'cdb-inter', ticker: 'CDB-INTER', tipo: 'Aporte', quantidade: 1, precoUnitario: 10000, taxas: 0, data: '2026-08-01' },
  { id: 't8', ativoId: 'hglg11', ticker: 'HGLG11', tipo: 'Compra', quantidade: 50, precoUnitario: 155, taxas: 6.5, data: '2026-07-25' },
  { id: 't9', ativoId: 'mxrf11', ticker: 'MXRF11', tipo: 'Dividendo', quantidade: 200, precoUnitario: 0.9, taxas: 0, data: '2026-07-10' },
  { id: 't10', ativoId: 'hglg11', ticker: 'HGLG11', tipo: 'Compra', quantidade: 50, precoUnitario: 155, taxas: 6.5, data: '2026-07-05' },
]

export const seedMovimentacoes: Movimentacao[] = [
  { id: 'm1', titulo: 'Depósito — Salário', tipo: 'Depósito', metodo: 'PIX', data: '2026-09-16', valor: 5000, status: 'Concluído' },
  { id: 'm2', titulo: 'Transferência para investimentos', tipo: 'Transferência para Invest.', data: '2026-09-15', valor: -2000, status: 'Concluído' },
  { id: 'm3', titulo: 'Depósito — Freelance', tipo: 'Depósito', metodo: 'TED', data: '2026-09-14', valor: 3000, status: 'Concluído' },
  { id: 'm4', titulo: 'Saque — Despesas pessoais', tipo: 'Saque', metodo: 'PIX', data: '2026-09-12', valor: -500, status: 'Concluído' },
  { id: 'm5', titulo: 'Dividendos — MXRF11', tipo: 'Dividendo', data: '2026-09-10', valor: 320, status: 'Concluído' },
  { id: 'm6', titulo: 'Transferência para investimentos', tipo: 'Transferência para Invest.', data: '2026-09-05', valor: -3000, status: 'Concluído' },
  { id: 'm7', titulo: 'Depósito — Salário', tipo: 'Depósito', metodo: 'TED', data: '2026-09-01', valor: 7000, status: 'Concluído' },
  { id: 'm8', titulo: 'Saque — Aluguel', tipo: 'Saque', metodo: 'PIX', data: '2026-08-30', valor: -2000, status: 'Concluído' },
  { id: 'm9', titulo: 'Resgate de investimentos — Tesouro Selic', tipo: 'Resgate de Invest.', data: '2026-08-25', valor: 1000, status: 'Concluído' },
  { id: 'm10', titulo: 'Depósito — Bônus', tipo: 'Depósito', metodo: 'PIX', data: '2026-08-20', valor: 5000, status: 'Concluído' },
]

export const seedProventos: Provento[] = [
  { id: 'p1', ticker: 'MXRF11', tipo: 'Rendimento', data: '2026-09-10', valor: 320, yieldPct: 0.8 },
  { id: 'p2', ticker: 'HGLG11', tipo: 'Rendimento', data: '2026-09-10', valor: 410, yieldPct: 0.65 },
  { id: 'p3', ticker: 'PETR4', tipo: 'Dividendo', data: '2026-08-30', valor: 215, yieldPct: 1.2 },
  { id: 'p4', ticker: 'VALE3', tipo: 'JCP', data: '2026-08-15', valor: 185, yieldPct: 0.9 },
  { id: 'p5', ticker: 'MXRF11', tipo: 'Rendimento', data: '2026-08-10', valor: 310, yieldPct: 0.78 },
  { id: 'p6', ticker: 'HGLG11', tipo: 'Rendimento', data: '2026-08-10', valor: 405, yieldPct: 0.63 },
  { id: 'p7', ticker: 'PETR4', tipo: 'Dividendo', data: '2026-07-30', valor: 195, yieldPct: 1.1 },
  { id: 'p8', ticker: 'MXRF11', tipo: 'Rendimento', data: '2026-07-10', valor: 305, yieldPct: 0.76 },
]

export const seedMetas: Meta[] = [
  {
    id: 'g1',
    emoji: '🛡️',
    titulo: 'Reserva de Emergência',
    descricao: '6 meses de despesas',
    valorAtual: 13250,
    valorAlvo: 30000,
    prazoISO: '2026-12-31',
    vinculoAutomatico: null,
  },
  {
    id: 'g2',
    emoji: '🏆',
    titulo: 'Primeiro Milhão',
    descricao: 'Patrimônio acumulado de R$ 1 milhão',
    valorAtual: 92950,
    valorAlvo: 1000000,
    prazoISO: '2035-12-31',
    vinculoAutomatico: 'patrimonio',
  },
  {
    id: 'g3',
    emoji: '💸',
    titulo: 'Renda Passiva',
    descricao: 'Patrimônio para gerar R$ 3.000/mês',
    valorAtual: 92950,
    valorAlvo: 500000,
    prazoISO: '2032-12-31',
    vinculoAutomatico: 'patrimonio',
  },
]

export const seedModulos: Modulo[] = [
  {
    id: 'mod1',
    emoji: '📚',
    titulo: 'Fundamentos',
    descricao: 'Base do conhecimento financeiro',
    aulas: [
      { id: 'a1', titulo: 'O que são investimentos?', duracaoMin: 8, concluida: true },
      { id: 'a2', titulo: 'Juros compostos', duracaoMin: 12, concluida: true },
      { id: 'a3', titulo: 'Inflação e poder de compra', duracaoMin: 10, concluida: false },
      { id: 'a4', titulo: 'CDI e Selic', duracaoMin: 8, concluida: false },
      { id: 'a5', titulo: 'Risco e retorno', duracaoMin: 15, concluida: false },
    ],
  },
  {
    id: 'mod2',
    emoji: '🏦',
    titulo: 'Renda Fixa',
    descricao: 'Investimentos com retorno previsível',
    aulas: [
      { id: 'b1', titulo: 'Tesouro Direto', duracaoMin: 15, concluida: false },
      { id: 'b2', titulo: 'CDB — O que é e como funciona', duracaoMin: 10, concluida: false },
      { id: 'b3', titulo: 'LCI e LCA', duracaoMin: 10, concluida: false },
      { id: 'b4', titulo: 'Debêntures', duracaoMin: 12, concluida: false },
      { id: 'b5', titulo: 'Prefixados e pós-fixados', duracaoMin: 10, concluida: false },
    ],
  },
  {
    id: 'mod3',
    emoji: '📈',
    titulo: 'Renda Variável',
    descricao: 'Ações, FIIs e muito mais',
    aulas: [
      { id: 'c1', titulo: 'O que são ações?', duracaoMin: 12, concluida: false },
      { id: 'c2', titulo: 'Fundos Imobiliários (FIIs)', duracaoMin: 15, concluida: false },
      { id: 'c3', titulo: 'ETFs — Fundos de índice', duracaoMin: 10, concluida: false },
      { id: 'c4', titulo: 'Dividendos e proventos', duracaoMin: 12, concluida: false },
      { id: 'c5', titulo: 'Análise fundamentalista', duracaoMin: 20, concluida: false },
    ],
  },
  {
    id: 'mod4',
    emoji: '⚖️',
    titulo: 'Gestão de Carteira',
    descricao: 'Como montar e gerenciar sua carteira',
    aulas: [
      { id: 'd1', titulo: 'Diversificação', duracaoMin: 12, concluida: false },
      { id: 'd2', titulo: 'Alocação de ativos', duracaoMin: 15, concluida: false },
      { id: 'd3', titulo: 'Gestão de risco', duracaoMin: 12, concluida: false },
      { id: 'd4', titulo: 'Rebalanceamento', duracaoMin: 10, concluida: false },
      { id: 'd5', titulo: 'Perfil de investidor', duracaoMin: 8, concluida: false },
    ],
  },
]

export const seedNotificacoes: Notificacao[] = [
  {
    id: 'n1',
    icone: 'gift',
    titulo: 'Dividendo recebido',
    mensagem: 'MXRF11 creditou R$ 320,00 em proventos.',
    dataISO: '2026-09-10T05:00:00',
    lida: false,
  },
  {
    id: 'n2',
    icone: 'deposito',
    titulo: 'Depósito confirmado',
    mensagem: 'Depósito de R$ 5.000,00 confirmado com sucesso.',
    dataISO: '2026-09-16T07:00:00',
    lida: false,
  },
  {
    id: 'n3',
    icone: 'meta',
    titulo: 'Meta em progresso',
    mensagem: 'Sua reserva de emergência está 44% concluída. Continue aportando!',
    dataISO: '2026-09-08T06:00:00',
    lida: true,
  },
  {
    id: 'n4',
    icone: 'carteira',
    titulo: 'Carteira atualizada',
    mensagem: 'VALE3 recuou 4,26%. Verifique sua posição.',
    dataISO: '2026-09-07T12:00:00',
    lida: true,
  },
]

// Evolução do patrimônio — usada no gráfico de área do Dashboard
export const seedEvolucaoPatrimonio = [
  { data: '2026-08-16', valor: 82903 },
  { data: '2026-08-18', valor: 84210 },
  { data: '2026-08-20', valor: 85950 },
  { data: '2026-08-22', valor: 85100 },
  { data: '2026-08-24', valor: 86730 },
  { data: '2026-08-26', valor: 88420 },
  { data: '2026-08-28', valor: 87610 },
  { data: '2026-08-30', valor: 89200 },
  { data: '2026-09-01', valor: 91530 },
  { data: '2026-09-03', valor: 90870 },
  { data: '2026-09-05', valor: 92140 },
  { data: '2026-09-07', valor: 93980 },
  { data: '2026-09-09', valor: 95260 },
  { data: '2026-09-11', valor: 97010 },
  { data: '2026-09-13', valor: 98540 },
  { data: '2026-09-16', valor: 92950 },
]

export const seedFluxoFinanceiro = [
  { mes: 'Abr', entradas: 8500, saidas: 3200 },
  { mes: 'Mai', entradas: 9200, saidas: 4100 },
  { mes: 'Jun', entradas: 7800, saidas: 5300 },
  { mes: 'Jul', entradas: 11000, saidas: 6200 },
  { mes: 'Ago', entradas: 14500, saidas: 8600 },
  { mes: 'Set', entradas: 20000, saidas: 7550 },
]

export const seedRentabilidadeHistorico = [
  { data: '2026-08-18', carteira: 0, cdi: 0, ibovespa: 0 },
  { data: '2026-08-25', carteira: 1.4, cdi: 0.8, ibovespa: -0.5 },
  { data: '2026-09-01', carteira: 2.6, cdi: 1.6, ibovespa: 0.9 },
  { data: '2026-09-08', carteira: 4.1, cdi: 2.4, ibovespa: 1.6 },
  { data: '2026-09-15', carteira: 5.93, cdi: 3.3, ibovespa: 2.1 },
]
