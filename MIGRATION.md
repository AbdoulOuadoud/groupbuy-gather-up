# Migration vers la nouvelle structure de base de données

## Résumé des changements

Ce document décrit la migration de l'ancienne structure `group_orders` + `group_order_participants` vers la nouvelle structure `profiles` + `campaigns` + `participations`.

## Structure de base de données mise à jour

### 1. Table `profiles`
```sql
- id: uuid (PK, FK → auth.users.id)
- username: text | unique
- full_name: text | null
- avatar_url: text | null
- phone: text | null
- created_at: timestamptz
```

### 2. Table `campaigns`
```sql
- id: uuid (PK)
- created_by: uuid (FK → auth.users.id)
- product_name: text
- product_image: text | null
- product_link: text | null
- description: text | null
- unit_price: numeric(10,2)
- moq: integer
- status: 'open' | 'completed' | 'cancelled'
- created_at: timestamptz
```

### 3. Table `participations`
```sql
- id: uuid (PK)
- user_id: uuid (FK → auth.users.id)
- campaign_id: uuid (FK → campaigns.id)
- quantity: integer
- joined_at: timestamptz
```

## Fichiers mis à jour

### Services
- ✅ `src/services/profiles.ts` - CRUD pour les profils
- ✅ `src/services/campaigns.ts` - CRUD pour les campagnes avec jointures
- ✅ `src/services/participations.ts` - CRUD pour les participations
- ✅ `src/services/auth.ts` - Authentification avec création automatique de profil
- ✅ `src/services/index.ts` - Export centralisé

### Types
- ✅ `src/types/database.ts` - Types TypeScript pour les nouvelles tables

### Hooks
- ✅ `src/hooks/useCampaigns.ts` - Hooks React Query pour les campagnes
- ✅ `src/hooks/useParticipations.ts` - Hooks React Query pour les participations
- ✅ `src/hooks/useNewParticipations.ts` - Hooks de participation (nouveau)

### Contexte d'authentification
- ✅ `src/contexts/AuthContext.tsx` - Mis à jour pour utiliser les nouveaux services

### Composants
- ✅ `src/components/JoinCampaignModal.tsx` - Utilise les nouveaux hooks
- ✅ `src/components/CampaignGrid.tsx` - Utilise les nouveaux hooks et types
- ✅ `src/components/CampaignCard.tsx` - Adapté aux nouveaux types
- ✅ `src/components/AuthForm.tsx` - Compatible avec le nouveau contexte

## Fichiers obsolètes

Les fichiers suivants peuvent être supprimés après vérification :
- `src/hooks/useGroupOrders.ts` (remplacé par useCampaigns + useNewParticipations)

## Actions à effectuer

1. **Migration de la base de données** : Exécuter le script `supabase-schema-new.sql`
2. **Configuration de l'environnement** : Mettre à jour les variables d'environnement selon `.env.example`
3. **Test des fonctionnalités** :
   - Inscription/connexion avec création automatique de profil
   - Création de campagnes
   - Participation aux campagnes
   - Affichage des campagnes avec statistiques

## Nouvelles fonctionnalités

- **Profils utilisateur** : Gestion complète des profils avec username unique
- **Authentification robuste** : Création automatique de profil à l'inscription
- **Campagnes avec statut** : États 'open', 'completed', 'cancelled'
- **Statistiques avancées** : Quantités totales, nombre de participants
- **Recherche et filtrage** : Recherche par nom de produit et description

## Compatibilité

L'interface utilisateur reste identique, seule la logique interne a été mise à jour pour utiliser la nouvelle structure de données.
