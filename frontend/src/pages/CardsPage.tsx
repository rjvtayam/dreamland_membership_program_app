import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cardsApi } from '@/api/cards'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowUpCircle, CreditCard } from 'lucide-react'
import { formatDate, getTierName } from '@/utils/formatters'
import { TableSkeleton } from '@/components/shared/Skeleton'
import { FadeUp } from '@/components/shared/Motion'
import { TIER_ORDER } from '@/utils/constants'
import { motion } from 'framer-motion'

export default function CardsPage() {
  const [selectedTier, setSelectedTier] = useState('qualifier')
  const { data: cards, isLoading } = useQuery({ queryKey: ['cards', selectedTier], queryFn: () => cardsApi.getByTier(selectedTier) })

  return (
    <div className="space-y-5">
      <FadeUp>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-text">Card Management</h1>
          <Link to="/cards/upgrade"><Button variant="outline"><ArrowUpCircle className="h-4 w-4 mr-2" /> Upgrade Queue</Button></Link>
        </div>
      </FadeUp>
      <FadeUp delay={0.1}>
        <div className="flex gap-2">
          {TIER_ORDER.map((tier) => (
            <motion.button key={tier} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedTier(tier)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: selectedTier === tier ? 'linear-gradient(135deg, var(--neon), var(--neon2))' : 'var(--surface-hover)',
                color: selectedTier === tier ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${selectedTier === tier ? 'transparent' : 'var(--surface-border)'}`,
              }}>
              {getTierName(tier)}
            </motion.button>
          ))}
        </div>
      </FadeUp>
      <FadeUp delay={0.2}>
        <div className="glass-card overflow-hidden">
          <div className="p-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--surface-border)' }}>
            <CreditCard className="h-4 w-4" style={{ color: 'var(--neon)' }} />
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{getTierName(selectedTier)} Cards</h3>
          </div>
          {isLoading ? <div className="p-5"><TableSkeleton rows={6} /></div> : !cards?.length ? (
            <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>No cards in this tier</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  {['Card ID', 'Points', 'Status', 'Welcome Bonus', 'Registered'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {cards.map((card, i) => (
                    <motion.tr key={card.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      style={{ borderBottom: '1px solid var(--surface-border)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{card.card_id}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>{card.total_points}</td>
                      <td className="px-4 py-3"><Badge variant={card.status === 'active' ? 'success' : 'secondary'}>{card.status}</Badge></td>
                      <td className="px-4 py-3">{card.welcome_bonus_issued ? <Badge variant="success">Issued</Badge> : <Badge variant="warning">Pending</Badge>}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{formatDate(card.date_registered)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </FadeUp>
    </div>
  )
}
