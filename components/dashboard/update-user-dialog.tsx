"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Edit, Loader2 } from "lucide-react"
import { useUpdateUser } from '@/lib/api/users'
import { User } from '@/lib/api/types'

const updateUserSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  role: z.enum(["client", "admin"]),
})

type UpdateUserFormData = z.infer<typeof updateUserSchema>

interface UpdateUserDialogProps {
  user: User
  children?: React.ReactNode
}

export function UpdateUserDialog({ user, children }: UpdateUserDialogProps) {
  const [open, setOpen] = React.useState(false)
  const updateUserMutation = useUpdateUser()

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  })

  // Mettre à jour les valeurs du formulaire quand l'utilisateur change
  React.useEffect(() => {
    form.reset({
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    })
  }, [user, form])

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      await updateUserMutation.mutateAsync({
        id: user.id || user.email, // Utiliser l'email si l'ID n'est pas disponible
        data,
      })
      setOpen(false)
    } catch (error) {
      // L'erreur est déjà gérée dans le hook useUpdateUser
      console.error("Erreur lors de la modification:", error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset le formulaire aux valeurs originales
      form.reset({
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de {user.username}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input placeholder="john_doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="+0123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateUserMutation.isPending}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Modification...
                  </>
                ) : (
                  "Modifier l&apos;utilisateur"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 