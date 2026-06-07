import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, AlertTriangle, Users, LogOut } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/atendente/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/atendente/solicitacoes', label: 'Solicitações', icon: FileText },
  { to: '/atendente/denuncias', label: 'Denúncias', icon: AlertTriangle },
  { to: '/atendente/usuarios', label: 'Usuários', icon: Users },
]

export function AtendentLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-900">Área do Atendente</span>
          <p className="text-xs text-slate-400 mt-0.5">Solicitações Urbanas</p>
        </div>

        {user && (
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-medium text-slate-800 truncate">{user.nome}</p>
            <p className="text-xs text-slate-400 font-mono">{user.documento}</p>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-500 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
