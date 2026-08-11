import apiClient from './client'
import type { DashboardStats, TierDistribution, RevenueData, UpgradeAlert } from '@/types'

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get('/dashboard/stats')
    return data
  },

  getTierDistribution: async (): Promise<TierDistribution[]> => {
    const { data } = await apiClient.get('/dashboard/tier-distribution')
    return data
  },

  getRevenue: async (days = 7): Promise<RevenueData[]> => {
    const { data } = await apiClient.get('/dashboard/revenue', { params: { days } })
    return data
  },

  getUpgradeAlerts: async (): Promise<UpgradeAlert[]> => {
    const { data } = await apiClient.get('/dashboard/upgrade-alerts')
    return data
  },

  getRecentActivity: async () => {
    const { data } = await apiClient.get('/dashboard/recent-activity')
    return data
  },
}
