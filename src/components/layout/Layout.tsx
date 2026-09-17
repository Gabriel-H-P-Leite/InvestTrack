import { Outlet } from 'react-router-dom'
import { Loader2, TriangleAlert } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { MobileHeader } from './MobileHeader'
import { MobileBottomNav } from './MobileBottomNav'
import { useApp } from '@/context/AppContext'

export function Layout() {
  const { carregando, erro, recarregar } = useApp()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          <div className="max-w-[1400px] mx-auto">
            {erro && (
              <div className="m-4 flex items-center gap-2 rounded-xl border border-loss/30 bg-loss/10 px-4 py-3 text-sm text-loss">
                <TriangleAlert size={16} className="flex-shrink-0" />
                <span className="flex-1">{erro}</span>
                <button
                  onClick={() => recarregar()}
                  className="rounded-lg border border-loss/40 px-2.5 py-1 text-xs font-medium hover:bg-loss/10"
                >
                  Tentar de novo
                </button>
              </div>
            )}

            {carregando ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="p-4 md:p-6 space-y-6 animate-fade-in">
                <Outlet />
              </div>
            )}
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}
