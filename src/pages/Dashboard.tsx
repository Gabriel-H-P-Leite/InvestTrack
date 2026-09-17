import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, RefreshCw } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button, Card, DemoBadge, SectionTitle } from '@/components/ui/Primitives'
import { WealthAreaChart } from '@/components/charts/Charts'
import { MovimentacaoItem } from '@/components/shared/MovimentacaoItem'
import { DepositoModal, SaqueModal, TransferirModal } from '@/components/forms/ContaFinanceiraModals'
import { cn, formatBRL, formatPercent, formatSignedBRL } from '@/lib/utils'

const PERIODOS = ['1D', '1S', '1M', '6M', '1A', '5A', 'TOTAL'] as const

export default function Dashboard() {
  const { state, derived, evolucaoPatrimonio } = useApp()
  const [modal, setModal] = useState<'deposito' | 'saque' | 'transferir' | null>(null)
  const [periodo, setPeriodo] = useState<(typeof PERIODOS)[number]>('1M')

  const pontosPorPeriodo: Record<string, number> = { '1D': 2, '1S': 5, '1M': 16, '6M': 16, '1A': 16, '5A': 16, TOTAL: 16 }
  const dados = evolucaoPatrimonio.slice(-pontosPorPeriodo[periodo])
  const inicio = dados[0]?.valor ?? derived.patrimonioTotal
  const variacao = derived.patrimonioTotal - inicio
  const variacaoPct = inicio > 0 ? (variacao / inicio) * 100 : 0

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-muted-foreground">Visão consolidada da sua vida financeira</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => setModal('deposito')}>
            <Plus size={15} /> Depositar
          </Button>
          <Button variant="destructive" onClick={() => setModal('saque')}>
            <Minus size={15} /> Sacar
          </Button>
          <Button variant="outline" onClick={() => setModal('transferir')}>
            <RefreshCw size={15} /> Transferir
          </Button>
        </div>
      </div>

      <Card className="gradient-primary text-white">
        <p className="text-xs text-white/80">Patrimônio Total</p>
        <p className="text-3xl font-bold mt-1">{formatBRL(derived.patrimonioTotal)}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-white/90">
          <span>Financeiro: <strong>{formatBRL(state.contaFinanceira.saldo)}</strong></span>
          <span>Investimentos: <strong>{formatBRL(derived.valorAtualCarteira)}</strong></span>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <SectionTitle>Conta Financeira</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Saldo Disponível" value={formatBRL(state.contaFinanceira.saldo)} />
            <Stat label="Total Depositado" value={formatBRL(state.contaFinanceira.totalEntradas)} />
            <Stat label="Total Sacado" value={formatBRL(state.contaFinanceira.totalSaidas)} />
            <Stat label="Investido" value={formatBRL(state.contaFinanceira.transferidoParaCarteira)} />
          </div>
        </Card>
        <Card>
          <SectionTitle>Investimentos</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Total Investido" value={formatBRL(derived.totalInvestido)} />
            <Stat label="Valor Atual" value={formatBRL(derived.valorAtualCarteira)} />
            <Stat
              label="Lucro / Prejuízo"
              value={formatSignedBRL(derived.resultadoCarteira)}
              valueClass={derived.resultadoCarteira >= 0 ? 'text-profit' : 'text-loss'}
              sub={formatPercent(derived.resultadoCarteiraPct)}
            />
            <Stat label="Dividendos" value={formatBRL(derived.proventosEsteMes)} />
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
          <div>
            <SectionTitle>Evolução do Patrimônio</SectionTitle>
            <p className="text-2xl font-bold text-foreground -mt-2">{formatBRL(derived.patrimonioTotal)}</p>
            <p className={cn('text-xs font-medium', variacao >= 0 ? 'text-profit' : 'text-loss')}>
              {formatSignedBRL(variacao)} ({formatPercent(variacaoPct)})
            </p>
          </div>
          <div className="flex gap-1 flex-wrap">
            {PERIODOS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                  periodo === p ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-secondary'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <WealthAreaChart data={dados} />
      </Card>

      <Card>
        <SectionTitle
          action={
            <Link to="/extrato" className="text-xs font-medium text-primary hover:underline">
              Ver extrato completo →
            </Link>
          }
        >
          Últimas Movimentações
        </SectionTitle>
        <div>
          {state.movimentacoes.slice(0, 5).map((mov) => (
            <MovimentacaoItem key={mov.id} mov={mov} />
          ))}
        </div>
      </Card>

      <DepositoModal open={modal === 'deposito'} onClose={() => setModal(null)} />
      <SaqueModal open={modal === 'saque'} onClose={() => setModal(null)} />
      <TransferirModal open={modal === 'transferir'} onClose={() => setModal(null)} />
    </>
  )
}

function Stat({ label, value, sub, valueClass }: { label: string; value: string; sub?: string; valueClass?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('text-sm font-bold text-foreground mt-0.5', valueClass)}>{value}</p>
      {sub && <p className={cn('text-xs mt-0.5', valueClass)}>{sub}</p>}
    </div>
  )
}
