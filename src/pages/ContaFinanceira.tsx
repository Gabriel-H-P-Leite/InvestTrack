import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, RefreshCw, Undo2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button, Card, DemoBadge, SectionTitle, StatCard } from '@/components/ui/Primitives'
import { CashFlowBarChart } from '@/components/charts/Charts'
import { MovimentacaoItem } from '@/components/shared/MovimentacaoItem'
import {
  DepositoModal,
  ResgatarModal,
  SaqueModal,
  TransferirModal,
} from '@/components/forms/ContaFinanceiraModals'
import { formatBRL } from '@/lib/utils'

export default function ContaFinanceira() {
  const { state, fluxoFinanceiro } = useApp()
  const [modal, setModal] = useState<'deposito' | 'saque' | 'transferir' | 'resgatar' | null>(null)
  const cf = state.contaFinanceira

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-foreground">Conta Financeira</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-muted-foreground">Gerencie seu dinheiro disponível separado dos investimentos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => setModal('deposito')}>
            <Plus size={15} /> Depositar
          </Button>
          <Button variant="destructive" onClick={() => setModal('saque')}>
            <Minus size={15} /> Sacar
          </Button>
          <Button variant="outline" onClick={() => setModal('transferir')}>
            <RefreshCw size={15} /> Para invest.
          </Button>
          <Button variant="outline" onClick={() => setModal('resgatar')}>
            <Undo2 size={15} /> Resgatar
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Saldo Disponível" value={formatBRL(cf.saldo)} sub="Atualizado em 16/09/2026" />
        <StatCard label="Total Entradas" value={formatBRL(cf.totalEntradas)} valueClassName="text-profit" />
        <StatCard label="Total Saídas" value={formatBRL(cf.totalSaidas)} valueClassName="text-loss" />
        <StatCard
          label="Investido"
          value={formatBRL(cf.transferidoParaCarteira)}
          sub={`Transf. para carteira · Resgatado ${formatBRL(cf.resgatado)}`}
        />
      </div>

      <Card>
        <SectionTitle>Fluxo Financeiro — Últimos 6 meses</SectionTitle>
        <CashFlowBarChart data={fluxoFinanceiro} />
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" /> Entradas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-loss inline-block" /> Saídas
          </span>
        </div>
      </Card>

      <Card>
        <SectionTitle
          action={
            <Link to="/extrato" className="text-xs font-medium text-primary hover:underline">
              Ver extrato →
            </Link>
          }
        >
          Últimas Movimentações
        </SectionTitle>
        <div>
          {state.movimentacoes.slice(0, 8).map((mov) => (
            <MovimentacaoItem key={mov.id} mov={mov} />
          ))}
        </div>
      </Card>

      <DepositoModal open={modal === 'deposito'} onClose={() => setModal(null)} />
      <SaqueModal open={modal === 'saque'} onClose={() => setModal(null)} />
      <TransferirModal open={modal === 'transferir'} onClose={() => setModal(null)} />
      <ResgatarModal open={modal === 'resgatar'} onClose={() => setModal(null)} />
    </>
  )
}
