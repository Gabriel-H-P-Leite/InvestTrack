import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Landmark, FileText, Target, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { to: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { to: '/conta-financeira', label: 'Conta', icon: Landmark },
  { to: '/extrato', label: 'Extrato', icon: FileText },
  { to: '/metas', label: 'Metas', icon: Target },
  { to: '/perfil', label: 'Perfil', icon: User },
]

export function MobileBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-sidebar border-t border-border flex items-stretch">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )
          }
        >
          <item.icon size={19} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
