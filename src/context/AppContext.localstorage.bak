import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
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
  TipoOperacao,
} from '@/types'
import {
  seedAtivos,
  seedContaFinanceira,
  seedEvolucaoPatrimonio,
  seedFluxoFinanceiro,
  seedMetas,
  seedModulos,
  seedMovimentacoes,
  seedNotificacoes,
  seedPerfil,
  seedProventos,
  seedRentabilidadeHistorico,
  seedTransacoes,
} from '@/lib/mockData'
import { uid } from '@/lib/utils'

const STORAGE_KEY = 'investtrack-demo-state-v1'

interface AppState {
  perfil: Perfil
  contaFinanceira: ContaFinanceira
  ativos: Ativo[]
  transacoes: Transacao[]
  movimentacoes: Movimentacao[]
  proventos: Provento[]
  metas: Meta[]
  modulos: Modulo[]
  notificacoes: Notificacao[]
}

function seedState(): AppState {
  return {
    perfil: seedPerfil,
    contaFinanceira: seedContaFinanceira,
    ativos: seedAtivos,
    transacoes: seedTransacoes,
    movimentacoes: seedMovimentacoes,
    proventos: seedProventos,
    metas: seedMetas,
    modulos: seedModulos,
    notificacoes: seedNotificacoes,
  }
}

function loadInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AppState
  } catch {
    // ignore corrupted storage
  }
  return seedState()
}

type Action =
  | { type: 'DEPOSITAR'; valor: number; metodo: string }
  | { type: 'SACAR'; valor: number; metodo: string }
  | { type: 'TRANSFERIR_PARA_CARTEIRA'; valor: number }
  | { type: 'RESGATAR'; valor: number }
  | { type: 'ADICIONAR_ATIVO'; ativo: Omit<Ativo, 'id'> }
  | {
      type: 'ADICIONAR_TRANSACAO'
      ativoId: string | null
      novoAtivo?: Omit<Ativo, 'id' | 'quantidade' | 'precoMedio'>
      tipo: TipoOperacao
      quantidade: number
      precoUnitario: number
      taxas: number
      data: string
    }
  | { type: 'MARCAR_NOTIFICACAO_LIDA'; id: string }
  | { type: 'MARCAR_TODAS_NOTIFICACOES_LIDAS' }
  | { type: 'ADICIONAR_META'; meta: Omit<Meta, 'id'> }
  | { type: 'APORTAR_META'; id: string; valor: number }
  | { type: 'COMPLETAR_AULA'; moduloId: string; aulaId: string }
  | { type: 'ATUALIZAR_PERFIL'; data: Partial<Perfil> }
  | { type: 'RESTAURAR_DADOS_DEMO' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'DEPOSITAR': {
      const mov: Movimentacao = {
        id: uid('mov'),
        titulo: `Depósito — ${action.metodo}`,
        tipo: 'Depósito',
        metodo: action.metodo,
        data: new Date().toISOString().slice(0, 10),
        valor: action.valor,
        status: 'Concluído',
      }
      return {
        ...state,
        contaFinanceira: {
          ...state.contaFinanceira,
          saldo: state.contaFinanceira.saldo + action.valor,
          totalEntradas: state.contaFinanceira.totalEntradas + action.valor,
        },
        movimentacoes: [mov, ...state.movimentacoes],
      }
    }
    case 'SACAR': {
      const mov: Movimentacao = {
        id: uid('mov'),
        titulo: `Saque — ${action.metodo}`,
        tipo: 'Saque',
        metodo: action.metodo,
        data: new Date().toISOString().slice(0, 10),
        valor: -action.valor,
        status: 'Concluído',
      }
      return {
        ...state,
        contaFinanceira: {
          ...state.contaFinanceira,
          saldo: state.contaFinanceira.saldo - action.valor,
          totalSaidas: state.contaFinanceira.totalSaidas + action.valor,
        },
        movimentacoes: [mov, ...state.movimentacoes],
      }
    }
    case 'TRANSFERIR_PARA_CARTEIRA': {
      const mov: Movimentacao = {
        id: uid('mov'),
        titulo: 'Transferência para investimentos',
        tipo: 'Transferência para Invest.',
        data: new Date().toISOString().slice(0, 10),
        valor: -action.valor,
        status: 'Concluído',
      }
      return {
        ...state,
        contaFinanceira: {
          ...state.contaFinanceira,
          saldo: state.contaFinanceira.saldo - action.valor,
          transferidoParaCarteira: state.contaFinanceira.transferidoParaCarteira + action.valor,
        },
        movimentacoes: [mov, ...state.movimentacoes],
      }
    }
    case 'RESGATAR': {
      const mov: Movimentacao = {
        id: uid('mov'),
        titulo: 'Resgate de investimentos',
        tipo: 'Resgate de Invest.',
        data: new Date().toISOString().slice(0, 10),
        valor: action.valor,
        status: 'Concluído',
      }
      return {
        ...state,
        contaFinanceira: {
          ...state.contaFinanceira,
          saldo: state.contaFinanceira.saldo + action.valor,
          resgatado: state.contaFinanceira.resgatado + action.valor,
        },
        movimentacoes: [mov, ...state.movimentacoes],
      }
    }
    case 'ADICIONAR_ATIVO': {
      const novo: Ativo = { id: uid('ativo'), ...action.ativo }
      return { ...state, ativos: [novo, ...state.ativos] }
    }
    case 'ADICIONAR_TRANSACAO': {
      const { tipo, quantidade, precoUnitario, taxas, data } = action
      const total = quantidade * precoUnitario
      let ativos = [...state.ativos]
      let ativoId = action.ativoId
      let ticker = ''
      let contaFinanceira = { ...state.contaFinanceira }
      let proventos = [...state.proventos]

      if (ativoId) {
        const idx = ativos.findIndex((a) => a.id === ativoId)
        if (idx >= 0) {
          const ativo = ativos[idx]
          ticker = ativo.ticker
          if (tipo === 'Compra' || tipo === 'Aporte') {
            const novaQtd = ativo.quantidade + quantidade
            const novoPrecoMedio =
              (ativo.quantidade * ativo.precoMedio + quantidade * precoUnitario) / (novaQtd || 1)
            ativos[idx] = { ...ativo, quantidade: novaQtd, precoMedio: novoPrecoMedio }
          } else if (tipo === 'Venda' || tipo === 'Resgate') {
            const novaQtd = Math.max(0, ativo.quantidade - quantidade)
            ativos[idx] = { ...ativo, quantidade: novaQtd }
          } else if (tipo === 'Dividendo') {
            proventos = [
              {
                id: uid('prov'),
                ticker: ativo.ticker,
                tipo: 'Dividendo',
                data,
                valor: total,
                yieldPct: Number(((total / (ativo.precoMedio * ativo.quantidade || 1)) * 100).toFixed(2)),
              },
              ...proventos,
            ]
          }
        }
      } else if (action.novoAtivo) {
        const novo: Ativo = {
          id: uid('ativo'),
          ...action.novoAtivo,
          quantidade,
          precoMedio: precoUnitario,
        }
        ativos = [novo, ...ativos]
        ativoId = novo.id
        ticker = novo.ticker
      }

      // impacto no saldo da conta financeira
      if (tipo === 'Compra' || tipo === 'Aporte') {
        contaFinanceira.saldo -= total + taxas
      } else if (tipo === 'Venda' || tipo === 'Resgate') {
        contaFinanceira.saldo += total - taxas
      } else if (tipo === 'Dividendo') {
        contaFinanceira.saldo += total
      }

      const transacao: Transacao = {
        id: uid('tx'),
        ativoId: ativoId ?? '',
        ticker,
        tipo,
        quantidade,
        precoUnitario,
        taxas,
        data,
      }

      return {
        ...state,
        ativos,
        contaFinanceira,
        proventos,
        transacoes: [transacao, ...state.transacoes],
      }
    }
    case 'MARCAR_NOTIFICACAO_LIDA':
      return {
        ...state,
        notificacoes: state.notificacoes.map((n) => (n.id === action.id ? { ...n, lida: true } : n)),
      }
    case 'MARCAR_TODAS_NOTIFICACOES_LIDAS':
      return { ...state, notificacoes: state.notificacoes.map((n) => ({ ...n, lida: true })) }
    case 'ADICIONAR_META':
      return { ...state, metas: [{ id: uid('meta'), ...action.meta }, ...state.metas] }
    case 'APORTAR_META':
      return {
        ...state,
        metas: state.metas.map((m) =>
          m.id === action.id ? { ...m, valorAtual: m.valorAtual + action.valor } : m
        ),
        contaFinanceira: { ...state.contaFinanceira, saldo: state.contaFinanceira.saldo - action.valor },
      }
    case 'COMPLETAR_AULA':
      return {
        ...state,
        modulos: state.modulos.map((m) =>
          m.id === action.moduloId
            ? {
                ...m,
                aulas: m.aulas.map((a) =>
                  a.id === action.aulaId ? { ...a, concluida: !a.concluida } : a
                ),
              }
            : m
        ),
      }
    case 'ATUALIZAR_PERFIL':
      return { ...state, perfil: { ...state.perfil, ...action.data } }
    case 'RESTAURAR_DADOS_DEMO':
      return seedState()
    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
  derived: {
    totalInvestido: number
    valorAtualCarteira: number
    resultadoCarteira: number
    resultadoCarteiraPct: number
    patrimonioTotal: number
    totalProventos: number
    proventosEsteMes: number
    aulasConcluidas: number
    aulasTotal: number
  }
  evolucaoPatrimonio: typeof seedEvolucaoPatrimonio
  fluxoFinanceiro: typeof seedFluxoFinanceiro
  rentabilidadeHistorico: typeof seedRentabilidadeHistorico
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const derived = useMemo(() => {
    const totalInvestido = state.ativos.reduce((sum, a) => sum + a.quantidade * a.precoMedio, 0)
    const valorAtualCarteira = state.ativos.reduce((sum, a) => sum + a.quantidade * a.precoAtual, 0)
    const resultadoCarteira = valorAtualCarteira - totalInvestido
    const resultadoCarteiraPct = totalInvestido > 0 ? (resultadoCarteira / totalInvestido) * 100 : 0
    const patrimonioTotal = state.contaFinanceira.saldo + valorAtualCarteira
    const totalProventos = state.proventos.reduce((sum, p) => sum + p.valor, 0)
    const now = new Date()
    const proventosEsteMes = state.proventos
      .filter((p) => {
        const d = new Date(p.data)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((sum, p) => sum + p.valor, 0)
    const aulasTotal = state.modulos.reduce((sum, m) => sum + m.aulas.length, 0)
    const aulasConcluidas = state.modulos.reduce(
      (sum, m) => sum + m.aulas.filter((a) => a.concluida).length,
      0
    )
    return {
      totalInvestido,
      valorAtualCarteira,
      resultadoCarteira,
      resultadoCarteiraPct,
      patrimonioTotal,
      totalProventos,
      proventosEsteMes,
      aulasConcluidas,
      aulasTotal,
    }
  }, [state])

  const value = useMemo(
    () => ({
      state,
      dispatch,
      derived,
      evolucaoPatrimonio: seedEvolucaoPatrimonio,
      fluxoFinanceiro: seedFluxoFinanceiro,
      rentabilidadeHistorico: seedRentabilidadeHistorico,
    }),
    [state, derived]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}
