export const TIER_THRESHOLDS = {
  qualifier: 1000,
  silver: 3500,
  gold: 5500,
  black: null,
} as const

export const TIER_ORDER = ['qualifier', 'silver', 'gold', 'black'] as const

export const TOKEN_PACKAGES = [
  { id: 1, name: '1 Token', cash_value: 5, points_earned: 1 },
  { id: 2, name: '5 Tokens', cash_value: 25, points_earned: 1 },
  { id: 3, name: '10 Tokens', cash_value: 50, points_earned: 5 },
  { id: 4, name: '20 Tokens', cash_value: 100, points_earned: 10 },
  { id: 5, name: '30 Tokens', cash_value: 150, points_earned: 15 },
  { id: 6, name: '50 Tokens', cash_value: 250, points_earned: 20 },
] as const

export const DISCOUNT_THRESHOLD = 150
