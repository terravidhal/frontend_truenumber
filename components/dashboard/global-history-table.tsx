"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useGetAllHistory } from '@/lib/api/history'
import { GameHistoryItem } from '@/lib/api/types'
import { Trophy, XCircle, Calendar, User as UserIcon } from "lucide-react"

const columns: ColumnDef<GameHistoryItem>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-sm">
          {new Date(row.original.date).toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.userId?.username || '',
    id: "username",
    header: "Utilisateur",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">
            {row.original.userId?.username || 'N/A'}
          </span>
        </div>
        <div className="text-xs text-gray-500 ml-6">
          {row.original.userId?.email || 'N/A'}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "_id",
    header: "ID Partie",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-mono text-sm text-gray-600 cursor-help">
              {row.original._id ? row.original._id.slice(0, 8) + '...' : 'N/A'}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-mono text-xs">{row.original._id || 'N/A'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "generatedNumber",
    header: "Nombre généré",
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        {row.original.generatedNumber || 'N/A'}
      </div>
    ),
  },
  {
    accessorKey: "result",
    header: "Résultat",
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.result === 'gagné' ? (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Trophy className="h-3 w-3 mr-1" />
            Gagné
          </Badge>
        ) : row.original.result === 'perdu' ? (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Perdu
          </Badge>
        ) : (
          <Badge variant="outline">N/A</Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "balanceChange",
    header: "Variation",
    cell: ({ row }) => (
      <div className={`text-center font-semibold ${
        row.original.balanceChange > 0 
          ? 'text-green-600' 
          : row.original.balanceChange < 0
          ? 'text-red-600'
          : 'text-gray-600'
      }`}>
        {row.original.balanceChange !== undefined && row.original.balanceChange !== null
          ? (row.original.balanceChange > 0 ? '+' : '') + row.original.balanceChange
          : 'N/A'
        }
      </div>
    ),
  },
  {
    accessorKey: "newBalance",
    header: "Nouveau solde",
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.newBalance !== undefined && row.original.newBalance !== null
          ? `${row.original.newBalance} €`
          : 'N/A'
        }
      </div>
    ),
    filterFn: (row, id, value) => {
      const balance = row.getValue(id)
      if (balance === null || balance === undefined) return false
      
      // Nettoyer la valeur de recherche (enlever €, espaces, etc.)
      const searchValue = value.toLowerCase().replace(/[€\s]/g, '')
      
      // Convertir le solde en string et nettoyer
      const balanceStr = String(balance).replace(/[€\s]/g, '')
      
      return balanceStr.includes(searchValue)
    },
  },
]

export function GlobalHistoryTable() {
  const { data: historyData, isLoading, isError } = useGetAllHistory()
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "date", desc: true } // Tri par date décroissante par défaut
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: historyData || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5, // Nombre de lignes par page
      },
    },
    state: {
      sorting,
      columnFilters,
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Erreur lors du chargement de l'historique global</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-base sm:text-lg font-semibold">Historique global des parties</h3>
          <Badge variant="outline" className="ml-2">
            {historyData?.length || 0} parties
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Rechercher par utilisateur..."
            value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("username")?.setFilterValue(event.target.value)
            }
            className="w-full sm:max-w-sm"
          />
          <Input
            placeholder="Rechercher par solde (ex: 100 ou 100€)..."
            value={(table.getColumn("newBalance")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("newBalance")?.setFilterValue(event.target.value)
            }
            className="w-full sm:max-w-sm"
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucune partie trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          {table.getFilteredRowModel().rows.length} partie(s) au total.
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
} 