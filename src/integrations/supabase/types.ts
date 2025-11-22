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
      ai_conversations: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          messages: Json
          session_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          messages?: Json
          session_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          messages?: Json
          session_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          area_sq_km: number | null
          avg_income: number | null
          business_ease_score: number | null
          created_at: string | null
          demographics: Json | null
          district: string | null
          employment_rate: number | null
          gdp_per_capita: number | null
          id: string
          infrastructure_score: number | null
          internet_penetration: number | null
          key_industries: Json | null
          latitude: number
          literacy_rate: number | null
          longitude: number
          name: string
          pin_code: string | null
          population: number
          population_density: number | null
          rent_index: number | null
          state: string
          tier: string | null
          updated_at: string | null
          urbanization_level: string | null
        }
        Insert: {
          area_sq_km?: number | null
          avg_income?: number | null
          business_ease_score?: number | null
          created_at?: string | null
          demographics?: Json | null
          district?: string | null
          employment_rate?: number | null
          gdp_per_capita?: number | null
          id?: string
          infrastructure_score?: number | null
          internet_penetration?: number | null
          key_industries?: Json | null
          latitude: number
          literacy_rate?: number | null
          longitude: number
          name: string
          pin_code?: string | null
          population: number
          population_density?: number | null
          rent_index?: number | null
          state: string
          tier?: string | null
          updated_at?: string | null
          urbanization_level?: string | null
        }
        Update: {
          area_sq_km?: number | null
          avg_income?: number | null
          business_ease_score?: number | null
          created_at?: string | null
          demographics?: Json | null
          district?: string | null
          employment_rate?: number | null
          gdp_per_capita?: number | null
          id?: string
          infrastructure_score?: number | null
          internet_penetration?: number | null
          key_industries?: Json | null
          latitude?: number
          literacy_rate?: number | null
          longitude?: number
          name?: string
          pin_code?: string | null
          population?: number
          population_density?: number | null
          rent_index?: number | null
          state?: string
          tier?: string | null
          updated_at?: string | null
          urbanization_level?: string | null
        }
        Relationships: []
      }
      custom_ideas: {
        Row: {
          analysis_result: Json | null
          biz_score: number | null
          category: string | null
          city_id: string | null
          coordinates: Json | null
          created_at: string | null
          id: string
          idea_text: string
          location: string | null
          niche: string | null
          parsed_data: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analysis_result?: Json | null
          biz_score?: number | null
          category?: string | null
          city_id?: string | null
          coordinates?: Json | null
          created_at?: string | null
          id?: string
          idea_text: string
          location?: string | null
          niche?: string | null
          parsed_data?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analysis_result?: Json | null
          biz_score?: number | null
          category?: string | null
          city_id?: string | null
          coordinates?: Json | null
          created_at?: string | null
          id?: string
          idea_text?: string
          location?: string | null
          niche?: string | null
          parsed_data?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_ideas_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_comparisons: {
        Row: {
          created_at: string | null
          id: string
          idea_ids: Json
          matrix_result: Json | null
          name: string
          updated_at: string | null
          user_id: string
          weights: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          idea_ids: Json
          matrix_result?: Json | null
          name: string
          updated_at?: string | null
          user_id: string
          weights?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          idea_ids?: Json
          matrix_result?: Json | null
          name?: string
          updated_at?: string | null
          user_id?: string
          weights?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_ideas: {
        Row: {
          biz_score_12m: number
          biz_score_today: number
          category: string
          competition_density: string | null
          coordinates: Json
          created_at: string
          demand_index: number | null
          financials: Json | null
          forecast_growth: number | null
          id: string
          location: string
          recommendation: Json | null
          swot: Json | null
          user_id: string
        }
        Insert: {
          biz_score_12m: number
          biz_score_today: number
          category: string
          competition_density?: string | null
          coordinates: Json
          created_at?: string
          demand_index?: number | null
          financials?: Json | null
          forecast_growth?: number | null
          id?: string
          location: string
          recommendation?: Json | null
          swot?: Json | null
          user_id: string
        }
        Update: {
          biz_score_12m?: number
          biz_score_today?: number
          category?: string
          competition_density?: string | null
          coordinates?: Json
          created_at?: string
          demand_index?: number | null
          financials?: Json | null
          forecast_growth?: number | null
          id?: string
          location?: string
          recommendation?: Json | null
          swot?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      saved_reports: {
        Row: {
          created_at: string
          id: string
          idea_id: string | null
          report_data: Json
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id?: string | null
          report_data: Json
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string | null
          report_data?: Json
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_reports_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "saved_ideas"
            referencedColumns: ["id"]
          },
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
    Enums: {},
  },
} as const
