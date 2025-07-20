import { z } from 'zod'

// Schéma pour l'inscription (register)
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(50, 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  
  email: z
    .string()
    .email('Adresse email invalide')
    .min(1, 'L\'email est requis'),
  
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  
  confirmPassword: z
    .string()
    .min(1, 'La confirmation du mot de passe est requise'),
  
  phone: z
    .string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres')
    .regex(/^[0-9+\-\s()]+$/, 'Format de téléphone invalide'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

// Schéma pour la connexion (login)
export const loginSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide')
    .min(1, 'L\'email est requis'),
  
  password: z
    .string()
    .min(1, 'Le mot de passe est requis'),
})

// Types TypeScript dérivés des schémas
export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>

// Messages d'erreur personnalisés
export const authErrorMessages = {
  invalidCredentials: 'Email ou mot de passe incorrect',
  userExists: 'Un utilisateur avec cet email existe déjà',
  networkError: 'Erreur de connexion. Veuillez réessayer.',
  serverError: 'Erreur serveur. Veuillez réessayer plus tard.',
  unknownError: 'Une erreur inattendue s\'est produite',
} 