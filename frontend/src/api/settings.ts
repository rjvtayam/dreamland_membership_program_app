import apiClient from './client'
import type { TierDefinition, TokenPackage } from '@/types'

export const settingsApi = {
  getTiers: async (): Promise<TierDefinition[]> => {
    const { data } = await apiClient.get('/settings/tiers')
    return data
  },

  updateTier: async (id: number, updates: Partial<TierDefinition>) => {
    const { data } = await apiClient.put(`/settings/tiers/${id}`, updates)
    return data
  },

  getPackages: async (): Promise<TokenPackage[]> => {
    const { data } = await apiClient.get('/settings/packages')
    return data
  },

  updatePackage: async (id: number, updates: Partial<TokenPackage>) => {
    const { data } = await apiClient.put(`/settings/packages/${id}`, updates)
    return data
  },
}
