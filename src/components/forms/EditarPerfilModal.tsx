import { useState } from 'react'
import { Modal, Field, inputClass } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Primitives'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/context/ToastContext'
import type { Perfil } from '@/types'

type Modo = 'perfil' | 'risco' | 'preferencias'

export function EditarPerfilModal({
  open,
  onClose,
  modo,
}: {
  open: boolean
  onClose: () => void
  modo: Modo
}) {
  const { state, dispatch } = useApp()
  const { toast } = useToast()
  const [form, setForm] = useState<Perfil>(state.perfil)

  const salvar = () => {
    dispatch({ type: 'ATUALIZAR_PERFIL', data: form })
    toast('Perfil atualizado', 'Suas informações foram salvas.')
    onClose()
  }

  const titulos: Record<Modo, string> = {
    perfil: 'Editar Perfil',
    risco: 'Perfil de Risco',
    preferencias: 'Preferências',
  }

  return (
    <Modal open={open} onClose={onClose} title={titulos[modo]}>
      {modo === 'perfil' && (
        <>
          <Field label="Nome completo">
            <input className={inputClass} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </Field>
          <Field label="E-mail">
            <input className={inputClass} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
        </>
      )}

      {modo === 'risco' && (
        <Field label="Perfil de risco">
          <select
            className={inputClass}
            value={form.perfilRisco}
            onChange={(e) => setForm({ ...form, perfilRisco: e.target.value as Perfil['perfilRisco'] })}
          >
            <option>Conservador</option>
            <option>Moderado</option>
            <option>Arrojado</option>
          </select>
          <p className="mt-2 text-xs text-muted-foreground">
            Define o tom das sugestões e simulações dentro da plataforma.
          </p>
        </Field>
      )}

      {modo === 'preferencias' && (
        <>
          <Field label="Moeda">
            <input className={inputClass} value={form.moeda} onChange={(e) => setForm({ ...form, moeda: e.target.value })} />
          </Field>
          <Field label="Idioma">
            <input className={inputClass} value={form.idioma} onChange={(e) => setForm({ ...form, idioma: e.target.value })} />
          </Field>
          <Field label="Tema">
            <select className={inputClass} value={form.tema} onChange={(e) => setForm({ ...form, tema: e.target.value as Perfil['tema'] })}>
              <option>Escuro</option>
              <option>Claro</option>
            </select>
            <p className="mt-2 text-xs text-muted-foreground">
              Nesta versão de demonstração apenas o tema escuro está disponível.
            </p>
          </Field>
        </>
      )}

      <Button variant="primary" className="w-full mt-2" onClick={salvar}>
        Salvar alterações
      </Button>
    </Modal>
  )
}
