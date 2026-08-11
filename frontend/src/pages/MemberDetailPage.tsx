import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { membersApi } from '@/api/members'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CreditCard, User } from 'lucide-react'
import { formatDate, getTierColor, getTierName } from '@/utils/formatters'
import { CardSkeleton } from '@/components/shared/Skeleton'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/Motion'
import { TIER_THRESHOLDS } from '@/utils/constants'
import { motion } from 'framer-motion'

export default function MemberDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: member, isLoading } = useQuery({
    queryKey: ['member', id],
    queryFn: () => membersApi.getById(Number(id)),
    enabled: !!id,
  })

  if (isLoading) return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
  if (!member) return <div className="text-center py-20 text-gray-500">Member not found</div>

  return (
    <div className="space-y-6">
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
              {member.name}
            </h1>
            <p className="text-gray-500">{member.contact_number}</p>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member Info */}
        <FadeUp delay={0.1}>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-white">Personal Information</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Name', value: member.name },
                { label: 'Contact', value: member.contact_number },
                { label: 'Email', value: member.email || '-' },
                { label: 'Member Since', value: formatDate(member.created_at) },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</span>
                  <span className="text-sm text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Cards */}
        <FadeUp delay={0.2}>
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-white">Cards ({member.cards?.length || 0})</h3>
            </div>
            {member.cards && member.cards.length > 0 ? (
              <StaggerContainer className="space-y-3">
                {member.cards.map((card: any) => {
                  const threshold = TIER_THRESHOLDS[card.tier as keyof typeof TIER_THRESHOLDS]
                  const readyToUpgrade = threshold !== null && card.total_points >= threshold
                  const progress = threshold ? Math.min(100, (card.total_points / threshold) * 100) : 100

                  return (
                    <StaggerItem key={card.id}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className={`p-4 rounded-xl border transition-all ${
                          card.status === 'active'
                            ? 'bg-white/[0.03] border-neon-purple/10 hover:border-neon-purple/30'
                            : 'bg-white/[0.01] border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={`${getTierColor(card.tier)} border-0`}>{getTierName(card.tier)}</Badge>
                            <div>
                              <p className="font-mono text-sm text-white">{card.card_id}</p>
                              <p className="text-xs text-gray-500">{card.total_points} points · {card.status}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {card.status === 'active' && readyToUpgrade && (
                              <Badge className="bg-neon-gold/20 text-neon-gold border border-neon-gold/20">Ready to Upgrade</Badge>
                            )}
                            {card.previous_card_id && (
                              <p className="text-[10px] text-gray-600 mt-1">Prev: {card.previous_card_id}</p>
                            )}
                          </div>
                        </div>
                        {card.status === 'active' && threshold && (
                          <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress to next tier</span>
                              <span>{card.total_points} / {threshold}</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full"
                              />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </StaggerItem>
                  )
                })}
              </StaggerContainer>
            ) : (
              <p className="text-gray-600 text-center py-8">No cards found</p>
            )}
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
