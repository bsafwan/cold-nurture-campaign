export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      campaigns: {
        Row: {
          clicks: number
          created_at: string
          emails_sent: number
          estimated_completion: string | null
          id: string
          name: string
          opens: number
          replies: number
          scheduled_start: string | null
          status: string
          total_contacts: number
          unsubscribes: number
          updated_at: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          emails_sent?: number
          estimated_completion?: string | null
          id?: string
          name: string
          opens?: number
          replies?: number
          scheduled_start?: string | null
          status?: string
          total_contacts?: number
          unsubscribes?: number
          updated_at?: string
        }
        Update: {
          clicks?: number
          created_at?: string
          emails_sent?: number
          estimated_completion?: string | null
          id?: string
          name?: string
          opens?: number
          replies?: number
          scheduled_start?: string | null
          status?: string
          total_contacts?: number
          unsubscribes?: number
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          campaign_id: string
          company: string | null
          created_at: string
          email: string
          first_name: string | null
          follow_up_count: number
          id: string
          last_email_sent: string | null
          last_name: string | null
          next_email_scheduled: string | null
          status: string
          title: string | null
          updated_at: string
        }
        Insert: {
          campaign_id: string
          company?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          follow_up_count?: number
          id?: string
          last_email_sent?: string | null
          last_name?: string | null
          next_email_scheduled?: string | null
          status?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          follow_up_count?: number
          id?: string
          last_email_sent?: string | null
          last_name?: string | null
          next_email_scheduled?: string | null
          status?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          campaign_id: string
          clicked_at: string | null
          contact_id: string
          created_at: string
          delivered_at: string | null
          email_account: string
          error_message: string | null
          id: string
          opened_at: string | null
          replied_at: string | null
          sent_at: string | null
          status: string
          subject_line: string
          template_id: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          clicked_at?: string | null
          contact_id: string
          created_at?: string
          delivered_at?: string | null
          email_account: string
          error_message?: string | null
          id?: string
          opened_at?: string | null
          replied_at?: string | null
          sent_at?: string | null
          status?: string
          subject_line: string
          template_id: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          clicked_at?: string | null
          contact_id?: string
          created_at?: string
          delivered_at?: string | null
          email_account?: string
          error_message?: string | null
          id?: string
          opened_at?: string | null
          replied_at?: string | null
          sent_at?: string | null
          status?: string
          subject_line?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          campaign_id: string
          created_at: string
          id: string
          sequence_number: number
          subject_line: string
          template_type: string
          updated_at: string
        }
        Insert: {
          body: string
          campaign_id: string
          created_at?: string
          id?: string
          sequence_number: number
          subject_line: string
          template_type: string
          updated_at?: string
        }
        Update: {
          body?: string
          campaign_id?: string
          created_at?: string
          id?: string
          sequence_number?: number
          subject_line?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      unsubscribes: {
        Row: {
          campaign_id: string
          contact_id: string
          email: string
          id: string
          ip_address: unknown | null
          unsubscribed_at: string
          user_agent: string | null
        }
        Insert: {
          campaign_id: string
          contact_id: string
          email: string
          id?: string
          ip_address?: unknown | null
          unsubscribed_at?: string
          user_agent?: string | null
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          email?: string
          id?: string
          ip_address?: unknown | null
          unsubscribed_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unsubscribes_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unsubscribes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
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
