import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { LogOut, User, Sun, Moon, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TopBar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header
      className="h-14 flex items-center justify-between px-5 relative"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--surface-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(var(--neon-rgb), 0.15), transparent)' }} />

      <div className="flex items-center gap-3">
        <Zap className="h-3.5 w-3.5 animate-pulse-neon" style={{ color: 'var(--neon2)' }} />
        <h1 className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'var(--text-muted)' }}>
          Dreamland Arcade
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{
            background: 'var(--surface-hover)',
            border: '1px solid var(--surface-border)',
          }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" style={{ color: 'var(--neon2)' }} />
          ) : (
            <Moon className="h-4 w-4" style={{ color: 'var(--neon)' }} />
          )}
        </motion.button>

        {/* User Info */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{
            background: 'var(--surface-hover)',
            border: '1px solid var(--surface-border)',
          }}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
            <User className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {user?.name}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(var(--neon-rgb), 0.12)',
              color: 'var(--neon)',
              border: '1px solid rgba(var(--neon-rgb), 0.15)',
            }}>
            {user?.role}
          </span>
        </motion.div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm p-2 rounded-xl transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
        >
          <LogOut className="h-4 w-4" />
        </motion.button>
      </div>
    </header>
  )
}
