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
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          id: string
          title: string
          description: string | null
          created_by: string
          is_active: boolean
          share_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_by: string
          is_active?: boolean
          share_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_by?: string
          is_active?: boolean
          share_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          question_text: string
          question_type: string
          order_index: number
          is_required: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          question_text: string
          question_type: string
          order_index: number
          is_required?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          question_text?: string
          question_type?: string
          order_index?: number
          is_required?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          }
        ]
      }
      options: {
        Row: {
          id: string
          question_id: string
          option_text: string
          is_correct: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_id: string
          option_text: string
          is_correct?: boolean
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          option_text?: string
          is_correct?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "options_question_id_fkey"
            columns: ["question_id"]
            referencedRelation: "questions"
            referencedColumns: ["id"]
          }
        ]
      }
      responses: {
        Row: {
          id: string
          quiz_id: string
          respondent_identifier: string | null
          started_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          respondent_identifier?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          respondent_identifier?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_quiz_id_fkey"
            columns: ["quiz_id"]
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          }
        ]
      }
      answers: {
        Row: {
          id: string
          response_id: string
          question_id: string
          selected_option_id: string | null
          text_answer: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          response_id: string
          question_id: string
          selected_option_id?: string | null
          text_answer?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          response_id?: string
          question_id?: string
          selected_option_id?: string | null
          text_answer?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_response_id_fkey"
            columns: ["response_id"]
            referencedRelation: "responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_selected_option_id_fkey"
            columns: ["selected_option_id"]
            referencedRelation: "options"
            referencedColumns: ["id"]
          }
        ]
      }
      completion_pages: {
        Row: {
          id: string
          quiz_id: string
          title: string
          description: string | null
          button_text: string
          button_url: string | null
          background_color: string
          text_color: string
          background_image: string | null
          header_enabled: boolean
          header_text: string | null
          header_font_size: string
          subheader_enabled: boolean
          subheader_text: string | null
          subheader_font_size: string
          main_image_enabled: boolean
          main_image_url: string | null
          main_image_alt: string | null
          footer_enabled: boolean
          footer_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          title: string
          description?: string | null
          button_text?: string
          button_url?: string | null
          background_color?: string
          text_color?: string
          background_image?: string | null
          header_enabled?: boolean
          header_text?: string | null
          header_font_size?: string
          subheader_enabled?: boolean
          subheader_text?: string | null
          subheader_font_size?: string
          main_image_enabled?: boolean
          main_image_url?: string | null
          main_image_alt?: string | null
          footer_enabled?: boolean
          footer_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          title?: string
          description?: string | null
          button_text?: string
          button_url?: string | null
          background_color?: string
          text_color?: string
          background_image?: string | null
          header_enabled?: boolean
          header_text?: string | null
          header_font_size?: string
          subheader_enabled?: boolean
          subheader_text?: string | null
          subheader_font_size?: string
          main_image_enabled?: boolean
          main_image_url?: string | null
          main_image_alt?: string | null
          footer_enabled?: boolean
          footer_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "completion_pages_quiz_id_fkey"
            columns: ["quiz_id"]
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          }
        ]
      }
      additional_buttons: {
        Row: {
          id: string
          completion_page_id: string
          button_text: string
          button_url: string
          button_style: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          completion_page_id: string
          button_text: string
          button_url: string
          button_style?: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          completion_page_id?: string
          button_text?: string
          button_url?: string
          button_style?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "additional_buttons_completion_page_id_fkey"
            columns: ["completion_page_id"]
            referencedRelation: "completion_pages"
            referencedColumns: ["id"]
          }
        ]
      }
      text_elements: {
        Row: {
          id: string
          completion_page_id: string
          element_type: string
          content: string
          font_size: string
          alignment: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          completion_page_id: string
          element_type: string
          content: string
          font_size?: string
          alignment?: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          completion_page_id?: string
          element_type?: string
          content?: string
          font_size?: string
          alignment?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "text_elements_completion_page_id_fkey"
            columns: ["completion_page_id"]
            referencedRelation: "completion_pages"
            referencedColumns: ["id"]
          }
        ]
      }
      footer_links: {
        Row: {
          id: string
          completion_page_id: string
          link_text: string
          link_url: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          completion_page_id: string
          link_text: string
          link_url: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          completion_page_id?: string
          link_text?: string
          link_url?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "footer_links_completion_page_id_fkey"
            columns: ["completion_page_id"]
            referencedRelation: "completion_pages"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
