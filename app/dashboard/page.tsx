"use client"

import { UsersTable } from "@/components/dashboard/users-table"
import { CreateUserDialog } from "@/components/dashboard/create-user-dialog"
import { GlobalHistoryTable } from "@/components/dashboard/global-history-table"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { useAuthStore } from "@/lib/store/auth-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, History } from "lucide-react"

export default function DashboardPage() {
  const { user: currentUser } = useAuthStore()
  const isAdmin = currentUser?.role === 'admin'

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Administrateur
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Gérez tous les utilisateurs et consultez l&apos;historique global
          </p>
        </div>
        {isAdmin && <CreateUserDialog />}
      </div>

      {/* SectionCards - Statistiques */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg sm:text-xl font-semibold">Statistiques des utilisateurs</h2>
        </div>
        <SectionCards />
      </div>

      {/* ChartAreaInteractive - Évolution des inscriptions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg sm:text-xl font-semibold">Évolution des inscriptions</h2>
        </div>
        <ChartAreaInteractive />
      </div>

      {/* Onglets */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Gestion des utilisateurs</span>
            <span className="sm:hidden">Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <History className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Historique global</span>
            <span className="sm:hidden">Historique</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg sm:text-xl font-semibold">Liste des utilisateurs</h2>
          </div>
          <UsersTable />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <GlobalHistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
