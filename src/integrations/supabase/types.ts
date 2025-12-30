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
      seller_submissions: {
        Row: {
          additional_notes: string | null
          admin_notes: string | null
          admin_status: Database["public"]["Enums"]["submission_status"]
          asking_price: number
          bathrooms: number | null
          bedrooms: number | null
          company_name: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string
          current_status: Database["public"]["Enums"]["property_status"]
          epc_rating: string | null
          has_eicr: boolean | null
          has_epc: boolean | null
          has_floor_plans: boolean | null
          has_gas_safety: boolean | null
          id: string
          is_owner: boolean | null
          photo_urls: string[] | null
          property_address: string
          property_city: string
          property_description: string | null
          property_postcode: string
          property_type: Database["public"]["Enums"]["property_type"]
          sale_timeline: Database["public"]["Enums"]["sale_timeline"]
          selling_reason: Database["public"]["Enums"]["selling_reason"]
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          admin_notes?: string | null
          admin_status?: Database["public"]["Enums"]["submission_status"]
          asking_price: number
          bathrooms?: number | null
          bedrooms?: number | null
          company_name?: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string
          current_status: Database["public"]["Enums"]["property_status"]
          epc_rating?: string | null
          has_eicr?: boolean | null
          has_epc?: boolean | null
          has_floor_plans?: boolean | null
          has_gas_safety?: boolean | null
          id?: string
          is_owner?: boolean | null
          photo_urls?: string[] | null
          property_address: string
          property_city: string
          property_description?: string | null
          property_postcode: string
          property_type: Database["public"]["Enums"]["property_type"]
          sale_timeline: Database["public"]["Enums"]["sale_timeline"]
          selling_reason: Database["public"]["Enums"]["selling_reason"]
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          admin_notes?: string | null
          admin_status?: Database["public"]["Enums"]["submission_status"]
          asking_price?: number
          bathrooms?: number | null
          bedrooms?: number | null
          company_name?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          current_status?: Database["public"]["Enums"]["property_status"]
          epc_rating?: string | null
          has_eicr?: boolean | null
          has_epc?: boolean | null
          has_floor_plans?: boolean | null
          has_gas_safety?: boolean | null
          id?: string
          is_owner?: boolean | null
          photo_urls?: string[] | null
          property_address?: string
          property_city?: string
          property_description?: string | null
          property_postcode?: string
          property_type?: Database["public"]["Enums"]["property_type"]
          sale_timeline?: Database["public"]["Enums"]["sale_timeline"]
          selling_reason?: Database["public"]["Enums"]["selling_reason"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      property_status:
        | "vacant"
        | "tenanted"
        | "owner_occupied"
        | "under_renovation"
      property_type:
        | "terraced"
        | "semi_detached"
        | "detached"
        | "flat"
        | "bungalow"
        | "commercial"
        | "land"
        | "hmo"
        | "other"
      sale_timeline:
        | "asap"
        | "within_1_month"
        | "within_3_months"
        | "within_6_months"
        | "flexible"
      selling_reason:
        | "quick_sale"
        | "relocation"
        | "investment_exit"
        | "inheritance"
        | "divorce"
        | "financial"
        | "upgrade"
        | "downsize"
        | "other"
      submission_status:
        | "pending"
        | "reviewing"
        | "approved"
        | "rejected"
        | "listed"
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
      property_status: [
        "vacant",
        "tenanted",
        "owner_occupied",
        "under_renovation",
      ],
      property_type: [
        "terraced",
        "semi_detached",
        "detached",
        "flat",
        "bungalow",
        "commercial",
        "land",
        "hmo",
        "other",
      ],
      sale_timeline: [
        "asap",
        "within_1_month",
        "within_3_months",
        "within_6_months",
        "flexible",
      ],
      selling_reason: [
        "quick_sale",
        "relocation",
        "investment_exit",
        "inheritance",
        "divorce",
        "financial",
        "upgrade",
        "downsize",
        "other",
      ],
      submission_status: [
        "pending",
        "reviewing",
        "approved",
        "rejected",
        "listed",
      ],
    },
  },
} as const
