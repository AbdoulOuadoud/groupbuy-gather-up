import { createApi } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/lib/supabase';
import { Participation, ParticipationInsert, ParticipationUpdate, ParticipationWithCampaign } from '@/types/database';

// Wrapper pour les participations
const participationsQuery = async (args: any) => {
  const { endpoint, method, data } = args;
  
  try {
    switch (endpoint) {
      case 'participations':
        if (method === 'POST') {
          console.log("🚀 Redux: Création de participation:", data);
          
          // Vérifier si l'utilisateur a déjà une participation
          const { data: existingParticipation } = await supabase
            .from('participations')
            .select('*')
            .eq('user_id', data.user_id)
            .eq('campaign_id', data.campaign_id)
            .single();
            
          if (existingParticipation) {
            // Mettre à jour la quantité existante
            const { data: updatedParticipation, error } = await supabase
              .from('participations')
              .update({ quantity: existingParticipation.quantity + data.quantity })
              .eq('id', existingParticipation.id)
              .select()
              .single();
              
            if (error) throw error;
            console.log("✅ Redux: Participation mise à jour:", updatedParticipation);
            return { data: updatedParticipation };
          } else {
            // Créer une nouvelle participation
            const { data: newParticipation, error } = await supabase
              .from('participations')
              .insert([data])
              .select()
              .single();
              
            if (error) throw error;
            console.log("✅ Redux: Participation créée:", newParticipation);
            return { data: newParticipation };
          }
        }
        break;
        
      case 'userParticipations':
        if (method === 'GET') {
          const { data: participations, error } = await supabase
            .from('participations')
            .select(`
              *,
              campaigns (
                id,
                product_name,
                product_image,
                product_link,
                description,
                unit_price,
                moq,
                status,
                created_at,
                created_by
              )
            `)
            .eq('user_id', data.userId)
            .order('joined_at', { ascending: false });
            
          if (error) throw error;
          return { data: participations };
        }
        break;
        
      case 'campaignParticipations':
        if (method === 'GET') {
          const { data: participations, error } = await supabase
            .from('participations')
            .select(`
              *,
              profiles (
                id,
                username,
                full_name,
                avatar_url
              )
            `)
            .eq('campaign_id', data.campaignId)
            .order('joined_at', { ascending: false });
            
          if (error) throw error;
          return { data: participations };
        }
        break;
        
      case 'userCampaignParticipation':
        if (method === 'GET') {
          const { data: participation, error } = await supabase
            .from('participations')
            .select('*')
            .eq('user_id', data.userId)
            .eq('campaign_id', data.campaignId)
            .single();
            
          if (error && error.code !== 'PGRST116') throw error;
          return { data: participation || null };
        }
        break;
        
      case 'participation':
        if (method === 'PUT') {
          const { data: updatedParticipation, error } = await supabase
            .from('participations')
            .update(data.updates)
            .eq('id', data.id)
            .select()
            .single();
            
          if (error) throw error;
          return { data: updatedParticipation };
        }
        
        if (method === 'DELETE') {
          const { error } = await supabase
            .from('participations')
            .delete()
            .eq('id', data.id);
            
          if (error) throw error;
          return { data: { success: true } };
        }
        break;
        
      default:
        throw new Error(`Endpoint ${endpoint} non supporté`);
    }
  } catch (error) {
    console.error('Erreur dans participationsQuery:', error);
    return { error: { status: 'CUSTOM_ERROR', data: error } };
  }
};

// API Slice pour les participations
export const participationsApi = createApi({
  reducerPath: 'participationsApi',
  baseQuery: participationsQuery,
  tagTypes: ['Participation', 'UserParticipations', 'CampaignParticipations'],
  endpoints: (builder) => ({
    // POST - Créer ou mettre à jour une participation (rejoindre une campagne)
    joinCampaign: builder.mutation<Participation, ParticipationInsert>({
      query: (participation) => ({
        endpoint: 'participations',
        method: 'POST',
        data: participation
      }),
      invalidatesTags: ['Participation', 'UserParticipations', 'CampaignParticipations'],
    }),
    
    // GET - Récupérer les participations d'un utilisateur
    getUserParticipations: builder.query<ParticipationWithCampaign[], string>({
      query: (userId) => ({
        endpoint: 'userParticipations',
        method: 'GET',
        data: { userId }
      }),
      providesTags: ['UserParticipations'],
    }),
    
    // GET - Récupérer les participations d'une campagne
    getCampaignParticipations: builder.query<Participation[], string>({
      query: (campaignId) => ({
        endpoint: 'campaignParticipations',
        method: 'GET',
        data: { campaignId }
      }),
      providesTags: (result, error, campaignId) => [
        { type: 'CampaignParticipations', id: campaignId }
      ],
    }),
    
    // GET - Récupérer la participation d'un utilisateur à une campagne
    getUserCampaignParticipation: builder.query<Participation | null, { userId: string; campaignId: string }>({
      query: ({ userId, campaignId }) => ({
        endpoint: 'userCampaignParticipation',
        method: 'GET',
        data: { userId, campaignId }
      }),
      providesTags: (result, error, { userId, campaignId }) => [
        { type: 'Participation', id: `${userId}-${campaignId}` }
      ],
    }),
    
    // PUT - Mettre à jour une participation
    updateParticipation: builder.mutation<Participation, { id: string; updates: ParticipationUpdate }>({
      query: ({ id, updates }) => ({
        endpoint: 'participation',
        method: 'PUT',
        data: { id, updates }
      }),
      invalidatesTags: ['Participation', 'UserParticipations', 'CampaignParticipations'],
    }),
    
    // DELETE - Supprimer une participation (quitter une campagne)
    leaveCampaign: builder.mutation<{ success: boolean }, string>({
      query: (participationId) => ({
        endpoint: 'participation',
        method: 'DELETE',
        data: { id: participationId }
      }),
      invalidatesTags: ['Participation', 'UserParticipations', 'CampaignParticipations'],
    }),
  }),
});

// Export des hooks générés automatiquement
export const {
  useJoinCampaignMutation,
  useGetUserParticipationsQuery,
  useGetCampaignParticipationsQuery,
  useGetUserCampaignParticipationQuery,
  useUpdateParticipationMutation,
  useLeaveCampaignMutation,
} = participationsApi;
