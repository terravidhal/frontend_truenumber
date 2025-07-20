"use client"

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Shield, Users, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useUserStats } from '@/lib/api/users'

export function SectionCards() {
  const { data: stats, isLoading, isError } = useUserStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Administrateurs</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <div className="flex items-center justify-center h-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Clients</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <div className="flex items-center justify-center h-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Administrateurs</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-600">
              Erreur
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Clients</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-600">
              Erreur
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }
      return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Administrateurs</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats?.adminCount || 0}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Utilisateurs avec privilèges <Shield className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Gestion complète de la plateforme
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Clients</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats?.clientCount || 0}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                Client
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Utilisateurs inscrits <Users className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Accès aux fonctionnalités de jeu
            </div>
          </CardFooter>
        </Card>
      </div>
    )
}
