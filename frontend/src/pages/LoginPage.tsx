import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gamepad2, Mail, Lock, Zap, ArrowRight } from 'lucide-react'
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080b16] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-cyan/8 rounded-full blur-[120px]" />
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="absolute inset-0 scanline-overlay opacity-20" />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-neon-purple/40 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card p-8 relative overflow-hidden">
          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent" />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-neon-purple/60 to-transparent" />
            <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-neon-purple/60 to-transparent" />
          </div>
          <div className="absolute top-0 right-0 w-16 h-16">
            <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-neon-cyan/60 to-transparent" />
            <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-neon-cyan/60 to-transparent" />
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-neon-purple/30 rounded-2xl blur-xl" />
              <div className="relative bg-gradient-to-br from-neon-purple via-neon-pink to-neon-cyan p-5 rounded-2xl">
                <Gamepad2 className="h-10 w-10 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple bg-clip-text text-transparent animate-gradient"
            >
              Dreamland Arcade
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 mt-2 text-sm uppercase tracking-widest"
            >
              Membership Management System
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                <Input
                  type="email"
                  placeholder="admin@dreamland.com"
                  {...register('email', { required: 'Email is required' })}
                  className="pl-10 bg-white/5 border-white/10 focus:border-neon-purple/50 focus:ring-neon-purple/20 text-white placeholder:text-gray-700"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                  className="pl-10 bg-white/5 border-white/10 focus:border-neon-purple/50 focus:ring-neon-purple/20 text-white placeholder:text-gray-700"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                className="w-full relative group bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-purple/80 hover:to-neon-cyan/80 text-white font-semibold py-3 h-12 border-0"
                disabled={loading}
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Sign In
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
          </form>

          {/* Footer accent */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-gray-700 uppercase tracking-[0.2em]">
              Powered by Dreamland Technology
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
