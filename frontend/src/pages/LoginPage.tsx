import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from '@/contexts/ThemeContext'
import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gamepad2, Mail, Lock, Zap, ArrowRight, Sun, Moon } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const { theme, toggleTheme } = useTheme()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      const response = await authApi.login(data.email, data.password)
      login(response.user, response.access_token)
      toast.success('Welcome back!')
      navigate('/')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--bg-page)' }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[150px]"
          style={{ background: 'rgba(var(--neon-rgb), 0.08)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[120px]"
          style={{ background: 'rgba(var(--neon2-rgb), 0.06)' }} />
        <div className="dark:block hidden absolute inset-0 cyber-grid opacity-30" />
        <div className="dark:block hidden absolute inset-0 scanline-overlay opacity-20" />
      </div>

      {/* Theme Toggle - top right */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={toggleTheme}
        className="absolute top-5 right-5 w-10 h-10 rounded-xl flex items-center justify-center z-20"
        style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)' }}
      >
        {theme === 'dark' ? <Sun className="h-4.5 w-4.5" style={{ color: 'var(--neon2)' }} />
          : <Moon className="h-4.5 w-4.5" style={{ color: 'var(--neon)' }} />}
      </motion.button>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ background: 'rgba(var(--neon-rgb), 0.3)' }}
          initial={{ x: Math.random() * 1200, y: Math.random() * 800 }}
          animate={{ y: [null, -100], opacity: [0, 1, 0] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, var(--neon), transparent)' }} />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to-r, var(--neon), transparent)' }} />
            <div className="absolute top-0 left-0 h-full w-px" style={{ background: 'linear-gradient(to-b, var(--neon), transparent)' }} />
          </div>
          <div className="absolute top-0 right-0 w-16 h-16">
            <div className="absolute top-0 right-0 w-full h-px" style={{ background: 'linear-gradient(to-l, var(--neon2), transparent)' }} />
            <div className="absolute top-0 right-0 h-full w-px" style={{ background: 'linear-gradient(to-b, var(--neon2), transparent)' }} />
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <motion.div whileHover={{ rotate: 10, scale: 1.05 }} className="relative">
              <div className="absolute inset-0 rounded-2xl blur-xl" style={{ background: 'rgba(var(--neon-rgb), 0.25)' }} />
              <div className="relative p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
                <Gamepad2 className="h-10 w-10 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-3xl font-bold gradient-text animate-gradient">
              Dreamland Arcade
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="mt-2 text-sm uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Membership Management System
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                <Input type="email" placeholder="admin@dreamland.com"
                  {...register('email', { required: 'Email is required' })}
                  className="pl-10" />
              </div>
              {errors.email && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.email.message}</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                <Input type="password" placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                  className="pl-10" />
              </div>
              {errors.password && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.password.message}</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Button type="submit" className="w-full relative group h-12 font-semibold text-white border-0"
                style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}
                disabled={loading}>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <><Zap className="h-4 w-4" /> Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </span>
              </Button>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
              Powered by Dreamland Technology
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
