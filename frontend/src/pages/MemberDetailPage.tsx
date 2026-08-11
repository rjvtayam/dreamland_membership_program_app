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
  const { data: member, isLoading } = useQuery({ queryKey: ['member', id], queryFn: () => membersApi.getById(Number(id)), enabled: !!id })

  if (isLoading) return <div className="grid grid-cols-1 lg:grid-cols-3 gap-5"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
  if (!member) return <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Member not found</div>

  return (
    <div className="space-y-5">
      <FadeUp>
        <div className="flex items-center gap-4">
          <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)} className="p-2 rounded-xl glass-card">
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold gradient-text">{member.name}</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{member.contact_number}</p>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <FadeUp delay={0.1}>
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
                <User className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Personal Information</h3>
            </div>
            <div className="space-y-2.5">
              {[{ l: 'Name', v: member.name }, { l: 'Contact', v: member.contact_number }, { l: 'Email', v: member.email || '-' }, { l: 'Member Since', v: formatDate(member.created_at) }].map((item) => (
                <div key={item.l} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{item.l}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="glass-card p-5 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--neon2), var(--neon3))' }}>
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Cards ({member.cards?.length || 0})</h3>
            </div>
            {member.cards && member.cards.length > 0 ? (
              <StaggerContainer className="space-y-2.5">
                {member.cards.map((card: any) => {
                  const threshold = TIER_THRESHOLDS[card.tier as keyof typeof TIER_THRESHOLDS]
                  const ready = threshold !== null && card.total_points >= threshold
                  const progress = threshold ? Math.min(100, (card.total_points / threshold) * 100) : 100
                  return (
                    <StaggerItem key={card.id}>
                      <motion.div whileHover={{ x: 3 }}
                        className="p-3.5 rounded-xl transition-all"
                        style={{
                          background: card.status === 'active' ? 'var(--surface-hover)' : 'transparent',
                          border: `1px solid ${card.status === 'active' ? 'var(--surface-border)' : 'transparent'}`,
                          opacity: card.status === 'active' ? 1 : 0.5,
                        }}>
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2.5">
                            <Badge className={getTierColor(card.tier)}>{getTierName(card.tier)}</Badge>
                            <div>
                              <p className="font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{card.card_id}</p>
                              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{card.total_points} points · {card.status}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {card.status === 'active' && ready && <Badge variant="warning">Ready to Upgrade</Badge>}
                            {card.previous_card_id && <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Prev: {card.previous_card_id}</p>}
                          </div>
                        </div>
                        {card.status === 'active' && threshold && (
                          <div>
                            <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>
                              <span>Progress to next tier</span><span>{card.total_points} / {threshold}</span>
                            </div>
                            <div className="w-full rounded-full h-1.5" style={{ background: 'var(--surface)' }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                                className="h-full rounded-full" style={{ background: 'linear-gradient(to right, var(--neon), var(--neon2))' }} />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </StaggerItem>
                  )
                })}
              </StaggerContainer>
            ) : <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>No cards found</p>}
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
