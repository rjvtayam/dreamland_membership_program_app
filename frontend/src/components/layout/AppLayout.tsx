import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/utils/formatters'

export default function AppLayout() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)

  return (
    <div className="min-h-screen bg-[#080b16] relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-cyan/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-pink/3 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 cyber-grid opacity-40" />

        {/* Scanline effect */}
        <div className="absolute inset-0 scanline-overlay opacity-30" />
      </div>

      <Sidebar />

      <div
        className={cn(
          "relative z-10 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        <TopBar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
