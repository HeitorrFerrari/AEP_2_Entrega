import { Outlet, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function AnonimoLayout() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Solicitações Urbanas</span>
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={13} /> Voltar ao login
        </button>
      </header>
      <Outlet />
    </div>
  )
}
