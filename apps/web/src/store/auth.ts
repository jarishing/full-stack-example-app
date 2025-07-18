import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@conduit/api-types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      setToken: (token: string) => {
        set({ token })
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
        // Clear localStorage
        localStorage.removeItem('auth-storage')
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
) 