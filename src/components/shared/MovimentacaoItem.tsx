import { ArrowDownLeft, ArrowUpRight, Gift, Landmark, Percent, Receipt, RefreshCw } from 'lucide-react'
import type { Movimentacao } from '@/types'
import { formatDateBR, formatSignedBRL, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Primitives'

const ICONS: Record<Movimentacao['tipo'], typeof ArrowUpRight> = {
  Depósito: ArrowDownLeft,
  Saque: ArrowUpRight,
  'Transferência para Invest.': RefreshCw,
  'Resgate de Invest.': RefreshCw,
  Dividendo: Gift,
  Juros: Percent,
  Taxa: Receipt,
  Ajuste: Landmark,
}

export function MovimentacaoItem({ mov }: { mov: Movimentacao }) {
  const Icon = ICONS[mov.tipo] ?? Receipt
  const positivo = mov.valor >= 0
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div
        className={cn(
          'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center',
          positivo ? 'bg-profit/15 text-profit' : 'bg-loss/15 text-loss'
        )}
      >
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{mov.titulo}</p>
        <p className="text-xs text-muted-foreground truncate">
          {mov.tipo}
          {mov.metodo ? ` · ${mov.metodo}` : ''} · {formatDateBR(mov.data)}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={cn('text-sm font-semibold', positivo ? 'text-profit' : 'text-loss')}>
          {formatSignedBRL(mov.valor)}
        </p>
        <Badge variant={mov.status === 'Concluído' ? 'profit' : 'warning'} className="mt-0.5">
          {mov.status}
        </Badge>
      </div>
    </div>
  )
}
