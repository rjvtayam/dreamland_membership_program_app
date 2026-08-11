import { NavLink, useNavigate } from 'react-router-dom'
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
  ChevronRight,
  Gamepad2,
  LogOut,
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
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
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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

      {/* Logo + Collapse */}
      <div className={cn(
        "flex-shrink-0 flex flex-col items-center pt-3",
        sidebarOpen ? "px-3" : "px-2"
      )}>
        {sidebarOpen ? (
          /* Expanded: logo + text in row, collapse on right */
          <div className="flex items-center gap-3 w-full">
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
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="gradient-text text-base font-bold whitespace-nowrap"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Dreamland
            </motion.span>
            <div className="flex-1" />
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'var(--surface-hover)' }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
          </div>
        ) : (
          /* Collapsed: collapse icon on top, logo below */
          <>
            <motion.button
              whileHover={{ scale: 1.15, backgroundColor: 'var(--surface-hover)' }}
              whileTap={{ scale: 0.85 }}
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-1"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-xl blur-lg opacity-30"
                style={{ background: 'var(--neon)' }} />
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
                <Gamepad2 className="h-4.5 w-4.5 text-white" />
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="mx-3 mt-3 h-px" style={{ background: 'var(--surface-border)' }} />

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <div key={item.to} className="nav-item-wrapper relative">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-3 rounded-xl transition-all duration-200 group",
                  sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
                  isActive
                    ? "text-[var(--neon)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active background */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: isActive ? 'var(--surface-hover)' : 'transparent',
                      border: isActive ? '1px solid var(--surface-border)' : '1px solid transparent',
                    }}
                  />
                  {/* Hover background */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl transition-opacity duration-200",
                    "opacity-0 group-hover:opacity-100",
                    isActive && "hidden"
                  )} style={{ background: 'var(--surface-hover)' }} />
                  <item.icon className={cn(
                    "relative z-10 h-[18px] w-[18px] flex-shrink-0 transition-all duration-200",
                    isActive && "drop-shadow-[0_0_6px_rgba(var(--neon-rgb),0.5)]",
                    !isActive && "group-hover:scale-110"
                  )} />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        className="relative z-10 text-[13px] font-medium whitespace-nowrap"
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

      {/* Divider */}
      <div className="mx-3 h-px" style={{ background: 'var(--surface-border)' }} />

      {/* Logout */}
      <div className="px-2 py-3 flex-shrink-0 nav-item-wrapper">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl transition-all duration-200 group",
            sidebarOpen ? "px-3 py-2.5 justify-start" : "px-0 py-2.5 justify-center",
            "text-[var(--text-muted)] hover:text-red-400"
          )}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0 group-hover:rotate-180 transition-transform duration-300" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="text-[13px] font-medium whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        {!sidebarOpen && (
          <div className="sidebar-tooltip">Logout</div>
        )}
      </div>
    </motion.aside>
  )
}
