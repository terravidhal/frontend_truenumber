import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import api from './axios'
import { useAuthStore } from '../store/auth-store'
import { RegisterFormData, LoginFormData } from '../validations/auth-schemas'
import { toast } from 'sonner'
import { User } from './types'

// Types pour les réponses API
interface RegisterResponse {
  message: string
}

interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    role: 'admin' | 'client'
  }
}

interface LogoutResponse {
  message: string
}

interface UserResponse {
  id: string
  username: string
  email: string
  phone: string
  role: 'admin' | 'client'
  balance: number
}

// Hook pour l'inscription
export const useRegister = () => {
  const router = useRouter()
  
  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await api.post<RegisterResponse>('/auth/register', data)
      return response.data
    },
    onSuccess: (data) => {
      toast.success('Inscription réussie ! Connectez-vous pour continuer.')
      router.push('/login')
    },
    onError: (error: any) => {
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.")
      console.error('Erreur lors de l\'inscription:', error)
    },
  })
}

// Hook pour la connexion
export const useLogin = () => {
  const router = useRouter()
  const { login } = useAuthStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post<LoginResponse>('/auth/login', data)
      return response.data
    },
    onSuccess: async (data) => {
      const partialUser = {
        id: data.user.id,
        username: data.user.username,
        role: data.user.role,
        email: '',
        phone: '',
        balance: 0,
      }
      login(data.token, partialUser)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Connexion réussie ! Bienvenue sur TrueNumber.')
      router.push('/truenumber')
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la connexion. Vérifiez vos identifiants.')
      console.error('Erreur lors de la connexion:', error)
    },
  })
}

// Hook pour la déconnexion
export const useLogout = () => {
  const router = useRouter()
  const { logout } = useAuthStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<LogoutResponse>('/auth/logout')
      return response.data
    },
    onSuccess: (data) => {
      logout()
      queryClient.clear()
      toast.success('Déconnexion réussie. À bientôt !')
      router.push('/')
    },
    onError: (error: any) => {
      logout()
      queryClient.clear()
      toast.error('Erreur lors de la déconnexion.')
      router.push('/')
    },
  })
}

// Hook pour récupérer les informations utilisateur
export const useGetUser = () => {
  const { updateUserFromAPI } = useAuthStore()
  
  const query = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<UserResponse> => {
      const response = await api.get<UserResponse>('/users/me')
      return response.data
    },
    retry: false, // Ne pas retenter en cas d'erreur
    staleTime: 5 * 60 * 1000, // Considère les données comme fraîches pendant 5 minutes
  })
  
  // Met à jour le store quand les données sont récupérées
  useEffect(() => {
    if (query.data) {
      updateUserFromAPI(query.data)
    }
  }, [query.data, updateUserFromAPI])
  
  return query
}

// Hook pour vérifier l'authentification
export const useCheckAuth = () => {
  const { isAuthenticated, checkAuth } = useAuthStore()
  
  return useQuery({
    queryKey: ['auth-check'],
    queryFn: async () => {
      // Vérifie d'abord le localStorage
      const isAuth = checkAuth()
      
      if (isAuth) {
        // Si authentifié localement, vérifie avec l'API
        try {
          await api.get('/users/me')
          return true
        } catch (error) {
          // Si erreur API, déconnecte localement
          useAuthStore.getState().logout()
          return false
        }
      }
      
      return false
    },
    enabled: !isAuthenticated, // Ne s'exécute que si pas déjà authentifié
    retry: false,
  })
} 

// Hook pour récupérer le solde de l'utilisateur
export const useBalance = () => {
  return useQuery({
    queryKey: ['balance'],
    queryFn: async (): Promise<{ balance: number }> => {
      const response = await api.get<{ balance: number }>('/game/balance')
      return response.data
    },
    staleTime: 60 * 1000, // 1 minute
    retry: false,
  })
} 