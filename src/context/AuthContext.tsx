import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, clearToken, getToken, setToken } from '@/lib/api'

export interface Usuario {
  id: string
  nome: string
  email: string
  perfilRisco?: string
}

interface AuthContextValue {
  usuario: Usuario | null
  carregando: boolean
  autenticado: boolean
  entrar: (email: string, senha: string) => Promise<void>
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>
  sair: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  // Revalida o token salvo ao abrir o app
  useEffect(() => {
    let cancelado = false

    async function validar() {
      if (!getToken()) {
        setCarregando(false)
        return
      }
      try {
        const { user } = await api.get<{ user: Usuario }>('/auth/me')
        if (!cancelado) setUsuario(user)
      } catch {
        clearToken()
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    validar()
    return () => {
      cancelado = true
    }
  }, [])

  const entrar = useCallback(async (email: string, senha: string) => {
    const { token, user } = await api.post<{ token: string; user: Usuario }>('/auth/login', {
      email,
      senha,
    })
    setToken(token)
    setUsuario(user)
  }, [])

  const cadastrar = useCallback(async (nome: string, email: string, senha: string) => {
    const { token, user } = await api.post<{ token: string; user: Usuario }>('/auth/register', {
      nome,
      email,
      senha,
    })
    setToken(token)
    setUsuario(user)
  }, [])

  const sair = useCallback(() => {
    clearToken()
    setUsuario(null)
  }, [])

  const value = useMemo(
    () => ({ usuario, carregando, autenticado: !!usuario, entrar, cadastrar, sair }),
    [usuario, carregando, entrar, cadastrar, sair]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
