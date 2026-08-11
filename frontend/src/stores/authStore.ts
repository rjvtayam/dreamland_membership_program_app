import { create } from 'zustand'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize from localStorage
  const storedUser = localStorage.getItem('user')
  const storedToken = localStorage.getItem('access_token')

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken,
    isAuthenticated: !!storedToken,

    login: (user, token) => {
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('access_token', token)
      set({ user, token, isAuthenticated: true })
    },

    logout: () => {
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      set({ user: null, token: null, isAuthenticated: false })
    },
  }
})
