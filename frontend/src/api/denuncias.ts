import { api } from './client'
import type { DenunciaResponse, DenunciaRequest } from './types'

export const denunciasApi = {
  listar: () => api.get<DenunciaResponse[]>('/denuncias'),
  buscarPorId: (id: number) => api.get<DenunciaResponse>(`/denuncias/${id}`),
  criar: (body: DenunciaRequest) => api.post<DenunciaResponse>('/denuncias', body),
  deletar: (id: number) => api.delete(`/denuncias/${id}`),
}
