import { createTRPCReact } from '@trpc/react-query'
// import type { AppRouter } from '@conduit/api-types'

// Temporary: Use any type until we have a real tRPC server
export const trpc = createTRPCReact<any>()

// tRPC client will be created in the providers with proper configuration
export { trpc as default }

function getAuthHeader() {
  // Get auth token from localStorage (Zustand persist storage)
  if (typeof window !== 'undefined') {
    try {
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        const { state } = JSON.parse(authStorage)
        if (state.token) {
          return `Token ${state.token}`
        }
      }
    } catch (error) {
      console.warn('Failed to get auth token from storage:', error)
    }
  }
  return ''
}