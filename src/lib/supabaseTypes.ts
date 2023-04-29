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
          file: string
          id: number
          name: string
          tags: string[]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string
          file: string
          id?: number
          name: string
          tags?: string[]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          file?: string
          id?: number
          name?: string
          tags?: string[]
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
