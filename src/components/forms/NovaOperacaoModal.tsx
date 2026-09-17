import { useState } from 'react'
import { Modal, Field, inputClass } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Primitives'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/context/ToastContext'
import type { TipoOperacao } from '@/types'
import { formatBRL } from '@/lib/utils'

const TIPOS: TipoOperacao[] = ['Compra', 'Venda', 'Aporte', 'Resgate', 'Dividendo']

export function NovaOperacaoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch } = useApp()
  const { toast } = useToast()
  const [ativoId, setAtivoId] = useState(state.ativos[0]?.id ?? '')
  const [tipo, setTipo] = useState<TipoOperacao>('Compra')
  const [quantidade, setQuantidade] = useState('')
  const [precoUnitario, setPrecoUnitario] = useState('')
  const [taxas, setTaxas] = useState('')
  const [data, setData] = useState(new Date().toISOString().slice(0, 10))

  const qtdNum = Number(quantidade.replace(',', '.'))
  const precoNum = Number(precoUnitario.replace(',', '.'))
  const taxasNum = Number((taxas || '0').replace(',', '.'))
  const valido = ativoId && qtdNum > 0 && precoNum > 0
  const total = qtdNum * precoNum

  const confirmar = () => {
    if (!valido) return
    dispatch({
      type: 'ADICIONAR_TRANSACAO',
      ativoId,
      tipo,
      quantidade: qtdNum,
      precoUnitario: precoNum,
      taxas: taxasNum,
      data,
    })
    const ativo = state.ativos.find((a) => a.id === ativoId)
    toast('Operação registrada', `${tipo} de ${ativo?.ticker} — ${formatBRL(total)}`)
    setQuantidade('')
    setPrecoUnitario('')
    setTaxas('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova Operação">
      <div className="grid grid-cols-2 gap-x-3">
        <Field label="Ativo">
          <select className={inputClass} value={ativoId} onChange={(e) => setAtivoId(e.target.value)}>
            {state.ativos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.ticker}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tipo">
          <select className={inputClass} value={tipo} onChange={(e) => setTipo(e.target.value as TipoOperacao)}>
            {TIPOS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-x-3">
        <Field label="Quantidade">
          <input className={inputClass} inputMode="decimal" placeholder="100" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} autoFocus />
        </Field>
        <Field label="Preço Unit. (R$)">
          <input className={inputClass} inputMode="decimal" placeholder="32,50" value={precoUnitario} onChange={(e) => setPrecoUnitario(e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-x-3">
        <Field label="Taxas (R$)">
          <input className={inputClass} inputMode="decimal" placeholder="0,00" value={taxas} onChange={(e) => setTaxas(e.target.value)} />
        </Field>
        <Field label="Data">
          <input className={inputClass} type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </Field>
      </div>
      {total > 0 && (
        <p className="text-xs text-muted-foreground mb-2">
          Total da operação: <span className="text-foreground font-semibold">{formatBRL(total)}</span>
        </p>
      )}
      <Button variant="primary" className="w-full mt-2" disabled={!valido} onClick={confirmar}>
        Registrar operação
      </Button>
    </Modal>
  )
}
