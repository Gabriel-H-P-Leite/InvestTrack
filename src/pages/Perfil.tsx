import { useState } from 'react'
import {
  Bell,
  ChevronRight,
  Info,
  LogOut,
  RefreshCw,
  Settings,
  Shield,
  ShieldCheck,
  User,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { Card, Badge, DemoBadge } from '@/components/ui/Primitives'
import { EditarPerfilModal } from '@/components/forms/EditarPerfilModal'
import { useToast } from '@/context/ToastContext'
import { initials } from '@/lib/utils'

export default function Perfil() {
  const { state, dispatch } = useApp()
  const { sair } = useAuth()
  const { toast } = useToast()
  const [modal, setModal] = useState<'perfil' | 'risco' | 'preferencias' | null>(null)
  const [confirmando, setConfirmando] = useState(false)

  const restaurar = () => {
    dispatch({ type: 'RESTAURAR_DADOS_DEMO' })
    toast('Dados restaurados', 'Todos os dados demonstrativos voltaram ao estado inicial.')
    setConfirmando(false)
  }

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-foreground">Perfil</h1>
          <DemoBadge />
        </div>
      </div>

      <Card className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-white">{initials(state.perfil.nome)}</span>
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold text-foreground truncate">{state.perfil.nome}</p>
          <p className="text-sm text-muted-foreground truncate">{state.perfil.email}</p>
          <Badge className="mt-1.5">{state.perfil.perfilRisco}</Badge>
        </div>
      </Card>

      <Card className="p-0 divide-y divide-border">
        <MenuItem icon={User} title="Editar perfil" subtitle="Nome, e-mail, foto" onClick={() => setModal('perfil')} />
        <MenuItem icon={ShieldCheck} title="Perfil de risco" subtitle={state.perfil.perfilRisco} onClick={() => setModal('risco')} />
        <MenuItemLink icon={Bell} title="Notificações" subtitle="Configurar alertas" to="/notificacoes" />
        <MenuItem icon={Settings} title="Preferências" subtitle="Moeda, idioma, tema" onClick={() => setModal('preferencias')} />
        <MenuItem
          icon={Shield}
          title="Segurança"
          subtitle="Senha, autenticação"
          onClick={() => toast('Modo demonstração', 'Segurança e autenticação não se aplicam a esta versão demo.', 'info')}
        />
        <MenuItem
          icon={RefreshCw}
          title="Dados de Demonstração"
          subtitle="Restaurar dados demonstrativos"
          onClick={() => setConfirmando(true)}
        />
        <MenuItem icon={LogOut} title="Sair da conta" subtitle={state.perfil.email} onClick={sair} />
      </Card>

      <div className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/[0.08] p-4 text-xs text-muted-foreground">
        <Info size={14} className="mt-0.5 flex-shrink-0 text-warning" />
        <p>
          Esta aplicação está em <span className="font-semibold text-foreground">Modo Demonstração</span>. Os dados
          não representam transações reais.
        </p>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        INVESTTRACK v1.0 — Fase 1
        <br />
        Plataforma de Gestão de Investimentos
      </p>

      {modal && <EditarPerfilModal open onClose={() => setModal(null)} modo={modal} />}

      {confirmando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmando(false)} />
          <Card className="relative z-10 max-w-sm w-full">
            <p className="text-sm font-bold text-foreground mb-1">Restaurar dados demonstrativos?</p>
            <p className="text-xs text-muted-foreground mb-4">
              Todos os valores, ativos, transações e metas voltarão ao estado inicial. Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmando(false)}
                className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={restaurar}
                className="flex-1 rounded-lg gradient-primary py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Restaurar
              </button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

function MenuItem({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: typeof User
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/40 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 text-primary">
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
    </button>
  )
}

function MenuItemLink({
  icon: Icon,
  title,
  subtitle,
  to,
}: {
  icon: typeof User
  title: string
  subtitle: string
  to: string
}) {
  return (
    <Link to={to} className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/40 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 text-primary">
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
    </Link>
  )
}
