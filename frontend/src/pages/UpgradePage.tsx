import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cardsApi } from '@/api/cards'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowUpCircle, Zap } from 'lucide-react'
import { getTierName } from '@/utils/formatters'
import { TableSkeleton } from '@/components/shared/Skeleton'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/Motion'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function UpgradePage() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { data: upgrades, isLoading } = useQuery({
    queryKey: ['cards', 'ready-for-upgrade'],
    queryFn: cardsApi.getReadyForUpgrade,
  })

  const upgradeMutation = useMutation({
    mutationFn: cardsApi.upgrade,
    onSuccess: (data) => {
      toast.success(`Card upgraded to ${getTierName(data.tier)}! New card: ${data.card_id}`)
      queryClient.invalidateQueries({ queryKey: ['cards'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setSelectedCard(null)
    },
    onError: (error: any) => toast.error(error.response?.data?.detail || 'Upgrade failed'),
  })

  const handleUpgrade = () => { if (selectedCard) upgradeMutation.mutate(selectedCard) }

  return (
    <div className="space-y-6">
      <FadeUp>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          Upgrade Queue
        </h1>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-gold to-neon-pink flex items-center justify-center">
              <ArrowUpCircle className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-white">Ready to Upgrade ({upgrades?.length || 0})</h3>
          </div>
          {isLoading ? (
            <TableSkeleton rows={4} />
          ) : !upgrades?.length ? (
            <EmptyState title="No upgrades pending" description="All members are at their current tier" />
          ) : (
            <StaggerContainer className="space-y-3">
              {upgrades.map((upgrade: any) => (
                <StaggerItem key={upgrade.card_id}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-neon-gold/5 border border-neon-gold/10 hover:border-neon-gold/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-white">{upgrade.member_name}</p>
                      <p className="text-sm text-gray-500 font-mono">{upgrade.card_id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className="bg-white/10 text-gray-300 border border-white/10">
                          {getTierName(upgrade.tier)}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">{upgrade.total_points} pts</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setSelectedCard(upgrade.card_id)}
                        className="bg-gradient-to-r from-neon-gold to-neon-pink hover:from-neon-gold/80 hover:to-neon-pink/80 text-white border-0"
                      >
                        <Zap className="h-4 w-4 mr-1" /> Upgrade
                      </Button>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </FadeUp>

      <ConfirmDialog
        open={!!selectedCard}
        title="Confirm Card Upgrade"
        message={`Are you sure you want to upgrade card ${selectedCard}? This will create a new card with points carried forward.`}
        confirmLabel="Upgrade Card"
        onConfirm={handleUpgrade}
        onCancel={() => setSelectedCard(null)}
      />
    </div>
  )
}
