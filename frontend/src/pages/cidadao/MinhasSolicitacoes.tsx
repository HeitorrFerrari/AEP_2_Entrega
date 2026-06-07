import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { solicitacoesApi } from '../../api/solicitacoes'
import { useAuth } from '../../context/AuthContext'
import { PageHeader } from '../../components/PageHeader'
import { Card } from '../../components/Card'
import { Table, Thead, Th, Tbody, Tr, Td } from '../../components/Table'
import { StatusBadge, PrioridadeBadge } from '../../components/Badge'

export function MinhasSolicitacoes() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data = [], isLoading } = useQuery({
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
      <div className="p-8">
        <Card>
          {isLoading ? (
            <div className="px-6 py-8 text-sm text-slate-500">Carregando...</div>
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Protocolo</Th>
                  <Th>Categoria</Th>
                  <Th>Prioridade</Th>
                  <Th>Status</Th>
                  <Th>Prazo</Th>
                </tr>
              </Thead>
              <Tbody>
                {data.map(s => (
                  <Tr key={s.id} onClick={() => navigate(`/cidadao/acompanhar?protocolo=${s.protocolo}`)}>
                    <Td>
                      <span className="font-mono text-xs text-slate-500">{s.protocolo}</span>
                      {s.atrasada && <AlertCircle size={12} className="inline ml-1.5 text-red-500" />}
                    </Td>
                    <Td>{s.categoria.tipoCategoria}</Td>
                    <Td><PrioridadeBadge prioridade={s.prioridade} /></Td>
                    <Td><StatusBadge status={s.status} /></Td>
                    <Td className="text-xs text-slate-500">{s.prazoAlvo}</Td>
                  </Tr>
                ))}
                {data.length === 0 && (
                  <Tr>
                    <Td colSpan={5} className="text-center text-slate-400 py-8">
                      Nenhuma solicitação registrada ainda.
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
