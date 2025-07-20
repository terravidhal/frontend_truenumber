import axios from 'axios'

// Instance Axios avec configuration de base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api', // URL de ton backend
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur de requête - Ajoute le token JWT dans le header Authorization
api.interceptors.request.use(
  (config) => {
    // Récupère le token depuis localStorage
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur de réponse - Gère les erreurs d'authentification
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Si erreur 401 (non autorisé) ou 403 (interdit)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Nettoie le localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      
      // Redirige vers la landing page
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
    
    return Promise.reject(error)
  }
)

export default api 