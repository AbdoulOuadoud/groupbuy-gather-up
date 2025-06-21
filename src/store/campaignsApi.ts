import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "@/lib/supabase";
import {
    Campaign,
    CampaignInsert,
    CampaignUpdate,
    CampaignWithParticipations,
} from "@/types/database";

// Base query personnalisée pour Supabase
const supabaseBaseQuery = fetchBaseQuery({
    baseUrl: "/", // Pas utilisé avec Supabase direct
    prepareHeaders: (headers, { getState }) => {
        // On utilisera directement le client Supabase
        return headers;
    },
});

// Wrapper pour utiliser le client Supabase avec RTK Query
const supabaseQuery = async (args: any, api: any, extraOptions: any) => {
    const { endpoint, method, data } = args;

    try {
        switch (endpoint) {
            case "campaigns":
                if (method === "GET") {
                    const { data: campaigns, error } = await supabase
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
                        .eq("status", "open")
                        .order("created_at", { ascending: false });

                    if (error) throw error;

                    // Calculer les totaux pour chaque campagne
                    const campaignsWithTotals =
                        campaigns?.map((campaign) => ({
                            ...campaign,
                            total_quantity:
                                campaign.participations?.reduce(
                                    (sum: number, p: any) => sum + p.quantity,
                                    0
                                ) || 0,
                            participant_count: campaign.participations?.length || 0,
                        })) || [];

                    return { data: campaignsWithTotals };
                }

                if (method === "POST") {
                    console.log("🚀 Redux: Création de campagne:", data);

                    const { data: newCampaign, error } = await supabase
                        .from("campaigns")
                        .insert(data)
                        .select()
                        .single();

                    if (error) {
                        console.error("❌ Redux: Erreur création:", error);
                        throw error;
                    }

                    console.log("✅ Redux: Campagne créée:", newCampaign);
                    return { data: newCampaign };
                }
                break;

            case "campaign":
                if (method === "GET") {
                    const { data: campaign, error } = await supabase
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
                        .eq("id", data.id)
                        .single();

                    if (error) throw error;

                    const campaignWithTotals = {
                        ...campaign,
                        total_quantity:
                            campaign.participations?.reduce(
                                (sum: number, p: any) => sum + p.quantity,
                                0
                            ) || 0,
                        participant_count: campaign.participations?.length || 0,
                    };

                    return { data: campaignWithTotals };
                }
                break;

            case "userCampaigns":
                if (method === "GET") {
                    const { data: campaigns, error } = await supabase
                        .from("campaigns")
                        .select("*")
                        .eq("created_by", data.userId)
                        .order("created_at", { ascending: false });

                    if (error) throw error;
                    return { data: campaigns };
                }
                break;

            default:
                throw new Error(`Endpoint ${endpoint} non supporté`);
        }
    } catch (error) {
        console.error("Erreur dans supabaseQuery:", error);
        return { error: { status: "CUSTOM_ERROR", data: error } };
    }
};

// API Slice avec RTK Query
export const campaignsApi = createApi({
    reducerPath: "campaignsApi",
    baseQuery: supabaseQuery,
    tagTypes: ["Campaign", "UserCampaigns"],
    endpoints: (builder) => ({
        // GET - Récupérer toutes les campagnes
        getCampaigns: builder.query<CampaignWithParticipations[], void>({
            query: () => ({
                endpoint: "campaigns",
                method: "GET",
            }),
            providesTags: ["Campaign"],
        }),

        // GET - Récupérer une campagne par ID
        getCampaign: builder.query<CampaignWithParticipations, string>({
            query: (id) => ({
                endpoint: "campaign",
                method: "GET",
                data: { id },
            }),
            providesTags: (result, error, id) => [{ type: "Campaign", id }],
        }),

        // POST - Créer une nouvelle campagne
        createCampaign: builder.mutation<Campaign, CampaignInsert>({
            query: (campaign) => ({
                endpoint: "campaigns",
                method: "POST",
                data: campaign,
            }),
            invalidatesTags: ["Campaign", "UserCampaigns"],
        }),

        // GET - Récupérer les campagnes d'un utilisateur
        getUserCampaigns: builder.query<Campaign[], string>({
            query: (userId) => ({
                endpoint: "userCampaigns",
                method: "GET",
                data: { userId },
            }),
            providesTags: ["UserCampaigns"],
        }),
    }),
});

// Export des hooks générés automatiquement
export const {
    useGetCampaignsQuery,
    useGetCampaignQuery,
    useCreateCampaignMutation,
    useGetUserCampaignsQuery,
} = campaignsApi;
