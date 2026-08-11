import apiClient from './client'
import type { Card, CardLookup } from '@/types'

export const cardsApi = {
  lookup: async (cardId: string): Promise<CardLookup> => {
    const { data } = await apiClient.get(`/cards/lookup/${cardId}`)
    return data
  },

  getById: async (id: number): Promise<Card> => {
    const { data } = await apiClient.get(`/cards/${id}`)
    return data
  },

  getNextId: async (tier: string): Promise<{ card_id: string }> => {
    const { data } = await apiClient.get(`/cards/next-id/${tier}`)
    return data
  },

  getReadyForUpgrade: async () => {
    const { data } = await apiClient.get('/cards/ready-for-upgrade')
    return data
  },

  getByTier: async (tier: string, status = 'active'): Promise<Card[]> => {
    const { data } = await apiClient.get(`/cards/tier/${tier}`, {
      params: { status },
    })
    return data
  },

  upgrade: async (currentCardId: string): Promise<Card> => {
    const { data } = await apiClient.post('/cards/upgrade', {
      current_card_id: currentCardId,
    })
    return data
  },

  markWelcomeBonus: async (cardId: string) => {
    const { data } = await apiClient.put(`/cards/${cardId}/welcome-bonus`)
    return data
  },
}
