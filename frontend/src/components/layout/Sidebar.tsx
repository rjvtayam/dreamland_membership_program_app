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
    <motion.aside
      animate={{ width: sidebarOpen ? 240 : 72 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "fixed left-3 top-3 bottom-3 z-40 island-sidebar",
        "rounded-2xl flex flex-col",
        "border"
      )}
      style={{
        background: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Glow edge */}
      <div className="absolute right-0 top-4 bottom-4 w-px opacity-40"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--neon), transparent)' }} />

      {/* Logo */}
      <div className="flex items-center gap-3 px-3 h-14 flex-shrink-0">
        <motion.div
          whileHover={{ rotate: 12, scale: 1.1 }}
          className="relative flex-shrink-0"
        >
          <div className="absolute inset-0 rounded-xl blur-lg opacity-30"
            style={{ background: 'var(--neon)' }} />
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
            <Gamepad2 className="h-4.5 w-4.5 text-white" />
          </div>
        </motion.div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="gradient-text text-base font-bold whitespace-nowrap overflow-hidden"
            >
              Dreamland
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px" style={{ background: 'var(--surface-border)' }} />

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <div key={item.to} className="nav-item-wrapper">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-3 rounded-xl transition-all duration-200",
                  sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
                  isActive
                    ? "text-[var(--neon)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'var(--surface-hover)',
                        border: '1px solid var(--surface-border)',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn(
                    "relative z-10 h-[18px] w-[18px] flex-shrink-0 transition-colors",
                    isActive && "drop-shadow-[0_0_6px_rgba(var(--neon-rgb),0.5)]"
                  )} />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 text-[13px] font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
            {/* Tooltip when collapsed */}
            {!sidebarOpen && (
              <div className="sidebar-tooltip">{item.label}</div>
            )}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-3">
        <button
          onClick={toggleSidebar}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all duration-200",
            "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          )}
          style={{ background: 'var(--surface-hover)' }}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              !sidebarOpen && "rotate-180"
            )}
          />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xs font-medium whitespace-nowrap overflow-hidden"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
