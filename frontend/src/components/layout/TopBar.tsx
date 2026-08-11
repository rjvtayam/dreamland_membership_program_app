import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TopBar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 relative">
      {/* Subtle glow line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent" />

      <div className="flex items-center gap-3">
        <Zap className="h-4 w-4 text-neon-cyan animate-pulse-neon" />
        <h1 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
          Dreamland Arcade
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 glass-card px-3 py-1.5"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm text-gray-300">{user?.name}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded-full border border-neon-purple/20">
            {user?.role}
          </span>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </motion.button>
      </div>
    </header>
  )
}
