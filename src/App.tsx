import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { ToastProvider } from '@/context/ToastContext'
import { Layout } from '@/components/layout/Layout'

import Dashboard from '@/pages/Dashboard'
import ContaFinanceira from '@/pages/ContaFinanceira'
import Carteira from '@/pages/Carteira'
import Transacoes from '@/pages/Transacoes'
import Extrato from '@/pages/Extrato'
import Rentabilidade from '@/pages/Rentabilidade'
import Proventos from '@/pages/Proventos'
import Analise from '@/pages/Analise'
import Metas from '@/pages/Metas'
import Academia from '@/pages/Academia'
import Simuladores from '@/pages/Simuladores'
import Notificacoes from '@/pages/Notificacoes'
import Perfil from '@/pages/Perfil'

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/conta-financeira" element={<ContaFinanceira />} />
              <Route path="/carteira" element={<Carteira />} />
              <Route path="/transacoes" element={<Transacoes />} />
              <Route path="/extrato" element={<Extrato />} />
              <Route path="/rentabilidade" element={<Rentabilidade />} />
              <Route path="/proventos" element={<Proventos />} />
              <Route path="/analise" element={<Analise />} />
              <Route path="/metas" element={<Metas />} />
              <Route path="/academia" element={<Academia />} />
              <Route path="/simuladores" element={<Simuladores />} />
              <Route path="/notificacoes" element={<Notificacoes />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  )
}
