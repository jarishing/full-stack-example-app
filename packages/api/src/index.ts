// Export all types and schemas
export * from './types'

// Export AppRouter type from backend (this is a bit unusual but needed for tRPC client)
// In a proper setup, this would be in a separate types-only package
export type { AppRouter } from '../../../apps/api/src/router/index' 