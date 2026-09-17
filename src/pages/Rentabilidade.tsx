import { Info } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Card, DemoBadge, SectionTitle, StatCard } from '@/components/ui/Primitives'
import { ReturnsLineChart } from '@/components/charts/Charts'
import { cn, formatBRL, formatPercent, formatSignedBRL, initials } from '@/lib/utils'

export default function Rentabilidade() {
  const { state, derived, rentabilidadeHistorico } = useApp()

  const rentabilidadeAnual = derived.resultadoCarteiraPct
  const rentabilidadeMensal = rentabilidadeAnual / 6 // aproximação demonstrativa
  const rentabilidadeDiaria = rentabilidadeMensal / 21

  const resumoPorAtivo = [...state.ativos]
    .map((a) => {
      const investido = a.quantidade * a.precoMedio
      const atual = a.quantidade * a.precoAtual
      const resultado = atual - investido
      const pct = investido > 0 ? (resultado / investido) * 100 : 0
      return { ...a, investido, resultado, pct }
    })
    .sort((a, b) => b.pct - a.pct)

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-foreground">Rentabilidade</h1>
          <DemoBadge />
        </div>
        <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
          <Info size={14} className="mt-0.5 flex-shrink-0" />
          Rentabilidade calculada com base nos dados demonstrativos. Aportes e retiradas são separados do resultado.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Rentabilidade Diária (est.)" value={formatPercent(rentabilidadeDiaria, 3)} valueClassName="text-profit" />
        <StatCard label="Rentabilidade Mensal (est.)" value={formatPercent(rentabilidadeMensal)} valueClassName="text-profit" />
        <StatCard label="Rentabilidade Anual (est.)" value={formatPercent(rentabilidadeAnual)} valueClassName="text-profit" />
        <StatCard
          label="Resultado Acumulado"
          value={formatSignedBRL(derived.resultadoCarteira)}
          valueClassName={derived.resultadoCarteira >= 0 ? 'text-profit' : 'text-loss'}
        />
      </div>

      <Card>
        <SectionTitle>Rentabilidade vs Benchmarks (últimos 30 dias)</SectionTitle>
        <ReturnsLineChart data={rentabilidadeHistorico} />
        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" /> Carteira
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-warning inline-block" /> CDI (est.)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-neutral inline-block" /> Ibovespa (est.)
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          * Benchmarks são estimativas para demonstração. Não representam dados reais de mercado.
        </p>
      </Card>

      <Card>
        <SectionTitle>Resumo por Ativo</SectionTitle>
        <div>
          {resumoPorAtivo.map((a) => (
            <div key={a.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                {initials(a.ticker)}
                {a.ticker.charAt(1)?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{a.ticker}</p>
                <p className="text-xs text-muted-foreground">{formatBRL(a.investido)} investido</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={cn('text-sm font-semibold', a.resultado >= 0 ? 'text-profit' : 'text-loss')}>
                  {formatPercent(a.pct)}
                </p>
                <p className={cn('text-xs', a.resultado >= 0 ? 'text-profit' : 'text-loss')}>
                  {formatSignedBRL(a.resultado)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
