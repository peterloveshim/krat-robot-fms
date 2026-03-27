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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      complexes: {
        Row: {
          address: string | null
          city: string | null
          complex_grade: Database["public"]["Enums"]["complex_grade"]
          created_at: string
          district: string | null
          id: string
          is_tower_pmc: boolean | null
          name: string
          notes: string | null
          site_manager_name: string | null
          site_manager_phone: string | null
          total_units: number | null
          tower_pmc_site_code: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          complex_grade?: Database["public"]["Enums"]["complex_grade"]
          created_at?: string
          district?: string | null
          id?: string
          is_tower_pmc?: boolean | null
          name: string
          notes?: string | null
          site_manager_name?: string | null
          site_manager_phone?: string | null
          total_units?: number | null
          tower_pmc_site_code?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          complex_grade?: Database["public"]["Enums"]["complex_grade"]
          created_at?: string
          district?: string | null
          id?: string
          is_tower_pmc?: boolean | null
          name?: string
          notes?: string | null
          site_manager_name?: string | null
          site_manager_phone?: string | null
          total_units?: number | null
          tower_pmc_site_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      consumable_types: {
        Row: {
          applicable_categories:
            | Database["public"]["Enums"]["robot_category"][]
            | null
          applicable_subtypes:
            | Database["public"]["Enums"]["robot_subtype"][]
            | null
          category: string | null
          created_at: string
          expected_lifespan_hours: number | null
          id: string
          lead_time_days: number | null
          name: string
          part_number: string | null
          supplier: string | null
          unit_cost_krw: number | null
        }
        Insert: {
          applicable_categories?:
            | Database["public"]["Enums"]["robot_category"][]
            | null
          applicable_subtypes?:
            | Database["public"]["Enums"]["robot_subtype"][]
            | null
          category?: string | null
          created_at?: string
          expected_lifespan_hours?: number | null
          id?: string
          lead_time_days?: number | null
          name: string
          part_number?: string | null
          supplier?: string | null
          unit_cost_krw?: number | null
        }
        Update: {
          applicable_categories?:
            | Database["public"]["Enums"]["robot_category"][]
            | null
          applicable_subtypes?:
            | Database["public"]["Enums"]["robot_subtype"][]
            | null
          category?: string | null
          created_at?: string
          expected_lifespan_hours?: number | null
          id?: string
          lead_time_days?: number | null
          name?: string
          part_number?: string | null
          supplier?: string | null
          unit_cost_krw?: number | null
        }
        Relationships: []
      }
      consumables: {
        Row: {
          alert_threshold_pct: number | null
          area_cleaned_m2: number | null
          consumable_type_id: string
          created_at: string
          hours_used: number | null
          id: string
          installed_at: string
          is_alert_active: boolean | null
          notes: string | null
          remaining_pct: number
          replaced_at: string | null
          robot_id: string
          updated_at: string
        }
        Insert: {
          alert_threshold_pct?: number | null
          area_cleaned_m2?: number | null
          consumable_type_id: string
          created_at?: string
          hours_used?: number | null
          id?: string
          installed_at?: string
          is_alert_active?: boolean | null
          notes?: string | null
          remaining_pct?: number
          replaced_at?: string | null
          robot_id: string
          updated_at?: string
        }
        Update: {
          alert_threshold_pct?: number | null
          area_cleaned_m2?: number | null
          consumable_type_id?: string
          created_at?: string
          hours_used?: number | null
          id?: string
          installed_at?: string
          is_alert_active?: boolean | null
          notes?: string | null
          remaining_pct?: number
          replaced_at?: string | null
          robot_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumables_consumable_type_id_fkey"
            columns: ["consumable_type_id"]
            isOneToOne: false
            referencedRelation: "consumable_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consumables_robot_id_fkey"
            columns: ["robot_id"]
            isOneToOne: false
            referencedRelation: "robots"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_logs: {
        Row: {
          charge_cycles: number | null
          charging_hours: number | null
          created_at: string
          energy_consumed_wh: number
          energy_per_hour: number | null
          energy_per_m2: number | null
          id: string
          log_date: string
          notes: string | null
          operating_hours: number | null
          robot_id: string
        }
        Insert: {
          charge_cycles?: number | null
          charging_hours?: number | null
          created_at?: string
          energy_consumed_wh: number
          energy_per_hour?: number | null
          energy_per_m2?: number | null
          id?: string
          log_date: string
          notes?: string | null
          operating_hours?: number | null
          robot_id: string
        }
        Update: {
          charge_cycles?: number | null
          charging_hours?: number | null
          created_at?: string
          energy_consumed_wh?: number
          energy_per_hour?: number | null
          energy_per_m2?: number | null
          id?: string
          log_date?: string
          notes?: string | null
          operating_hours?: number | null
          robot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "energy_logs_robot_id_fkey"
            columns: ["robot_id"]
            isOneToOne: false
            referencedRelation: "robots"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          complex_id: string
          created_at: string
          description: string | null
          error_code: string | null
          error_source: string | null
          id: string
          is_safety_incident: boolean | null
          occurred_at: string
          resident_involved: boolean | null
          resolution: string | null
          resolved_at: string | null
          robot_id: string | null
          severity: Database["public"]["Enums"]["incident_severity"]
          status: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          complex_id: string
          created_at?: string
          description?: string | null
          error_code?: string | null
          error_source?: string | null
          id?: string
          is_safety_incident?: boolean | null
          occurred_at?: string
          resident_involved?: boolean | null
          resolution?: string | null
          resolved_at?: string | null
          robot_id?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"]
          status?: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          complex_id?: string
          created_at?: string
          description?: string | null
          error_code?: string | null
          error_source?: string | null
          id?: string
          is_safety_incident?: boolean | null
          occurred_at?: string
          resident_involved?: boolean | null
          resolution?: string | null
          resolved_at?: string | null
          robot_id?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"]
          status?: Database["public"]["Enums"]["incident_status"]
          title?: string
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_complex_id_fkey"
            columns: ["complex_id"]
            isOneToOne: false
            referencedRelation: "complexes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_robot_id_fkey"
            columns: ["robot_id"]
            isOneToOne: false
            referencedRelation: "robots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      interaction_events: {
        Row: {
          complex_id: string
          created_at: string
          encounter_duration_sec: number | null
          id: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          latitude: number | null
          longitude: number | null
          notes: string | null
          occurred_at: string
          request_detail: string | null
          response_status: string | null
          robot_action: string | null
          robot_id: string
          zone_id: string | null
        }
        Insert: {
          complex_id: string
          created_at?: string
          encounter_duration_sec?: number | null
          id?: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          occurred_at?: string
          request_detail?: string | null
          response_status?: string | null
          robot_action?: string | null
          robot_id: string
          zone_id?: string | null
        }
        Update: {
          complex_id?: string
          created_at?: string
          encounter_duration_sec?: number | null
          id?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          occurred_at?: string
          request_detail?: string | null
          response_status?: string | null
          robot_action?: string | null
          robot_id?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interaction_events_complex_id_fkey"
            columns: ["complex_id"]
            isOneToOne: false
            referencedRelation: "complexes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interaction_events_robot_id_fkey"
            columns: ["robot_id"]
            isOneToOne: false
            referencedRelation: "robots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interaction_events_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          area_cleaned_m2: number | null
          cleaning_score: number | null
          completed_at: string | null
          complex_id: string
          coverage_pct: number | null
          created_at: string
          delta_air_quality: number | null
          duration_minutes: number | null
          error_code: string | null
          error_message: string | null
          id: string
          manual_override: boolean | null
          manual_override_reason: string | null
          mission_name: string | null
          notes: string | null
          post_co2: number | null
          post_contamination: number | null
          post_pm25: number | null
          pre_co2: number | null
          pre_contamination: number | null
          pre_pm25: number | null
          robot_id: string
          scheduled_at: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["mission_status"]
          water_used_liters: number | null
          zone_id: string
        }
        Insert: {
          area_cleaned_m2?: number | null
          cleaning_score?: number | null
          completed_at?: string | null
          complex_id: string
          coverage_pct?: number | null
          created_at?: string
          delta_air_quality?: number | null
          duration_minutes?: number | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          manual_override?: boolean | null
          manual_override_reason?: string | null
          mission_name?: string | null
          notes?: string | null
          post_co2?: number | null
          post_contamination?: number | null
          post_pm25?: number | null
          pre_co2?: number | null
          pre_contamination?: number | null
          pre_pm25?: number | null
          robot_id: string
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["mission_status"]
          water_used_liters?: number | null
          zone_id: string
        }
        Update: {
          area_cleaned_m2?: number | null
          cleaning_score?: number | null
          completed_at?: string | null
          complex_id?: string
          coverage_pct?: number | null
          created_at?: string
          delta_air_quality?: number | null
          duration_minutes?: number | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          manual_override?: boolean | null
          manual_override_reason?: string | null
          mission_name?: string | null
          notes?: string | null
          post_co2?: number | null
          post_contamination?: number | null
          post_pm25?: number | null
          pre_co2?: number | null
          pre_contamination?: number | null
          pre_pm25?: number | null
          robot_id?: string
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["mission_status"]
          water_used_liters?: number | null
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "missions_complex_id_fkey"
            columns: ["complex_id"]
            isOneToOne: false
            referencedRelation: "complexes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_robot_id_fkey"
            columns: ["robot_id"]
            isOneToOne: false
            referencedRelation: "robots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      operational_insights: {
        Row: {
          applied_at: string | null
          complex_id: string | null
          confidence_score: number | null
          created_at: string
          description: string
          id: string
          insight_type: string
          is_applied: boolean | null
          parameters_json: Json | null
          robot_category: Database["public"]["Enums"]["robot_category"] | null
          sample_size: number | null
          title: string
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          applied_at?: string | null
          complex_id?: string | null
          confidence_score?: number | null
          created_at?: string
          description: string
          id?: string
          insight_type: string
          is_applied?: boolean | null
          parameters_json?: Json | null
          robot_category?: Database["public"]["Enums"]["robot_category"] | null
          sample_size?: number | null
          title: string
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          applied_at?: string | null
          complex_id?: string | null
          confidence_score?: number | null
          created_at?: string
          description?: string
          id?: string
          insight_type?: string
          is_applied?: boolean | null
          parameters_json?: Json | null
          robot_category?: Database["public"]["Enums"]["robot_category"] | null
          sample_size?: number | null
          title?: string
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operational_insights_complex_id_fkey"
            columns: ["complex_id"]
            isOneToOne: false
            referencedRelation: "complexes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_insights_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      path_logs: {
        Row: {
          captured_at: string
          heading_deg: number | null
          id: number
          latitude: number
          longitude: number
          mission_id: string | null
          robot_id: string
          speed_mps: number | null
          zone_id: string | null
        }
        Insert: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude: number
          longitude: number
          mission_id?: string | null
          robot_id: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Update: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude?: number
          longitude?: number
          mission_id?: string | null
          robot_id?: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      path_logs_2026_03: {
        Row: {
          captured_at: string
          heading_deg: number | null
          id: number
          latitude: number
          longitude: number
          mission_id: string | null
          robot_id: string
          speed_mps: number | null
          zone_id: string | null
        }
        Insert: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude: number
          longitude: number
          mission_id?: string | null
          robot_id: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Update: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude?: number
          longitude?: number
          mission_id?: string | null
          robot_id?: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      path_logs_2026_04: {
        Row: {
          captured_at: string
          heading_deg: number | null
          id: number
          latitude: number
          longitude: number
          mission_id: string | null
          robot_id: string
          speed_mps: number | null
          zone_id: string | null
        }
        Insert: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude: number
          longitude: number
          mission_id?: string | null
          robot_id: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Update: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude?: number
          longitude?: number
          mission_id?: string | null
          robot_id?: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      path_logs_2026_05: {
        Row: {
          captured_at: string
          heading_deg: number | null
          id: number
          latitude: number
          longitude: number
          mission_id: string | null
          robot_id: string
          speed_mps: number | null
          zone_id: string | null
        }
        Insert: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude: number
          longitude: number
          mission_id?: string | null
          robot_id: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Update: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude?: number
          longitude?: number
          mission_id?: string | null
          robot_id?: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      path_logs_2026_06: {
        Row: {
          captured_at: string
          heading_deg: number | null
          id: number
          latitude: number
          longitude: number
          mission_id: string | null
          robot_id: string
          speed_mps: number | null
          zone_id: string | null
        }
        Insert: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude: number
          longitude: number
          mission_id?: string | null
          robot_id: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Update: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude?: number
          longitude?: number
          mission_id?: string | null
          robot_id?: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      path_logs_2026_07: {
        Row: {
          captured_at: string
          heading_deg: number | null
          id: number
          latitude: number
          longitude: number
          mission_id: string | null
          robot_id: string
          speed_mps: number | null
          zone_id: string | null
        }
        Insert: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude: number
          longitude: number
          mission_id?: string | null
          robot_id: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Update: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude?: number
          longitude?: number
          mission_id?: string | null
          robot_id?: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      path_logs_2026_08: {
        Row: {
          captured_at: string
          heading_deg: number | null
          id: number
          latitude: number
          longitude: number
          mission_id: string | null
          robot_id: string
          speed_mps: number | null
          zone_id: string | null
        }
        Insert: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude: number
          longitude: number
          mission_id?: string | null
          robot_id: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Update: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude?: number
          longitude?: number
          mission_id?: string | null
          robot_id?: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      path_logs_2026_09: {
        Row: {
          captured_at: string
          heading_deg: number | null
          id: number
          latitude: number
          longitude: number
          mission_id: string | null
          robot_id: string
          speed_mps: number | null
          zone_id: string | null
        }
        Insert: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude: number
          longitude: number
          mission_id?: string | null
          robot_id: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Update: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude?: number
          longitude?: number
          mission_id?: string | null
          robot_id?: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      path_logs_2026_10: {
        Row: {
          captured_at: string
          heading_deg: number | null
          id: number
          latitude: number
          longitude: number
          mission_id: string | null
          robot_id: string
          speed_mps: number | null
          zone_id: string | null
        }
        Insert: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude: number
          longitude: number
          mission_id?: string | null
          robot_id: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Update: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude?: number
          longitude?: number
          mission_id?: string | null
          robot_id?: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      path_logs_2026_11: {
        Row: {
          captured_at: string
          heading_deg: number | null
          id: number
          latitude: number
          longitude: number
          mission_id: string | null
          robot_id: string
          speed_mps: number | null
          zone_id: string | null
        }
        Insert: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude: number
          longitude: number
          mission_id?: string | null
          robot_id: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Update: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude?: number
          longitude?: number
          mission_id?: string | null
          robot_id?: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      path_logs_2026_12: {
        Row: {
          captured_at: string
          heading_deg: number | null
          id: number
          latitude: number
          longitude: number
          mission_id: string | null
          robot_id: string
          speed_mps: number | null
          zone_id: string | null
        }
        Insert: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude: number
          longitude: number
          mission_id?: string | null
          robot_id: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Update: {
          captured_at?: string
          heading_deg?: number | null
          id?: number
          latitude?: number
          longitude?: number
          mission_id?: string | null
          robot_id?: string
          speed_mps?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      robots: {
        Row: {
          assigned_zone_ids: string[] | null
          battery_pct: number | null
          category: Database["public"]["Enums"]["robot_category"]
          clean_water_pct: number | null
          complex_id: string | null
          created_at: string
          current_zone_id: string | null
          deployed_at: string | null
          dirty_water_pct: number | null
          display_name: string | null
          dock_latitude: number | null
          dock_longitude: number | null
          dock_zone_id: string | null
          firmware_version: string | null
          id: string
          last_seen_at: string | null
          latitude: number | null
          longitude: number | null
          manufacturer: string
          model: string
          notes: string | null
          serial_number: string
          status: Database["public"]["Enums"]["robot_status"]
          subtype: Database["public"]["Enums"]["robot_subtype"]
          total_area_m2: number | null
          total_hours: number | null
          total_missions: number | null
          updated_at: string
        }
        Insert: {
          assigned_zone_ids?: string[] | null
          battery_pct?: number | null
          category: Database["public"]["Enums"]["robot_category"]
          clean_water_pct?: number | null
          complex_id?: string | null
          created_at?: string
          current_zone_id?: string | null
          deployed_at?: string | null
          dirty_water_pct?: number | null
          display_name?: string | null
          dock_latitude?: number | null
          dock_longitude?: number | null
          dock_zone_id?: string | null
          firmware_version?: string | null
          id?: string
          last_seen_at?: string | null
          latitude?: number | null
          longitude?: number | null
          manufacturer: string
          model: string
          notes?: string | null
          serial_number: string
          status?: Database["public"]["Enums"]["robot_status"]
          subtype: Database["public"]["Enums"]["robot_subtype"]
          total_area_m2?: number | null
          total_hours?: number | null
          total_missions?: number | null
          updated_at?: string
        }
        Update: {
          assigned_zone_ids?: string[] | null
          battery_pct?: number | null
          category?: Database["public"]["Enums"]["robot_category"]
          clean_water_pct?: number | null
          complex_id?: string | null
          created_at?: string
          current_zone_id?: string | null
          deployed_at?: string | null
          dirty_water_pct?: number | null
          display_name?: string | null
          dock_latitude?: number | null
          dock_longitude?: number | null
          dock_zone_id?: string | null
          firmware_version?: string | null
          id?: string
          last_seen_at?: string | null
          latitude?: number | null
          longitude?: number | null
          manufacturer?: string
          model?: string
          notes?: string | null
          serial_number?: string
          status?: Database["public"]["Enums"]["robot_status"]
          subtype?: Database["public"]["Enums"]["robot_subtype"]
          total_area_m2?: number | null
          total_hours?: number | null
          total_missions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "robots_complex_id_fkey"
            columns: ["complex_id"]
            isOneToOne: false
            referencedRelation: "complexes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "robots_current_zone_id_fkey"
            columns: ["current_zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "robots_dock_zone_id_fkey"
            columns: ["dock_zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      telemetry: {
        Row: {
          battery_pct: number | null
          battery_voltage: number | null
          captured_at: string
          clean_water_pct: number | null
          co2_ppm: number | null
          dirty_water_pct: number | null
          floor_contamination: number | null
          humidity_pct: number | null
          id: number
          latitude: number | null
          longitude: number | null
          pm25: number | null
          raw_json: Json | null
          robot_id: string
          sensor_node_id: string | null
          speed_mps: number | null
          temperature_c: number | null
          tvoc_ppb: number | null
          wifi_rssi_dbm: number | null
          zone_id: string | null
        }
        Insert: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Update: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id?: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      telemetry_2026_03: {
        Row: {
          battery_pct: number | null
          battery_voltage: number | null
          captured_at: string
          clean_water_pct: number | null
          co2_ppm: number | null
          dirty_water_pct: number | null
          floor_contamination: number | null
          humidity_pct: number | null
          id: number
          latitude: number | null
          longitude: number | null
          pm25: number | null
          raw_json: Json | null
          robot_id: string
          sensor_node_id: string | null
          speed_mps: number | null
          temperature_c: number | null
          tvoc_ppb: number | null
          wifi_rssi_dbm: number | null
          zone_id: string | null
        }
        Insert: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Update: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id?: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      telemetry_2026_04: {
        Row: {
          battery_pct: number | null
          battery_voltage: number | null
          captured_at: string
          clean_water_pct: number | null
          co2_ppm: number | null
          dirty_water_pct: number | null
          floor_contamination: number | null
          humidity_pct: number | null
          id: number
          latitude: number | null
          longitude: number | null
          pm25: number | null
          raw_json: Json | null
          robot_id: string
          sensor_node_id: string | null
          speed_mps: number | null
          temperature_c: number | null
          tvoc_ppb: number | null
          wifi_rssi_dbm: number | null
          zone_id: string | null
        }
        Insert: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Update: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id?: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      telemetry_2026_05: {
        Row: {
          battery_pct: number | null
          battery_voltage: number | null
          captured_at: string
          clean_water_pct: number | null
          co2_ppm: number | null
          dirty_water_pct: number | null
          floor_contamination: number | null
          humidity_pct: number | null
          id: number
          latitude: number | null
          longitude: number | null
          pm25: number | null
          raw_json: Json | null
          robot_id: string
          sensor_node_id: string | null
          speed_mps: number | null
          temperature_c: number | null
          tvoc_ppb: number | null
          wifi_rssi_dbm: number | null
          zone_id: string | null
        }
        Insert: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Update: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id?: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      telemetry_2026_06: {
        Row: {
          battery_pct: number | null
          battery_voltage: number | null
          captured_at: string
          clean_water_pct: number | null
          co2_ppm: number | null
          dirty_water_pct: number | null
          floor_contamination: number | null
          humidity_pct: number | null
          id: number
          latitude: number | null
          longitude: number | null
          pm25: number | null
          raw_json: Json | null
          robot_id: string
          sensor_node_id: string | null
          speed_mps: number | null
          temperature_c: number | null
          tvoc_ppb: number | null
          wifi_rssi_dbm: number | null
          zone_id: string | null
        }
        Insert: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Update: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id?: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      telemetry_2026_07: {
        Row: {
          battery_pct: number | null
          battery_voltage: number | null
          captured_at: string
          clean_water_pct: number | null
          co2_ppm: number | null
          dirty_water_pct: number | null
          floor_contamination: number | null
          humidity_pct: number | null
          id: number
          latitude: number | null
          longitude: number | null
          pm25: number | null
          raw_json: Json | null
          robot_id: string
          sensor_node_id: string | null
          speed_mps: number | null
          temperature_c: number | null
          tvoc_ppb: number | null
          wifi_rssi_dbm: number | null
          zone_id: string | null
        }
        Insert: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Update: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id?: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      telemetry_2026_08: {
        Row: {
          battery_pct: number | null
          battery_voltage: number | null
          captured_at: string
          clean_water_pct: number | null
          co2_ppm: number | null
          dirty_water_pct: number | null
          floor_contamination: number | null
          humidity_pct: number | null
          id: number
          latitude: number | null
          longitude: number | null
          pm25: number | null
          raw_json: Json | null
          robot_id: string
          sensor_node_id: string | null
          speed_mps: number | null
          temperature_c: number | null
          tvoc_ppb: number | null
          wifi_rssi_dbm: number | null
          zone_id: string | null
        }
        Insert: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Update: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id?: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      telemetry_2026_09: {
        Row: {
          battery_pct: number | null
          battery_voltage: number | null
          captured_at: string
          clean_water_pct: number | null
          co2_ppm: number | null
          dirty_water_pct: number | null
          floor_contamination: number | null
          humidity_pct: number | null
          id: number
          latitude: number | null
          longitude: number | null
          pm25: number | null
          raw_json: Json | null
          robot_id: string
          sensor_node_id: string | null
          speed_mps: number | null
          temperature_c: number | null
          tvoc_ppb: number | null
          wifi_rssi_dbm: number | null
          zone_id: string | null
        }
        Insert: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Update: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id?: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      telemetry_2026_10: {
        Row: {
          battery_pct: number | null
          battery_voltage: number | null
          captured_at: string
          clean_water_pct: number | null
          co2_ppm: number | null
          dirty_water_pct: number | null
          floor_contamination: number | null
          humidity_pct: number | null
          id: number
          latitude: number | null
          longitude: number | null
          pm25: number | null
          raw_json: Json | null
          robot_id: string
          sensor_node_id: string | null
          speed_mps: number | null
          temperature_c: number | null
          tvoc_ppb: number | null
          wifi_rssi_dbm: number | null
          zone_id: string | null
        }
        Insert: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Update: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id?: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      telemetry_2026_11: {
        Row: {
          battery_pct: number | null
          battery_voltage: number | null
          captured_at: string
          clean_water_pct: number | null
          co2_ppm: number | null
          dirty_water_pct: number | null
          floor_contamination: number | null
          humidity_pct: number | null
          id: number
          latitude: number | null
          longitude: number | null
          pm25: number | null
          raw_json: Json | null
          robot_id: string
          sensor_node_id: string | null
          speed_mps: number | null
          temperature_c: number | null
          tvoc_ppb: number | null
          wifi_rssi_dbm: number | null
          zone_id: string | null
        }
        Insert: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Update: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id?: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      telemetry_2026_12: {
        Row: {
          battery_pct: number | null
          battery_voltage: number | null
          captured_at: string
          clean_water_pct: number | null
          co2_ppm: number | null
          dirty_water_pct: number | null
          floor_contamination: number | null
          humidity_pct: number | null
          id: number
          latitude: number | null
          longitude: number | null
          pm25: number | null
          raw_json: Json | null
          robot_id: string
          sensor_node_id: string | null
          speed_mps: number | null
          temperature_c: number | null
          tvoc_ppb: number | null
          wifi_rssi_dbm: number | null
          zone_id: string | null
        }
        Insert: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Update: {
          battery_pct?: number | null
          battery_voltage?: number | null
          captured_at?: string
          clean_water_pct?: number | null
          co2_ppm?: number | null
          dirty_water_pct?: number | null
          floor_contamination?: number | null
          humidity_pct?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          pm25?: number | null
          raw_json?: Json | null
          robot_id?: string
          sensor_node_id?: string | null
          speed_mps?: number | null
          temperature_c?: number | null
          tvoc_ppb?: number | null
          wifi_rssi_dbm?: number | null
          zone_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          assigned_complex_ids: string[] | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          assigned_complex_ids?: string[] | null
          created_at?: string
          display_name?: string | null
          email: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          assigned_complex_ids?: string[] | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      zone_maps: {
        Row: {
          change_reason: string | null
          created_at: string
          id: string
          is_active: boolean
          map_file_url: string | null
          map_format: string | null
          resolution_m: number | null
          robot_category: Database["public"]["Enums"]["robot_category"]
          version: number
          zone_id: string
        }
        Insert: {
          change_reason?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          map_file_url?: string | null
          map_format?: string | null
          resolution_m?: number | null
          robot_category: Database["public"]["Enums"]["robot_category"]
          version?: number
          zone_id: string
        }
        Update: {
          change_reason?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          map_file_url?: string | null
          map_format?: string | null
          resolution_m?: number | null
          robot_category?: Database["public"]["Enums"]["robot_category"]
          version?: number
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "zone_maps_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      zones: {
        Row: {
          area_m2: number | null
          cleaning_passes: number | null
          complex_id: string
          contamination_level: string | null
          contamination_type: string | null
          created_at: string
          encounter_protocol: string | null
          floor_level: string | null
          floor_material: Database["public"]["Enums"]["floor_material"]
          id: string
          name: string
          noise_limit_db: number | null
          notes: string | null
          optimal_brush_pressure: string | null
          optimal_speed_mps: number | null
          optimal_water_level: string | null
          peak_hours_end: string | null
          peak_hours_start: string | null
          priority_score: number | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          resident_feedback_json: Json | null
          robot_accessible: boolean
          seasonal_profile_json: Json | null
          updated_at: string
          weather_override_json: Json | null
          zone_type: Database["public"]["Enums"]["zone_type"]
        }
        Insert: {
          area_m2?: number | null
          cleaning_passes?: number | null
          complex_id: string
          contamination_level?: string | null
          contamination_type?: string | null
          created_at?: string
          encounter_protocol?: string | null
          floor_level?: string | null
          floor_material?: Database["public"]["Enums"]["floor_material"]
          id?: string
          name: string
          noise_limit_db?: number | null
          notes?: string | null
          optimal_brush_pressure?: string | null
          optimal_speed_mps?: number | null
          optimal_water_level?: string | null
          peak_hours_end?: string | null
          peak_hours_start?: string | null
          priority_score?: number | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          resident_feedback_json?: Json | null
          robot_accessible?: boolean
          seasonal_profile_json?: Json | null
          updated_at?: string
          weather_override_json?: Json | null
          zone_type: Database["public"]["Enums"]["zone_type"]
        }
        Update: {
          area_m2?: number | null
          cleaning_passes?: number | null
          complex_id?: string
          contamination_level?: string | null
          contamination_type?: string | null
          created_at?: string
          encounter_protocol?: string | null
          floor_level?: string | null
          floor_material?: Database["public"]["Enums"]["floor_material"]
          id?: string
          name?: string
          noise_limit_db?: number | null
          notes?: string | null
          optimal_brush_pressure?: string | null
          optimal_speed_mps?: number | null
          optimal_water_level?: string | null
          peak_hours_end?: string | null
          peak_hours_start?: string | null
          priority_score?: number | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          resident_feedback_json?: Json | null
          robot_accessible?: boolean
          seasonal_profile_json?: Json | null
          updated_at?: string
          weather_override_json?: Json | null
          zone_type?: Database["public"]["Enums"]["zone_type"]
        }
        Relationships: [
          {
            foreignKeyName: "zones_complex_id_fkey"
            columns: ["complex_id"]
            isOneToOne: false
            referencedRelation: "complexes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      gettransactionid: { Args: never; Returns: unknown }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      complex_grade: "ULTRA_PREMIUM" | "PREMIUM" | "HIGH_END" | "STANDARD"
      floor_material:
        | "MARBLE"
        | "GRANITE"
        | "POLISHED_CONCRETE"
        | "EPOXY"
        | "PORCELAIN_TILE"
        | "CERAMIC_TILE"
        | "VINYL"
        | "CARPET"
        | "WOOD"
        | "RUBBER"
        | "OTHER"
      incident_severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      incident_status: "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED"
      interaction_type:
        | "RESIDENT_ENCOUNTER"
        | "PET_ENCOUNTER"
        | "CHILD_ENCOUNTER"
        | "VITAL_SIGN_REQUEST"
        | "CONVERSATION_ATTEMPT"
        | "EMERGENCY_CALL"
      mission_status:
        | "SCHEDULED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "FAILED"
        | "CANCELLED"
        | "PAUSED"
        | "MANUAL_OVERRIDE"
      robot_category: "CLEANING" | "AIR_PURIFIER" | "SECURITY"
      robot_status:
        | "ONLINE"
        | "OFFLINE"
        | "CHARGING"
        | "WORKING"
        | "ERROR"
        | "MANUAL"
        | "RETURNING"
        | "IDLE"
        | "MAINTENANCE"
      robot_subtype: "WET_SCRUB" | "DRY_VACUUM" | "NAMUX" | "LYNX_M20"
      user_role: "ADMIN" | "MANAGER" | "OPERATOR" | "VIEWER"
      zone_type:
        | "LOBBY"
        | "CORRIDOR"
        | "PARKING_B1"
        | "PARKING_B2"
        | "PARKING_B3"
        | "ELEVATOR_HALL"
        | "COMMUNITY_CENTER"
        | "FITNESS"
        | "SWIMMING_POOL"
        | "KIDS_ROOM"
        | "LIBRARY"
        | "OUTDOOR_DECK"
        | "ROOFTOP"
        | "MANAGEMENT_OFFICE"
        | "GARBAGE_ROOM"
        | "MECHANICAL_ROOM"
        | "OTHER"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
      complex_grade: ["ULTRA_PREMIUM", "PREMIUM", "HIGH_END", "STANDARD"],
      floor_material: [
        "MARBLE",
        "GRANITE",
        "POLISHED_CONCRETE",
        "EPOXY",
        "PORCELAIN_TILE",
        "CERAMIC_TILE",
        "VINYL",
        "CARPET",
        "WOOD",
        "RUBBER",
        "OTHER",
      ],
      incident_severity: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      incident_status: ["OPEN", "INVESTIGATING", "RESOLVED", "CLOSED"],
      interaction_type: [
        "RESIDENT_ENCOUNTER",
        "PET_ENCOUNTER",
        "CHILD_ENCOUNTER",
        "VITAL_SIGN_REQUEST",
        "CONVERSATION_ATTEMPT",
        "EMERGENCY_CALL",
      ],
      mission_status: [
        "SCHEDULED",
        "IN_PROGRESS",
        "COMPLETED",
        "FAILED",
        "CANCELLED",
        "PAUSED",
        "MANUAL_OVERRIDE",
      ],
      robot_category: ["CLEANING", "AIR_PURIFIER", "SECURITY"],
      robot_status: [
        "ONLINE",
        "OFFLINE",
        "CHARGING",
        "WORKING",
        "ERROR",
        "MANUAL",
        "RETURNING",
        "IDLE",
        "MAINTENANCE",
      ],
      robot_subtype: ["WET_SCRUB", "DRY_VACUUM", "NAMUX", "LYNX_M20"],
      user_role: ["ADMIN", "MANAGER", "OPERATOR", "VIEWER"],
      zone_type: [
        "LOBBY",
        "CORRIDOR",
        "PARKING_B1",
        "PARKING_B2",
        "PARKING_B3",
        "ELEVATOR_HALL",
        "COMMUNITY_CENTER",
        "FITNESS",
        "SWIMMING_POOL",
        "KIDS_ROOM",
        "LIBRARY",
        "OUTDOOR_DECK",
        "ROOFTOP",
        "MANAGEMENT_OFFICE",
        "GARBAGE_ROOM",
        "MECHANICAL_ROOM",
        "OTHER",
      ],
    },
  },
} as const
