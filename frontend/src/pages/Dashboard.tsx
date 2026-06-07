import { useQuery } from '@tanstack/react-query'
import { AlertCircle, FileText, Clock, TrendingUp } from 'lucide-react'
import { dashboardApi } from '../api/dashboard'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import type { StatusSolicitacao, TipoCategoria } from '../api/types'

const statusLabels: Record<StatusSolicitacao, string> = {
  ABERTO: 'Aberto',
  TRIAGEM: 'Triagem',
  EM_EXECUCAO: 'Em Execução',
  RESOLVIDO: 'Resolvido',
  ENCERRADO: 'Encerrado',
}

const categoriaLabels: Record<TipoCategoria, string> = {
  ILUMINACAO: 'Iluminação',
  BURACO: 'Buraco',
  PODA: 'Poda',
  SAUDE: 'Saúde',
  LIMPEZA: 'Limpeza',
  OUTRO: 'Outro',
}

function StatCard({ label, value, icon: Icon, accent }: {
  label: string
  value: number
  icon: typeof AlertCircle
  accent?: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${accent ?? 'bg-slate-100'}`}>
          <Icon size={20} className="text-slate-700" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.obter,
  })

  if (isLoading) return <div className="p-8 text-slate-500 text-sm">Carregando...</div>
  if (error || !data) return <div className="p-8 text-red-500 text-sm">Erro ao carregar dashboard.</div>

  const statusEntries = Object.entries(data.porStatus ?? {}) as [StatusSolicitacao, number][]
  const categoriaEntries = Object.entries(data.porCategoria ?? {}) as [TipoCategoria, number][]

  return (
    <div>
      <PageHeader title="Dashboard" description="Visão geral do sistema de solicitações urbanas" />
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total de Solicitações" value={data.totalSolicitacoes} icon={FileText} />
          <StatCard label="Total de Denúncias" value={data.totalDenuncias} icon={TrendingUp} />
          <StatCard
            label="Solicitações Atrasadas"
            value={data.atrasadas}
            icon={Clock}
            accent={data.atrasadas > 0 ? 'bg-red-100' : 'bg-slate-100'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Por Status</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  {statusEntries.map(([status, count]) => (
                    <tr key={status} className="border-t border-slate-100 first:border-0">
                      <td className="px-6 py-3 text-slate-600">{statusLabels[status]}</td>
                      <td className="px-6 py-3 text-right font-semibold text-slate-900">{count}</td>
                    </tr>
                  ))}
                  {statusEntries.length === 0 && (
                    <tr><td className="px-6 py-4 text-slate-400 text-center" colSpan={2}>Sem dados</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  {categoriaEntries.map(([cat, count]) => (
                    <tr key={cat} className="border-t border-slate-100 first:border-0">
                      <td className="px-6 py-3 text-slate-600">{categoriaLabels[cat]}</td>
                      <td className="px-6 py-3 text-right font-semibold text-slate-900">{count}</td>
                    </tr>
                  ))}
                  {categoriaEntries.length === 0 && (
                    <tr><td className="px-6 py-4 text-slate-400 text-center" colSpan={2}>Sem dados</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
