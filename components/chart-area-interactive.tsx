"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { useRegistrationTrend } from '@/lib/api/users'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Loader2, AlertCircle, Users } from "lucide-react"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]

const chartConfig = {
  inscriptions: {
    label: "Inscriptions",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const { data: trendData, isLoading, isError } = useRegistrationTrend()

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  // Transformer les données de l'API pour le format attendu par le graphique
  const chartData = React.useMemo(() => {
    if (!trendData || trendData.length === 0) return []
    
    const transformed = trendData.map((item) => ({
      date: item.date,
      inscriptions: item.count,
    }))
    
    return transformed
  }, [trendData])

  // Créer des données étendues pour un graphique plus visible avec peu de données
  const extendedData = React.useMemo(() => {
    if (!trendData || trendData.length === 0) return []
    
    const baseData = trendData.map((item) => ({
      date: item.date,
      inscriptions: item.count,
    }))
    
    // Si on a peu de données, créer un graphique avec des points répétés
    if (baseData.length === 1) {
      const singlePoint = baseData[0]
      return [
        { date: singlePoint.date, inscriptions: 0 },
        { date: singlePoint.date, inscriptions: singlePoint.inscriptions },
        { date: singlePoint.date, inscriptions: singlePoint.inscriptions },
      ]
    }
    
    if (baseData.length === 2) {
      const [point1, point2] = baseData
      return [
        { date: point1.date, inscriptions: 0 },
        { date: point1.date, inscriptions: point1.inscriptions },
        { date: point2.date, inscriptions: point2.inscriptions },
        { date: point2.date, inscriptions: point2.inscriptions },
      ]
    }
    
    return baseData
  }, [trendData])

  const filteredData = React.useMemo(() => {
    return chartData
  }, [chartData, timeRange])

  // États de chargement et d'erreur
  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Évolution des inscriptions</CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Chargement des données...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Évolution des inscriptions</CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2 text-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="text-sm font-medium text-red-600">Erreur de chargement</p>
              <p className="text-xs text-muted-foreground">Impossible de récupérer les données d'évolution</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!trendData || trendData.length === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Évolution des inscriptions</CardTitle>
          <CardDescription>Aucune donnée disponible</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2 text-center">
              <Users className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Aucune donnée disponible</p>
              <p className="text-xs text-muted-foreground">Les données d'évolution apparaîtront ici</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Si peu de données, créer un graphique simple mais visible
  if (trendData.length < 3) {
    
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Évolution des inscriptions</CardTitle>
          <CardDescription>
            {trendData.length} point{trendData.length !== 1 ? 's' : ''} de données - Graphique simplifié
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="mb-4 text-sm text-muted-foreground">
            Données affichées: {trendData.length} point{trendData.length !== 1 ? 's' : ''} réel{trendData.length !== 1 ? 's' : ''}
          </div>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={extendedData}>
              <defs>
                <linearGradient id="fillInscriptions" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("fr-FR", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("fr-FR", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="inscriptions"
                type="natural"
                fill="url(#fillInscriptions)"
                stroke="var(--primary)"
                strokeWidth={3}
              />
            </AreaChart>
          </ChartContainer>
          
          {/* Statistiques rapides */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total inscriptions</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {trendData.reduce((sum, item) => sum + item.count, 0)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">Moyenne par jour</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {(trendData.reduce((sum, item) => sum + item.count, 0) / trendData.length).toFixed(1)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Évolution des inscriptions</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Évolution du nombre d'inscriptions sur la plateforme
          </span>
          <span className="@[540px]/card:hidden">Évolution des inscriptions</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 derniers mois</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 derniers jours</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 derniers jours</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="3 derniers mois" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 derniers mois
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 derniers jours
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 derniers jours
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="mb-4 text-sm text-muted-foreground">
          Données affichées: {filteredData.length} point{filteredData.length !== 1 ? 's' : ''}
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={trendData.length < 3 ? extendedData : filteredData}>
            <defs>
              <linearGradient id="fillInscriptions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="inscriptions"
              type="natural"
              fill="url(#fillInscriptions)"
             // stroke="#3b82f6"
              stroke="#030101"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
