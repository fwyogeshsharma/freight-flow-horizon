export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      access_logs: {
        Row: {
          action: string
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_holder_name: string
          account_number: string
          account_type: string | null
          bank_name: string
          branch_name: string | null
          created_at: string | null
          id: string
          ifsc_code: string
          is_primary: boolean
          is_verified: boolean
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_holder_name: string
          account_number: string
          account_type?: string | null
          bank_name: string
          branch_name?: string | null
          created_at?: string | null
          id?: string
          ifsc_code: string
          is_primary?: boolean
          is_verified?: boolean
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          account_type?: string | null
          bank_name?: string
          branch_name?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string
          is_primary?: boolean
          is_verified?: boolean
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          bid_amount: number
          comments: string | null
          delivery_commitment: string | null
          fleet_owner_id: string
          id: string
          load_id: string
          proposed_driver_id: string
          proposed_truck_id: string
          responded_at: string | null
          status: string | null
          submitted_at: string | null
        }
        Insert: {
          bid_amount: number
          comments?: string | null
          delivery_commitment?: string | null
          fleet_owner_id: string
          id?: string
          load_id: string
          proposed_driver_id: string
          proposed_truck_id: string
          responded_at?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Update: {
          bid_amount?: number
          comments?: string | null
          delivery_commitment?: string | null
          fleet_owner_id?: string
          id?: string
          load_id?: string
          proposed_driver_id?: string
          proposed_truck_id?: string
          responded_at?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_fleet_owner_id_fkey"
            columns: ["fleet_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "loads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_proposed_driver_id_fkey"
            columns: ["proposed_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_proposed_truck_id_fkey"
            columns: ["proposed_truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_rules: {
        Row: {
          commission_type: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean
          max_amount: number | null
          min_amount: number | null
          rule_name: string
          updated_at: string | null
          user_role: Database["public"]["Enums"]["user_role"]
          value: number
        }
        Insert: {
          commission_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean
          max_amount?: number | null
          min_amount?: number | null
          rule_name: string
          updated_at?: string | null
          user_role: Database["public"]["Enums"]["user_role"]
          value: number
        }
        Update: {
          commission_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean
          max_amount?: number | null
          min_amount?: number | null
          rule_name?: string
          updated_at?: string | null
          user_role?: Database["public"]["Enums"]["user_role"]
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "commission_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          document_type: string
          driver_id: string
          file_name: string
          file_url: string
          id: string
          notes: string | null
          trip_id: string | null
          truck_id: string | null
          uploaded_at: string | null
        }
        Insert: {
          document_type: string
          driver_id: string
          file_name: string
          file_url: string
          id?: string
          notes?: string | null
          trip_id?: string | null
          truck_id?: string | null
          uploaded_at?: string | null
        }
        Update: {
          document_type?: string
          driver_id?: string
          file_name?: string
          file_url?: string
          id?: string
          notes?: string | null
          trip_id?: string | null
          truck_id?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          experience_years: number | null
          fleet_owner_id: string
          id: string
          license_expiry: string | null
          license_number: string
          license_type: string
          rating: number | null
          status: string | null
          total_trips: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience_years?: number | null
          fleet_owner_id: string
          id?: string
          license_expiry?: string | null
          license_number: string
          license_type: string
          rating?: number | null
          status?: string | null
          total_trips?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience_years?: number | null
          fleet_owner_id?: string
          id?: string
          license_expiry?: string | null
          license_number?: string
          license_type?: string
          rating?: number | null
          status?: string | null
          total_trips?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_fleet_owner_id_fkey"
            columns: ["fleet_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drivers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_alerts: {
        Row: {
          acknowledged_at: string | null
          alert_type: string
          created_at: string | null
          driver_id: string
          id: string
          latitude: number | null
          longitude: number | null
          message: string | null
          resolved_at: string | null
          status: string
          trip_id: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          alert_type?: string
          created_at?: string | null
          driver_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          message?: string | null
          resolved_at?: string | null
          status?: string
          trip_id?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          alert_type?: string
          created_at?: string | null
          driver_id?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          message?: string | null
          resolved_at?: string | null
          status?: string
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_alerts_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_advances: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string
          created_at: string | null
          driver_id: string
          id: string
          notes: string | null
          purpose: string
          receipt_url: string | null
          status: Database["public"]["Enums"]["payment_status"]
          trip_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by: string
          created_at?: string | null
          driver_id: string
          id?: string
          notes?: string | null
          purpose?: string
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          trip_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string
          created_at?: string | null
          driver_id?: string
          id?: string
          notes?: string | null
          purpose?: string
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          trip_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fuel_advances_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_advances_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_logs: {
        Row: {
          driver_id: string
          fuel_amount: number
          fuel_cost: number
          id: string
          location: string | null
          logged_at: string | null
          odometer_reading: number | null
          receipt_url: string | null
          trip_id: string | null
          truck_id: string
        }
        Insert: {
          driver_id: string
          fuel_amount: number
          fuel_cost: number
          id?: string
          location?: string | null
          logged_at?: string | null
          odometer_reading?: number | null
          receipt_url?: string | null
          trip_id?: string | null
          truck_id: string
        }
        Update: {
          driver_id?: string
          fuel_amount?: number
          fuel_cost?: number
          id?: string
          location?: string | null
          logged_at?: string | null
          odometer_reading?: number | null
          receipt_url?: string | null
          trip_id?: string | null
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_logs_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          agent_commission: number
          base_amount: number
          created_at: string | null
          driver_id: string | null
          drop_location: string
          due_date: string | null
          factory_owner_id: string
          fleet_owner_id: string
          id: string
          invoice_date: string
          invoice_number: string
          load_id: string
          material_type: string
          notes: string | null
          paid_at: string | null
          payment_gateway_id: string | null
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["invoice_status"]
          pickup_location: string
          platform_commission: number
          tax_amount: number
          terms_conditions: string | null
          total_amount: number
          trip_id: string | null
          truck_id: string | null
          updated_at: string | null
          weight_tons: number
        }
        Insert: {
          agent_commission?: number
          base_amount: number
          created_at?: string | null
          driver_id?: string | null
          drop_location: string
          due_date?: string | null
          factory_owner_id: string
          fleet_owner_id: string
          id?: string
          invoice_date?: string
          invoice_number: string
          load_id: string
          material_type: string
          notes?: string | null
          paid_at?: string | null
          payment_gateway_id?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["invoice_status"]
          pickup_location: string
          platform_commission?: number
          tax_amount?: number
          terms_conditions?: string | null
          total_amount: number
          trip_id?: string | null
          truck_id?: string | null
          updated_at?: string | null
          weight_tons: number
        }
        Update: {
          agent_commission?: number
          base_amount?: number
          created_at?: string | null
          driver_id?: string | null
          drop_location?: string
          due_date?: string | null
          factory_owner_id?: string
          fleet_owner_id?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          load_id?: string
          material_type?: string
          notes?: string | null
          paid_at?: string | null
          payment_gateway_id?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["invoice_status"]
          pickup_location?: string
          platform_commission?: number
          tax_amount?: number
          terms_conditions?: string | null
          total_amount?: number
          trip_id?: string | null
          truck_id?: string | null
          updated_at?: string | null
          weight_tons?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_factory_owner_id_fkey"
            columns: ["factory_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_fleet_owner_id_fkey"
            columns: ["fleet_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "loads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          document_number: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_url: string
          id: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["kyc_status"] | null
          uploaded_at: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_number?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_url: string
          id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["kyc_status"] | null
          uploaded_at?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_number?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_url?: string
          id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["kyc_status"] | null
          uploaded_at?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loads: {
        Row: {
          assigned_driver_id: string | null
          assigned_to_fleet: string | null
          assigned_truck_id: string | null
          bidding_enabled: boolean | null
          bidding_end_time: string | null
          created_at: string | null
          delivery_date: string | null
          drop_address: string
          drop_location: string
          factory_owner_id: string
          id: string
          load_number: string
          material_type: string
          organization_id: string | null
          pickup_address: string
          pickup_date: string
          pickup_location: string
          price_quoted: number | null
          special_instructions: string | null
          status: string | null
          truck_type_required: string
          updated_at: string | null
          weight_tons: number
        }
        Insert: {
          assigned_driver_id?: string | null
          assigned_to_fleet?: string | null
          assigned_truck_id?: string | null
          bidding_enabled?: boolean | null
          bidding_end_time?: string | null
          created_at?: string | null
          delivery_date?: string | null
          drop_address: string
          drop_location: string
          factory_owner_id: string
          id?: string
          load_number: string
          material_type: string
          organization_id?: string | null
          pickup_address: string
          pickup_date: string
          pickup_location: string
          price_quoted?: number | null
          special_instructions?: string | null
          status?: string | null
          truck_type_required: string
          updated_at?: string | null
          weight_tons: number
        }
        Update: {
          assigned_driver_id?: string | null
          assigned_to_fleet?: string | null
          assigned_truck_id?: string | null
          bidding_enabled?: boolean | null
          bidding_end_time?: string | null
          created_at?: string | null
          delivery_date?: string | null
          drop_address?: string
          drop_location?: string
          factory_owner_id?: string
          id?: string
          load_number?: string
          material_type?: string
          organization_id?: string | null
          pickup_address?: string
          pickup_date?: string
          pickup_location?: string
          price_quoted?: number | null
          special_instructions?: string | null
          status?: string | null
          truck_type_required?: string
          updated_at?: string | null
          weight_tons?: number
        }
        Relationships: [
          {
            foreignKeyName: "loads_assigned_driver_id_fkey"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loads_assigned_to_fleet_fkey"
            columns: ["assigned_to_fleet"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loads_assigned_truck_id_fkey"
            columns: ["assigned_truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loads_factory_owner_id_fkey"
            columns: ["factory_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          id: string
          is_read: boolean | null
          message: string
          recipient_id: string
          sender_id: string
          sent_at: string | null
          trip_id: string | null
        }
        Insert: {
          id?: string
          is_read?: boolean | null
          message: string
          recipient_id: string
          sender_id: string
          sent_at?: string | null
          trip_id?: string | null
        }
        Update: {
          id?: string
          is_read?: boolean | null
          message?: string
          recipient_id?: string
          sender_id?: string
          sent_at?: string | null
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string
          city: string
          created_at: string | null
          email: string | null
          gst_number: string | null
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          name: string
          owner_id: string
          phone: string | null
          pin_code: string
          registration_number: string | null
          state: string
          type: string
          updated_at: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          name: string
          owner_id: string
          phone?: string | null
          pin_code: string
          registration_number?: string | null
          state: string
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          name?: string
          owner_id?: string
          phone?: string | null
          pin_code?: string
          registration_number?: string | null
          state?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          failure_reason: string | null
          gateway_payment_id: string | null
          gateway_response: Json | null
          id: string
          invoice_id: string
          payee_id: string
          payer_id: string
          payment_gateway: string | null
          payment_method: string
          processed_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          failure_reason?: string | null
          gateway_payment_id?: string | null
          gateway_response?: Json | null
          id?: string
          invoice_id: string
          payee_id: string
          payer_id: string
          payment_gateway?: string | null
          payment_method: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          failure_reason?: string | null
          gateway_payment_id?: string | null
          gateway_response?: Json | null
          id?: string
          invoice_id?: string
          payee_id?: string
          payer_id?: string
          payment_gateway?: string | null
          payment_method?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payee_id_fkey"
            columns: ["payee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          company_name: string | null
          created_at: string | null
          full_name: string | null
          gst_number: string | null
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          phone_number: string | null
          pin_code: string | null
          rejected_reason: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          state: string | null
          updated_at: string | null
          username: string | null
          verified_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          gst_number?: string | null
          id: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          phone_number?: string | null
          pin_code?: string | null
          rejected_reason?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          state?: string | null
          updated_at?: string | null
          username?: string | null
          verified_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          gst_number?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          phone_number?: string | null
          pin_code?: string | null
          rejected_reason?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          state?: string | null
          updated_at?: string | null
          username?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      trip_tracking: {
        Row: {
          heading: number | null
          id: string
          latitude: number
          longitude: number
          recorded_at: string | null
          speed: number | null
          trip_id: string
        }
        Insert: {
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string | null
          speed?: number | null
          trip_id: string
        }
        Update: {
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string | null
          speed?: number | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_tracking_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          completed_at: string | null
          created_at: string | null
          destination: string
          distance_km: number | null
          driver_id: string
          fuel_consumed: number | null
          id: string
          load_id: string
          origin: string
          paused_at: string | null
          started_at: string | null
          status: string
          truck_id: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          destination: string
          distance_km?: number | null
          driver_id: string
          fuel_consumed?: number | null
          id?: string
          load_id: string
          origin: string
          paused_at?: string | null
          started_at?: string | null
          status?: string
          truck_id: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          destination?: string
          distance_km?: number | null
          driver_id?: string
          fuel_consumed?: number | null
          id?: string
          load_id?: string
          origin?: string
          paused_at?: string | null
          started_at?: string | null
          status?: string
          truck_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trucks: {
        Row: {
          capacity_tons: number
          created_at: string | null
          current_location: string | null
          fitness_expiry: string | null
          fleet_owner_id: string
          id: string
          insurance_expiry: string | null
          model: string | null
          organization_id: string | null
          permit_expiry: string | null
          rc_number: string | null
          status: string | null
          truck_number: string
          truck_type: string
          updated_at: string | null
          year: number | null
        }
        Insert: {
          capacity_tons: number
          created_at?: string | null
          current_location?: string | null
          fitness_expiry?: string | null
          fleet_owner_id: string
          id?: string
          insurance_expiry?: string | null
          model?: string | null
          organization_id?: string | null
          permit_expiry?: string | null
          rc_number?: string | null
          status?: string | null
          truck_number: string
          truck_type: string
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          capacity_tons?: number
          created_at?: string | null
          current_location?: string | null
          fitness_expiry?: string | null
          fleet_owner_id?: string
          id?: string
          insurance_expiry?: string | null
          model?: string | null
          organization_id?: string | null
          permit_expiry?: string | null
          rc_number?: string | null
          status?: string | null
          truck_number?: string
          truck_type?: string
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trucks_fleet_owner_id_fkey"
            columns: ["fleet_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trucks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_inspections: {
        Row: {
          checklist_data: Json
          driver_id: string
          id: string
          images: Json | null
          inspected_at: string | null
          inspection_type: string
          notes: string | null
          status: string
          truck_id: string
        }
        Insert: {
          checklist_data: Json
          driver_id: string
          id?: string
          images?: Json | null
          inspected_at?: string | null
          inspection_type: string
          notes?: string | null
          status: string
          truck_id: string
        }
        Update: {
          checklist_data?: Json
          driver_id?: string
          id?: string
          images?: Json | null
          inspected_at?: string | null
          inspection_type?: string
          notes?: string | null
          status?: string
          truck_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          description: string | null
          gateway_transaction_id: string | null
          id: string
          metadata: Json | null
          payment_gateway: string | null
          reference_id: string | null
          reference_type: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          description?: string | null
          gateway_transaction_id?: string | null
          id?: string
          metadata?: Json | null
          payment_gateway?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          description?: string | null
          gateway_transaction_id?: string | null
          id?: string
          metadata?: Json | null
          payment_gateway?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string | null
          frozen_balance: number
          id: string
          is_frozen: boolean
          minimum_balance: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          frozen_balance?: number
          id?: string
          is_frozen?: boolean
          minimum_balance?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          frozen_balance?: number
          id?: string
          is_frozen?: boolean
          minimum_balance?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          bank_account_id: string
          created_at: string | null
          id: string
          processed_at: string | null
          processed_by: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string | null
          user_id: string
          wallet_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          bank_account_id: string
          created_at?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
          user_id: string
          wallet_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          bank_account_id?: string
          created_at?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "withdrawal_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "withdrawal_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "withdrawal_requests_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_super_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      document_type:
        | "pan_card"
        | "aadhaar_card"
        | "driving_license"
        | "vehicle_rc"
        | "insurance_certificate"
        | "permit"
        | "gst_certificate"
        | "company_registration"
        | "bank_proof"
        | "address_proof"
        | "factory_verification"
        | "police_verification"
      invoice_status: "draft" | "pending" | "paid" | "overdue" | "cancelled"
      kyc_status: "pending" | "verified" | "rejected" | "suspended"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
        | "cancelled"
      transaction_type:
        | "credit"
        | "debit"
        | "commission"
        | "refund"
        | "withdrawal"
        | "deposit"
      user_role:
        | "super_admin"
        | "fleet_owner"
        | "factory_owner"
        | "transport_agent"
        | "driver"
        | "consignee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_type: [
        "pan_card",
        "aadhaar_card",
        "driving_license",
        "vehicle_rc",
        "insurance_certificate",
        "permit",
        "gst_certificate",
        "company_registration",
        "bank_proof",
        "address_proof",
        "factory_verification",
        "police_verification",
      ],
      invoice_status: ["draft", "pending", "paid", "overdue", "cancelled"],
      kyc_status: ["pending", "verified", "rejected", "suspended"],
      payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "cancelled",
      ],
      transaction_type: [
        "credit",
        "debit",
        "commission",
        "refund",
        "withdrawal",
        "deposit",
      ],
      user_role: [
        "super_admin",
        "fleet_owner",
        "factory_owner",
        "transport_agent",
        "driver",
        "consignee",
      ],
    },
  },
} as const
