import { supabase } from "@/lib/supabase";
import {
    Campaign,
    CampaignInsert,
    CampaignUpdate,
    CampaignWithParticipations,
} from "@/types/database";

// GET - Récupérer une campagne par ID
export const getCampaign = async (id: string): Promise<Campaign | null> => {
    const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            return null; // Pas trouvé
        }
        console.error("Erreur lors de la récupération de la campagne:", error);
        throw error;
    }

    return data;
};

// GET - Récupérer une campagne avec ses participations
export const getCampaignWithParticipations = async (
    id: string
): Promise<CampaignWithParticipations | null> => {
    const { data, error } = await supabase
        .from("campaigns")
        .select(
            `
      *,
      participations (
        id,
        user_id,
        quantity,
        joined_at,
        profiles (
          id,
          username,
          full_name,
          avatar_url
        )
      )
    `
        )
        .eq("id", id)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            return null;
        }
        console.error(
            "Erreur lors de la récupération de la campagne avec participations:",
            error
        );
        throw error;
    }

    if (!data) return null;

    // Calculer les totaux
    const participations = data.participations || [];
    const total_quantity = participations.reduce((sum, p) => sum + p.quantity, 0);
    const participant_count = participations.length;

    return {
        ...data,
        participations,
        total_quantity,
        participant_count,
    } as CampaignWithParticipations;
};

// GET - Récupérer toutes les campagnes actives
export const getActiveCampaigns = async (
    limit?: number,
    offset?: number
): Promise<Campaign[]> => {
    let query = supabase
        .from("campaigns")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
        console.error(
            "Erreur lors de la récupération des campagnes actives:",
            error
        );
        throw error;
    }

    return data || [];
};

// GET - Récupérer toutes les campagnes actives avec participations
export const getActiveCampaignsWithParticipations = async (
    limit?: number,
    offset?: number
): Promise<CampaignWithParticipations[]> => {
    let query = supabase
        .from("campaigns")
        .select(
            `
      *,
      participations (
        id,
        user_id,
        quantity,
        joined_at
      )
    `
        )
        .eq("status", "open")
        .order("created_at", { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
        console.error(
            "Erreur lors de la récupération des campagnes avec participations:",
            error
        );
        throw error;
    }

    if (!data) return [];

    // Calculer les totaux pour chaque campagne
    return data.map((campaign) => {
        const participations = campaign.participations || [];
        const total_quantity = participations.reduce(
            (sum, p) => sum + p.quantity,
            0
        );
        const participant_count = participations.length;

        return {
            ...campaign,
            participations,
            total_quantity,
            participant_count,
        } as CampaignWithParticipations;
    });
};

// GET - Récupérer les campagnes créées par un utilisateur
export const getCampaignsByUser = async (
    userId: string
): Promise<Campaign[]> => {
    const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(
            "Erreur lors de la récupération des campagnes de l'utilisateur:",
            error
        );
        throw error;
    }

    return data || [];
};

// GET - Rechercher des campagnes par nom de produit
export const searchCampaigns = async (
    searchTerm: string,
    limit?: number
): Promise<Campaign[]> => {
    let query = supabase
        .from("campaigns")
        .select("*")
        .eq("status", "open")
        .or(`product_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order("created_at", { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Erreur lors de la recherche de campagnes:", error);
        throw error;
    }

    return data || [];
};

// INSERT - Créer une nouvelle campagne
export const createCampaign = async (
    campaign: CampaignInsert
): Promise<Campaign> => {
    console.log("🚀 Tentative de création de campagne:", campaign);
    console.log("📡 Client Supabase:", supabase);
    
    try {
        console.log("⏳ Avant l'appel Supabase...");
        
        const { data, error } = await supabase
            .from('campaigns')
            .insert([campaign])  // ✅ Passer un tableau d'objets
            .select()
            .single();  // ✅ Récupérer un seul élément
            
        console.log("📥 Réponse Supabase - data:", data, "error:", error);

        if (error) {
            console.error("❌ Erreur lors de la création de la campagne:", error);
            throw error;
        }

        console.log("✅ Campagne créée avec succès:", data);
        return data;
    } catch (err) {
        console.error("💥 Exception lors de la création de la campagne:", err);
        throw err;
    }
};

// UPDATE - Mettre à jour une campagne
export const updateCampaign = async (
    id: string,
    updates: CampaignUpdate
): Promise<Campaign> => {
    const { data, error } = await supabase
        .from("campaigns")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Erreur lors de la mise à jour de la campagne:", error);
        throw error;
    }

    return data;
};

// UPDATE - Changer le statut d'une campagne
export const updateCampaignStatus = async (
    id: string,
    status: "open" | "completed" | "cancelled"
): Promise<Campaign> => {
    return updateCampaign(id, { status });
};

// DELETE - Supprimer une campagne
export const deleteCampaign = async (id: string): Promise<void> => {
    const { error } = await supabase.from("campaigns").delete().eq("id", id);

    if (error) {
        console.error("Erreur lors de la suppression de la campagne:", error);
        throw error;
    }
};

// Obtenir des statistiques sur les campagnes
export const getCampaignStats = async (): Promise<{
    total: number;
    open: number;
    completed: number;
    cancelled: number;
}> => {
    const { data, error } = await supabase.from("campaigns").select("status");

    if (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        throw error;
    }

    const stats = {
        total: data?.length || 0,
        open: data?.filter((c) => c.status === "open").length || 0,
        completed: data?.filter((c) => c.status === "completed").length || 0,
        cancelled: data?.filter((c) => c.status === "cancelled").length || 0,
    };

    return stats;
};
