import { supabase, handleSupabaseError } from '@/lib/supabase';

/**
 * Authentication service for handling user authentication operations
 */
export const AuthService = {
  /**
   * Sign up a new user with email and password
   * 
   * @param email - User's email
   * @param password - User's password
   * @param fullName - User's full name
   * @returns The user data or null if there was an error
   */
  async signUp(email: string, password: string, fullName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  },

  /**
   * Sign in a user with email and password
   * 
   * @param email - User's email
   * @param password - User's password
   * @returns The session data or null if there was an error
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  },

  /**
   * Sign out the current user
   * 
   * @returns Success status
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  },

  /**
   * Get the current user
   * 
   * @returns The current user or null if not authenticated
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      return data.user;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  },

  /**
   * Get the current session
   * 
   * @returns The current session or null if not authenticated
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return data.session;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  },

  /**
   * Reset password for a user
   * 
   * @param email - User's email
   * @returns Success status
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  },

  /**
   * Update user password
   * 
   * @param password - New password
   * @returns Success status
   */
  async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  },

  /**
   * Update user profile
   * 
   * @param profile - Profile data to update
   * @returns Success status
   */
  async updateProfile(profile: { fullName?: string; avatarUrl?: string }) {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName,
          avatar_url: profile.avatarUrl,
        },
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  },

  /**
   * Set up auth state change listener
   * 
   * @param callback - Callback function to execute when auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
