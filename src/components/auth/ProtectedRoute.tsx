import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute() {
  const { autenticado, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    )
  }

  if (!autenticado) return <Navigate to="/login" replace />

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { autenticado, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    )
  }

  if (autenticado) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
