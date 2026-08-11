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
    qualifier: 'bg-gray-400/15 text-gray-500 dark:text-gray-400 border border-gray-400/20',
    silver: 'bg-slate-400/15 text-slate-600 dark:text-slate-300 border border-slate-400/20',
    gold: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    black: 'bg-gray-800/15 text-gray-800 dark:text-gray-200 border border-gray-800/20',
  }
  return colors[tier] || 'bg-gray-400/15 text-gray-500 border border-gray-400/20'
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
