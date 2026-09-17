import { useState } from 'react'
import { Modal, Field, inputClass } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Primitives'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/context/ToastContext'

const EMOJIS = ['🎯', '🛡️', '🏆', '💸', '🏠', '✈️', '🚗', '🎓']

export function NovaMetaModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useApp()
  const { toast } = useToast()
  const [emoji, setEmoji] = useState('🎯')
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [valorAlvo, setValorAlvo] = useState('')
  const [prazo, setPrazo] = useState('')

  const valido = titulo.trim() && Number(valorAlvo) > 0 && prazo

  const confirmar = () => {
    if (!valido) return
    dispatch({
      type: 'ADICIONAR_META',
      meta: {
        emoji,
        titulo,
        descricao: descricao || titulo,
        valorAtual: 0,
        valorAlvo: Number(valorAlvo.replace(',', '.')),
        prazoISO: prazo,
        vinculoAutomatico: null,
      },
    })
    toast('Meta criada', titulo)
    setTitulo('')
    setDescricao('')
    setValorAlvo('')
    setPrazo('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova Meta">
      <Field label="Ícone">
        <div className="flex gap-2 flex-wrap">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-colors ${
                emoji === e ? 'border-primary bg-primary/15' : 'border-border hover:bg-secondary'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Título da meta">
        <input className={inputClass} placeholder="Viagem para Europa" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </Field>
      <Field label="Descrição (opcional)">
        <input className={inputClass} placeholder="15 dias em Portugal e Espanha" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-x-3">
        <Field label="Valor Alvo (R$)">
          <input className={inputClass} inputMode="decimal" placeholder="20000" value={valorAlvo} onChange={(e) => setValorAlvo(e.target.value)} />
        </Field>
        <Field label="Prazo">
          <input className={inputClass} type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} />
        </Field>
      </div>
      <Button variant="primary" className="w-full mt-2" disabled={!valido} onClick={confirmar}>
        Criar meta
      </Button>
    </Modal>
  )
}
