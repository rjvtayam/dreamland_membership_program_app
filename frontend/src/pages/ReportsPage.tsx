import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/utils/formatters'
import { ChartSkeleton } from '@/components/shared/Skeleton'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/Motion'
import { BarChart3, Trophy, Package } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-neon-purple/20">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-bold text-neon-cyan">{typeof payload[0].value === 'number' && payload[0].value > 100 ? formatCurrency(payload[0].value) : payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function ReportsPage() {
  const { data: revenueByTier, isLoading: tierLoading } = useQuery({
    queryKey: ['reports', 'revenue-by-tier'],
    queryFn: async () => { const { data } = await apiClient.get('/reports/revenue-by-tier'); return data },
  })
  const { data: topMembers, isLoading: membersLoading } = useQuery({
    queryKey: ['reports', 'top-members'],
    queryFn: async () => { const { data } = await apiClient.get('/reports/top-members'); return data },
  })
  const { data: packagePopularity, isLoading: packagesLoading } = useQuery({
    queryKey: ['reports', 'package-popularity'],
    queryFn: async () => { const { data } = await apiClient.get('/reports/package-popularity'); return data },
  })

  if (tierLoading || membersLoading || packagesLoading) {
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><ChartSkeleton /><ChartSkeleton /><ChartSkeleton /></div>
  }

  return (
    <div className="space-y-6">
      <FadeUp>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          Reports
        </h1>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeUp delay={0.1}>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Revenue by Tier</h3>
            </div>
            {revenueByTier && revenueByTier.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByTier}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,247,0.08)" />
                  <XAxis dataKey="tier" stroke="#4b5563" fontSize={12} />
                  <YAxis stroke="#4b5563" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#a855f7" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center py-12 text-gray-600 text-sm">No data yet</p>}
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-gold to-neon-pink flex items-center justify-center">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Top Members by Spending</h3>
            </div>
            {topMembers && topMembers.length > 0 ? (
              <StaggerContainer className="space-y-3">
                {topMembers.map((member: any, index: number) => (
                  <StaggerItem key={member.member_id}>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${index === 0 ? 'text-neon-gold' : index === 1 ? 'text-gray-400' : 'text-amber-700'}`}>
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-white">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.total_transactions} transactions</p>
                        </div>
                      </div>
                      <p className="font-bold text-neon-cyan">{formatCurrency(member.total_spent)}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : <p className="text-center py-12 text-gray-600 text-sm">No data yet</p>}
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center">
                <Package className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Package Popularity</h3>
            </div>
            {packagePopularity && packagePopularity.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={packagePopularity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,247,0.08)" />
                  <XAxis dataKey="package_name" stroke="#4b5563" fontSize={12} />
                  <YAxis stroke="#4b5563" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total_value" fill="#10b981" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center py-12 text-gray-600 text-sm">No data yet</p>}
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
