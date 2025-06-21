# Migration vers Redux Toolkit avec RTK Query

## ✅ Migration terminée !

Le projet utilise maintenant **Redux Toolkit** avec **RTK Query** au lieu de React Query pour la gestion des états et des appels API.

## 🏗️ Architecture Redux

### Store principal
- **`src/store/index.ts`** - Configuration du store Redux
- **`src/store/hooks.ts`** - Hooks typés pour Redux

### API Slices
- **`src/store/campaignsApi.ts`** - API pour les campagnes
- **`src/store/participationsApi.ts`** - API pour les participations

## 🎯 Hooks disponibles

### Campagnes
```typescript
import { 
  useGetCampaignsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useGetUserCampaignsQuery 
} from '@/store/campaignsApi';

// Récupérer toutes les campagnes
const { data: campaigns, isLoading, error } = useGetCampaignsQuery();

// Créer une nouvelle campagne
const [createCampaign, { isLoading }] = useCreateCampaignMutation();
```

### Participations
```typescript
import { 
  useJoinCampaignMutation,
  useGetUserParticipationsQuery,
  useGetCampaignParticipationsQuery,
  useGetUserCampaignParticipationQuery,
  useUpdateParticipationMutation,
  useLeaveCampaignMutation 
} from '@/store/participationsApi';

// Rejoindre une campagne
const [joinCampaign, { isLoading }] = useJoinCampaignMutation();
```

## 📋 Composants mis à jour

- ✅ **`CreateCampaignForm`** - Utilise `useCreateCampaignMutation`
- ✅ **`CampaignGrid`** - Utilise `useGetCampaignsQuery`
- ✅ **`JoinCampaignModal`** - Utilise `useJoinCampaignMutation`

## 🔧 Avantages de Redux Toolkit

1. **Cache automatique** - RTK Query gère automatiquement le cache
2. **Invalidation intelligente** - Les données se mettent à jour automatiquement
3. **Loading states** - États de chargement automatiques
4. **Error handling** - Gestion d'erreurs intégrée
5. **DevTools** - Excellent debugging avec Redux DevTools
6. **TypeScript** - Support TypeScript complet

## 🚀 Utilisation

### Créer une campagne
```typescript
const [createCampaign] = useCreateCampaignMutation();

const handleCreate = async () => {
  try {
    const result = await createCampaign({
      product_name: "Mon produit",
      description: "Description",
      unit_price: 99.99,
      moq: 10,
      status: 'open',
      created_by: user.id
    }).unwrap();
    
    console.log("Campagne créée:", result);
  } catch (error) {
    console.error("Erreur:", error);
  }
};
```

### Rejoindre une campagne
```typescript
const [joinCampaign] = useJoinCampaignMutation();

const handleJoin = async () => {
  try {
    await joinCampaign({
      user_id: user.id,
      campaign_id: "campaign-id",
      quantity: 2
    }).unwrap();
    
    console.log("Participation réussie !");
  } catch (error) {
    console.error("Erreur:", error);
  }
};
```

## 🎨 Fonctionnalités avancées

- **Cache persistant** - Les données restent en cache
- **Refetch automatique** - Mise à jour automatique après mutations
- **Optimistic updates** - Mises à jour optimistes possibles
- **Polling** - Récupération automatique des données
- **Prefetching** - Préchargement des données

## 📊 Debug

Installez l'extension **Redux DevTools** pour Chrome/Firefox pour voir :
- L'état Redux en temps réel
- Les actions dispatshées
- Les mutations RTK Query
- Le cache des données

---

**🎉 Le projet est maintenant prêt avec Redux Toolkit !**
