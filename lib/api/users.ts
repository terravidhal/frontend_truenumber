import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './axios'
import { toast } from 'sonner'
import { User, CreateUserData, UpdateUserData } from './types'

// Hook pour récupérer tous les utilisateurs (Admin seulement)
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['all-users'],
    queryFn: async (): Promise<User[]> => {
      const response = await api.get<User[]>('/users')
      return response.data
    },
    staleTime: 60 * 1000, // 1 minute
    retry: false,
  })
}

// Hook pour créer un nouvel utilisateur (Admin seulement)
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await api.post<{ message: string; user: User }>('/users', data)
      return response.data
    },
    onSuccess: (data) => {
      toast.success('Utilisateur créé avec succès !')
      queryClient.invalidateQueries({ queryKey: ['all-users'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
      queryClient.invalidateQueries({ queryKey: ['registration-trend'] })
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la création de l\'utilisateur.')
      console.error('Erreur création utilisateur:', error)
    },
  })
}

// Hook pour modifier un utilisateur (Admin seulement)
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }) => {
      // Si l'ID est undefined, utiliser l'email comme identifiant
      const identifier = id || data.email
      const response = await api.put<{ message: string; user: User }>(`/users/${identifier}`, data)
      return response.data
    },
    onSuccess: (data) => {
      toast.success('Utilisateur modifié avec succès !')
      queryClient.invalidateQueries({ queryKey: ['all-users'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la modification de l\'utilisateur.')
      console.error('Erreur modification utilisateur:', error)
    },
  })
}

// Hook pour supprimer un utilisateur (Admin seulement)
export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Si l'ID est undefined, on ne peut pas supprimer
      if (!id) {
        throw new Error('ID utilisateur non disponible pour la suppression')
      }
      const response = await api.delete<{ message: string }>(`/users/${id}`)
      return response.data
    },
    onSuccess: (data) => {
      toast.success('Utilisateur supprimé avec succès !')
      queryClient.invalidateQueries({ queryKey: ['all-users'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
      queryClient.invalidateQueries({ queryKey: ['registration-trend'] })
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la suppression de l\'utilisateur.')
      console.error('Erreur suppression utilisateur:', error)
    },
  })
}

// Hook pour récupérer les statistiques des utilisateurs (Admin seulement)
export const useUserStats = () => {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async (): Promise<{
      totalUsers: number
      adminCount: number
      clientCount: number
    }> => {
      const response = await api.get('/users/stats')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

// Hook pour récupérer l'évolution des inscriptions (Admin seulement)
export const useRegistrationTrend = () => {
  return useQuery({
    queryKey: ['registration-trend'],
    queryFn: async (): Promise<{
      date: string
      count: number
    }[]> => {
      try {
        const response = await api.get('/users/registration-trend')
        return response.data
      } catch (error) {
        console.log('API registration-trend not available, using mock data')
        // Données de test si l'API n'existe pas encore
        const mockData = []
        const today = new Date()
        for (let i = 30; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          mockData.push({
            date: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 15) + 5
          })
        }
        console.log('Generated mock data:', mockData.length, 'points')
        return mockData
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  })
} 