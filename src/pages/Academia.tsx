import { Check, Clock } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Card, DemoBadge, ProgressBar, StatCard } from '@/components/ui/Primitives'
import { useToast } from '@/context/ToastContext'
import { cn } from '@/lib/utils'

export default function Academia() {
  const { state, derived, dispatch } = useApp()
  const { toast } = useToast()

  const toggleAula = (moduloId: string, aulaId: string, titulo: string, concluida: boolean) => {
    dispatch({ type: 'COMPLETAR_AULA', moduloId, aulaId })
    if (!concluida) toast('Aula concluída', titulo)
  }

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-foreground mb-1">Academia INVESTTRACK</h1>
        <DemoBadge />
        <p className="text-lg font-semibold text-foreground mt-3">Evolua seu conhecimento financeiro</p>
        <p className="text-sm text-muted-foreground">Do básico ao avançado. Aprenda no seu ritmo.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Módulos" value={String(state.modulos.length)} />
        <StatCard label="Aulas" value={String(derived.aulasTotal)} />
        <StatCard label="Concluídas" value={String(derived.aulasConcluidas)} valueClassName="text-profit" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {state.modulos.map((mod) => {
          const concluidas = mod.aulas.filter((a) => a.concluida).length
          const progresso = (concluidas / mod.aulas.length) * 100
          return (
            <Card key={mod.id}>
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl flex-shrink-0">
                  {mod.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground">{mod.titulo}</p>
                  <p className="text-xs text-muted-foreground">{mod.descricao}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">
                  {concluidas}/{mod.aulas.length}
                </span>
                <span className="font-semibold text-foreground">{progresso.toFixed(0)}%</span>
              </div>
              <ProgressBar value={progresso} className="mb-3" />

              <div className="space-y-1">
                {mod.aulas.map((aula, i) => (
                  <button
                    key={aula.id}
                    onClick={() => toggleAula(mod.id, aula.id, aula.titulo, aula.concluida)}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary transition-colors text-left"
                  >
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold',
                        aula.concluida ? 'bg-profit/20 text-profit' : 'bg-secondary text-muted-foreground'
                      )}
                    >
                      {aula.concluida ? <Check size={13} /> : i + 1}
                    </div>
                    <span
                      className={cn(
                        'flex-1 text-sm truncate',
                        aula.concluida ? 'text-muted-foreground line-through' : 'text-foreground'
                      )}
                    >
                      {aula.titulo}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <Clock size={12} /> {aula.duracaoMin} min
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}
