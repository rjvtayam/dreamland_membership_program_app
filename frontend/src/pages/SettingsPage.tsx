import { useQuery } from '@tanstack/react-query'
import { settingsApi } from '@/api/settings'
import { Badge } from '@/components/ui/badge'
import { CardSkeleton } from '@/components/shared/Skeleton'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/Motion'
import { Settings, Package } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const { data: tiers, isLoading: tiersLoading } = useQuery({ queryKey: ['settings', 'tiers'], queryFn: settingsApi.getTiers })
  const { data: packages, isLoading: packagesLoading } = useQuery({ queryKey: ['settings', 'packages'], queryFn: settingsApi.getPackages })

  if (tiersLoading || packagesLoading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-5"><CardSkeleton /><CardSkeleton /></div>

  return (
    <div className="space-y-5">
      <FadeUp><h1 className="text-xl font-bold gradient-text">Settings</h1></FadeUp>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FadeUp delay={0.1}>
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
                <Settings className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Tier Definitions</h3>
            </div>
            <StaggerContainer className="space-y-2.5">
              {tiers?.map((tier) => (
                <StaggerItem key={tier.id}>
                  <motion.div whileHover={{ x: 3 }} className="p-3.5 rounded-xl" style={{ background: 'var(--surface-hover)', border: '1px solid var(--surface-border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm capitalize" style={{ color: 'var(--text-primary)' }}>{tier.tier_name}</h4>
                      <Badge>{tier.discount_percent}% off</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><p style={{ color: 'var(--text-muted)' }}>Points Required</p><p className="font-medium" style={{ color: 'var(--text-primary)' }}>{tier.points_required.toLocaleString()}</p></div>
                      <div><p style={{ color: 'var(--text-muted)' }}>Welcome Bonus</p><p className="font-medium" style={{ color: 'var(--text-primary)' }}>{tier.welcome_bonus_tokens} tokens</p></div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--neon2), var(--neon))' }}>
                <Package className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Token Packages</h3>
            </div>
            <StaggerContainer className="space-y-2.5">
              {packages?.map((pkg) => (
                <StaggerItem key={pkg.id}>
                  <motion.div whileHover={{ x: 3 }} className="flex items-center justify-between p-3.5 rounded-xl"
                    style={{ background: 'var(--surface-hover)', border: '1px solid var(--surface-border)' }}>
                    <div><p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{pkg.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>₱{pkg.cash_value} = {pkg.points_earned} pts</p></div>
                    <Badge variant={pkg.is_active ? 'success' : 'secondary'}>{pkg.is_active ? 'Active' : 'Inactive'}</Badge>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
