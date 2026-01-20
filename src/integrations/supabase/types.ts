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
      crm_contacts: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          company: string | null
          created_at: string
          created_by: string | null
          email: string | null
          full_name: string
          id: string
          last_contacted_at: string | null
          notes: string | null
          phone: string | null
          preferred_locations: string[] | null
          priority_level: string
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name: string
          id?: string
          last_contacted_at?: string | null
          notes?: string | null
          phone?: string | null
          preferred_locations?: string[] | null
          priority_level?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name?: string
          id?: string
          last_contacted_at?: string | null
          notes?: string | null
          phone?: string | null
          preferred_locations?: string[] | null
          priority_level?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      investor_applications: {
        Row: {
          admin_notes: string | null
          agreed_to_terms: boolean
          cash_available: string
          created_at: string
          crm_notes: string | null
          decision_maker: boolean
          funding_source: string
          id: string
          investment_experience: string
          last_contacted_at: string | null
          max_budget: number
          min_budget: number
          mortgage_approved: boolean
          needs_mortgage_broker: boolean | null
          needs_property_management: boolean | null
          needs_refurb_team: boolean | null
          needs_solicitor: boolean | null
          preferred_locations: string[]
          preferred_strategies: string[]
          priority_level: string | null
          properties_owned: number | null
          properties_to_acquire: number
          purchase_timeline: string
          referral_source: string | null
          rental_preference: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          specific_locations: string[] | null
          status: Database["public"]["Enums"]["investor_status"]
          target_yield: number | null
          tenure_preferences: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          agreed_to_terms?: boolean
          cash_available: string
          created_at?: string
          crm_notes?: string | null
          decision_maker: boolean
          funding_source: string
          id?: string
          investment_experience: string
          last_contacted_at?: string | null
          max_budget: number
          min_budget: number
          mortgage_approved: boolean
          needs_mortgage_broker?: boolean | null
          needs_property_management?: boolean | null
          needs_refurb_team?: boolean | null
          needs_solicitor?: boolean | null
          preferred_locations: string[]
          preferred_strategies: string[]
          priority_level?: string | null
          properties_owned?: number | null
          properties_to_acquire: number
          purchase_timeline: string
          referral_source?: string | null
          rental_preference?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specific_locations?: string[] | null
          status?: Database["public"]["Enums"]["investor_status"]
          target_yield?: number | null
          tenure_preferences?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          agreed_to_terms?: boolean
          cash_available?: string
          created_at?: string
          crm_notes?: string | null
          decision_maker?: boolean
          funding_source?: string
          id?: string
          investment_experience?: string
          last_contacted_at?: string | null
          max_budget?: number
          min_budget?: number
          mortgage_approved?: boolean
          needs_mortgage_broker?: boolean | null
          needs_property_management?: boolean | null
          needs_refurb_team?: boolean | null
          needs_solicitor?: boolean | null
          preferred_locations?: string[]
          preferred_strategies?: string[]
          priority_level?: string | null
          properties_owned?: number | null
          properties_to_acquire?: number
          purchase_timeline?: string
          referral_source?: string | null
          rental_preference?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specific_locations?: string[] | null
          status?: Database["public"]["Enums"]["investor_status"]
          target_yield?: number | null
          tenure_preferences?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investor_tag_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          crm_contact_id: string | null
          id: string
          investor_id: string | null
          tag_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          crm_contact_id?: string | null
          id?: string
          investor_id?: string | null
          tag_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          crm_contact_id?: string | null
          id?: string
          investor_id?: string | null
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_tag_assignments_crm_contact_id_fkey"
            columns: ["crm_contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investor_tag_assignments_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investor_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investor_tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "investor_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_tags: {
        Row: {
          category: Database["public"]["Enums"]["tag_category"]
          color: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category: Database["public"]["Enums"]["tag_category"]
          color?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: Database["public"]["Enums"]["tag_category"]
          color?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      mortgage_referrals: {
        Row: {
          cash_available: string | null
          created_at: string
          funding_source: string | null
          id: string
          investment_experience: string | null
          investor_email: string | null
          investor_name: string | null
          investor_phone: string | null
          max_budget: number | null
          min_budget: number | null
          mortgage_approved: boolean | null
          needs_mortgage_broker: boolean | null
          properties_owned: number | null
          property_id: string | null
          purchase_timeline: string | null
          referrer_url: string | null
          user_id: string | null
        }
        Insert: {
          cash_available?: string | null
          created_at?: string
          funding_source?: string | null
          id?: string
          investment_experience?: string | null
          investor_email?: string | null
          investor_name?: string | null
          investor_phone?: string | null
          max_budget?: number | null
          min_budget?: number | null
          mortgage_approved?: boolean | null
          needs_mortgage_broker?: boolean | null
          properties_owned?: number | null
          property_id?: string | null
          purchase_timeline?: string | null
          referrer_url?: string | null
          user_id?: string | null
        }
        Update: {
          cash_available?: string | null
          created_at?: string
          funding_source?: string | null
          id?: string
          investment_experience?: string | null
          investor_email?: string | null
          investor_name?: string | null
          investor_phone?: string | null
          max_budget?: number | null
          min_budget?: number | null
          mortgage_approved?: boolean | null
          needs_mortgage_broker?: boolean | null
          properties_owned?: number | null
          property_id?: string | null
          purchase_timeline?: string | null
          referrer_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mortgage_referrals_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cookie_consent_at: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          marketing_consent: boolean | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          cookie_consent_at?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          marketing_consent?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          cookie_consent_at?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          marketing_consent?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          asking_price: number
          bathrooms: number | null
          bedrooms: number | null
          cash_roi_percentage: number | null
          created_at: string
          current_rental_income: number | null
          current_status: Database["public"]["Enums"]["property_status"] | null
          deposit_required: number | null
          end_value_gdv: number | null
          epc_rating: string | null
          estimated_rental_income: number | null
          floor_plan_urls: string[] | null
          gross_yield_percentage: number | null
          has_eicr: boolean | null
          has_epc: boolean | null
          has_floor_plans: boolean | null
          has_gas_safety: boolean | null
          id: string
          investment_highlights: string[] | null
          is_tenanted: boolean | null
          leveraged_roi_percentage: number | null
          listing_status: Database["public"]["Enums"]["listing_status"]
          market_discount_percentage: number | null
          photo_urls: string[] | null
          property_address: string
          property_city: string
          property_description: string | null
          property_postcode: string
          property_reference: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          refurb_cost: number | null
          roce_percentage: number | null
          square_feet: number | null
          strategies:
            | Database["public"]["Enums"]["investment_strategy"][]
            | null
          submission_id: string | null
          tenure: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          asking_price: number
          bathrooms?: number | null
          bedrooms?: number | null
          cash_roi_percentage?: number | null
          created_at?: string
          current_rental_income?: number | null
          current_status?: Database["public"]["Enums"]["property_status"] | null
          deposit_required?: number | null
          end_value_gdv?: number | null
          epc_rating?: string | null
          estimated_rental_income?: number | null
          floor_plan_urls?: string[] | null
          gross_yield_percentage?: number | null
          has_eicr?: boolean | null
          has_epc?: boolean | null
          has_floor_plans?: boolean | null
          has_gas_safety?: boolean | null
          id?: string
          investment_highlights?: string[] | null
          is_tenanted?: boolean | null
          leveraged_roi_percentage?: number | null
          listing_status?: Database["public"]["Enums"]["listing_status"]
          market_discount_percentage?: number | null
          photo_urls?: string[] | null
          property_address: string
          property_city: string
          property_description?: string | null
          property_postcode: string
          property_reference?: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          refurb_cost?: number | null
          roce_percentage?: number | null
          square_feet?: number | null
          strategies?:
            | Database["public"]["Enums"]["investment_strategy"][]
            | null
          submission_id?: string | null
          tenure?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          asking_price?: number
          bathrooms?: number | null
          bedrooms?: number | null
          cash_roi_percentage?: number | null
          created_at?: string
          current_rental_income?: number | null
          current_status?: Database["public"]["Enums"]["property_status"] | null
          deposit_required?: number | null
          end_value_gdv?: number | null
          epc_rating?: string | null
          estimated_rental_income?: number | null
          floor_plan_urls?: string[] | null
          gross_yield_percentage?: number | null
          has_eicr?: boolean | null
          has_epc?: boolean | null
          has_floor_plans?: boolean | null
          has_gas_safety?: boolean | null
          id?: string
          investment_highlights?: string[] | null
          is_tenanted?: boolean | null
          leveraged_roi_percentage?: number | null
          listing_status?: Database["public"]["Enums"]["listing_status"]
          market_discount_percentage?: number | null
          photo_urls?: string[] | null
          property_address?: string
          property_city?: string
          property_description?: string | null
          property_postcode?: string
          property_reference?: string | null
          property_type?: Database["public"]["Enums"]["property_type"]
          refurb_cost?: number | null
          roce_percentage?: number | null
          square_feet?: number | null
          strategies?:
            | Database["public"]["Enums"]["investment_strategy"][]
            | null
          submission_id?: string | null
          tenure?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "seller_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      property_reservations: {
        Row: {
          created_at: string
          deposit_amount: number | null
          id: string
          notes: string | null
          property_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deposit_amount?: number | null
          id?: string
          notes?: string | null
          property_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deposit_amount?: number | null
          id?: string
          notes?: string | null
          property_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_reservations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_properties: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
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
          current_monthly_rent: number | null
          current_status: Database["public"]["Enums"]["property_status"]
          epc_rating: string | null
          estimated_monthly_rent: number | null
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
          user_id: string | null
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
          current_monthly_rent?: number | null
          current_status: Database["public"]["Enums"]["property_status"]
          epc_rating?: string | null
          estimated_monthly_rent?: number | null
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
          user_id?: string | null
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
          current_monthly_rent?: number | null
          current_status?: Database["public"]["Enums"]["property_status"]
          epc_rating?: string | null
          estimated_monthly_rent?: number | null
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
          user_id?: string | null
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
          role?: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_investor_status: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["investor_status"]
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
      app_role: "admin" | "investor" | "pending"
      investment_strategy:
        | "cash_roi"
        | "brrr"
        | "leveraged"
        | "capital_growth"
        | "hands_on"
        | "hands_off"
        | "btl"
        | "social_housing"
      investor_status: "pending" | "approved" | "rejected"
      listing_status: "available" | "reserved" | "under_offer" | "sold"
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
      tag_category:
        | "funding_type"
        | "strategy"
        | "rental_type"
        | "location"
        | "budget"
        | "preference"
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
      app_role: ["admin", "investor", "pending"],
      investment_strategy: [
        "cash_roi",
        "brrr",
        "leveraged",
        "capital_growth",
        "hands_on",
        "hands_off",
        "btl",
        "social_housing",
      ],
      investor_status: ["pending", "approved", "rejected"],
      listing_status: ["available", "reserved", "under_offer", "sold"],
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
      tag_category: [
        "funding_type",
        "strategy",
        "rental_type",
        "location",
        "budget",
        "preference",
      ],
    },
  },
} as const
