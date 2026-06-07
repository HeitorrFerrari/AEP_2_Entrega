import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Search, AlertCircle, Clock } from 'lucide-react'
import { solicitacoesApi } from '../../api/solicitacoes'
import { PageHeader } from '../../components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card'
import { Button } from '../../components/Button'
import { StatusBadge, PrioridadeBadge } from '../../components/Badge'

export function AcompanharProtocolo() {
  const [searchParams] = useSearchParams()
  const [input, setInput] = useState(searchParams.get('protocolo') ?? '')
  const [protocolo, setProtocolo] = useState(searchParams.get('protocolo') ?? '')

  useEffect(() => {
    const p = searchParams.get('protocolo')
    if (p) { setInput(p); setProtocolo(p) }
  }, [])

  const { data, isLoading, error } = useQuery({
    queryKey: ['solicitacao-protocolo', protocolo],
    queryFn: () => solicitacoesApi.buscarPorProtocolo(protocolo),
    enabled: !!protocolo,
    retry: false,
  })

  const handleBuscar = () => {
    if (input.trim()) setProtocolo(input.trim().toUpperCase())
  }

  return (
    <div>
      <PageHeader title="Acompanhar Solicitação" description="Informe o protocolo recebido no momento do registro" />
      <div className="p-8 max-w-2xl space-y-4">
        <Card>
          <CardContent>
            <div className="flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                placeholder="Ex: SOL-20260607143022-0001"
                className="flex-1 text-sm font-mono border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              <Button onClick={handleBuscar} disabled={!input.trim()}>
                <Search size={14} /> Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <p className="text-sm text-slate-500 px-2">Buscando...</p>
        )}

        {error && (
          <Card>
            <CardContent className="flex items-center gap-3 text-amber-700">
              <AlertCircle size={18} />
              <p className="text-sm">Protocolo não encontrado. Verifique e tente novamente.</p>
            </CardContent>
          </Card>
        )}

        {data && (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Situação da Solicitação</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Row label="Protocolo">
                  <span className="font-mono text-slate-700">{data.protocolo}</span>
                </Row>
                <Row label="Status"><StatusBadge status={data.status} /></Row>
                <Row label="Categoria">{data.categoria.tipoCategoria} — {data.categoria.descricao}</Row>
                <Row label="Prioridade"><PrioridadeBadge prioridade={data.prioridade} /></Row>
                <Row label="Prazo alvo">{data.prazoAlvo}</Row>
                <Row label="Atrasada">
                  {data.atrasada
                    ? <span className="flex items-center gap-1 text-red-600"><Clock size={13} /> Sim</span>
                    : <span className="text-green-600">Não</span>}
                </Row>
                {data.justificativaAtraso && (
                  <Row label="Justificativa">{data.justificativaAtraso}</Row>
                )}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2">Descrição</p>
                  <p className="text-slate-700 leading-relaxed">{data.descricao}</p>
                </div>
              </CardContent>
            </Card>

            {data.historico.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Histórico de Movimentações</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <ol className="relative border-l border-slate-200 ml-6 mr-4 py-4 space-y-4">
                    {data.historico.map(h => (
                      <li key={h.id} className="ml-4">
                        <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white" />
                        <StatusBadge status={h.status} />
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(h.dataMovimentacao).toLocaleString('pt-BR')}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">{h.nomeResponsavel}</p>
                        <p className="text-xs text-slate-500 italic mt-0.5">{h.comentario}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-xs text-slate-400 w-28 shrink-0 pt-0.5">{label}</span>
      <span>{children}</span>
    </div>
  )
}
