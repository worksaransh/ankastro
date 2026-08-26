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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          id: string
          meta: Json | null
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          id?: string
          meta?: Json | null
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          meta?: Json | null
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      affirmations: {
        Row: {
          category: string | null
          created_at: string
          id: string
          language: string
          number: number | null
          sort_order: number | null
          text: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          language?: string
          number?: number | null
          sort_order?: number | null
          text: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          language?: string
          number?: number | null
          sort_order?: number | null
          text?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event: string
          id: string
          meta: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          meta?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          meta?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string
          featured_image: string | null
          id: string
          keywords: string[] | null
          language: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string
          featured_image?: string | null
          id?: string
          keywords?: string[] | null
          language?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string
          featured_image?: string | null
          id?: string
          keywords?: string[] | null
          language?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      compatibility_data: {
        Row: {
          challenges: string | null
          created_at: string
          detailed_analysis: string | null
          id: string
          language: string
          number1: number
          number2: number
          score: number
          strength: string | null
          updated_at: string
        }
        Insert: {
          challenges?: string | null
          created_at?: string
          detailed_analysis?: string | null
          id?: string
          language?: string
          number1: number
          number2: number
          score?: number
          strength?: string | null
          updated_at?: string
        }
        Update: {
          challenges?: string | null
          created_at?: string
          detailed_analysis?: string | null
          id?: string
          language?: string
          number1?: number
          number2?: number
          score?: number
          strength?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          content: Json
          created_at: string
          id: string
          key: string
          lang: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          key: string
          lang?: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          key?: string
          lang?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          created_at: string
          discount_amount: number
          id: string
          payment_id: string | null
          tier: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          discount_amount?: number
          id?: string
          payment_id?: string | null
          tier?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          discount_amount?: number
          id?: string
          payment_id?: string | null
          tier?: string | null
          user_id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          allow_stacking: boolean
          applicable_tiers: string[] | null
          auto_apply: boolean
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expiry_date: string | null
          first_time_user_only: boolean
          id: string
          min_cart_value: number
          per_user_limit: number
          updated_at: string
          usage_limit: number | null
          used_count: number
        }
        Insert: {
          active?: boolean
          allow_stacking?: boolean
          applicable_tiers?: string[] | null
          auto_apply?: boolean
          code: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expiry_date?: string | null
          first_time_user_only?: boolean
          id?: string
          min_cart_value?: number
          per_user_limit?: number
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Update: {
          active?: boolean
          allow_stacking?: boolean
          applicable_tiers?: string[] | null
          auto_apply?: boolean
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expiry_date?: string | null
          first_time_user_only?: boolean
          id?: string
          min_cart_value?: number
          per_user_limit?: number
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
        }
        Relationships: []
      }
      famous_persons: {
        Row: {
          bhagyank: number | null
          birth_year: number | null
          country: string
          created_at: string
          date_of_birth: string
          destiny_number: number
          field: string
          id: string
          known_for: string | null
          language: string
          life_path: number
          mulank: number | null
          name: string
          nationality: string | null
          personality_number: number
          profession: string
          short_bio: string
          soul_urge: number
          updated_at: string
          verified: boolean
        }
        Insert: {
          bhagyank?: number | null
          birth_year?: number | null
          country?: string
          created_at?: string
          date_of_birth: string
          destiny_number: number
          field?: string
          id?: string
          known_for?: string | null
          language?: string
          life_path: number
          mulank?: number | null
          name: string
          nationality?: string | null
          personality_number: number
          profession?: string
          short_bio?: string
          soul_urge: number
          updated_at?: string
          verified?: boolean
        }
        Update: {
          bhagyank?: number | null
          birth_year?: number | null
          country?: string
          created_at?: string
          date_of_birth?: string
          destiny_number?: number
          field?: string
          id?: string
          known_for?: string | null
          language?: string
          life_path?: number
          mulank?: number | null
          name?: string
          nationality?: string | null
          personality_number?: number
          profession?: string
          short_bio?: string
          soul_urge?: number
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          description: string | null
          enabled: boolean
          key: string
          updated_at: string
        }
        Insert: {
          description?: string | null
          enabled?: boolean
          key: string
          updated_at?: string
        }
        Update: {
          description?: string | null
          enabled?: boolean
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      lucky_attributes: {
        Row: {
          created_at: string
          id: string
          language: string
          lucky_colors: string[] | null
          lucky_days: string[] | null
          lucky_directions: string[] | null
          lucky_numbers: number[] | null
          number: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          lucky_colors?: string[] | null
          lucky_days?: string[] | null
          lucky_directions?: string[] | null
          lucky_numbers?: number[] | null
          number: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          lucky_colors?: string[] | null
          lucky_days?: string[] | null
          lucky_directions?: string[] | null
          lucky_numbers?: number[] | null
          number?: number
          updated_at?: string
        }
        Relationships: []
      }
      number_meanings: {
        Row: {
          careers: string[]
          category: string
          challenges: string[]
          created_at: string
          health: string | null
          id: string
          language: string
          number: number
          purpose: string
          relationships: string | null
          spiritual: string | null
          strengths: string[]
          title: string
          updated_at: string
        }
        Insert: {
          careers?: string[]
          category?: string
          challenges?: string[]
          created_at?: string
          health?: string | null
          id?: string
          language?: string
          number: number
          purpose: string
          relationships?: string | null
          spiritual?: string | null
          strengths?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          careers?: string[]
          category?: string
          challenges?: string[]
          created_at?: string
          health?: string | null
          id?: string
          language?: string
          number?: number
          purpose?: string
          relationships?: string | null
          spiritual?: string | null
          strengths?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      otp_delivery_log: {
        Row: {
          attempt: number
          created_at: string
          error_code: string | null
          error_message: string | null
          id: string
          phone: string
          provider: string
          provider_message_id: string | null
          status: string
        }
        Insert: {
          attempt?: number
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          phone: string
          provider: string
          provider_message_id?: string | null
          status: string
        }
        Update: {
          attempt?: number
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          phone?: string
          provider?: string
          provider_message_id?: string | null
          status?: string
        }
        Relationships: []
      }
      otp_providers: {
        Row: {
          config: Json
          created_at: string
          display_name: string
          enabled: boolean
          id: string
          is_test: boolean
          name: string
          priority: number
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          display_name: string
          enabled?: boolean
          id?: string
          is_test?: boolean
          name: string
          priority?: number
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          display_name?: string
          enabled?: boolean
          id?: string
          is_test?: boolean
          name?: string
          priority?: number
          updated_at?: string
        }
        Relationships: []
      }
      otp_verifications: {
        Row: {
          attempts: number
          created_at: string
          email: string | null
          expires_at: string
          id: string
          otp_code: string
          otp_hash: string | null
          phone: string | null
          provider: string | null
          purpose: string
          verified: boolean
        }
        Insert: {
          attempts?: number
          created_at?: string
          email?: string | null
          expires_at: string
          id?: string
          otp_code: string
          otp_hash?: string | null
          phone?: string | null
          provider?: string | null
          purpose?: string
          verified?: boolean
        }
        Update: {
          attempts?: number
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          otp_code?: string
          otp_hash?: string | null
          phone?: string | null
          provider?: string | null
          purpose?: string
          verified?: boolean
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          cashfree_order_id: string
          coupon_code: string | null
          created_at: string
          currency: string
          gateway_status: string | null
          id: string
          is_upgrade: boolean
          original_tier: string | null
          payment_session_id: string | null
          report_id: string | null
          status: string
          tier: Database["public"]["Enums"]["report_tier"]
          updated_at: string
          upgraded_from_payment_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          cashfree_order_id: string
          coupon_code?: string | null
          created_at?: string
          currency?: string
          gateway_status?: string | null
          id?: string
          is_upgrade?: boolean
          original_tier?: string | null
          payment_session_id?: string | null
          report_id?: string | null
          status?: string
          tier?: Database["public"]["Enums"]["report_tier"]
          updated_at?: string
          upgraded_from_payment_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          cashfree_order_id?: string
          coupon_code?: string | null
          created_at?: string
          currency?: string
          gateway_status?: string | null
          id?: string
          is_upgrade?: boolean
          original_tier?: string | null
          payment_session_id?: string | null
          report_id?: string | null
          status?: string
          tier?: Database["public"]["Enums"]["report_tier"]
          updated_at?: string
          upgraded_from_payment_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "user_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content_type: string
          created_at: string
          id: string
          key: string
          language: string
          updated_at: string
          value: string
        }
        Insert: {
          content_type?: string
          created_at?: string
          id?: string
          key: string
          language?: string
          updated_at?: string
          value?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          id?: string
          key?: string
          language?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          rating: number
          sort_order: number | null
          text: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          rating?: number
          sort_order?: number | null
          text: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          rating?: number
          sort_order?: number | null
          text?: string
        }
        Relationships: []
      }
      upgrade_paths: {
        Row: {
          created_at: string
          enabled: boolean
          from_tier: string
          id: string
          override_price: number | null
          to_tier: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          from_tier: string
          id?: string
          override_price?: number | null
          to_tier: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          from_tier?: string
          id?: string
          override_price?: number | null
          to_tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          bhagyank: number | null
          created_at: string
          display_name: string | null
          form_data: Json
          id: string
          is_primary: boolean
          language: string | null
          life_path: number | null
          mulank: number | null
          name_number: number | null
          relation: Database["public"]["Enums"]["report_relation"]
          report_type: string
          risk_score: number | null
          status: string | null
          tier_unlocked: Database["public"]["Enums"]["report_tier"]
          user_id: string
        }
        Insert: {
          bhagyank?: number | null
          created_at?: string
          display_name?: string | null
          form_data: Json
          id?: string
          is_primary?: boolean
          language?: string | null
          life_path?: number | null
          mulank?: number | null
          name_number?: number | null
          relation?: Database["public"]["Enums"]["report_relation"]
          report_type?: string
          risk_score?: number | null
          status?: string | null
          tier_unlocked?: Database["public"]["Enums"]["report_tier"]
          user_id: string
        }
        Update: {
          bhagyank?: number | null
          created_at?: string
          display_name?: string | null
          form_data?: Json
          id?: string
          is_primary?: boolean
          language?: string | null
          life_path?: number | null
          mulank?: number | null
          name_number?: number | null
          relation?: Database["public"]["Enums"]["report_relation"]
          report_type?: string
          risk_score?: number | null
          status?: string | null
          tier_unlocked?: Database["public"]["Enums"]["report_tier"]
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
      vedic_meanings: {
        Row: {
          content: Json
          created_at: string
          id: string
          language: string
          number: number
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          language?: string
          number: number
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          language?: string
          number?: number
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_report_tier: {
        Args: { _report_id: string }
        Returns: Database["public"]["Enums"]["report_tier"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_coupon_usage: {
        Args: { coupon_id: string }
        Returns: undefined
      }
      tier_rank: {
        Args: { _t: Database["public"]["Enums"]["report_tier"] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "user"
      report_relation:
        | "self"
        | "spouse"
        | "child"
        | "parent"
        | "sibling"
        | "friend"
        | "business"
        | "other"
      report_tier: "glimpse" | "starter" | "pro" | "master" | "addon"
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
      app_role: ["admin", "user"],
      report_relation: [
        "self",
        "spouse",
        "child",
        "parent",
        "sibling",
        "friend",
        "business",
        "other",
      ],
      report_tier: ["glimpse", "starter", "pro", "master", "addon"],
    },
  },
} as const
