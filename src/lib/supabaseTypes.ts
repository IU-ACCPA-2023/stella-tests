export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tests: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          file_path: string
          id: number
          name: string
          tags: string[]
          well_typed: boolean
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string
          file_path: string
          id?: number
          name: string
          tags?: string[]
          well_typed: boolean
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          file_path?: string
          id?: number
          name?: string
          tags?: string[]
          well_typed?: boolean
        }
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
