import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Clock } from 'lucide-react'
import { solicitacoesApi } from '../api/solicitacoes'
import { usuariosApi } from '../api/usuarios'
import { useAuth } from '../context/AuthContext'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import { StatusBadge, PrioridadeBadge } from '../components/Badge'
import { Button } from '../components/Button'
import { PageHeader } from '../components/PageHeader'
import type { StatusSolicitacao, AtualizarStatusRequest } from '../api/types'

const transicoes: Record<StatusSolicitacao, StatusSolicitacao[]> = {
  ABERTO: ['TRIAGEM', 'EM_EXECUCAO', 'RESOLVIDO', 'ENCERRADO'],
  TRIAGEM: ['EM_EXECUCAO', 'RESOLVIDO', 'ENCERRADO'],
  EM_EXECUCAO: ['RESOLVIDO', 'ENCERRADO'],
  RESOLVIDO: ['ENCERRADO'],
  ENCERRADO: [],
}

const statusLabels: Record<StatusSolicitacao, string> = {
  ABERTO: 'Aberto',
  TRIAGEM: 'Triagem',
  EM_EXECUCAO: 'Em Execução',
  RESOLVIDO: 'Resolvido',
  ENCERRADO: 'Encerrado',
}

export function SolicitacaoDetalhe() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { user } = useAuth()
  const [novoStatus, setNovoStatus] = useState<StatusSolicitacao | ''>('')
  const [responsavelId, setResponsavelId] = useState<string>(
    user?.cargo === 'FUNCIONARIO_PUBLICO' ? String(user.id) : ''
  )
  const [comentario, setComentario] = useState('')
  const [justificativa, setJustificativa] = useState('')

  const { data: sol, isLoading } = useQuery({
    queryKey: ['solicitacao', id],
    queryFn: () => solicitacoesApi.buscarPorId(Number(id)),
  })

  const { data: usuarios = [] } = useQuery({
    queryKey: ['usuarios'],
    queryFn: usuariosApi.listar,
  })

  const funcionarios = usuarios.filter(u => u.cargo === 'FUNCIONARIO_PUBLICO')

  const atualizarStatus = useMutation({
    mutationFn: (body: AtualizarStatusRequest) => solicitacoesApi.atualizarStatus(Number(id), body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacao', id] })
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] })
      setNovoStatus('')
      setComentario('')
      setJustificativa('')
    },
  })

  const handleAtualizarStatus = () => {
    if (!novoStatus || !responsavelId || !comentario) return
    atualizarStatus.mutate({
      novoStatus,
      responsavelId: Number(responsavelId),
      comentario,
      justificativaAtraso: justificativa || undefined,
    })
  }

  if (isLoading) return <div className="p-8 text-slate-500 text-sm">Carregando...</div>
  if (!sol) return <div className="p-8 text-red-500 text-sm">Solicitação não encontrada.</div>

  const proximosStatus = transicoes[sol.status]

  return (
    <div>
      <PageHeader
        title={sol.protocolo}
        description={`${sol.categoria.tipoCategoria} · ${sol.localizacao}`}
        action={
          <Button variant="secondary" onClick={() => navigate('/atendente/solicitacoes')}>
            <ArrowLeft size={14} /> Voltar
          </Button>
        }
      />
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>Detalhes</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Status"><StatusBadge status={sol.status} /></Row>
              <Row label="Prioridade"><PrioridadeBadge prioridade={sol.prioridade} /></Row>
              <Row label="Impacto">{sol.impactoSocial}</Row>
              <Row label="Identificação">{sol.tipoIdentificacao}</Row>
              {sol.cidadao && <Row label="Cidadão">{sol.cidadao.nome}</Row>}
              <Row label="Criado em">{new Date(sol.criadoEm).toLocaleString('pt-BR')}</Row>
              <Row label="Prazo">{sol.prazoAlvo}</Row>
              {sol.atrasada && (
                <div className="flex items-center gap-2 text-red-600 font-medium">
                  <Clock size={14} /> Solicitação atrasada
                </div>
              )}
              {sol.justificativaAtraso && <Row label="Justificativa">{sol.justificativaAtraso}</Row>}
              <div className="pt-2">
                <p className="text-xs text-slate-400 mb-1">Descrição</p>
                <p className="text-slate-700 leading-relaxed">{sol.descricao}</p>
              </div>
            </CardContent>
          </Card>

          {proximosStatus.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Atualizar Status</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Novo Status</label>
                    <select
                      value={novoStatus}
                      onChange={e => setNovoStatus(e.target.value as StatusSolicitacao)}
                      className="w-full text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
                    >
                      <option value="">Selecionar...</option>
                      {proximosStatus.map(s => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Responsável</label>
                    <select
                      value={responsavelId}
                      onChange={e => setResponsavelId(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
                    >
                      <option value="">Selecionar...</option>
                      {funcionarios.map(u => (
                        <option key={u.id} value={u.id}>{u.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Comentário</label>
                  <textarea
                    value={comentario}
                    onChange={e => setComentario(e.target.value)}
                    rows={2}
                    className="w-full text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                    placeholder="Descreva a movimentação..."
                  />
                </div>
                {sol.atrasada && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Justificativa do Atraso <span className="text-red-500">*</span></label>
                    <textarea
                      value={justificativa}
                      onChange={e => setJustificativa(e.target.value)}
                      rows={2}
                      className="w-full text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                      placeholder="Explique o motivo do atraso..."
                    />
                  </div>
                )}
                {atualizarStatus.error && (
                  <p className="text-xs text-red-500">{(atualizarStatus.error as Error).message}</p>
                )}
                <Button
                  onClick={handleAtualizarStatus}
                  disabled={!novoStatus || !responsavelId || !comentario || atualizarStatus.isPending}
                >
                  {atualizarStatus.isPending ? 'Salvando...' : 'Atualizar Status'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader><CardTitle>Histórico</CardTitle></CardHeader>
            <CardContent className="p-0">
              {sol.historico.length === 0 ? (
                <p className="px-6 py-4 text-sm text-slate-400">Sem movimentações.</p>
              ) : (
                <ol className="relative border-l border-slate-200 ml-6 mr-4 py-4 space-y-4">
                  {sol.historico.map(h => (
                    <li key={h.id} className="ml-4">
                      <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white" />
                      <StatusBadge status={h.status} />
                      <p className="text-xs text-slate-500 mt-1">{new Date(h.dataMovimentacao).toLocaleString('pt-BR')}</p>
                      <p className="text-xs text-slate-700 mt-0.5">{h.nomeResponsavel}</p>
                      <p className="text-xs text-slate-500 mt-0.5 italic">{h.comentario}</p>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-xs text-slate-400 w-28 shrink-0 pt-0.5">{label}</span>
      <span className="text-slate-700">{children}</span>
    </div>
  )
}
