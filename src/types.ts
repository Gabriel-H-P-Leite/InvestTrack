export type Categoria = 'Ações' | 'FIIs' | 'ETFs' | 'Tesouro Direto' | 'CDB' | 'Cripto'

export interface Ativo {
  id: string
  ticker: string
  nome: string
  categoria: Categoria
  quantidade: number
  precoMedio: number
  precoAtual: number
  setor: string
}

export type TipoOperacao = 'Compra' | 'Venda' | 'Aporte' | 'Resgate' | 'Dividendo'

export interface Transacao {
  id: string
  ativoId: string
  ticker: string
  tipo: TipoOperacao
  quantidade: number
  precoUnitario: number
  taxas: number
  data: string // ISO date
}

export type TipoMovimentacao =
  | 'Depósito'
  | 'Saque'
  | 'Transferência para Invest.'
  | 'Resgate de Invest.'
  | 'Dividendo'
  | 'Juros'
  | 'Taxa'
  | 'Ajuste'

export interface Movimentacao {
  id: string
  titulo: string
  tipo: TipoMovimentacao
  metodo?: string
  data: string // ISO date
  valor: number // positivo = entrada, negativo = saída
  status: 'Concluído' | 'Pendente'
}

export interface Provento {
  id: string
  ticker: string
  tipo: 'Dividendo' | 'JCP' | 'Rendimento'
  data: string
  valor: number
  yieldPct: number
}

export interface Meta {
  id: string
  emoji: string
  titulo: string
  descricao: string
  valorAtual: number
  valorAlvo: number
  prazoISO: string
  vinculoAutomatico?: 'patrimonio' | 'financeiro' | null
}

export interface Aula {
  id: string
  titulo: string
  duracaoMin: number
  concluida: boolean
}

export interface Modulo {
  id: string
  emoji: string
  titulo: string
  descricao: string
  aulas: Aula[]
}

export interface Notificacao {
  id: string
  icone: 'gift' | 'deposito' | 'meta' | 'carteira'
  titulo: string
  mensagem: string
  dataISO: string
  lida: boolean
}

export interface Perfil {
  nome: string
  email: string
  perfilRisco: 'Conservador' | 'Moderado' | 'Arrojado'
  moeda: string
  idioma: string
  tema: 'Escuro' | 'Claro'
}

export interface ContaFinanceira {
  saldo: number
  totalEntradas: number
  totalSaidas: number
  transferidoParaCarteira: number
  resgatado: number
}
