// Types partagés pour les hooks API

export interface User {
  id: string
  username: string
  email: string
  phone: string
  role: 'admin' | 'client'
  balance?: number
}

export interface CreateUserData {
  username: string
  email: string
  password: string
  phone: string
  role: 'client' | 'admin'
}

export interface UpdateUserData {
  username?: string
  email?: string
  phone?: string
  role?: 'client' | 'admin'
}

export interface GameHistoryItem {
  _id: string
  gameId?: string // Optionnel pour compatibilité
  date: string
  generatedNumber: number
  result: 'gagné' | 'perdu'
  balanceChange: number
  newBalance: number
  userId?: {
    username: string
    email: string
  }
} 