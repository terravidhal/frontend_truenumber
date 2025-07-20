import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Gamepad2, 
  Trophy, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Star,
  Target
} from "lucide-react"
import Link from "next/link"
import { RedirectIfAuthenticated } from "@/lib/utils/redirect-if-authenticated"

export default function LandingPage() {
  return (
    <RedirectIfAuthenticated>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        {/* Header */}
        <header className="container mx-auto px-4 py-4 sm:py-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 sm:p-2 rounded-lg">
                <Gamepad2 className="h-4 w-4 sm:h-6 sm:w-6" />
              </div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TrueNumber
              </span>
            </div>
            <div className="flex gap-1 sm:gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs sm:text-base px-2 sm:px-4">
                  Se connecter
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="text-xs sm:text-base px-2 sm:px-4">
                  Commencer
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 sm:py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs sm:text-sm">
              <Zap className="h-3 w-3 mr-1" />
              Nouveau jeu disponible
            </Badge>
            
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Testez votre chance avec
              <span className="block">TrueNumber</span>
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto px-4">
              Générez un nombre aléatoire et tentez de gagner des points ! 
              Un jeu simple mais addictif qui teste votre chance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
                  Commencer à jouer
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
                  J&apos;ai déjà un compte
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12 sm:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">Comment ça marche ?</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Un jeu simple en 3 étapes
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg sm:text-2xl">1. Générez un nombre</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base sm:text-lg">
                  Cliquez sur &quot;Générer un nombre&quot; pour obtenir un nombre aléatoire entre 0 et 100.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg sm:text-2xl">2. Testez votre chance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base sm:text-lg">
                  Si le nombre est supérieur à 70, vous gagnez 50 points ! Sinon, vous perdez 35 points.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg sm:text-2xl">3. Suivez votre progression</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base sm:text-lg">
                  Consultez votre solde et l&apos;historique de vos parties pour améliorer votre stratégie.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-12 sm:py-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-2">70%</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Chance de perdre</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-green-600 mb-2">30%</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Chance de gagner</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-purple-600 mb-2">+50</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Points gagnés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-red-600 mb-2">-35</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Points perdus</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 sm:py-20">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl mb-4">Prêt à tester votre chance ?</CardTitle>
              <CardDescription className="text-blue-100 text-base sm:text-lg">
                Rejoignez des milliers de joueurs et commencez votre aventure TrueNumber dès maintenant !
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
                    <Star className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Créer mon compte
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-white text-black hover:bg-white hover:text-blue-600 w-full sm:w-auto">
                    Se connecter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 sm:py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-lg sm:text-xl font-bold">TrueNumber</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <span>© {new Date().getFullYear()} TrueNumber by vidhal elame. Tous droits réservés.</span>
            </div>
          </div>
        </footer>
      </div>
    </RedirectIfAuthenticated>
  )
}
