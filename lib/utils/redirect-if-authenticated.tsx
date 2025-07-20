'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/auth-store'
import { useCheckAuth } from '../api/auth'

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ReactNode
}

export function RedirectIfAuthenticated({ 
  children, 
  redirectTo = '/truenumber',
  fallback 
}: RedirectIfAuthenticatedProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { data: isAuthValid, isLoading } = useCheckAuth()

  useEffect(() => {
    // Si authentifié et pas en cours de vérification
    if (!isLoading && (isAuthenticated || isAuthValid)) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isAuthValid, isLoading, router, redirectTo])

  // Affichage du fallback pendant le chargement
  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Si authentifié, ne rien afficher (redirection en cours)
  if (isAuthenticated || isAuthValid) {
    return null
  }

  // Si pas authentifié, afficher le contenu
  return <>{children}</>
} 