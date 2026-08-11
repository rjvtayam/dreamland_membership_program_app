import apiClient from './client'
import type { Transaction, PaginatedResponse } from '@/types'

interface ListTransactionsParams {
  card_id?: string
  member_id?: number
  start_date?: string
  end_date?: string
  page?: number
  limit?: number
}

export const transactionsApi = {
  create: async (transaction: {
    card_id: string
    token_package_id: number
    notes?: string
  }): Promise<Transaction> => {
    const { data } = await apiClient.post('/transactions', transaction)
    return data
  },

  list: async (params: ListTransactionsParams = {}): Promise<PaginatedResponse<Transaction>> => {
    const { data } = await apiClient.get('/transactions', { params })
    return data
  },

  getToday: async (): Promise<Transaction[]> => {
    const { data } = await apiClient.get('/transactions/today')
    return data
  },

  getSummary: async (startDate?: string, endDate?: string) => {
    const { data } = await apiClient.get('/transactions/summary', {
      params: { start_date: startDate, end_date: endDate },
    })
    return data
  },
}
