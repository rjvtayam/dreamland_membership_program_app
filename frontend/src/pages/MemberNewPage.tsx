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

interface MemberForm {
  name: string
  contact_number: string
  email?: string
}

export default function MemberNewPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm<MemberForm>()

  const createMutation = useMutation({
    mutationFn: membersApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      toast.success('Member registered successfully!')
      navigate(`/members/${data.id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to register member')
    },
  })

  const onSubmit = (data: MemberForm) => createMutation.mutate(data)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <FadeUp>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl glass-card hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Register New Member
            </h1>
            <p className="text-gray-500 text-sm">A Qualifier card will be issued automatically</p>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Member Information</h2>
              <p className="text-xs text-gray-500">Enter the new member's details</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Full Name *</label>
              <Input
                placeholder="Enter full name"
                {...register('name', { required: 'Name is required' })}
                className="bg-white/5 border-white/10 focus:border-neon-purple/50 text-white placeholder:text-gray-700"
              />
              {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Contact Number *</label>
              <Input
                placeholder="e.g., 0917-123-4567"
                {...register('contact_number', { required: 'Contact number is required' })}
                className="bg-white/5 border-white/10 focus:border-neon-purple/50 text-white placeholder:text-gray-700"
              />
              {errors.contact_number && <p className="text-sm text-red-400 mt-1">{errors.contact_number.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Email (Optional)</label>
              <Input
                type="email"
                placeholder="Enter email address"
                {...register('email')}
                className="bg-white/5 border-white/10 focus:border-neon-purple/50 text-white placeholder:text-gray-700"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}
                className="border-white/10 text-gray-400 hover:bg-white/5">
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}
                className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-purple/80 hover:to-neon-cyan/80 text-white border-0">
                {createMutation.isPending ? 'Registering...' : 'Register Member'}
              </Button>
            </div>
          </form>
        </div>
      </FadeUp>
    </div>
  )
}
