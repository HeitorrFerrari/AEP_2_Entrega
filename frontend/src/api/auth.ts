import { api } from './client'
import type { UsuarioResponse } from './types'

export const authApi = {
  login: (documento: string) => api.post<UsuarioResponse>('/auth/login', { documento }),
}
