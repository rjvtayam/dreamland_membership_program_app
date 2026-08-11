import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    qualifier: 'bg-gray-100 text-gray-800',
    silver: 'bg-gray-200 text-gray-800',
    gold: 'bg-yellow-100 text-yellow-800',
    black: 'bg-gray-900 text-white',
  }
  return colors[tier] || 'bg-gray-100 text-gray-800'
}

export function getTierName(tier: string): string {
  const names: Record<string, string> = {
    qualifier: 'Qualifier',
    silver: 'Silver',
    gold: 'Gold',
    black: 'Black',
  }
  return names[tier] || tier
}
