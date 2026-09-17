import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button, Card, DemoBadge, Badge } from '@/components/ui/Primitives'
import { NovaOperacaoModal } from '@/components/forms/NovaOperacaoModal'
import { formatBRL, formatDateBR, initials } from '@/lib/utils'
import type { TipoOperacao } from '@/types'

const TIPO_VARIANT: Record<TipoOperacao, 'profit' | 'loss' | 'default' | 'warning'> = {
  Compra: 'default',
  Venda: 'warning',
  Aporte: 'profit',
  Resgate: 'loss',
  Dividendo: 'profit',
}

export default function Transacoes() {
  const { state } = useApp()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-foreground">Transações</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-muted-foreground">Histórico de operações da carteira</p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus size={15} /> Nova Operação
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Ativo</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium text-right">Quantidade</th>
                <th className="px-4 py-3 font-medium text-right">Preço Unit.</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium text-right">Taxas</th>
                <th className="px-4 py-3 font-medium text-right">Data</th>
              </tr>
            </thead>
            <tbody>
              {state.transacoes.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                        {initials(t.ticker)}
                        {t.ticker.charAt(1)?.toUpperCase()}
                      </div>
                      <span className="font-semibold text-foreground">{t.ticker}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={TIPO_VARIANT[t.tipo]}>{t.tipo}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {t.quantidade.toLocaleString('pt-BR', { maximumFractionDigits: 4 })}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">{formatBRL(t.precoUnitario)}</td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">
                    {formatBRL(t.quantidade * t.precoUnitario)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {t.taxas > 0 ? formatBRL(t.taxas) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{formatDateBR(t.data)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <NovaOperacaoModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
