'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData, authErrorMessages } from '@/lib/validations/auth-schemas'
import { useLogin } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string>('')
  
  const loginMutation = useLogin()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })
  
  const onSubmit = async (data: LoginFormData) => {
    setError('')
    
    try {
      await loginMutation.mutateAsync(data)
    } catch (error: any) {
      // Gestion des erreurs spécifiques
      if (error.response?.status === 401) {
        setError(authErrorMessages.invalidCredentials)
      } else if (error.response?.status >= 500) {
        setError(authErrorMessages.serverError)
      } else if (!error.response) {
        setError(authErrorMessages.networkError)
      } else {
        setError(error.response?.data?.message || authErrorMessages.unknownError)
      }
    }
  }
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Se connecter</CardTitle>
        <CardDescription>
          Entrez vos identifiants pour accéder à votre compte TrueNumber
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          {/* Mot de passe */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              {/*<Link 
                href="#" 
                className="text-sm text-primary hover:underline"
              >
                Mot de passe oublié ?
              </Link>*/}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          {/* Message d'erreur global */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Bouton de soumission */}
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>

          {/* login ADMIN */}
          <div className="text-center text-sm">
            LOGIN ADMIN{' '}
            Email : superadmin123@truenumber.com ?{' '}
            password : admin123
          </div>
          
          {/* Lien vers la page d'inscription */}
          <div className="text-center text-sm">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-primary hover:underline">
              S&apos;inscrire
            </Link>
          </div>
          
          {/* Lien de retour vers la landing page */}
          <div className="text-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-800 hover:underline">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
