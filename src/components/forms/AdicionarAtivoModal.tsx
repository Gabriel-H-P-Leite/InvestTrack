import { useState } from 'react'
import { Modal, Field, inputClass } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Primitives'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/context/ToastContext'
import type { Categoria } from '@/types'

const CATEGORIAS: Categoria[] = ['Ações', 'FIIs', 'ETFs', 'Tesouro Direto', 'CDB', 'Cripto']

export function AdicionarAtivoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useApp()
  const { toast } = useToast()
  const [ticker, setTicker] = useState('')
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState<Categoria>('Ações')
  const [setor, setSetor] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [precoMedio, setPrecoMedio] = useState('')
  const [precoAtual, setPrecoAtual] = useState('')

  const valido = ticker.trim() && nome.trim() && Number(quantidade) > 0 && Number(precoMedio) > 0

  const confirmar = () => {
    if (!valido) return
    dispatch({
      type: 'ADICIONAR_ATIVO',
      ativo: {
        ticker: ticker.toUpperCase(),
        nome,
        categoria,
        setor: setor || categoria,
        quantidade: Number(quantidade.replace(',', '.')),
        precoMedio: Number(precoMedio.replace(',', '.')),
        precoAtual: Number((precoAtual || precoMedio).replace(',', '.')),
      },
    })
    toast('Ativo adicionado', `${ticker.toUpperCase()} incluído na sua carteira`)
    setTicker('')
    setNome('')
    setSetor('')
    setQuantidade('')
    setPrecoMedio('')
    setPrecoAtual('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Adicionar Ativo">
      <div className="grid grid-cols-2 gap-x-3">
        <Field label="Ticker">
          <input className={inputClass} placeholder="PETR4" value={ticker} onChange={(e) => setTicker(e.target.value)} autoFocus />
        </Field>
        <Field label="Categoria">
          <select className={inputClass} value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
            {CATEGORIAS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Nome do ativo">
        <input className={inputClass} placeholder="Petrobras PN" value={nome} onChange={(e) => setNome(e.target.value)} />
      </Field>
      <Field label="Setor (opcional)">
        <input className={inputClass} placeholder="Petróleo e Gás" value={setor} onChange={(e) => setSetor(e.target.value)} />
      </Field>
      <div className="grid grid-cols-3 gap-x-3">
        <Field label="Quantidade">
          <input className={inputClass} inputMode="decimal" placeholder="100" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        </Field>
        <Field label="Preço médio">
          <input className={inputClass} inputMode="decimal" placeholder="32,50" value={precoMedio} onChange={(e) => setPrecoMedio(e.target.value)} />
        </Field>
        <Field label="Preço atual">
          <input className={inputClass} inputMode="decimal" placeholder="36,80" value={precoAtual} onChange={(e) => setPrecoAtual(e.target.value)} />
        </Field>
      </div>
      <Button variant="primary" className="w-full mt-2" disabled={!valido} onClick={confirmar}>
        Adicionar à carteira
      </Button>
    </Modal>
  )
}
