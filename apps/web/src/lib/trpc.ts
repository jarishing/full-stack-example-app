import { createTRPCReact } from '@trpc/react-query'
// TODO: Fix type imports from backend
// import type { AppRouter } from '@conduit/api-types'

// Temporary: Use any type until we resolve type sharing between packages
export const trpc = createTRPCReact<any>()

export function getAuthHeader() {
  // Get auth token from localStorage (Zustand persist storage)
  if (typeof window !== 'undefined') {
    try {
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        const { state } = JSON.parse(authStorage)
        if (state.token) {
          return `Bearer ${state.token}`
        }
      }
    } catch (error) {
      console.warn('Failed to get auth token from storage:', error)
    }
  }
  return ''
}

export { trpc as default }