import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string | number
  username: string
  email: string
  avatar?: string
  fullName?: string
  title?: string
  department?: string
  phone?: string
  location?: string
  timezone?: string
  language?: string
  bio?: string
  emailNotifications?: boolean
  productUpdates?: boolean
  twoFactorEnabled?: boolean
  [key: string]: unknown
}

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

interface UserActions {
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },

      setToken: (token) => {
        set({ token })
        if (token) {
          localStorage.setItem('token', token)
        } else {
          localStorage.removeItem('token')
        }
      },

      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        })
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      },

      updateUser: (updatedUser) => {
        set((state) => {
          const newUser = state.user ? { ...state.user, ...updatedUser } : null
          if (newUser) {
            localStorage.setItem('user', JSON.stringify(newUser))
          }
          return { user: newUser }
        })
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useUserStore
