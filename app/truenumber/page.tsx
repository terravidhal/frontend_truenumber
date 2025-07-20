'use client'

import { ProtectedRoute } from '@/lib/utils/protected-route'
import { useAuthStore } from '@/lib/store/auth-store'
import { useGetUser, useLogout, useBalance } from '@/lib/api/auth'
import { usePlayGame, useGameHistory } from '@/lib/api/game'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, User, Mail, Phone, CreditCard, Shield, Gamepad2, History } from 'lucide-react'
import Link from 'next/link'

export default function TrueNumberPage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  )
}

function HomeContent() {
  const { user } = useAuthStore()
  const { data: userData, isLoading } = useGetUser()
  const logoutMutation = useLogout()
  const { data: balanceData, isLoading: isBalanceLoading, isError: isBalanceError } = useBalance()
  const playGameMutation = usePlayGame()
  const { data: historyData, isLoading: isHistoryLoading, isError: isHistoryError } = useGameHistory()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const handlePlayGame = async () => {
    playGameMutation.mutate(undefined, {
      onSuccess: (data) => {

        
        if (data.message === 'Vous avez gagné !') {
          toast.success(`Bravo ! Vous avez gagné (${data.generatedNumber}) : +50 points`)
        } else {
          toast.error(`Dommage... Vous avez perdu (${data.generatedNumber}) : -35 points`)
        }
        // Met à jour le solde dans le cache
        queryClient.setQueryData(['balance'], { balance: data.newBalance })
        // Met à jour le store utilisateur avec le nouveau solde
        if (userData) { // Use userData from useGetUser
          const { updateUserFromAPI } = useAuthStore.getState()
          updateUserFromAPI({ ...userData, balance: data.newBalance })
        }
        // Invalide l'historique pour le rafraîchir
        queryClient.invalidateQueries({ queryKey: ['game-history'] })
      },
      onError: () => {
        toast.error('Erreur lors de la partie. Veuillez réessayer.')
      },
    })
  }

  // Utilise les données du store ou de l'API
  const currentUser = userData || user

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 1. Header avec bienvenue et déconnexion */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Bienvenue sur TrueNumber
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Votre tableau de bord personnel
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {currentUser?.role === 'admin' && (
              <Button
                asChild
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Link href="/dashboard">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              disabled={logoutMutation.isPending}
              className="flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">
                {logoutMutation.isPending ? 'Déconnexion...' : 'Se déconnecter'}
              </span>
            </Button>
          </div>
        </div>

        {/* 2. Bouton de jeu et solde */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 w-full">
            <Button
              onClick={handlePlayGame}
              disabled={playGameMutation.isPending}
              className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center gap-2 w-full sm:w-auto"
            >
              <Gamepad2 className="h-5 w-5" />
              <span className="hidden sm:inline">
                {playGameMutation.isPending ? 'Génération en cours...' : 'Générer un nombre'}
              </span>
              <span className="sm:hidden">
                {playGameMutation.isPending ? 'Génération...' : 'Jouer'}
              </span>
            </Button>
            
            {isBalanceLoading ? (
              <span className="text-gray-600 dark:text-gray-300 animate-pulse text-center">Chargement du solde...</span>
            ) : isBalanceError ? (
              <span className="text-red-500 text-center">Erreur lors du chargement du solde</span>
            ) : (
              <span className="text-base sm:text-lg font-semibold text-indigo-700 dark:text-indigo-200 bg-white/70 dark:bg-gray-900/40 rounded px-3 sm:px-4 py-2 shadow text-center">
                Solde : {balanceData?.balance ?? 0} €
              </span>
            )}
          </div>
          
          {playGameMutation.isSuccess && playGameMutation.data && (
            <div className="mt-2 text-lg sm:text-xl font-bold text-indigo-700 dark:text-indigo-200 text-center">
              Nombre généré : {playGameMutation.data.generatedNumber}
              <div className="text-sm mt-1">
                {playGameMutation.data.message}
              </div>
            </div>
          )}
        </div>

        {/* 3. Card profil utilisateur */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil utilisateur
            </CardTitle>
            <CardDescription>
              Vos informations personnelles et votre statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {currentUser?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold">{currentUser?.username}</h3>
                  <Badge variant={currentUser?.role === 'admin' ? 'default' : 'secondary'}>
                    {currentUser?.role === 'admin' ? (
                      <>
                        <Shield className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Administrateur</span>
                        <span className="sm:hidden">Admin</span>
                      </>
                    ) : (
                      'Client'
                    )}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4" />
                    <span className="break-all">{currentUser?.email}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-gray-600 dark:text-gray-300">
                    <CreditCard className="h-4 w-4" />
                    <span>Solde: {balanceData?.balance ?? currentUser?.balance ?? 0} €</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4" />
                    <span className="break-all">{currentUser?.phone || 'Indisponible'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Card historique des transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historique des parties
            </CardTitle>
            <CardDescription>
              Consultez vos parties jouées et leurs résultats
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isHistoryLoading ? (
              <div className="text-gray-600 dark:text-gray-300">Chargement de l&apos;historique...</div>
            ) : isHistoryError ? (
              <div className="text-red-500">Erreur lors du chargement de l&apos;historique</div>
            ) : !historyData || historyData.length === 0 ? (
              <div className="text-gray-500">Aucune partie jouée pour le moment.</div>
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="min-w-full">
                  <thead className="sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <tr className="border-b">
                      <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Date</th>
                      <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Nombre</th>
                      <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Résultat</th>
                      <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Variation</th>
                      <th className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">Solde</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((item, index) => (
                      <tr key={item._id || `game-${index}-${item.date}`} className="border-b last:border-0">
                        <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap">
                          {new Date(item.date).toLocaleString()}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">{item.generatedNumber}</td>
                        <td className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
                          {item.result === 'gagné' ? (
                            <span className="text-green-600 font-semibold">Gagné</span>
                          ) : (
                            <span className="text-red-600 font-semibold">Perdu</span>
                          )}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
                          {item.balanceChange > 0 ? (
                            <span className="text-green-600">+{item.balanceChange}</span>
                          ) : (
                            <span className="text-red-600">{item.balanceChange}</span>
                          )}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">{item.newBalance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Debug info */}
            {/*<div className="mt-4 text-xs text-gray-500">
              Debug: Loading={isHistoryLoading.toString()}, Error={isHistoryError?.toString()}, 
              Data length={historyData?.length || 0}
            </div>*/}
          </CardContent>
        </Card>

        {/* Bouton Dashboard (seulement pour les admins) */}
        {currentUser?.role === 'admin' && (
          <div className="mt-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/dashboard">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Dashboard Administrateur
                  </CardTitle>
                  <CardDescription>
                    Accédez au panneau d&apos;administration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Gérez les utilisateurs, consultez les statistiques et administrez l&apos;application.
                  </p>
                </CardContent>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 