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
  const { data: cards, isLoading } = useQuery({
    queryKey: ['cards', selectedTier],
    queryFn: () => cardsApi.getByTier(selectedTier),
  })

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Card Management
          </h1>
          <Link to="/cards/upgrade">
            <Button variant="outline" className="border-white/10 text-gray-400 hover:bg-white/5">
              <ArrowUpCircle className="h-4 w-4 mr-2" /> Upgrade Queue
            </Button>
          </Link>
        </div>
      </FadeUp>

      {/* Tier Tabs */}
      <FadeUp delay={0.1}>
        <div className="flex gap-2">
          {TIER_ORDER.map((tier) => (
            <motion.button
              key={tier}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedTier(tier)}
              className={`relative px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                selectedTier === tier
                  ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
              }`}
            >
              {getTierName(tier)}
            </motion.button>
          ))}
        </div>
      </FadeUp>

      {/* Cards List */}
      <FadeUp delay={0.2}>
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-neon-purple" />
              {getTierName(selectedTier)} Cards
            </h3>
          </div>
          {isLoading ? (
            <div className="p-6"><TableSkeleton rows={6} /></div>
          ) : !cards?.length ? (
            <p className="text-center py-12 text-gray-600 text-sm">No cards in this tier</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Card ID</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Welcome Bonus</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card, i) => (
                    <motion.tr
                      key={card.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-sm text-white">{card.card_id}</td>
                      <td className="px-4 py-3 text-white">{card.total_points}</td>
                      <td className="px-4 py-3">
                        <Badge className={card.status === 'active' ? 'bg-neon-green/20 text-neon-green border border-neon-green/20' : 'bg-white/5 text-gray-500 border border-white/10'}>
                          {card.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {card.welcome_bonus_issued ? (
                          <Badge className="bg-neon-green/20 text-neon-green border border-neon-green/20">Issued</Badge>
                        ) : (
                          <Badge className="bg-neon-gold/20 text-neon-gold border border-neon-gold/20">Pending</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{formatDate(card.date_registered)}</td>
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
