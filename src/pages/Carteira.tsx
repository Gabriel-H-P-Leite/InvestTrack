import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button, Card, DemoBadge, StatCard } from '@/components/ui/Primitives'
import { AdicionarAtivoModal } from '@/components/forms/AdicionarAtivoModal'
import type { Categoria } from '@/types'
import { cn, formatBRL, formatPercent, formatSignedBRL, initials } from '@/lib/utils'

const CATEGORIAS: (Categoria | 'Todos')[] = ['Todos', 'Ações', 'FIIs', 'ETFs', 'Tesouro Direto', 'CDB', 'Cripto']

export default function Carteira() {
  const { state, derived } = useApp()
  const [filtro, setFiltro] = useState<(typeof CATEGORIAS)[number]>('Todos')
  const [open, setOpen] = useState(false)

  const ativosFiltrados = useMemo(
    () => (filtro === 'Todos' ? state.ativos : state.ativos.filter((a) => a.categoria === filtro)),
    [state.ativos, filtro]
  )

  const categoriasUnicas = new Set(state.ativos.map((a) => a.categoria)).size

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-foreground">Carteira</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-muted-foreground">Acompanhe seus ativos e posições</p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus size={15} /> Adicionar Ativo
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Investido" value={formatBRL(derived.totalInvestido)} />
        <StatCard label="Valor Atual" value={formatBRL(derived.valorAtualCarteira)} />
        <StatCard
          label="Resultado"
          value={formatSignedBRL(derived.resultadoCarteira)}
          sub={formatPercent(derived.resultadoCarteiraPct)}
          valueClassName={derived.resultadoCarteira >= 0 ? 'text-profit' : 'text-loss'}
        />
        <StatCard label="Ativos" value={String(state.ativos.length)} sub={`${categoriasUnicas} categorias`} />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            onClick={() => setFiltro(c)}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              filtro === c
                ? 'bg-primary/15 text-primary border-primary/30'
                : 'text-muted-foreground border-border hover:bg-secondary'
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Ativo</th>
                <th className="px-4 py-3 font-medium text-right">Qtd.</th>
                <th className="px-4 py-3 font-medium text-right">Preço Médio</th>
                <th className="px-4 py-3 font-medium text-right">Preço Atual</th>
                <th className="px-4 py-3 font-medium text-right">Investido</th>
                <th className="px-4 py-3 font-medium text-right">Atual</th>
                <th className="px-4 py-3 font-medium text-right">Resultado</th>
                <th className="px-4 py-3 font-medium text-right">Carteira</th>
              </tr>
            </thead>
            <tbody>
              {ativosFiltrados.map((a) => {
                const investido = a.quantidade * a.precoMedio
                const atual = a.quantidade * a.precoAtual
                const resultado = atual - investido
                const resultadoPct = investido > 0 ? (resultado / investido) * 100 : 0
                const pctCarteira = derived.valorAtualCarteira > 0 ? (atual / derived.valorAtualCarteira) * 100 : 0
                return (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                          {initials(a.ticker)}
                          {a.ticker.charAt(1)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{a.ticker}</p>
                          <p className="text-xs text-muted-foreground truncate">{a.nome}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {a.quantidade.toLocaleString('pt-BR', { maximumFractionDigits: 4 })}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">{formatBRL(a.precoMedio)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatBRL(a.precoAtual)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatBRL(investido)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatBRL(atual)}</td>
                    <td className="px-4 py-3 text-right">
                      <p className={cn('font-semibold', resultado >= 0 ? 'text-profit' : 'text-loss')}>
                        {formatSignedBRL(resultado)}
                      </p>
                      <p className={cn('text-xs', resultado >= 0 ? 'text-profit' : 'text-loss')}>
                        {formatPercent(resultadoPct)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{pctCarteira.toFixed(1)}%</td>
                  </tr>
                )
              })}
              {ativosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Nenhum ativo nesta categoria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AdicionarAtivoModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
