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
  const { data: upgrades, isLoading } = useQuery({ queryKey: ['cards', 'ready-for-upgrade'], queryFn: cardsApi.getReadyForUpgrade })
  const upgradeMutation = useMutation({
    mutationFn: cardsApi.upgrade,
    onSuccess: (d) => { toast.success(`Upgraded to ${getTierName(d.tier)}! New: ${d.card_id}`); queryClient.invalidateQueries({ queryKey: ['cards'] }); queryClient.invalidateQueries({ queryKey: ['dashboard'] }); setSelectedCard(null) },
    onError: (e: any) => toast.error(e.response?.data?.detail || 'Failed'),
  })

  return (
    <div className="space-y-5">
      <FadeUp><h1 className="text-xl font-bold gradient-text">Upgrade Queue</h1></FadeUp>
      <FadeUp delay={0.1}>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--neon3), var(--neon))' }}>
              <ArrowUpCircle className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Ready to Upgrade ({upgrades?.length || 0})</h3>
          </div>
          {isLoading ? <TableSkeleton rows={4} /> : !upgrades?.length ? (
            <EmptyState title="No upgrades pending" description="All members at current tier" />
          ) : (
            <StaggerContainer className="space-y-2.5">
              {upgrades.map((u: any) => (
                <StaggerItem key={u.card_id}>
                  <motion.div whileHover={{ x: 3 }} className="flex items-center justify-between p-3.5 rounded-xl transition-colors"
                    style={{ background: 'var(--surface-hover)', border: '1px solid var(--surface-border)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>{u.member_name?.charAt(0)}</div>
                      <div><p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{u.member_name}</p>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{u.card_id}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right"><Badge variant="secondary">{getTierName(u.tier)}</Badge>
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{u.total_points} pts</p></div>
                      <Button size="sm" onClick={() => setSelectedCard(u.card_id)}
                        className="text-white border-0" style={{ background: 'linear-gradient(135deg, var(--neon3), var(--neon))' }}>
                        <Zap className="h-3.5 w-3.5 mr-1" /> Upgrade
                      </Button>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </FadeUp>
      <ConfirmDialog open={!!selectedCard} title="Confirm Upgrade" message={`Upgrade card ${selectedCard}? Points carried forward to new card.`}
        confirmLabel="Upgrade" onConfirm={() => selectedCard && upgradeMutation.mutate(selectedCard)} onCancel={() => setSelectedCard(null)} />
    </div>
  )
}
