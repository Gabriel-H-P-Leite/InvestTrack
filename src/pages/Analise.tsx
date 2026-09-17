import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { Card, DemoBadge, SectionTitle, ProgressBar } from '@/components/ui/Primitives'
import { ClassPieChart, SectorBarChart } from '@/components/charts/Charts'
import { cn, formatBRL, formatPercent, initials } from '@/lib/utils'

export default function Analise() {
  const { state, derived } = useApp()

  const porClasse = useMemo(() => {
    const mapa = new Map<string, number>()
    for (const a of state.ativos) {
      mapa.set(a.categoria, (mapa.get(a.categoria) ?? 0) + a.quantidade * a.precoAtual)
    }
    return Array.from(mapa.entries()).map(([nome, valor]) => ({ nome, valor }))
  }, [state.ativos])

  const porSetor = useMemo(() => {
    const mapa = new Map<string, number>()
    for (const a of state.ativos) {
      mapa.set(a.setor, (mapa.get(a.setor) ?? 0) + a.quantidade * a.precoAtual)
    }
    return Array.from(mapa.entries())
      .map(([setor, valor]) => ({ setor, valor }))
      .sort((a, b) => b.valor - a.valor)
  }, [state.ativos])

  const maioresPosicoes = useMemo(() => {
    return [...state.ativos]
      .map((a) => {
        const investido = a.quantidade * a.precoMedio
        const atual = a.quantidade * a.precoAtual
        const pctResultado = investido > 0 ? ((atual - investido) / investido) * 100 : 0
        const pctCarteira = derived.valorAtualCarteira > 0 ? (atual / derived.valorAtualCarteira) * 100 : 0
        return { ...a, atual, pctResultado, pctCarteira }
      })
      .sort((a, b) => b.atual - a.atual)
  }, [state.ativos, derived.valorAtualCarteira])

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-foreground">Análise da Carteira</h1>
          <DemoBadge />
        </div>
        <p className="text-sm text-muted-foreground">Diversificação, concentração e maiores posições</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <SectionTitle>Distribuição por Classe</SectionTitle>
          <ClassPieChart data={porClasse} />
          <div className="grid grid-cols-2 gap-2 mt-2">
            {porClasse.map((c) => (
              <div key={c.nome} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate">{c.nome}</span>
                <span className="font-semibold text-foreground">
                  {((c.valor / derived.valorAtualCarteira) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Maiores Posições</SectionTitle>
          <div>
            {maioresPosicoes.slice(0, 5).map((a, i) => (
              <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}.</span>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                  {initials(a.ticker)}
                  {a.ticker.charAt(1)?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{a.ticker}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.nome}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={cn('text-sm font-semibold', a.pctResultado >= 0 ? 'text-profit' : 'text-loss')}>
                    {formatPercent(a.pctResultado)}
                  </p>
                  <p className="text-xs text-muted-foreground">{a.pctCarteira.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle>Distribuição por Setor</SectionTitle>
        <SectorBarChart data={porSetor} />
      </Card>

      <Card>
        <SectionTitle>Concentração da Carteira</SectionTitle>
        <div className="space-y-3">
          {maioresPosicoes.map((a) => (
            <div key={a.id}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-foreground">{a.ticker}</span>
                <span className="text-muted-foreground">
                  {a.pctCarteira.toFixed(1)}% · {formatBRL(a.atual)}
                </span>
              </div>
              <ProgressBar value={a.pctCarteira} />
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
