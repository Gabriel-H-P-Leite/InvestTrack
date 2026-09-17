import { useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Card, DemoBadge, StatCard } from '@/components/ui/Primitives'
import { MovimentacaoItem } from '@/components/shared/MovimentacaoItem'
import { cn, formatBRL } from '@/lib/utils'
import type { TipoMovimentacao } from '@/types'

const TIPOS: TipoMovimentacao[] = [
  'Depósito',
  'Saque',
  'Transferência para Invest.',
  'Resgate de Invest.',
  'Dividendo',
  'Juros',
  'Taxa',
  'Ajuste',
]

export default function Extrato() {
  const { state } = useApp()
  const [fluxo, setFluxo] = useState<'Todos' | 'Entradas' | 'Saídas'>('Todos')
  const [tipo, setTipo] = useState<'Todos' | TipoMovimentacao>('Todos')

  const filtradas = useMemo(() => {
    return state.movimentacoes.filter((m) => {
      if (fluxo === 'Entradas' && m.valor < 0) return false
      if (fluxo === 'Saídas' && m.valor >= 0) return false
      if (tipo !== 'Todos' && m.tipo !== tipo) return false
      return true
    })
  }, [state.movimentacoes, fluxo, tipo])

  const entradas = state.movimentacoes.filter((m) => m.valor > 0).reduce((s, m) => s + m.valor, 0)
  const saidas = state.movimentacoes.filter((m) => m.valor < 0).reduce((s, m) => s + m.valor, 0)

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-foreground">Extrato</h1>
          <DemoBadge />
        </div>
        <p className="text-sm text-muted-foreground">Todas as movimentações financeiras</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <StatCard label="Entradas no período" value={formatBRL(entradas)} valueClassName="text-profit" />
        <StatCard label="Saídas no período" value={formatBRL(saidas)} valueClassName="text-loss" />
      </div>

      <div className="flex gap-2">
        {(['Todos', 'Entradas', 'Saídas'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFluxo(f)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              fluxo === f
                ? 'bg-primary/15 text-primary border-primary/30'
                : 'text-muted-foreground border-border hover:bg-secondary'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {(['Todos', ...TIPOS] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTipo(t)}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              tipo === t
                ? 'bg-secondary text-foreground border-border'
                : 'text-muted-foreground border-transparent hover:bg-secondary/60'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <Card>
        {filtradas.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nenhuma movimentação encontrada para este filtro.
          </p>
        ) : (
          <div>
            {filtradas.map((mov) => (
              <MovimentacaoItem key={mov.id} mov={mov} />
            ))}
          </div>
        )}
        <p className="pt-3 text-xs text-muted-foreground text-center">
          {filtradas.length} movimentaç{filtradas.length === 1 ? 'ão encontrada' : 'ões encontradas'}
        </p>
      </Card>
    </>
  )
}
