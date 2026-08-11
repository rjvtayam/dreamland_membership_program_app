import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShoppingCart,
  ArrowUpCircle,
  BarChart3,
  Settings,
  History,
  ChevronLeft,
  Gamepad2,
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/utils/formatters'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/pos', icon: ShoppingCart, label: 'Point of Sale' },
  { to: '/cards', icon: CreditCard, label: 'Cards' },
  { to: '/cards/upgrade', icon: ArrowUpCircle, label: 'Upgrades' },
  { to: '/transactions', icon: History, label: 'Transactions' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "bg-[#0a0e1a]/90 backdrop-blur-xl border-r border-neon-purple/10",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Glow line on right edge */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple/40 via-neon-cyan/20 to-neon-purple/40" />

      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-hidden">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="flex-shrink-0 relative"
          >
            <div className="absolute inset-0 bg-neon-purple/20 rounded-xl blur-lg" />
            <div className="relative bg-gradient-to-br from-neon-purple to-neon-cyan p-2 rounded-xl">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
          </motion.div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-lg font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent whitespace-nowrap"
              >
                Dreamland
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-300",
              !sidebarOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-neon-purple/15 text-neon-purple"
                  : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-neon-purple to-neon-cyan rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors",
                  isActive && "drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                )} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom decoration */}
      {sidebarOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="glass-card p-3 text-center">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Membership System</p>
            <p className="text-[10px] text-neon-purple/50 mt-0.5">v1.0</p>
          </div>
        </div>
      )}
    </aside>
  )
}
