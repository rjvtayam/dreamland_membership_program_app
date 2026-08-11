import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfirmDialogProps {
  open: boolean; title: string; message: string; confirmLabel?: string; cancelLabel?: string;
  variant?: 'default' | 'destructive'; onConfirm: () => void; onCancel: () => void
}

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'default', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onCancel} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative glass-card p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(var(--neon3-rgb),0.12)' }}>
                <AlertTriangle className="h-5 w-5" style={{ color: 'var(--neon3)' }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{message}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={onCancel}>{cancelLabel}</Button>
              <Button onClick={onConfirm} className={variant === 'destructive' ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-white border-0'}
                style={variant !== 'destructive' ? { background: 'linear-gradient(135deg, var(--neon), var(--neon2))' } : undefined}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
