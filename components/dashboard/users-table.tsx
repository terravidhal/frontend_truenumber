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
import { User as UserIcon, Eye, Edit, Trash2, Shield } from "lucide-react"
import { useGetAllUsers } from '@/lib/api/users'
import { User } from '@/lib/api/types'
import { useAuthStore } from "@/lib/store/auth-store"
import { UpdateUserDialog } from "./update-user-dialog"
import { UserDetailsDialog } from "./user-details-dialog"
import { DeleteUserDialog } from "./delete-user-dialog"

export function UsersTable() {
  const { data: users, isLoading, isError } = useGetAllUsers()
  const { user: currentUser } = useAuthStore()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  // Vérifier si l'utilisateur actuel est admin
  const isAdmin = currentUser?.role === 'admin'
  
  // Email de l'admin principal depuis les variables d'environnement
  const MAIN_ADMIN_EMAIL = process.env.NEXT_PUBLIC_MAIN_ADMIN_EMAIL || "admin45@gmail.com"

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm text-gray-600">
          {row.original.id ? row.original.id.slice(0, 8) + '...' : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: "Nom d'utilisateur",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{row.original.username}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="text-sm">{row.original.email}</div>,
    },
    {
      accessorKey: "phone",
      header: "Téléphone",
      cell: ({ row }) => <div className="text-sm">{row.original.phone || 'Indisponible'}</div>,
    },
    {
      accessorKey: "role",
      header: "Rôle",
      cell: ({ row }) => (
        <Badge variant={row.original.role === 'admin' ? 'default' : 'secondary'}>
          {row.original.role === 'admin' ? (
            <>
              <Shield className="h-3 w-3 mr-1" />
              Administrateur
            </>
          ) : (
            <>
              <UserIcon className="h-3 w-3 mr-1" />
              Client
            </>
          )}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const isCurrentUser = currentUser?.email === row.original.email
        const isMainAdmin = row.original.email === MAIN_ADMIN_EMAIL
        
        return (
          <div className="flex items-center gap-2">
            <UserDetailsDialog user={row.original} />
            {isAdmin && !isCurrentUser && !isMainAdmin && (
              <>
                <UpdateUserDialog user={row.original} />
                <DeleteUserDialog user={row.original} />
              </>
            )}
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: users || [],
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
        <div className="text-red-500">Erreur lors du chargement des utilisateurs</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Rechercher un utilisateur..."
          value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-sm"
        />
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
                  Aucun utilisateur trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          {table.getFilteredSelectedRowModel().rows.length} sur{" "}
          {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
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