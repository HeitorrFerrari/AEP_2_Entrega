import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, FileText, AlertTriangle, Users } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/solicitacoes', label: 'Solicitações', icon: FileText, end: false },
  { to: '/denuncias', label: 'Denúncias', icon: AlertTriangle, end: false },
  { to: '/usuarios', label: 'Usuários', icon: Users, end: false },
]

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-900 tracking-tight">Urbano</span>
          <p className="text-xs text-slate-400 mt-0.5">Solicitações Urbanas</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
