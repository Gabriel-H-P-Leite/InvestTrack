import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileHeader } from './MobileHeader'
import { MobileBottomNav } from './MobileBottomNav'

export function Layout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          <div className="max-w-[1400px] mx-auto">
            <div className="p-4 md:p-6 space-y-6 animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}
