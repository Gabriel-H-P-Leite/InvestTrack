import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
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
  seedEvolucaoPatrimonio,
  seedFluxoFinanceiro,
  seedRentabilidadeHistorico,
} from '@/lib/mockData'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export interface AppState {
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

const ESTADO_VAZIO: AppState = {
  perfil: {
    nome: '',
    email: '',
    perfilRisco: 'Moderado',
    moeda: 'BRL — Real Brasileiro',
    idioma: 'Português (Brasil)',
    tema: 'Escuro',
  },
  contaFinanceira: {
    saldo: 0,
    totalEntradas: 0,
    totalSaidas: 0,
    transferidoParaCarteira: 0,
    resgatado: 0,
  },
  ativos: [],
  transacoes: [],
  movimentacoes: [],
  proventos: [],
  metas: [],
  modulos: [],
  notificacoes: [],
}

export type Action =
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

/** Traduz cada ação do front em uma chamada à API. O backend devolve o estado
 *  completo já atualizado, que passa a ser a fonte da verdade. */
function chamadaDaAcao(action: Action): Promise<AppState> {
  switch (action.type) {
    case 'DEPOSITAR':
      return api.post<AppState>('/conta/deposito', { valor: action.valor, metodo: action.metodo })
    case 'SACAR':
      return api.post<AppState>('/conta/saque', { valor: action.valor, metodo: action.metodo })
    case 'TRANSFERIR_PARA_CARTEIRA':
      return api.post<AppState>('/conta/transferir', { valor: action.valor })
    case 'RESGATAR':
      return api.post<AppState>('/conta/resgatar', { valor: action.valor })
    case 'ADICIONAR_ATIVO':
      return api.post<AppState>('/ativos', action.ativo)
    case 'ADICIONAR_TRANSACAO':
      return api.post<AppState>('/transacoes', {
        ativoId: action.ativoId,
        tipo: action.tipo,
        quantidade: action.quantidade,
        precoUnitario: action.precoUnitario,
        taxas: action.taxas,
        data: action.data,
      })
    case 'MARCAR_NOTIFICACAO_LIDA':
      return api.patch<AppState>(`/notificacoes/${action.id}/lida`)
    case 'MARCAR_TODAS_NOTIFICACOES_LIDAS':
      return api.post<AppState>('/notificacoes/ler-todas')
    case 'ADICIONAR_META':
      return api.post<AppState>('/metas', action.meta)
    case 'APORTAR_META':
      return api.post<AppState>(`/metas/${action.id}/aporte`, { valor: action.valor })
    case 'COMPLETAR_AULA':
      return api.post<AppState>(`/academia/aulas/${action.aulaId}/toggle`)
    case 'ATUALIZAR_PERFIL':
      return api.patch<AppState>('/perfil', action.data)
    case 'RESTAURAR_DADOS_DEMO':
      return api.post<AppState>('/demo/restaurar')
  }
}

interface AppContextValue {
  state: AppState
  dispatch: (action: Action) => void
  carregando: boolean
  erro: string | null
  recarregar: () => Promise<void>
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
  const { autenticado } = useAuth()
  const [state, setState] = useState<AppState>(ESTADO_VAZIO)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const recarregar = useCallback(async () => {
    if (!autenticado) {
      setState(ESTADO_VAZIO)
      setCarregando(false)
      return
    }
    try {
      setErro(null)
      const dados = await api.get<AppState>('/state')
      setState(dados)
    } catch (e: any) {
      setErro(e?.message ?? 'Não foi possível carregar seus dados.')
    } finally {
      setCarregando(false)
    }
  }, [autenticado])

  useEffect(() => {
    setCarregando(true)
    recarregar()
  }, [recarregar])

  const dispatch = useCallback((action: Action) => {
    chamadaDaAcao(action)
      .then((novoEstado) => setState(novoEstado))
      .catch((e: any) => setErro(e?.message ?? 'Não foi possível concluir a operação.'))
  }, [])

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
      carregando,
      erro,
      recarregar,
      derived,
      evolucaoPatrimonio: seedEvolucaoPatrimonio,
      fluxoFinanceiro: seedFluxoFinanceiro,
      rentabilidadeHistorico: seedRentabilidadeHistorico,
    }),
    [state, dispatch, carregando, erro, recarregar, derived]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}
