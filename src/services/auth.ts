import { supabase } from '@/lib/supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { createProfile, isUsernameAvailable } from './profiles';

export interface AuthResponse {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
}

export interface SignUpData {
    email: string;
    password: string;
    username: string;
    full_name?: string;
    phone?: string;
}

export interface SignInData {
    email: string;
    password: string;
}

// Inscription avec création automatique du profil
export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
    try {
        // Vérifier que le username est disponible
        const isAvailable = await isUsernameAvailable(data.username);
        if (!isAvailable) {
            return {
                user: null,
                session: null,
                error: {
                    message: 'Ce nom d\'utilisateur est déjà pris',
                    name: 'UsernameUnavailable'
                } as AuthError
            };
        }

        // Inscription Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    username: data.username,
                    full_name: data.full_name || null,
                    phone: data.phone || null,
                }
            }
        });

        if (authError) {
            return {
                user: null,
                session: null,
                error: authError
            };
        }

        // Si l'utilisateur est créé, créer le profil
        if (authData.user) {
            try {
                await createProfile({
                    id: authData.user.id,
                    username: data.username,
                    full_name: data.full_name || null,
                    phone: data.phone || null,
                });
            } catch (profileError) {
                console.error('Erreur lors de la création du profil:', profileError);
                // Ne pas faire échouer l'inscription si le profil ne peut pas être créé
                // Le trigger de la base de données devrait gérer cela
            }
        }

        return {
            user: authData.user,
            session: authData.session,
            error: null
        };
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        return {
            user: null,
            session: null,
            error: error as AuthError
        };
    }
};

// Connexion
export const signIn = async (data: SignInData): Promise<AuthResponse> => {
    try {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        return {
            user: authData.user,
            session: authData.session,
            error
        };
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return {
            user: null,
            session: null,
            error: error as AuthError
        };
    }
};

// Déconnexion
export const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
        const { error } = await supabase.auth.signOut();
        return { error };
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        return { error: error as AuthError };
    }
};

// Récupérer la session actuelle
export const getCurrentSession = async (): Promise<Session | null> => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Erreur lors de la récupération de la session:', error);
            return null;
        }

        return session;
    } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        return null;
    }
};

// Récupérer l'utilisateur actuel
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            return null;
        }

        return user;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return null;
    }
};

// Réinitialisation du mot de passe
export const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        return { error };
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        return { error: error as AuthError };
    }
};

// Mettre à jour le mot de passe
export const updatePassword = async (newPassword: string): Promise<{ error: AuthError | null }> => {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        return { error };
    } catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe:', error);
        return { error: error as AuthError };
    }
};

// Mettre à jour l'email
export const updateEmail = async (newEmail: string): Promise<{ error: AuthError | null }> => {
    try {
        const { error } = await supabase.auth.updateUser({
            email: newEmail
        });

        return { error };
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'email:', error);
        return { error: error as AuthError };
    }
};

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = async (): Promise<boolean> => {
    const session = await getCurrentSession();
    return !!session;
};

// Listener pour les changements d'état d'authentification
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
};

// Rafraîchir la session
export const refreshSession = async (): Promise<AuthResponse> => {
    try {
        const { data, error } = await supabase.auth.refreshSession();

        return {
            user: data.user,
            session: data.session,
            error
        };
    } catch (error) {
        console.error('Erreur lors du rafraîchissement de la session:', error);
        return {
            user: null,
            session: null,
            error: error as AuthError
        };
    }
};
