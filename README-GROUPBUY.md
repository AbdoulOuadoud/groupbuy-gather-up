# GroupBuy - Plateforme d'Achat Groupé

Une plateforme moderne pour organiser et participer à des achats groupés depuis Alibaba, permettant d'atteindre les MOQ (quantités minimales de commande) et d'économiser sur les achats.

## 🚀 Fonctionnalités

### MVP (Version 1.0)

✅ **Authentification utilisateur**
- Inscription / Connexion via Supabase Auth
- Gestion des profils utilisateur

✅ **Création de campagne d'achat groupé**
- Formulaire complet avec validation
- Informations produit : nom, description, lien Alibaba, MOQ, prix unitaire
- Upload d'image optionnel
- Quantité initiale du créateur

✅ **Liste des campagnes en cours**
- Affichage des campagnes actives
- Filtres de recherche par mot-clé
- Tri par popularité, prix, progression
- Cartes produit avec progression visuelle

✅ **Participation à une campagne**
- Modal de participation avec validation
- Mise à jour dynamique des quantités
- Calcul automatique du total

✅ **Dashboard utilisateur**
- Campagnes créées par l'utilisateur
- Campagnes auxquelles l'utilisateur participe
- Statistiques personnalisées
- État de progression de chaque campagne

## 🛠 Technologies

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 📦 Installation

### Prérequis

- Node.js 18+ 
- npm ou bun
- Compte Supabase

### 1. Cloner le projet

```bash
git clone <your-repo-url>
cd groupbuy-gather-up
```

### 2. Installer les dépendances

```bash
npm install
# ou
bun install
```

### 3. Configuration Supabase

1. Créez un nouveau projet sur [supabase.com](https://supabase.com)
2. Copiez l'URL du projet et la clé anonyme
3. Créez un fichier `.env` à partir de `.env.example`:

```bash
cp .env.example .env
```

4. Remplissez les variables d'environnement dans `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Setup de la base de données

1. Allez dans l'éditeur SQL de votre projet Supabase
2. Exécutez le contenu du fichier `supabase-schema.sql`

Cela va créer:
- Les tables `profiles`, `group_orders`, `group_order_participants`
- Les politiques RLS (Row Level Security)
- Les fonctions et triggers automatiques
- Les index pour les performances

### 5. Lancer le projet

```bash
npm run dev
# ou 
bun dev
```

L'application sera disponible sur `http://localhost:5173`

## 📊 Structure de la Base de Données

### Tables principales

**profiles**
- Profils utilisateur liés à Supabase Auth
- Création automatique lors de l'inscription

**group_orders**
- Campagnes d'achat groupé
- Informations produit, MOQ, prix, statut
- Lié au créateur via `user_id`

**group_order_participants**
- Participations aux campagnes
- Quantité souhaitée par utilisateur
- Contrainte d'unicité par campagne/utilisateur

### Triggers automatiques

- Création automatique du profil lors de l'inscription
- Mise à jour de `current_quantity` lors des participations
- Gestion des timestamps `updated_at`

## 🔐 Sécurité

- **RLS activé** sur toutes les tables
- **Politiques granulaires** par type d'opération
- **Validation côté client et serveur**
- **Authentification requise** pour les actions sensibles

## 🎨 Interface Utilisateur

### Pages principales

- **/** - Accueil avec liste des campagnes
- **/create-campaign** - Création de campagne
- **/dashboard** - Dashboard utilisateur
- **/auth** - Authentification (modal)

### Composants clés

- `CampaignCard` - Carte de campagne avec progression
- `CampaignGrid` - Liste avec filtres et tri
- `CreateCampaignForm` - Formulaire de création
- `JoinCampaignModal` - Modal de participation
- `UserDashboard` - Interface utilisateur complète

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connectez votre repo GitHub à Vercel
2. Ajoutez les variables d'environnement dans Vercel
3. Déployez automatiquement

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Ajoutez les variables d'environnement

## 🔄 Prochaines Fonctionnalités

### Phase 2
- [ ] Système de notifications en temps réel
- [ ] Chat intégré par campagne
- [ ] Historique des commandes
- [ ] Export PDF des commandes groupées
- [ ] Système de reviews produits

### Phase 3
- [ ] Intégration API Alibaba
- [ ] Calcul automatique des frais de port
- [ ] Gestion des paiements (Stripe)
- [ ] Système de parrainage
- [ ] Application mobile (React Native)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème:
- Ouvrez une issue sur GitHub
- Consultez la documentation Supabase
- Vérifiez les logs dans la console développeur

---

**Made with ❤️ for the group buying community**
