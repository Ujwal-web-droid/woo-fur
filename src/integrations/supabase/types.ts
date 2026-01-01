export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      animals: {
        Row: {
          adoption_status: string | null
          age: number | null
          arrival_date: string | null
          availability_status: string | null
          biography: string | null
          breed: string | null
          created_at: string
          gender: string | null
          id: string
          medical_history: Json | null
          name: string
          personality_traits: string[] | null
          photos: string[] | null
          size: string | null
          special_needs: string | null
          species: string
          therapy_certifications: Json | null
          updated_at: string
        }
        Insert: {
          adoption_status?: string | null
          age?: number | null
          arrival_date?: string | null
          availability_status?: string | null
          biography?: string | null
          breed?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          medical_history?: Json | null
          name: string
          personality_traits?: string[] | null
          photos?: string[] | null
          size?: string | null
          special_needs?: string | null
          species: string
          therapy_certifications?: Json | null
          updated_at?: string
        }
        Update: {
          adoption_status?: string | null
          age?: number | null
          arrival_date?: string | null
          availability_status?: string | null
          biography?: string | null
          breed?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          medical_history?: Json | null
          name?: string
          personality_traits?: string[] | null
          photos?: string[] | null
          size?: string | null
          special_needs?: string | null
          species?: string
          therapy_certifications?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          animal_id: string | null
          booking_type: string
          confirmation_sent: boolean | null
          contact_info: Json | null
          created_at: string
          duration: unknown
          id: string
          program_id: string | null
          scheduled_date: string
          scheduled_time: string
          special_requirements: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          animal_id?: string | null
          booking_type: string
          confirmation_sent?: boolean | null
          contact_info?: Json | null
          created_at?: string
          duration?: unknown
          id?: string
          program_id?: string | null
          scheduled_date: string
          scheduled_time: string
          special_requirements?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          animal_id?: string | null
          booking_type?: string
          confirmation_sent?: boolean | null
          contact_info?: Json | null
          created_at?: string
          duration?: unknown
          id?: string
          program_id?: string | null
          scheduled_date?: string
          scheduled_time?: string
          special_requirements?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          allocation: Json | null
          amount: number
          created_at: string
          currency: string | null
          donor_email: string | null
          donor_name: string | null
          id: string
          payment_method: string | null
          recurring: boolean | null
          recurring_frequency: string | null
          status: string
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          allocation?: Json | null
          amount: number
          created_at?: string
          currency?: string | null
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          payment_method?: string | null
          recurring?: boolean | null
          recurring_frequency?: string | null
          status: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          allocation?: Json | null
          amount?: number
          created_at?: string
          currency?: string | null
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          payment_method?: string | null
          recurring?: boolean | null
          recurring_frequency?: string | null
          status?: string
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accessibility_preferences: Json | null
          address: Json | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          emergency_contact: Json | null
          full_name: string | null
          id: string
          notification_preferences: Json | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          accessibility_preferences?: Json | null
          address?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          emergency_contact?: Json | null
          full_name?: string | null
          id: string
          notification_preferences?: Json | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          accessibility_preferences?: Json | null
          address?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          emergency_contact?: Json | null
          full_name?: string | null
          id?: string
          notification_preferences?: Json | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          goals: string | null
          id: string
          name: string
          pricing: Json | null
          process_steps: Json | null
          requirements: Json | null
          type: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          goals?: string | null
          id?: string
          name: string
          pricing?: Json | null
          process_steps?: Json | null
          requirements?: Json | null
          type: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          goals?: string | null
          id?: string
          name?: string
          pricing?: Json | null
          process_steps?: Json | null
          requirements?: Json | null
          type?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          author_id: string | null
          author_name: string | null
          category: string
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean | null
          id: string
          likes_count: number | null
          media_urls: string[] | null
          related_animal_ids: string[] | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          likes_count?: number | null
          media_urls?: string[] | null
          related_animal_ids?: string[] | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          likes_count?: number | null
          media_urls?: string[] | null
          related_animal_ids?: string[] | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      story_likes: {
        Row: {
          created_at: string
          id: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_likes_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          animal_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          animal_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          animal_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          availability: Json | null
          background_check: boolean | null
          created_at: string
          emergency_contact: Json | null
          hours_logged: number | null
          id: string
          skills: string[] | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: Json | null
          background_check?: boolean | null
          created_at?: string
          emergency_contact?: Json | null
          hours_logged?: number | null
          id?: string
          skills?: string[] | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: Json | null
          background_check?: boolean | null
          created_at?: string
          emergency_contact?: Json | null
          hours_logged?: number | null
          id?: string
          skills?: string[] | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_animal_availability: {
        Args: {
          _animal_id: string
          _date: string
          _duration?: unknown
          _time: string
        }
        Returns: boolean
      }
      get_donation_impact: { Args: never; Returns: Json }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "user"
        | "therapy_client"
        | "volunteer"
        | "adopter"
        | "donor"
        | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "user",
        "therapy_client",
        "volunteer",
        "adopter",
        "donor",
        "admin",
      ],
    },
  },
} as const
