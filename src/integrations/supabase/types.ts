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
      bets: {
        Row: {
          amount: number
          created_at: string
          game_id: string | null
          id: string
          multiplier: number | null
          potential_win: number | null
          resolved_at: string | null
          result: Json | null
          session_id: string | null
          status: Database["public"]["Enums"]["bet_status"] | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          game_id?: string | null
          id?: string
          multiplier?: number | null
          potential_win?: number | null
          resolved_at?: string | null
          result?: Json | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["bet_status"] | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          game_id?: string | null
          id?: string
          multiplier?: number | null
          potential_win?: number | null
          resolved_at?: string | null
          result?: Json | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["bet_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bets_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bets_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bonuses: {
        Row: {
          amount: number
          claimed_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          type: string
          user_id: string | null
          wagered_amount: number | null
          wagering_requirement: number | null
        }
        Insert: {
          amount: number
          claimed_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          type: string
          user_id?: string | null
          wagered_amount?: number | null
          wagering_requirement?: number | null
        }
        Update: {
          amount?: number
          claimed_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          type?: string
          user_id?: string | null
          wagered_amount?: number | null
          wagering_requirement?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bonuses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_packages: {
        Row: {
          coins: number
          created_at: string
          currency: string
          free_sc: number
          id: number
          is_active: boolean
          price: number
          tag: string | null
          updated_at: string
        }
        Insert: {
          coins: number
          created_at?: string
          currency?: string
          free_sc?: number
          id?: number
          is_active?: boolean
          price: number
          tag?: string | null
          updated_at?: string
        }
        Update: {
          coins?: number
          created_at?: string
          currency?: string
          free_sc?: number
          id?: number
          is_active?: boolean
          price?: number
          tag?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      crypto_transactions: {
        Row: {
          amount_crypto: number
          amount_usd: number
          created_at: string
          id: string
          network: string
          status: Database["public"]["Enums"]["withdrawal_status"] | null
          transaction_id: string | null
          tx_hash: string | null
          updated_at: string
          user_id: string | null
          wallet_address: string
        }
        Insert: {
          amount_crypto: number
          amount_usd: number
          created_at?: string
          id?: string
          network: string
          status?: Database["public"]["Enums"]["withdrawal_status"] | null
          transaction_id?: string | null
          tx_hash?: string | null
          updated_at?: string
          user_id?: string | null
          wallet_address: string
        }
        Update: {
          amount_crypto?: number
          amount_usd?: number
          created_at?: string
          id?: string
          network?: string
          status?: Database["public"]["Enums"]["withdrawal_status"] | null
          transaction_id?: string | null
          tx_hash?: string | null
          updated_at?: string
          user_id?: string | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "crypto_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crypto_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          created_at: string
          end_time: string | null
          game_id: string | null
          id: string
          start_time: string
          total_bets: number | null
          total_wins: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          game_id?: string | null
          id?: string
          start_time?: string
          total_bets?: number | null
          total_wins?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          end_time?: string | null
          game_id?: string | null
          id?: string
          start_time?: string
          total_bets?: number | null
          total_wins?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          max_bet: number
          min_bet: number
          name: string
          popularity_score: number | null
          provider: string
          rtp: number
          status: Database["public"]["Enums"]["game_status"] | null
          type: Database["public"]["Enums"]["game_type"]
          updated_at: string
          volatility: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          max_bet: number
          min_bet: number
          name: string
          popularity_score?: number | null
          provider: string
          rtp: number
          status?: Database["public"]["Enums"]["game_status"] | null
          type: Database["public"]["Enums"]["game_type"]
          updated_at?: string
          volatility?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          max_bet?: number
          min_bet?: number
          name?: string
          popularity_score?: number | null
          provider?: string
          rtp?: number
          status?: Database["public"]["Enums"]["game_status"] | null
          type?: Database["public"]["Enums"]["game_type"]
          updated_at?: string
          volatility?: string | null
        }
        Relationships: []
      }
      jackpots: {
        Row: {
          created_at: string
          current_amount: number
          id: string
          increment_rate: number
          last_won_at: string | null
          last_won_by: string | null
          name: string
          start_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          id?: string
          increment_rate: number
          last_won_at?: string | null
          last_won_by?: string | null
          name: string
          start_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          id?: string
          increment_rate?: number
          last_won_at?: string | null
          last_won_by?: string | null
          name?: string
          start_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jackpots_last_won_by_fkey"
            columns: ["last_won_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          coins_amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          payment_method: string
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          coins_amount: number
          created_at?: string
          currency: string
          id?: string
          metadata?: Json | null
          payment_method: string
          status: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          coins_amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          kyc_verified: boolean | null
          referral_code: string | null
          referred_by: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          sweepcoins: number | null
          total_wagered: number | null
          total_won: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          kyc_verified?: boolean | null
          referral_code?: string | null
          referred_by?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          sweepcoins?: number | null
          total_wagered?: number | null
          total_won?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          kyc_verified?: boolean | null
          referral_code?: string | null
          referred_by?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          sweepcoins?: number | null
          total_wagered?: number | null
          total_won?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          currency: string | null
          id: string
          metadata: Json | null
          status: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string | null
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_balances: {
        Row: {
          balance: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          game_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          game_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          game_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_vip_progress: {
        Row: {
          last_weekly_bonus: string | null
          points: number | null
          total_points: number | null
          updated_at: string
          user_id: string
          vip_level: number | null
        }
        Insert: {
          last_weekly_bonus?: string | null
          points?: number | null
          total_points?: number | null
          updated_at?: string
          user_id: string
          vip_level?: number | null
        }
        Update: {
          last_weekly_bonus?: string | null
          points?: number | null
          total_points?: number | null
          updated_at?: string
          user_id?: string
          vip_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_vip_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_vip_progress_vip_level_fkey"
            columns: ["vip_level"]
            isOneToOne: false
            referencedRelation: "vip_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      vip_levels: {
        Row: {
          cashback_rate: number
          created_at: string
          id: number
          name: string
          required_points: number
          weekly_bonus: number
        }
        Insert: {
          cashback_rate: number
          created_at?: string
          id?: number
          name: string
          required_points: number
          weekly_bonus: number
        }
        Update: {
          cashback_rate?: number
          created_at?: string
          id?: number
          name?: string
          required_points?: number
          weekly_bonus?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user: {
        Args: {
          admin_email: string
          admin_password: string
          admin_username: string
        }
        Returns: string
      }
      handle_transaction:
        | {
            Args: {
              p_user_id: string
              p_type: Database["public"]["Enums"]["transaction_type"]
              p_amount: number
              p_description?: string
            }
            Returns: string
          }
        | {
            Args: {
              p_user_id: string
              p_type: string
              p_amount: number
              p_description?: string
            }
            Returns: string
          }
    }
    Enums: {
      bet_status: "pending" | "completed" | "cancelled"
      game_status: "active" | "maintenance" | "deprecated"
      game_type: "slots" | "table" | "live" | "instant"
      transaction_type:
        | "deposit"
        | "withdrawal"
        | "bet"
        | "win"
        | "bonus"
        | "referral"
        | "crypto_deposit"
        | "crypto_withdrawal"
      user_role: "user" | "vip" | "admin"
      withdrawal_status: "pending" | "approved" | "rejected" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
