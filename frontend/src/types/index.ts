// Auth types
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'cashier'
  is_active: boolean
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

// Member types
export interface Member {
  id: number
  name: string
  contact_number: string
  email: string | null
  created_at: string
  updated_at: string
  current_tier?: string | null
  active_card_id?: string | null
}

export interface MemberWithCards extends Member {
  cards: Card[]
}

// Card types
export interface Card {
  id: number
  member_id: number
  card_id: string
  tier: 'qualifier' | 'silver' | 'gold' | 'black'
  previous_card_id: string | null
  status: 'active' | 'upgraded' | 'retired'
  points_carried_over: number
  points_earned: number
  total_points: number
  welcome_bonus_issued: boolean
  date_registered: string
  created_at: string
  updated_at: string
}

export interface CardLookup {
  card_id: string
  member_name: string
  tier: string
  total_points: number
  status: string
  discount_percent: number
  welcome_bonus_issued: boolean
  ready_to_upgrade: boolean
}

// Transaction types
export interface Transaction {
  id: number
  card_id: string
  member_id: number
  token_package_id: number
  cash_value: number
  points_earned: number
  discount_eligible: boolean
  discount_percent: number
  discount_amount: number
  amount_to_collect: number
  staff_user_id: number | null
  notes: string | null
  transaction_date: string
  created_at: string
  member_name?: string
  package_name?: string
  staff_name?: string
}

// Token package types
export interface TokenPackage {
  id: number
  name: string
  cash_value: number
  points_earned: number
  is_active: boolean
}

// Tier types
export interface TierDefinition {
  id: number
  tier_name: string
  points_required: number
  discount_percent: number
  welcome_bonus_tokens: number
  sort_order: number
}

// Dashboard types
export interface DashboardStats {
  total_members: number
  active_cards: number
  total_revenue_today: number
  pending_upgrades: number
  total_transactions_today: number
}

export interface TierDistribution {
  tier: string
  count: number
}

export interface RevenueData {
  date: string
  revenue: number
  transactions: number
}

export interface UpgradeAlert {
  card_id: string
  member_name: string
  tier: string
  total_points: number
  points_needed: number
}

// Common types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
}
