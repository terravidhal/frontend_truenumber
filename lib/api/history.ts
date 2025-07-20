import { useQuery } from '@tanstack/react-query'
import api from './axios'
import { GameHistoryItem } from './types'

// Hook pour récupérer l'historique global (Admin seulement)
export const useGetAllHistory = () => {
  return useQuery({
    queryKey: ['all-history'],
    queryFn: async (): Promise<GameHistoryItem[]> => {
      const response = await api.get<GameHistoryItem[]>('/game/history/all')
      return response.data
    },
    staleTime: 60 * 1000, // 1 minute
    retry: false,
  })
} 