# TrueNumber

TrueNumber est une application web de jeu de hasard et de gestion d'utilisateurs, développée avec Next.js 15 (App Router), TypeScript, Zustand, React Query, Shadcn/ui et Tailwind CSS.

## ✨ Fonctionnalités principales

- **Jeu TrueNumber** : Générez un nombre aléatoire, tentez de gagner ou perdre des points selon le résultat.
- **Historique des parties** : Consultez l'historique détaillé de vos parties et de vos gains/pertes.
- **Dashboard Administrateur** :
  - Visualisez tous les utilisateurs (clients & admins)
  - Ajoutez, modifiez, supprimez des utilisateurs (CRUD complet)
  - Attribuez ou retirez le rôle admin
  - Accédez à l'historique global de toutes les parties
  - Statistiques et graphiques d'inscription
- **Connexion & inscription sécurisées**
- **Responsive design** (mobile, tablette, desktop)
- **Notifications (toast)** et feedback utilisateur
- **Protection des routes et gestion des rôles**

## 🚀 Installation & configuration

1. **Cloner le repo**

```bash
git clone <repo-url>
cd trueNumber_frontend
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine avec :

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_MAIN_ADMIN_EMAIL=admin@exemple.com
NODE_ENV=development
```

Adaptez selon votre backend/API.

4. **Lancer en développement**

```bash
npm run dev
```

5. **Build & production**

```bash
npm run build
npm start
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 🗂️ Structure du projet

- `app/` : Pages principales (dashboard, login, register, jeu...)
- `components/` : Composants UI réutilisables (table, cards, forms...)
- `lib/` : API, store Zustand, validations, helpers
- `public/` : Assets statiques


## 🛠️ Technologies utilisées

- **Next.js 15** (App Router)
- **TypeScript**
- **React Query** (TanStack Query)
- **Zustand** (state global)
- **Shadcn/ui** (UI components)
- **Tailwind CSS**
- **Axios** (requêtes API)
- **Zod** (validation)
- **Recharts** (graphiques)

## 👤 Auteur

Développé par vidhal elame.

---

Pour toute question ou contribution, ouvrez une issue ou contactez l'auteur.
