import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Cargo } from '../api/types'

interface ProtectedRouteProps {
  requiredCargo: Cargo
  layout: React.ReactNode
}

export function ProtectedRoute({ requiredCargo, layout }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user || user.cargo !== requiredCargo) {
    return <Navigate to="/login" replace />
  }

  return <>{layout}</>
}
