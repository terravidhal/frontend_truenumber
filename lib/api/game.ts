import { useMutation, useQuery } from '@tanstack/react-query'
import api from './axios'
import { GameHistoryItem } from './types'

// Hook pour jouer au jeu TrueNumber
interface PlayGameResponse {
  message: string
  generatedNumber: number
  balanceChange: number
  newBalance: number
}

export const usePlayGame = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<PlayGameResponse>('/game/play')
      return response.data
    },
  })
}

// Hook pour récupérer l'historique des parties
export const useGameHistory = () => {
  return useQuery({
    queryKey: ['game-history'],
    queryFn: async (): Promise<GameHistoryItem[]> => {
      const response = await api.get<GameHistoryItem[]>('/game/history')
      return response.data
    },
    staleTime: 60 * 1000,
    retry: false,
  })
} 