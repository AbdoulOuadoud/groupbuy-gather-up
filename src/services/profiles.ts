import { supabase } from '@/lib/supabase';
import { Profile, ProfileInsert, ProfileUpdate } from '@/types/database';

// GET - Récupérer un profil par ID
export const getProfile = async (id: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error;
  }

  return data;
};

// GET - Récupérer un profil par username
export const getProfileByUsername = async (username: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Pas trouvé
    }
    console.error('Erreur lors de la récupération du profil par username:', error);
    throw error;
  }

  return data;
};

// GET - Récupérer tous les profils (avec pagination optionnelle)
export const getProfiles = async (limit?: number, offset?: number): Promise<Profile[]> => {
  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  if (offset) {
    query = query.range(offset, offset + (limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erreur lors de la récupération des profils:', error);
    throw error;
  }

  return data || [];
};

// INSERT - Créer un nouveau profil
export const createProfile = async (profile: ProfileInsert): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la création du profil:', error);
    throw error;
  }

  return data;
};

// UPDATE - Mettre à jour un profil
export const updateProfile = async (id: string, updates: ProfileUpdate): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }

  return data;
};

// DELETE - Supprimer un profil
export const deleteProfile = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erreur lors de la suppression du profil:', error);
    throw error;
  }
};

// Vérifier si un username est disponible
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (error && error.code === 'PGRST116') {
    return true; // Username disponible
  }

  if (error) {
    console.error('Erreur lors de la vérification du username:', error);
    throw error;
  }

  return false; // Username déjà pris
};
