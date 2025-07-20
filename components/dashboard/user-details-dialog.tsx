"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, Shield, User as UserIcon, Mail, Phone, CreditCard, Calendar } from "lucide-react"
import { User } from '@/lib/api/types'

interface UserDetailsDialogProps {
  user: User
  children?: React.ReactNode
}

export function UserDetailsDialog({ user, children }: UserDetailsDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de l'utilisateur</DialogTitle>
          <DialogDescription>
            Informations complètes de {user.username}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* En-tête avec avatar et nom */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.username}</h3>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                {user.role === 'admin' ? (
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
            </div>
          </div>

          <Separator />

          {/* Informations détaillées */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Téléphone</p>
                  <p className="text-sm">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Solde</p>
                  <p className="text-sm font-semibold text-green-600">
                    {user.balance || 0} €
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">ID Utilisateur</p>
                  <p className="text-sm font-mono text-gray-600">{user.id}</p>
                </div>
              </div>

            </div>
          </div>


        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 