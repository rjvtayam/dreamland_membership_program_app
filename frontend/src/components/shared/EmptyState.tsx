import { Inbox } from 'lucide-react'
import { motion } from 'framer-motion'

interface EmptyStateProps { title: string; description?: string; icon?: React.ReactNode }

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-2xl p-4 mb-4" style={{ background: 'var(--surface-hover)', border: '1px solid var(--surface-border)' }}>
        {icon || <Inbox className="h-7 w-7" style={{ color: 'var(--text-muted)' }} />}
      </div>
      <h3 className="text-base font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{title}</h3>
      {description && <p className="text-sm max-w-sm" style={{ color: 'var(--text-muted)' }}>{description}</p>}
    </motion.div>
  )
}
