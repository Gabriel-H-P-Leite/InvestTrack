import { useState, type FormEvent } from 'react'
import { BarChart3, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Primitives'
import { inputClass } from '@/components/ui/Modal'

export default function Login() {
  const { entrar, cadastrar } = useAuth()
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const cadastrando = modo === 'cadastro'

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setErro(null)

    if (cadastrando && !nome.trim()) return setErro('Informe seu nome.')
    if (!email.trim()) return setErro('Informe seu e-mail.')
    if (cadastrando && senha.length < 8) return setErro('A senha precisa ter pelo menos 8 caracteres.')
    if (!senha) return setErro('Informe sua senha.')

    setEnviando(true)
    try {
      if (cadastrando) {
        await cadastrar(nome.trim(), email.trim(), senha)
      } else {
        await entrar(email.trim(), senha)
      }
    } catch (e: any) {
      setErro(e?.message ?? 'Não foi possível concluir. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-wider text-foreground">INVEST</span>
            <span className="font-bold text-lg tracking-wider text-primary">TRACK</span>
          </div>
        </div>

        <div className="card-surface p-6">
          <h1 className="text-lg font-bold text-foreground mb-1">
            {cadastrando ? 'Criar conta' : 'Entrar'}
          </h1>
          <p className="text-sm text-muted-foreground mb-5">
            {cadastrando
              ? 'Sua conta já começa com dados de demonstração para explorar.'
              : 'Acesse sua conta para acompanhar seus investimentos.'}
          </p>

          <form onSubmit={enviar}>
            {cadastrando && (
              <label className="block mb-3">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Nome</span>
                <input
                  className={inputClass}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  autoComplete="name"
                />
              </label>
            )}

            <label className="block mb-3">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">E-mail</span>
              <input
                className={inputClass}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                autoComplete="email"
              />
            </label>

            <label className="block mb-4">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Senha</span>
              <input
                className={inputClass}
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder={cadastrando ? 'Mínimo de 8 caracteres' : '••••••••'}
                autoComplete={cadastrando ? 'new-password' : 'current-password'}
              />
            </label>

            {erro && (
              <p className="mb-3 rounded-lg border border-loss/30 bg-loss/10 px-3 py-2 text-xs text-loss">
                {erro}
              </p>
            )}

            <Button type="submit" variant="primary" className="w-full" disabled={enviando}>
              {enviando && <Loader2 size={15} className="animate-spin" />}
              {cadastrando ? 'Criar conta' : 'Entrar'}
            </Button>
          </form>

          <button
            onClick={() => {
              setModo(cadastrando ? 'login' : 'cadastro')
              setErro(null)
            }}
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {cadastrando ? 'Já tenho uma conta — entrar' : 'Não tenho conta — cadastrar'}
          </button>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          INVESTTRACK — Modo Demonstração. Os dados não representam transações reais.
        </p>
      </div>
    </div>
  )
}
