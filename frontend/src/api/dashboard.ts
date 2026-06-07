import { api } from './client'
import type { DashboardResponse } from './types'

export const dashboardApi = {
  obter: () => api.get<DashboardResponse>('/dashboard'),
}
