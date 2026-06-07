import { useNavigate } from 'react-router-dom'
import { User, Briefcase } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleArea = (area: 'cidadao' | 'atendente') => {
    if (user) {
      const isCidadao = user.cargo === 'CIDADAO'
      if (area === 'cidadao' && isCidadao) { navigate('/cidadao'); return }
      if (area === 'atendente' && !isCidadao) { navigate('/atendente'); return }
    }
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Solicitações Urbanas</h1>
        <p className="text-slate-500 mt-2 text-sm">Selecione sua área de acesso</p>
      </div>

      <div className="flex gap-6">
        <button
          onClick={() => handleArea('cidadao')}
          className="flex flex-col items-center gap-4 p-10 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all w-56 group"
        >
          <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
            <User size={32} className="text-blue-600" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-900">Área do Cidadão</p>
            <p className="text-xs text-slate-500 mt-1">Registrar solicitações e acompanhar status</p>
          </div>
        </button>

        <button
          onClick={() => handleArea('atendente')}
          className="flex flex-col items-center gap-4 p-10 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all w-56 group"
        >
          <div className="p-4 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors">
            <Briefcase size={32} className="text-slate-700" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-900">Área do Atendente</p>
            <p className="text-xs text-slate-500 mt-1">Gerenciar e atualizar solicitações</p>
          </div>
        </button>
      </div>
    </div>
  )
}
