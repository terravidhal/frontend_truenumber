'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/auth-store'
import { useCheckAuth } from '../api/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'client'
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const { data: isAuthValid, isLoading } = useCheckAuth()

  useEffect(() => {
    // Si pas authentifié et pas en cours de vérification
    if (!isLoading && !isAuthenticated && !isAuthValid) {
      router.push('/')
      return
    }

    // Si authentifié mais rôle requis non respecté
    if (isAuthenticated && user && requiredRole && user.role !== requiredRole) {
      // Redirige vers la homepage si pas le bon rôle
      router.push('/truenumber')
      return
    }
  }, [isAuthenticated, isAuthValid, isLoading, user, requiredRole, router])

  // Affichage du fallback pendant le chargement
  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Si pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated && !isAuthValid) {
    return null
  }

  // Si rôle requis non respecté, ne rien afficher (redirection en cours)
  if (requiredRole && user && user.role !== requiredRole) {
    return null
  }

  // Si tout est OK, afficher le contenu
  return <>{children}</>
}

// Composant spécifique pour les routes admin
export function AdminRoute({ children, fallback }: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return (
    <ProtectedRoute requiredRole="admin" fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

// Composant spécifique pour les routes client
export function ClientRoute({ children, fallback }: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return (
    <ProtectedRoute requiredRole="client" fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

// Hook pour vérifier les permissions
export function useAuthGuard(requiredRole?: 'admin' | 'client') {
  const { isAuthenticated, user } = useAuthStore()
  const { data: isAuthValid, isLoading } = useCheckAuth()

  const hasAccess = () => {
    if (isLoading) return false
    if (!isAuthenticated || !isAuthValid) return false
    if (requiredRole && user && user.role !== requiredRole) return false
    return true
  }

  return {
    hasAccess: hasAccess(),
    isLoading,
    isAuthenticated,
    user,
  }
} 