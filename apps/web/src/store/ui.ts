import { create } from 'zustand'

interface UIState {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  activeModal: string | null
  globalLoading: boolean
  notifications: Notification[]
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface UIActions {
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openModal: (modalId: string) => void
  closeModal: () => void
  setGlobalLoading: (loading: boolean) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

type UIStore = UIState & UIActions

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  theme: 'system',
  sidebarOpen: false,
  activeModal: null,
  globalLoading: false,
  notifications: [],

  // Actions
  setTheme: (theme) => {
    set({ theme })
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }))
  },

  setSidebarOpen: (sidebarOpen) => {
    set({ sidebarOpen })
  },

  openModal: (modalId) => {
    set({ activeModal: modalId })
  },

  closeModal: () => {
    set({ activeModal: null })
  },

  setGlobalLoading: (globalLoading) => {
    set({ globalLoading })
  },

  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      id,
      duration: 5000, // 5 seconds default
      ...notification,
    }

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id)
      }, newNotification.duration)
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  },
}))

// Export types for external use
export type { Notification } 