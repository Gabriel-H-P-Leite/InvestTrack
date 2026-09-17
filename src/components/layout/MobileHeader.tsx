import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  BookOpen,
  Calculator,
  FileText,
  Gift,
  Landmark,
  LayoutDashboard,
  ArrowLeftRight,
  Menu,
  PieChart,
  Target,
  TrendingUp,
  User,
  Wallet,
  X,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn, initials } from '@/lib/utils'

// Páginas de ativos ficam fora do menu (sem cotação em tempo real),
// mas as rotas continuam funcionando por URL direta.
const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/conta-financeira', label: 'Conta Financeira', icon: Landmark },
  { to: '/extrato', label: 'Extrato', icon: FileText },
  { to: '/metas', label: 'Metas', icon: Target },
  { to: '/academia', label: 'Academia', icon: BookOpen },
  { to: '/simuladores', label: 'Simuladores', icon: Calculator },
  { to: '/perfil', label: 'Perfil', icon: User },
]

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/conta-financeira': 'Conta Financeira',
  '/carteira': 'Carteira',
  '/transacoes': 'Transações',
  '/extrato': 'Extrato',
  '/rentabilidade': 'Rentabilidade',
  '/proventos': 'Proventos',
  '/analise': 'Análise',
  '/metas': 'Metas',
  '/academia': 'Academia',
  '/simuladores': 'Simuladores',
  '/notificacoes': 'Notificações',
  '/perfil': 'Perfil',
}

export function MobileHeader() {
  const [open, setOpen] = useState(false)
  const { state } = useApp()
  const location = useLocation()
  const naoLidas = state.notificacoes.filter((n) => !n.lida).length
  const title = TITLES[location.pathname] ?? 'INVESTTRACK'

  return (
    <>
      <header className="lg:hidden sticky top-0 z-30 bg-sidebar border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm font-bold text-foreground">{title}</span>
        <NavLink
          to="/notificacoes"
          className="relative rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
          aria-label="Notificações"
        >
          <Bell size={20} />
          {naoLidas > 0 && (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-loss" />
          )}
        </NavLink>
      </header>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-72 max-w-[80vw] h-full bg-sidebar border-r border-sidebar-border flex flex-col animate-slide-in">
            <div className="flex items-center justify-between gap-3 px-4 py-5 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <BarChart3 size={16} className="text-white" />
                </div>
                <div>
                  <span className="font-bold text-sm tracking-wider text-foreground">INVEST</span>
                  <span className="font-bold text-sm tracking-wider text-primary">TRACK</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
                aria-label="Fechar menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
              <ul className="space-y-0.5">
                {NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary/15 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        )
                      }
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-sidebar-border p-3">
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-secondary">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">{initials(state.perfil.nome)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{state.perfil.nome}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{state.perfil.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
