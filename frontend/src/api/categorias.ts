import { api } from './client'
import type { CategoriaResponse } from './types'

export const categoriasApi = {
  listar: () => api.get<CategoriaResponse[]>('/categorias'),
}
