'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Temps de fraîcheur par défaut (5 minutes)
            staleTime: 5 * 60 * 1000,
            // Temps de cache par défaut (10 minutes)
            gcTime: 10 * 60 * 1000,
            // Nombre de tentatives par défaut
            retry: (failureCount, error: any) => {
              // Ne pas retenter pour les erreurs 4xx (sauf 408, 429)
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return false
              }
              // Retenter jusqu'à 3 fois pour les autres erreurs
              return failureCount < 3
            },
            // Temps entre les tentatives
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch automatique quand la fenêtre reprend le focus
            refetchOnWindowFocus: false,
            // Refetch automatique quand reconnecté
            refetchOnReconnect: true,
          },
          mutations: {
            // Nombre de tentatives pour les mutations
            retry: 1,
            // Temps entre les tentatives
            retryDelay: 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
} 