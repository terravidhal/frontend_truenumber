import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types pour l'utilisateur et l'état d'authentification
interface User {
  id: string
  username: string
  email: string
  phone: string
  role: 'admin' | 'client'
  balance: number
}

interface AuthState {
  // État
  user: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Actions
  login: (token: string, user: User) => void
  logout: () => void
  register: (user: User) => void
  updateUser: (user: User) => void
  updateUserFromAPI: (userData: Partial<User>) => void
  checkAuth: () => boolean
}

// Store Zustand avec persistance
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      token: null,
      isAuthenticated: false,
      
      // Action de connexion
      login: (token: string, user: User) => {
        // Stocke dans localStorage
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(user))
        
        // Met à jour le store
        set({
          token,
          user,
          isAuthenticated: true,
        })
      },
      
      // Action de déconnexion
      logout: () => {
        // Nettoie localStorage
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        
        // Met à jour le store
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
      },
      
      // Action d'inscription
      register: (user: User) => {
        set({
          user,
          isAuthenticated: false, // Pas encore connecté après inscription
        })
      },
      
      // Action de mise à jour utilisateur
      updateUser: (user: User) => {
        // Met à jour localStorage
        localStorage.setItem('auth_user', JSON.stringify(user))
        
        // Met à jour le store
        set({ user })
      },
      
      // Action de mise à jour utilisateur depuis l'API
      updateUserFromAPI: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData }
          // Met à jour localStorage
          localStorage.setItem('auth_user', JSON.stringify(updatedUser))
          
          // Met à jour le store
          set({ user: updatedUser })
        }
      },
      
      // Vérification de l'authentification
      checkAuth: () => {
        const token = localStorage.getItem('auth_token')
        const userStr = localStorage.getItem('auth_user')
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr)
            set({
              token,
              user,
              isAuthenticated: true,
            })
            return true
          } catch (error) {
            // Si erreur de parsing, nettoie tout
            get().logout()
            return false
          }
        }
        
        return false
      },
    }),
    {
      name: 'auth-storage', // Nom pour localStorage
      partialize: (state) => ({
        // Ne persiste que certaines parties de l'état
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
) 