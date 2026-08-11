import { useQuery } from '@tanstack/react-query'
import { settingsApi } from '@/api/settings'
import { Badge } from '@/components/ui/badge'
import { CardSkeleton } from '@/components/shared/Skeleton'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/Motion'
import { Settings, Package } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const { data: tiers, isLoading: tiersLoading } = useQuery({
    queryKey: ['settings', 'tiers'],
    queryFn: settingsApi.getTiers,
  })
  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ['settings', 'packages'],
    queryFn: settingsApi.getPackages,
  })

  if (tiersLoading || packagesLoading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><CardSkeleton /><CardSkeleton /></div>

  return (
    <div className="space-y-6">
      <FadeUp>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          Settings
        </h1>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Settings */}
        <FadeUp delay={0.1}>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-white">Tier Definitions</h3>
            </div>
            <StaggerContainer className="space-y-3">
              {tiers?.map((tier) => (
                <StaggerItem key={tier.id}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-neon-purple/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white capitalize">{tier.tier_name}</h4>
                      <Badge className="bg-neon-purple/20 text-neon-purple border border-neon-purple/20">
                        {tier.discount_percent}% discount
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 text-xs uppercase tracking-wider">Points Required</p>
                        <p className="font-medium text-white">{tier.points_required.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs uppercase tracking-wider">Welcome Bonus</p>
                        <p className="font-medium text-white">{tier.welcome_bonus_tokens} tokens</p>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeUp>

        {/* Token Packages */}
        <FadeUp delay={0.2}>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-white">Token Packages</h3>
            </div>
            <StaggerContainer className="space-y-3">
              {packages?.map((pkg) => (
                <StaggerItem key={pkg.id}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-neon-green/20 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-white">{pkg.name}</p>
                      <p className="text-sm text-gray-500">
                        ₱{pkg.cash_value} = {pkg.points_earned} points
                      </p>
                    </div>
                    <Badge className={pkg.is_active ? 'bg-neon-green/20 text-neon-green border border-neon-green/20' : 'bg-white/5 text-gray-500 border border-white/10'}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </Badge>
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
