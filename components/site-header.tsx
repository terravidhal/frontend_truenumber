'use client'

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuthStore } from "@/lib/store/auth-store"
import { useLogout } from "@/lib/api/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Home } from "lucide-react"
import Link from "next/link"

export function SiteHeader() {
  const { user } = useAuthStore()
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard TrueNumber</h1>
        
        <div className="ml-auto flex items-center gap-4">
          {/* Informations utilisateur */}
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{user?.username}</span>
                <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                  {user?.role === 'admin' ? 'Admin' : 'Client'}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Bouton Homepage */}
          <Link href="/truenumber">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Accueil du jeu</span>
            </Button>
          </Link>
          
          {/* Bouton de déconnexion */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            disabled={logoutMutation.isPending}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">
              {logoutMutation.isPending ? 'Déconnexion...' : 'Déconnexion'}
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}
