import { useMemo } from 'react'
import { Gift } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Card, DemoBadge, SectionTitle, StatCard, Badge } from '@/components/ui/Primitives'
import { DividendsBarChart } from '@/components/charts/Charts'
import { formatBRL, formatDateBR, formatSignedBRL } from '@/lib/utils'

export default function Proventos() {
  const { state, derived } = useApp()

  const historicoMensal = useMemo(() => {
    const mapa = new Map<string, number>()
    for (const p of state.proventos) {
      const d = new Date(p.data)
      const key = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
      mapa.set(key, (mapa.get(key) ?? 0) + p.valor)
    }
    return Array.from(mapa.entries())
      .reverse()
      .map(([mes, valor]) => ({ mes: mes.charAt(0).toUpperCase() + mes.slice(1), valor }))
  }, [state.proventos])

  const ativosComProventos = new Set(state.proventos.map((p) => p.ticker)).size

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-foreground">Proventos</h1>
          <DemoBadge />
        </div>
        <p className="text-sm text-muted-foreground">Dividendos, JCP e rendimentos recebidos</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Recebido" value={formatBRL(derived.totalProventos)} valueClassName="text-profit" />
        <StatCard label="Este Mês" value={formatBRL(derived.proventosEsteMes)} valueClassName="text-profit" />
        <StatCard
          label="Provento Médio/Mês"
          value={formatBRL(derived.totalProventos / Math.max(1, historicoMensal.length))}
        />
        <StatCard label="Ativos com Proventos" value={String(ativosComProventos)} sub={`em ${state.ativos.length} ativos`} />
      </div>

      <Card>
        <SectionTitle>Histórico Mensal</SectionTitle>
        <DividendsBarChart data={historicoMensal} />
      </Card>

      <Card>
        <SectionTitle>Histórico de Proventos</SectionTitle>
        <div>
          {state.proventos.map((p) => (
            <div key={p.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <div className="w-9 h-9 rounded-lg bg-profit/15 text-profit flex items-center justify-center flex-shrink-0">
                <Gift size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">{p.ticker}</p>
                  <Badge>{p.tipo}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{formatDateBR(p.data)}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-profit">{formatSignedBRL(p.valor)}</p>
                <p className="text-xs text-muted-foreground">Yield: {p.yieldPct.toFixed(2)}%</p>
              </div>
            </div>
          ))}
          {state.proventos.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">Nenhum provento registrado ainda.</p>
          )}
        </div>
      </Card>
    </>
  )
}
