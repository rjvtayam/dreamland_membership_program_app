import { cn } from '@/utils/formatters'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps { size?: 'sm' | 'md' | 'lg'; className?: string }

export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={cn("rounded-full border-2", sizes[size])}
        style={{ borderColor: 'rgba(var(--neon-rgb),0.15)', borderTopColor: 'var(--neon)' }} />
    </div>
  )
}
