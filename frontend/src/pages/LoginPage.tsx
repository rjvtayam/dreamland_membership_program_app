import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Gamepad2, Mail, Lock, ArrowRight, X, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

interface LoginForm { email: string; password: string }

function ForgotPasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { toast.success('Reset link sent!'); onClose(); setSent(false); setEmail('') }, 1500)
  }

  if (!open) return null
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl p-6 z-10">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4 text-gray-400" />
          </button>
          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Forgot Password?
            </h3>
            <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Enter your email and we'll send you a reset link
            </p>
          </div>
          <form onSubmit={handleReset} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="email" placeholder="Enter your email" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                style={{ fontFamily: "'Rajdhani', sans-serif" }} />
            </div>
            <Button type="submit" className="w-full h-11 text-white border-0 font-semibold rounded-xl"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', fontFamily: "'Rajdhani', sans-serif" }}
              disabled={sent}>
              {sent ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </div>
              ) : 'Send Reset Link'}
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    if (!agreed) { toast.error('Please agree to the Terms and Conditions'); return }
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Sparkles / particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: ['#a855f7', '#6366f1', '#22d3ee', '#ec4899', '#f59e0b'][i % 5],
          }}
          animate={{ y: [0, -30, 0], opacity: [0.15, 0.6, 0.15], scale: [1, 1.3, 1] }}
          transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}

      {/* Glow orbs */}
      <div className="absolute top-20 left-[15%] w-72 h-72 rounded-full blur-[100px] opacity-30"
        style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
      <div className="absolute bottom-20 right-[15%] w-64 h-64 rounded-full blur-[80px] opacity-20"
        style={{ background: 'radial-gradient(circle, #22d3ee, transparent)' }} />
      <div className="absolute top-[60%] left-[50%] w-48 h-48 rounded-full blur-[60px] opacity-15"
        style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-[400px] mx-4"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/60 p-8 relative overflow-hidden">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(to right, #a855f7, #6366f1, #22d3ee)' }} />

          {/* Logo */}
          <div className="flex justify-center mb-5">
            <motion.div whileHover={{ rotate: 8, scale: 1.06 }} className="relative">
              <div className="absolute inset-0 rounded-2xl blur-xl opacity-40"
                style={{ background: 'linear-gradient(135deg, #a855f7, #22d3ee)' }} />
              <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #a855f7, #22d3ee)' }}>
                <Gamepad2 className="h-8 w-8 text-white" strokeWidth={1.8} />
              </div>
            </motion.div>
          </div>

          {/* Title - ALL CAPS with Orbitron */}
          <div className="text-center mb-7">
            <h1 className="text-[22px] font-bold uppercase tracking-[0.06em] whitespace-nowrap"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                background: 'linear-gradient(135deg, #6366f1, #a855f7, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
              Dreamland Arcade
            </h1>
            <p className="text-[11px] text-gray-400 mt-1.5 uppercase tracking-[0.25em] font-medium"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Membership Management System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="email" placeholder="admin@dreamland.com"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50/80 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-gray-50/80 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              {/* Forgot Password - below input, right side */}
              <div className="flex justify-end mt-1.5">
                <button type="button" onClick={() => setForgotOpen(true)}
                  className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Forgot Password?
                </button>
              </div>
            </motion.div>

            {/* Terms and Conditions checkbox */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex items-start gap-2.5">
              <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500/30 cursor-pointer accent-[#6366f1]" />
              <label htmlFor="terms" className="text-[12px] text-gray-500 leading-snug cursor-pointer"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                I agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer"
                  className="font-semibold text-indigo-500 hover:text-indigo-600 underline underline-offset-2 transition-colors">
                  Terms and Conditions
                </a>
              </label>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Button type="submit"
                className="w-full h-11 text-white border-0 font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
                style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1, #22d3ee)', fontFamily: "'Rajdhani', sans-serif", fontSize: '15px' }}
                disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] text-gray-400 font-medium" style={{ fontFamily: "'Rajdhani', sans-serif" }}>or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 h-11 flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 h-11 flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </motion.button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Powered by Dreamland Technology
            </p>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  )
}
