import { api } from './client'
import type { UsuarioResponse, UsuarioRequest } from './types'

export const usuariosApi = {
  listar: () => api.get<UsuarioResponse[]>('/usuarios'),
  buscarPorId: (id: number) => api.get<UsuarioResponse>(`/usuarios/${id}`),
  criar: (body: UsuarioRequest) => api.post<UsuarioResponse>('/usuarios', body),
  atualizar: (id: number, body: UsuarioRequest) => api.put<UsuarioResponse>(`/usuarios/${id}`, body),
  deletar: (id: number) => api.delete(`/usuarios/${id}`),
}
