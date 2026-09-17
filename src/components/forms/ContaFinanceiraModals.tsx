import { useState } from 'react'
import { Modal, Field, inputClass } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Primitives'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/context/ToastContext'
import { formatBRL } from '@/lib/utils'

function useValor() {
  const [valor, setValor] = useState('')
  const numero = Number(valor.replace(',', '.'))
  const valido = numero > 0
  return { valor, setValor, numero, valido }
}

export function DepositoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useApp()
  const { toast } = useToast()
  const { valor, setValor, numero, valido } = useValor()
  const [metodo, setMetodo] = useState('PIX')

  const confirmar = () => {
    if (!valido) return
    dispatch({ type: 'DEPOSITAR', valor: numero, metodo })
    toast('Depósito confirmado', `${formatBRL(numero)} via ${metodo}`)
    setValor('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Depositar">
      <Field label="Valor (R$)">
        <input className={inputClass} inputMode="decimal" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} autoFocus />
      </Field>
      <Field label="Método">
        <select className={inputClass} value={metodo} onChange={(e) => setMetodo(e.target.value)}>
          <option>PIX</option>
          <option>TED</option>
          <option>Boleto</option>
        </select>
      </Field>
      <Button variant="primary" className="w-full mt-2" disabled={!valido} onClick={confirmar}>
        Confirmar depósito
      </Button>
    </Modal>
  )
}

export function SaqueModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch } = useApp()
  const { toast } = useToast()
  const { valor, setValor, numero, valido } = useValor()
  const [metodo, setMetodo] = useState('PIX')
  const excedeSaldo = numero > state.contaFinanceira.saldo

  const confirmar = () => {
    if (!valido || excedeSaldo) return
    dispatch({ type: 'SACAR', valor: numero, metodo })
    toast('Saque realizado', `${formatBRL(numero)} via ${metodo}`)
    setValor('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Sacar">
      <p className="text-xs text-muted-foreground mb-3">
        Saldo disponível: <span className="text-foreground font-semibold">{formatBRL(state.contaFinanceira.saldo)}</span>
      </p>
      <Field label="Valor (R$)">
        <input className={inputClass} inputMode="decimal" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} autoFocus />
      </Field>
      <Field label="Método">
        <select className={inputClass} value={metodo} onChange={(e) => setMetodo(e.target.value)}>
          <option>PIX</option>
          <option>TED</option>
        </select>
      </Field>
      {excedeSaldo && <p className="text-xs text-loss mb-2">Valor maior que o saldo disponível.</p>}
      <Button variant="destructive" className="w-full mt-2" disabled={!valido || excedeSaldo} onClick={confirmar}>
        Confirmar saque
      </Button>
    </Modal>
  )
}

export function TransferirModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch } = useApp()
  const { toast } = useToast()
  const { valor, setValor, numero, valido } = useValor()
  const excedeSaldo = numero > state.contaFinanceira.saldo

  const confirmar = () => {
    if (!valido || excedeSaldo) return
    dispatch({ type: 'TRANSFERIR_PARA_CARTEIRA', valor: numero })
    toast('Transferência concluída', `${formatBRL(numero)} disponível para investir`)
    setValor('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Transferir para investimentos">
      <p className="text-xs text-muted-foreground mb-3">
        Saldo disponível: <span className="text-foreground font-semibold">{formatBRL(state.contaFinanceira.saldo)}</span>
      </p>
      <Field label="Valor (R$)">
        <input className={inputClass} inputMode="decimal" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} autoFocus />
      </Field>
      {excedeSaldo && <p className="text-xs text-loss mb-2">Valor maior que o saldo disponível.</p>}
      <Button variant="primary" className="w-full mt-2" disabled={!valido || excedeSaldo} onClick={confirmar}>
        Confirmar transferência
      </Button>
    </Modal>
  )
}

export function ResgatarModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useApp()
  const { toast } = useToast()
  const { valor, setValor, numero, valido } = useValor()

  const confirmar = () => {
    if (!valido) return
    dispatch({ type: 'RESGATAR', valor: numero })
    toast('Resgate concluído', `${formatBRL(numero)} disponível na conta financeira`)
    setValor('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Resgatar investimentos">
      <Field label="Valor (R$)">
        <input className={inputClass} inputMode="decimal" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} autoFocus />
      </Field>
      <Button variant="primary" className="w-full mt-2" disabled={!valido} onClick={confirmar}>
        Confirmar resgate
      </Button>
    </Modal>
  )
}
