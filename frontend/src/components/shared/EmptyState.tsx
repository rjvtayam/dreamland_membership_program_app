import { Inbox } from 'lucide-react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="rounded-2xl bg-white/5 border border-white/5 p-5 mb-4">
        {icon || <Inbox className="h-8 w-8 text-gray-600" />}
      </div>
      <h3 className="text-lg font-medium text-gray-400 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 max-w-sm">{description}</p>
      )}
    </motion.div>
  )
}
