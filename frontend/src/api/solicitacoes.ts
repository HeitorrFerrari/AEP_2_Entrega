import { api } from './client'
import type { SolicitacaoResponse, SolicitacaoRequest, AtualizarStatusRequest, Prioridade, TipoCategoria } from './types'

export const solicitacoesApi = {
  listar: (prioridade?: Prioridade, tipoCategoria?: TipoCategoria) => {
    const params = new URLSearchParams()
    if (prioridade) params.set('prioridade', prioridade)
    if (tipoCategoria) params.set('tipoCategoria', tipoCategoria)
    const qs = params.toString()
    return api.get<SolicitacaoResponse[]>(`/solicitacoes${qs ? `?${qs}` : ''}`)
  },
  buscarPorId: (id: number) => api.get<SolicitacaoResponse>(`/solicitacoes/${id}`),
  buscarPorProtocolo: (protocolo: string) => api.get<SolicitacaoResponse>(`/solicitacoes/protocolo/${protocolo}`),
  listarPendentes: () => api.get<SolicitacaoResponse[]>('/solicitacoes/pendentes'),
  listarAtrasadas: () => api.get<SolicitacaoResponse[]>('/solicitacoes/atrasadas'),
  criar: (body: SolicitacaoRequest) => api.post<SolicitacaoResponse>('/solicitacoes', body),
  atualizarStatus: (id: number, body: AtualizarStatusRequest) =>
    api.patch<SolicitacaoResponse>(`/solicitacoes/${id}/status`, body),
  deletar: (id: number) => api.delete(`/solicitacoes/${id}`),
  listarPorCidadao: (cidadaoId: number) => api.get<SolicitacaoResponse[]>(`/solicitacoes/cidadao/${cidadaoId}`),
}
