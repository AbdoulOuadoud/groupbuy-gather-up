export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          created_by: string
          product_name: string
          product_image: string | null
          product_link: string | null
          description: string | null
          unit_price: number
          moq: number
          status: 'open' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          created_by: string
          product_name: string
          product_image?: string | null
          product_link?: string | null
          description?: string | null
          unit_price: number
          moq: number
          status?: 'open' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          product_name?: string
          product_image?: string | null
          product_link?: string | null
          description?: string | null
          unit_price?: number
          moq?: number
          status?: 'open' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      participations: {
        Row: {
          id: string
          user_id: string
          campaign_id: string
          quantity: number
          joined_at: string
        }
        Insert: {
          id?: string
          user_id: string
          campaign_id: string
          quantity: number
          joined_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          campaign_id?: string
          quantity?: number
          joined_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Types d'export pour utilisation dans les composants
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
export type CampaignUpdate = Database['public']['Tables']['campaigns']['Update'];

export type Participation = Database['public']['Tables']['participations']['Row'];
export type ParticipationInsert = Database['public']['Tables']['participations']['Insert'];
export type ParticipationUpdate = Database['public']['Tables']['participations']['Update'];

// Types étendus pour les jointures
export type CampaignWithParticipations = Campaign & {
  participations: Participation[];
  total_quantity: number;
  participant_count: number;
};

export type ParticipationWithCampaign = Participation & {
  campaigns: Campaign;
};

export type ParticipationWithProfile = Participation & {
  profiles: Profile;
};
