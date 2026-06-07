import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

import { CidadaoLayout } from './components/CidadaoLayout'
import { AtendentLayout } from './components/AtendentLayout'

import { Home } from './pages/Home'
import { Login } from './pages/Login'

import { NovaSolicitacao } from './pages/cidadao/NovaSolicitacao'
import { AcompanharProtocolo } from './pages/cidadao/AcompanharProtocolo'
import { MinhasSolicitacoes } from './pages/cidadao/MinhasSolicitacoes'

import { Dashboard } from './pages/Dashboard'
import { Solicitacoes } from './pages/Solicitacoes'
import { SolicitacaoDetalhe } from './pages/SolicitacaoDetalhe'
import { Denuncias } from './pages/Denuncias'
import { Usuarios } from './pages/Usuarios'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />

          <Route
            path="cidadao"
            element={<ProtectedRoute requiredCargo="CIDADAO" layout={<CidadaoLayout />} />}
          >
            <Route index element={<Navigate to="nova" replace />} />
            <Route path="nova" element={<NovaSolicitacao />} />
            <Route path="minhas" element={<MinhasSolicitacoes />} />
            <Route path="acompanhar" element={<AcompanharProtocolo />} />
          </Route>

          <Route
            path="atendente"
            element={<ProtectedRoute requiredCargo="FUNCIONARIO_PUBLICO" layout={<AtendentLayout />} />}
          >
            <Route index element={<Navigate to="solicitacoes" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="solicitacoes" element={<Solicitacoes />} />
            <Route path="solicitacoes/:id" element={<SolicitacaoDetalhe />} />
            <Route path="denuncias" element={<Denuncias />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
