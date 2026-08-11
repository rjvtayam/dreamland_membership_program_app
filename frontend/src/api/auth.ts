import apiClient from './client'
import type { LoginResponse, User } from '@/types'

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await apiClient.post('/auth/login', { email, password })
    return data
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/me')
    return data
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await apiClient.put('/auth/password', {
      current_password: currentPassword,
      new_password: newPassword,
    })
    return data
  },
}
