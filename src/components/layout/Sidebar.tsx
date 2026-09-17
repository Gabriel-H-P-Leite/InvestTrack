import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  Calculator,
  ChevronLeft,
  ChevronRight,
  FileText,
  Gift,
  Landmark,
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  TrendingUp,
  User,
  Wallet,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn, initials } from '@/lib/utils'
import { useState } from 'react'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/conta-financeira', label: 'Conta Financeira', icon: Landmark },
  { to: '/carteira', label: 'Carteira', icon: Wallet },
  { to: '/transacoes', label: 'Transações', icon: ArrowLeftRight },
  { to: '/extrato', label: 'Extrato', icon: FileText },
  { to: '/rentabilidade', label: 'Rentabilidade', icon: TrendingUp },
  { to: '/proventos', label: 'Proventos', icon: Gift },
  { to: '/analise', label: 'Análise', icon: PieChart },
  { to: '/metas', label: 'Metas', icon: Target },
  { to: '/academia', label: 'Academia', icon: BookOpen },
  { to: '/simuladores', label: 'Simuladores', icon: Calculator },
]

export function Sidebar() {
  const { state } = useApp()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen sticky top-0 bg-sidebar border-r border-sidebar-border transition-all duration-300 z-30',
        collapsed ? 'w-[72px]' : 'w-60'
      )}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border min-h-[72px]">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
          <BarChart3 size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="truncate">
            <span className="font-bold text-sm tracking-wider text-foreground">INVEST</span>
            <span className="font-bold text-sm tracking-wider text-primary">TRACK</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group',
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )
                }
              >
                <item.icon size={18} className="flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3 space-y-2">
        <NavLink
          to="/perfil"
          className="flex items-center gap-3 px-2 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">{initials(state.perfil.nome)}</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{state.perfil.nome}</p>
              <p className="text-[11px] text-muted-foreground truncate">{state.perfil.email}</p>
            </div>
          )}
        </NavLink>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </aside>
  )
}
