import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, AlertCircle, Clock, CheckCircle2, Circle, XCircle } from 'lucide-react'
import { solicitacoesApi } from '../../api/solicitacoes'
import { useAuth } from '../../context/AuthContext'
import { PageHeader } from '../../components/PageHeader'
import { StatusBadge, PrioridadeBadge } from '../../components/Badge'
import type { SolicitacaoResponse, StatusSolicitacao } from '../../api/types'

const statusColor: Record<StatusSolicitacao, string> = {
  ABERTO: 'bg-slate-400',
  TRIAGEM: 'bg-blue-400',
  EM_EXECUCAO: 'bg-yellow-400',
  RESOLVIDO: 'bg-green-500',
  ENCERRADO: 'bg-slate-600',
}

const statusIcon: Record<StatusSolicitacao, typeof Circle> = {
  ABERTO: Circle,
  TRIAGEM: Clock,
  EM_EXECUCAO: Clock,
  RESOLVIDO: CheckCircle2,
  ENCERRADO: XCircle,
}

function SolicitacaoCard({ sol }: { sol: SolicitacaoResponse }) {
  const [open, setOpen] = useState(false)
  const Icon = statusIcon[sol.status]

  return (
    <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${sol.atrasada ? 'border-red-200' : 'border-slate-200'}`}>
      <button
        className="w-full text-left px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className={`mt-0.5 p-1.5 rounded-full ${statusColor[sol.status]} text-white shrink-0`}>
          <Icon size={14} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-slate-400">{sol.protocolo}</span>
            {sol.atrasada && (
              <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <AlertCircle size={11} /> Atrasada
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-800 mt-0.5 truncate">{sol.categoria.tipoCategoria}</p>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{sol.localizacao}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={sol.status} />
          <PrioridadeBadge prioridade={sol.prioridade} />
          {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-6 py-5 bg-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-sm">
            <Info label="Descrição" value={sol.descricao} />
            <Info label="Prazo" value={sol.prazoAlvo} />
            <Info label="Impacto" value={sol.impactoSocial} />
            <Info label="Identificação" value={sol.tipoIdentificacao} />
            {sol.justificativaAtraso && <Info label="Justificativa atraso" value={sol.justificativaAtraso} />}
          </div>

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Histórico de movimentações</p>

          {sol.historico.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Nenhuma movimentação registrada.</p>
          ) : (
            <ol className="relative border-l-2 border-slate-200 ml-2 space-y-4 pb-1">
              {[...sol.historico].reverse().map((h, i) => {
                const HIcon = statusIcon[h.status]
                return (
                  <li key={h.id} className="ml-5">
                    <div className={`absolute -left-2.5 w-5 h-5 rounded-full ${statusColor[h.status]} flex items-center justify-center border-2 border-white`}>
                      <HIcon size={10} className="text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <StatusBadge status={h.status} />
                      {i === 0 && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">atual</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{new Date(h.dataMovimentacao).toLocaleString('pt-BR')}</p>
                    {h.nomeResponsavel && (
                      <p className="text-xs text-slate-600 mt-0.5">Por: {h.nomeResponsavel}</p>
                    )}
                    {h.comentario && (
                      <p className="text-xs text-slate-500 italic mt-0.5">"{h.comentario}"</p>
                    )}
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      )}
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm text-slate-700">{value}</p>
    </div>
  )
}

export function MinhasSolicitacoes() {
  const { user } = useAuth()

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ['solicitacoes-cidadao', user?.id],
    queryFn: () => solicitacoesApi.listarPorCidadao(user!.id),
    enabled: !!user,
  })

  return (
    <div>
      <PageHeader
        title="Minhas Solicitações"
        description={`Solicitações registradas por ${user?.nome}`}
      />
      <div className="p-8 max-w-3xl mx-auto space-y-3">
        {isLoading && (
          <div className="text-sm text-slate-400 text-center py-12">Carregando...</div>
        )}

        {isError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            <AlertCircle size={16} />
            {(error as Error).message}
          </div>
        )}

        {!isLoading && !isError && data.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Circle size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhuma solicitação registrada ainda.</p>
          </div>
        )}

        {data.map(s => (
          <SolicitacaoCard key={s.id} sol={s} />
        ))}
      </div>
    </div>
  )
}
