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
import { AlertTriangle, Trash2, Loader2 } from "lucide-react"
import { useDeleteUser } from '@/lib/api/users'
import { User } from '@/lib/api/types'
import { useAuthStore } from "@/lib/store/auth-store"

interface DeleteUserDialogProps {
  user: User
  children?: React.ReactNode
}

export function DeleteUserDialog({ user, children }: DeleteUserDialogProps) {
  const [open, setOpen] = React.useState(false)
  const deleteUserMutation = useDeleteUser()
  const { user: currentUser } = useAuthStore()

  // Empêcher un admin de se supprimer lui-même
  const isSelfDeletion = currentUser?.email === user.email

  const handleDelete = async () => {
    try {
      // Utiliser l'email si l'ID n'est pas disponible
      const identifier = user.id || user.email
      if (!identifier) {
        throw new Error('Identifiant utilisateur non disponible')
      }
      await deleteUserMutation.mutateAsync(identifier)
      setOpen(false)
    } catch (error) {
      // L'erreur est déjà gérée dans le hook useDeleteUser
      console.error("Erreur lors de la suppression:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            disabled={isSelfDeletion}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Confirmer la suppression
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {isSelfDeletion && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Attention : Vous ne pouvez pas vous supprimer vous-même
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Pour supprimer votre compte, contactez un autre administrateur.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Attention : Cette action est irréversible
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  L&apos;utilisateur <strong>{user.username}</strong> sera définitivement supprimé de la base de données.
                  Toutes ses données, y compris son historique de parties, seront perdues.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-2">Informations de l'utilisateur</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Nom :</span> {user.username}</p>
              <p><span className="font-medium">Email :</span> {user.email}</p>
              <p><span className="font-medium">Rôle :</span> {user.role === 'admin' ? 'Administrateur' : 'Client'}</p>
              <p><span className="font-medium">Solde :</span> {user.balance || 0} €</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleteUserMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteUserMutation.isPending || isSelfDeletion}
            className="flex items-center gap-2"
          >
            {deleteUserMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Oui, supprimer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 