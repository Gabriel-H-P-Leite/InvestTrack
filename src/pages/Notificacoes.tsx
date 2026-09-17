import { Bell, Gift, Landmark, Target, Wallet } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Card, Button } from '@/components/ui/Primitives'
import { cn, formatDateTimeBR } from '@/lib/utils'
import type { Notificacao } from '@/types'

const ICONS: Record<Notificacao['icone'], typeof Bell> = {
  gift: Gift,
  deposito: Landmark,
  meta: Target,
  carteira: Wallet,
}

export default function Notificacoes() {
  const { state, dispatch } = useApp()
  const naoLidas = state.notificacoes.filter((n) => !n.lida).length
  const ordenadas = [...state.notificacoes].sort(
    (a, b) => new Date(b.dataISO).getTime() - new Date(a.dataISO).getTime()
  )

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Notificações</h1>
          <p className="text-sm text-muted-foreground">
            {naoLidas > 0 ? `${naoLidas} não lida${naoLidas > 1 ? 's' : ''}` : 'Tudo em dia'}
          </p>
        </div>
        {naoLidas > 0 && (
          <Button variant="outline" size="sm" onClick={() => dispatch({ type: 'MARCAR_TODAS_NOTIFICACOES_LIDAS' })}>
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <Card className="p-0 divide-y divide-border">
        {ordenadas.map((n) => {
          const Icon = ICONS[n.icone]
          return (
            <button
              key={n.id}
              onClick={() => dispatch({ type: 'MARCAR_NOTIFICACAO_LIDA', id: n.id })}
              className={cn(
                'w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-secondary/40',
                !n.lida && 'bg-primary/[0.04]'
              )}
            >
              <div
                className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                  n.lida ? 'bg-secondary text-muted-foreground' : 'bg-primary/15 text-primary'
                )}
              >
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={cn('text-sm', n.lida ? 'text-foreground' : 'font-bold text-foreground')}>
                    {n.titulo}
                  </p>
                  {!n.lida && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.mensagem}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{formatDateTimeBR(n.dataISO)}</p>
              </div>
            </button>
          )
        })}
        {ordenadas.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">Nenhuma notificação por aqui.</p>
        )}
      </Card>
    </>
  )
}
