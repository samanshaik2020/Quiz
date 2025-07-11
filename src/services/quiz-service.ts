import { supabase, handleSupabaseError } from '@/lib/supabase';
import { generateUniqueUrl } from '@/lib/url-generator';
import { AuthService } from './auth-service';

// Define types for our database entities
type Quiz = {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  is_active: boolean;
  share_url: string | null;
  created_at: string;
  updated_at: string;
};

type QuizInsert = {
  id?: string;
  title: string;
  description?: string | null;
  created_by: string;
  is_active?: boolean;
  share_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

type CompletionPage = {
  id: string;
  quiz_id: string;
  title: string;
  description: string | null;
  button_text: string;
  button_url: string | null;
  background_color: string;
  text_color: string;
  background_image: string | null;
  header_enabled: boolean;
  header_text: string | null;
  header_font_size: string;
  subheader_enabled: boolean;
  subheader_text: string | null;
  subheader_font_size: string;
  main_image_enabled: boolean;
  main_image_url: string | null;
  main_image_alt: string | null;
  footer_enabled: boolean;
  footer_text: string | null;
  created_at: string;
  updated_at: string;
};

type CompletionPageInsert = {
  id?: string;
  quiz_id: string;
  title: string;
  description?: string | null;
  button_text?: string;
  button_url?: string | null;
  background_color?: string;
  text_color?: string;
  background_image?: string | null;
  header_enabled?: boolean;
  header_text?: string | null;
  header_font_size?: string;
  subheader_enabled?: boolean;
  subheader_text?: string | null;
  subheader_font_size?: string;
  main_image_enabled?: boolean;
  main_image_url?: string | null;
  main_image_alt?: string | null;
  footer_enabled?: boolean;
  footer_text?: string | null;
  created_at?: string;
  updated_at?: string;
};

/**
 * Service for handling quiz-related operations
 */
export const QuizService = {
  /**
   * Create a new quiz
   * 
   * @param quiz - Quiz data to insert (created_by is optional and will use current user if not provided)
   * @returns The created quiz or null if there was an error
   */
  async createQuiz(quiz: Omit<QuizInsert, 'id' | 'created_at' | 'updated_at' | 'share_url' | 'created_by'> & { created_by?: string }): Promise<Quiz | null> {
    try {
      // Get current user if created_by is not provided
      let userId = quiz.created_by;
      
      if (!userId) {
        const currentUser = await AuthService.getCurrentUser();
        if (!currentUser) {
          throw new Error('User must be authenticated to create a quiz');
        }
        userId = currentUser.id;
      }
      
      // Generate a unique URL for the quiz
      const shareUrl = generateUniqueUrl({
        baseUrl: window.location.origin,
        pathPrefix: '/quiz/',
        length: 12
      });

      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          ...quiz,
          created_by: userId,
          share_url: shareUrl
        })
        .select()
        .single();

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
   * Get a quiz by ID
   * 
   * @param id - Quiz ID
   * @returns The quiz or null if not found
   */
  async getQuizById(id: string): Promise<Quiz | null> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

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
   * Get a quiz by share URL
   * 
   * @param shareUrl - The unique share URL
   * @returns The quiz or null if not found
   */
  async getQuizByShareUrl(shareUrl: string): Promise<Quiz | null> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('share_url', shareUrl)
        .single();

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
   * Get all quizzes for a user
   * 
   * @param userId - User ID
   * @returns Array of quizzes
   */
  async getQuizzesByUser(userId: string): Promise<Quiz[]> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  /**
   * Update a quiz
   * 
   * @param id - Quiz ID
   * @param updates - Fields to update
   * @returns The updated quiz or null if there was an error
   */
  async updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz | null> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

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
   * Toggle the active status of a quiz
   * 
   * @param id - Quiz ID
   * @param isActive - New active status
   * @returns The updated quiz or null if there was an error
   */
  async toggleQuizActive(id: string, isActive: boolean): Promise<Quiz | null> {
    return this.updateQuiz(id, { is_active: isActive });
  },

  /**
   * Delete a quiz
   * 
   * @param id - Quiz ID
   * @returns Success status
   */
  async deleteQuiz(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);

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
   * Save completion page configuration for a quiz
   * 
   * @param quizId - Quiz ID
   * @param config - Completion page configuration
   * @returns The created/updated completion page or null if there was an error
   */
  async saveCompletionPage(quizId: string, config: Omit<CompletionPageInsert, 'id' | 'quiz_id' | 'created_at' | 'updated_at'>): Promise<CompletionPage | null> {
    try {
      // Check if a completion page already exists for this quiz
      const { data: existingPage, error: fetchError } = await supabase
        .from('completion_pages')
        .select('id')
        .eq('quiz_id', quizId)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      let result;

      if (existingPage) {
        // Update existing page
        const { data, error } = await supabase
          .from('completion_pages')
          .update(config)
          .eq('id', existingPage.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        result = data;
      } else {
        // Create new page
        const { data, error } = await supabase
          .from('completion_pages')
          .insert({
            ...config,
            quiz_id: quizId
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        result = data;
      }

      return result;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  },

  /**
   * Get completion page for a quiz
   * 
   * @param quizId - Quiz ID
   * @returns The completion page or null if not found
   */
  async getCompletionPage(quizId: string): Promise<CompletionPage | null> {
    try {
      const { data, error } = await supabase
        .from('completion_pages')
        .select('*')
        .eq('quiz_id', quizId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }
};
