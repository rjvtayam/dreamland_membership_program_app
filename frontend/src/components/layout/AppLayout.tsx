import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { useUIStore } from '@/stores/uiStore'

export default function AppLayout() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-page)' }}>
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] animate-float"
          style={{ background: 'rgba(var(--neon-rgb), 0.04)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] animate-float"
          style={{ background: 'rgba(var(--neon2-rgb), 0.04)', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[80px] animate-float"
          style={{ background: 'rgba(var(--neon3-rgb), 0.03)', animationDelay: '2s' }} />
        <div className="dark:block hidden absolute inset-0 cyber-grid opacity-30" />
        <div className="dark:block hidden absolute inset-0 scanline-overlay opacity-20" />
      </div>

      <Sidebar />

      <motion.div
        animate={{ marginLeft: sidebarOpen ? 256 : 88 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 flex flex-col min-h-screen pt-3 pr-3 pb-3"
      >
        <div className="flex flex-col flex-1 rounded-2xl overflow-hidden" style={{
          background: 'var(--surface)',
          border: '1px solid var(--surface-border)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}>
          <TopBar />
          <main className="flex-1 p-5 overflow-auto">
            <Outlet />
          </main>
        </div>
      </motion.div>
    </div>
  )
}
