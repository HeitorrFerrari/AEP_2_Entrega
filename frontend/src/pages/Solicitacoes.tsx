import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Trash2, AlertCircle } from 'lucide-react'
import { solicitacoesApi } from '../api/solicitacoes'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/Table'
import { StatusBadge, PrioridadeBadge } from '../components/Badge'
import { Card } from '../components/Card'
import type { Prioridade, TipoCategoria } from '../api/types'

const prioridades: Prioridade[] = ['CRITICA', 'ALTA', 'MEDIA', 'BAIXA']
const categorias: TipoCategoria[] = ['ILUMINACAO', 'BURACO', 'PODA', 'SAUDE', 'LIMPEZA', 'OUTRO']

export function Solicitacoes() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [filtroPrioridade, setFiltroPrioridade] = useState<Prioridade | ''>('')
  const [filtroCategoria, setFiltroCategoria] = useState<TipoCategoria | ''>('')

  const { data = [], isLoading } = useQuery({
    queryKey: ['solicitacoes', filtroPrioridade, filtroCategoria],
    queryFn: () => solicitacoesApi.listar(filtroPrioridade || undefined, filtroCategoria || undefined),
  })

  const deletar = useMutation({
    mutationFn: solicitacoesApi.deletar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solicitacoes'] }),
  })

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (confirm('Deletar esta solicitação?')) deletar.mutate(id)
  }

  return (
    <div>
      <PageHeader
        title="Solicitações"
        description="Gerencie e atualize o status das solicitações urbanas"
      />
      <div className="p-8 space-y-4">
        <div className="flex gap-3">
          <select
            value={filtroPrioridade}
            onChange={e => setFiltroPrioridade(e.target.value as Prioridade | '')}
            className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="">Todas as prioridades</option>
            {prioridades.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value as TipoCategoria | '')}
            className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="">Todas as categorias</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <Card>
          {isLoading ? (
            <div className="px-6 py-8 text-sm text-slate-500">Carregando...</div>
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Protocolo</Th>
                  <Th>Categoria</Th>
                  <Th>Localização</Th>
                  <Th>Prioridade</Th>
                  <Th>Status</Th>
                  <Th>Prazo</Th>
                  <Th></Th>
                </tr>
              </Thead>
              <Tbody>
                {data.map(s => (
                  <Tr key={s.id} onClick={() => navigate(`/atendente/solicitacoes/${s.id}`)}>
                    <Td>
                      <span className="font-mono text-xs text-slate-500">{s.protocolo}</span>
                      {s.atrasada && (
                        <AlertCircle size={12} className="inline ml-1.5 text-red-500" />
                      )}
                    </Td>
                    <Td>{s.categoria.tipoCategoria}</Td>
                    <Td className="max-w-[200px] truncate">{s.localizacao}</Td>
                    <Td><PrioridadeBadge prioridade={s.prioridade} /></Td>
                    <Td><StatusBadge status={s.status} /></Td>
                    <Td className="text-xs text-slate-500">{s.prazoAlvo}</Td>
                    <Td>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => handleDelete(e, s.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </Td>
                  </Tr>
                ))}
                {data.length === 0 && (
                  <Tr>
                    <Td colSpan={7} className="text-center text-slate-400 py-8">
                      Nenhuma solicitação encontrada.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  )
}
