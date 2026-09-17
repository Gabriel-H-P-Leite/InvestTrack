import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button, Card, DemoBadge, ProgressBar } from '@/components/ui/Primitives'
import { Modal, Field, inputClass } from '@/components/ui/Modal'
import { NovaMetaModal } from '@/components/forms/NovaMetaModal'
import { useToast } from '@/context/ToastContext'
import { formatBRL, daysUntil } from '@/lib/utils'
import type { Meta } from '@/types'

export default function Metas() {
  const { state, derived, dispatch } = useApp()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [aportando, setAportando] = useState<Meta | null>(null)
  const [valorAporte, setValorAporte] = useState('')

  const valorAtualDe = (m: Meta) => (m.vinculoAutomatico === 'patrimonio' ? derived.patrimonioTotal : m.valorAtual)

  const confirmarAporte = () => {
    const numero = Number(valorAporte.replace(',', '.'))
    if (!aportando || numero <= 0) return
    dispatch({ type: 'APORTAR_META', id: aportando.id, valor: numero })
    toast('Aporte registrado', `${formatBRL(numero)} adicionados a "${aportando.titulo}"`)
    setValorAporte('')
    setAportando(null)
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-foreground">Metas</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-muted-foreground">Defina e acompanhe seus objetivos financeiros</p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus size={15} /> Nova Meta
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {state.metas.map((m) => {
          const atual = valorAtualDe(m)
          const progresso = m.valorAlvo > 0 ? (atual / m.valorAlvo) * 100 : 0
          const falta = Math.max(0, m.valorAlvo - atual)
          const dias = daysUntil(m.prazoISO)
          return (
            <Card key={m.id} className="flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl flex-shrink-0">
                  {m.emoji}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground truncate">{m.titulo}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.descricao}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-semibold text-foreground">{Math.min(100, progresso).toFixed(1)}%</span>
              </div>
              <ProgressBar value={progresso} />
              <p className="text-xs text-muted-foreground mt-1.5">
                {formatBRL(atual)} <span className="opacity-60">/</span> {formatBRL(m.valorAlvo)}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border text-xs">
                <div>
                  <p className="text-muted-foreground">Falta</p>
                  <p className="font-semibold text-foreground">{formatBRL(falta)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Prazo</p>
                  <p className="font-semibold text-foreground">{dias} dias</p>
                </div>
              </div>

              {m.vinculoAutomatico !== 'patrimonio' && (
                <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => setAportando(m)}>
                  Aportar nesta meta
                </Button>
              )}
              {m.vinculoAutomatico === 'patrimonio' && (
                <p className="mt-3 text-[11px] text-muted-foreground text-center">
                  Atualizada automaticamente pelo seu patrimônio total
                </p>
              )}
            </Card>
          )
        })}
      </div>

      <NovaMetaModal open={open} onClose={() => setOpen(false)} />

      <Modal open={!!aportando} onClose={() => setAportando(null)} title={`Aportar em "${aportando?.titulo ?? ''}"`}>
        <Field label="Valor (R$)">
          <input
            className={inputClass}
            inputMode="decimal"
            placeholder="0,00"
            value={valorAporte}
            onChange={(e) => setValorAporte(e.target.value)}
            autoFocus
          />
        </Field>
        <p className="text-xs text-muted-foreground mb-3">
          O valor será debitado do saldo da sua Conta Financeira.
        </p>
        <Button variant="primary" className="w-full" onClick={confirmarAporte}>
          Confirmar aporte
        </Button>
      </Modal>
    </>
  )
}
