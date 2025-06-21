import { supabase } from '@/lib/supabase';
import { Participation, ParticipationInsert, ParticipationUpdate, ParticipationWithCampaign, ParticipationWithProfile } from '@/types/database';

// GET - Récupérer une participation par ID
export const getParticipation = async (id: string): Promise<Participation | null> => {
    const { data, error } = await supabase
        .from('participations')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null; // Pas trouvé
        }
        console.error('Erreur lors de la récupération de la participation:', error);
        throw error;
    }

    return data;
};

// GET - Récupérer la participation d'un utilisateur à une campagne
export const getUserParticipationInCampaign = async (userId: string, campaignId: string): Promise<Participation | null> => {
    const { data, error } = await supabase
        .from('participations')
        .select('*')
        .eq('user_id', userId)
        .eq('campaign_id', campaignId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null; // Pas trouvé
        }
        console.error('Erreur lors de la récupération de la participation utilisateur:', error);
        throw error;
    }

    return data;
};

// GET - Récupérer toutes les participations d'une campagne
export const getParticipationsByCampaign = async (campaignId: string): Promise<ParticipationWithProfile[]> => {
    const { data, error } = await supabase
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
        .eq('campaign_id', campaignId)
        .order('joined_at', { ascending: false });

    if (error) {
        console.error('Erreur lors de la récupération des participations de la campagne:', error);
        throw error;
    }

    return (data || []) as ParticipationWithProfile[];
};

// GET - Récupérer toutes les participations d'un utilisateur
export const getParticipationsByUser = async (userId: string): Promise<ParticipationWithCampaign[]> => {
    const { data, error } = await supabase
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
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });

    if (error) {
        console.error('Erreur lors de la récupération des participations de l\'utilisateur:', error);
        throw error;
    }

    return (data || []) as ParticipationWithCampaign[];
};

// GET - Récupérer toutes les participations avec détails
export const getAllParticipations = async (limit?: number, offset?: number): Promise<Participation[]> => {
    let query = supabase
        .from('participations')
        .select('*')
        .order('joined_at', { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Erreur lors de la récupération des participations:', error);
        throw error;
    }

    return data || [];
};

// INSERT - Créer une nouvelle participation
export const createParticipation = async (participation: ParticipationInsert): Promise<Participation> => {
    const { data, error } = await supabase
        .from('participations')
        .insert(participation)
        .select()
        .single();

    if (error) {
        console.error('Erreur lors de la création de la participation:', error);
        throw error;
    }

    return data;
};

// INSERT - Participer à une campagne (ou mettre à jour la quantité si déjà participant)
export const joinCampaign = async (userId: string, campaignId: string, quantity: number): Promise<Participation> => {
    // Vérifier si l'utilisateur participe déjà
    const existingParticipation = await getUserParticipationInCampaign(userId, campaignId);

    if (existingParticipation) {
        // Mettre à jour la quantité existante
        return updateParticipation(existingParticipation.id, {
            quantity: existingParticipation.quantity + quantity
        });
    } else {
        // Créer une nouvelle participation
        return createParticipation({
            user_id: userId,
            campaign_id: campaignId,
            quantity
        });
    }
};

// UPDATE - Mettre à jour une participation
export const updateParticipation = async (id: string, updates: ParticipationUpdate): Promise<Participation> => {
    const { data, error } = await supabase
        .from('participations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Erreur lors de la mise à jour de la participation:', error);
        throw error;
    }

    return data;
};

// UPDATE - Modifier la quantité d'une participation
export const updateParticipationQuantity = async (id: string, newQuantity: number): Promise<Participation> => {
    if (newQuantity <= 0) {
        throw new Error('La quantité doit être positive');
    }

    return updateParticipation(id, { quantity: newQuantity });
};

// DELETE - Supprimer une participation
export const deleteParticipation = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('participations')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erreur lors de la suppression de la participation:', error);
        throw error;
    }
};

// DELETE - Quitter une campagne
export const leaveCampaign = async (userId: string, campaignId: string): Promise<void> => {
    const { error } = await supabase
        .from('participations')
        .delete()
        .eq('user_id', userId)
        .eq('campaign_id', campaignId);

    if (error) {
        console.error('Erreur lors de la sortie de la campagne:', error);
        throw error;
    }
};

// Calculer la quantité totale pour une campagne
export const getTotalQuantityForCampaign = async (campaignId: string): Promise<number> => {
    const { data, error } = await supabase
        .from('participations')
        .select('quantity')
        .eq('campaign_id', campaignId);

    if (error) {
        console.error('Erreur lors du calcul de la quantité totale:', error);
        throw error;
    }

    return (data || []).reduce((total, participation) => total + participation.quantity, 0);
};

// Compter le nombre de participants pour une campagne
export const getParticipantCountForCampaign = async (campaignId: string): Promise<number> => {
    const { count, error } = await supabase
        .from('participations')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaignId);

    if (error) {
        console.error('Erreur lors du comptage des participants:', error);
        throw error;
    }

    return count || 0;
};

// Obtenir des statistiques sur les participations d'un utilisateur
export const getUserParticipationStats = async (userId: string): Promise<{
    total_campaigns: number;
    total_quantity: number;
    completed_campaigns: number;
    active_campaigns: number;
}> => {
    const participations = await getParticipationsByUser(userId);

    const stats = {
        total_campaigns: participations.length,
        total_quantity: participations.reduce((sum, p) => sum + p.quantity, 0),
        completed_campaigns: participations.filter(p => p.campaigns.status === 'completed').length,
        active_campaigns: participations.filter(p => p.campaigns.status === 'open').length,
    };

    return stats;
};
