import { createClient } from '@supabase/supabase-js';

// Using a type assertion since we'll be generating the types from the database schema
// This allows us to have type safety without requiring the exact type definition
type Database = any;

// Initialize the Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

// Create a single supabase client for the entire app
export const supabase = createClient<Database>(
  supabaseUrl as string, 
  supabaseAnonKey as string
);

// Helper function to check if Supabase connection is working
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('quizzes').select('id').limit(1);
    
    // If there's an error with permissions, that still means the connection works
    // We're just checking if we can reach Supabase
    return !error || error.code !== 'connection_error';
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}

// Helper function to get authenticated user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Helper function for handling Supabase errors
export function handleSupabaseError(error: any): string {
  console.error('Supabase error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error_description) {
    return error.error_description;
  }
  
  return 'An unexpected error occurred';
}
