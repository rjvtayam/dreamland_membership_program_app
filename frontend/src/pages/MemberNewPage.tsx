import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { membersApi } from '@/api/members'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { FadeUp } from '@/components/shared/Motion'
import { motion } from 'framer-motion'

interface MemberForm { name: string; contact_number: string; email?: string }

export default function MemberNewPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm<MemberForm>()
  const createMutation = useMutation({
    mutationFn: membersApi.create,
    onSuccess: (data) => { queryClient.invalidateQueries({ queryKey: ['members'] }); toast.success('Member registered!'); navigate(`/members/${data.id}`) },
    onError: (error: any) => toast.error(error.response?.data?.detail || 'Failed'),
  })

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <FadeUp>
        <div className="flex items-center gap-4">
          <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)} className="p-2 rounded-xl glass-card">
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold gradient-text">Register New Member</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>A Qualifier card will be issued automatically</p>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Member Information</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Enter the new member's details</p>
            </div>
          </div>
          <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
              <Input placeholder="Enter full name" {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Contact Number *</label>
              <Input placeholder="e.g., 0917-123-4567" {...register('contact_number', { required: 'Contact number is required' })} />
              {errors.contact_number && <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{errors.contact_number.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Email (Optional)</label>
              <Input type="email" placeholder="Enter email address" {...register('email')} />
            </div>
            <div className="flex gap-3 pt-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}
                className="text-white border-0" style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
                {createMutation.isPending ? 'Registering...' : 'Register Member'}
              </Button>
            </div>
          </form>
        </div>
      </FadeUp>
    </div>
  )
}
