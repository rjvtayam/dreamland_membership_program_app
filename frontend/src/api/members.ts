import apiClient from './client'
import type { Member, MemberWithCards, PaginatedResponse, Transaction } from '@/types'

interface ListMembersParams {
  search?: string
  page?: number
  limit?: number
}

export const membersApi = {
  list: async (params: ListMembersParams = {}): Promise<PaginatedResponse<Member>> => {
    const { data } = await apiClient.get('/members', { params })
    return data
  },

  search: async (q: string): Promise<Member[]> => {
    const { data } = await apiClient.get('/members/search', { params: { q } })
    return data
  },

  getById: async (id: number): Promise<MemberWithCards> => {
    const { data } = await apiClient.get(`/members/${id}`)
    return data
  },

  create: async (member: { name: string; contact_number: string; email?: string }): Promise<Member> => {
    const { data } = await apiClient.post('/members', member)
    return data
  },

  update: async (id: number, member: Partial<Member>): Promise<Member> => {
    const { data } = await apiClient.put(`/members/${id}`, member)
    return data
  },

  getTransactions: async (id: number, page = 1, limit = 20): Promise<PaginatedResponse<Transaction>> => {
    const { data } = await apiClient.get(`/members/${id}/transactions`, {
      params: { page, limit },
    })
    return data
  },
}
