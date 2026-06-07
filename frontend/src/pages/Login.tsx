import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { User, Briefcase } from 'lucide-react'
import { authApi } from '../api/auth'
import { usuariosApi } from '../api/usuarios'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import type { Cargo } from '../api/types'

type Area = 'CIDADAO' | 'FUNCIONARIO_PUBLICO'
type Tab = 'login' | 'cadastro'

const areaConfig: Record<Area, { label: string; icon: typeof User; redirect: string }> = {
  CIDADAO: { label: 'Cidadão', icon: User, redirect: '/cidadao' },
  FUNCIONARIO_PUBLICO: { label: 'Atendente / Gestor', icon: Briefcase, redirect: '/atendente' },
}

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [tab, setTab] = useState<Tab>('login')
  const [area, setArea] = useState<Area | null>(null)
  const [documento, setDocumento] = useState('')
  const [nome, setNome] = useState('')

  const loginMutation = useMutation({
    mutationFn: () => authApi.login(documento),
    onSuccess: (user) => {
      if (user.cargo !== area) {
        loginMutation.reset()
        setDocumento('')
        alert(`Perfil incorreto. Este documento pertence a um "${user.cargo === 'CIDADAO' ? 'Cidadão' : 'Atendente'}".`)
        return
      }
      login(user)
      navigate(areaConfig[area!].redirect)
    },
  })

  const cadastroMutation = useMutation({
    mutationFn: () => usuariosApi.criar({ nome: nome.trim(), documento: documento.trim(), cargo: area! as Cargo }),
    onSuccess: (user) => {
      login(user)
      navigate(areaConfig[area!].redirect)
    },
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!area || !documento.trim()) return
    loginMutation.mutate()
  }

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault()
    if (!area || !documento.trim() || !nome.trim()) return
    cadastroMutation.mutate()
  }

  const switchTab = (t: Tab) => {
    setTab(t)
    loginMutation.reset()
    cadastroMutation.reset()
    setDocumento('')
    setNome('')
  }

  const isPending = loginMutation.isPending || cadastroMutation.isPending
  const error = loginMutation.error || cadastroMutation.error

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Solicitações Urbanas</h1>
          <p className="text-slate-500 mt-1 text-sm">Acesse ou crie sua conta</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {(['login', 'cadastro'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-3 text-sm font-medium transition-colors
                  ${tab === t ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-5">
            {/* Seleção de perfil */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Perfil</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(areaConfig) as Area[]).map((a) => {
                  const { label, icon: Icon } = areaConfig[a]
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setArea(a)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-xs font-medium
                        ${area === a
                          ? a === 'CIDADAO' ? 'border-blue-500 bg-blue-50' : 'border-slate-700 bg-slate-100'
                          : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <Icon size={18} className={area === a ? 'text-slate-800' : 'text-slate-400'} />
                      <span className="text-slate-700">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">CPF / Documento</label>
                  <input
                    type="text"
                    value={documento}
                    onChange={e => setDocumento(e.target.value)}
                    placeholder="00000000000"
                    maxLength={14}
                    className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 font-mono"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-500">Documento não encontrado. Verifique ou cadastre-se.</p>
                )}

                <Button type="submit" className="w-full justify-center" disabled={!area || !documento.trim() || isPending}>
                  {isPending ? 'Verificando...' : 'Entrar'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleCadastro} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Nome completo</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">CPF / Documento</label>
                  <input
                    type="text"
                    value={documento}
                    onChange={e => setDocumento(e.target.value)}
                    placeholder="00000000000"
                    maxLength={14}
                    className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 font-mono"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-500">
                    {(error as Error).message || 'Erro ao cadastrar.'}
                  </p>
                )}

                <Button type="submit" className="w-full justify-center" disabled={!area || !documento.trim() || !nome.trim() || isPending}>
                  {isPending ? 'Cadastrando...' : 'Criar conta'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
