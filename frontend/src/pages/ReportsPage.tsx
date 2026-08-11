import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/utils/formatters'
import { ChartSkeleton } from '@/components/shared/Skeleton'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/Motion'
import { BarChart3, Trophy, Package } from 'lucide-react'

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) return (
    <div className="glass-card p-3"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-sm font-bold gradient-text">{typeof payload[0].value === 'number' && payload[0].value > 100 ? formatCurrency(payload[0].value) : payload[0].value}</p></div>
  )
  return null
}

export default function ReportsPage() {
  const { data: revenueByTier, isLoading: tierLoading } = useQuery({ queryKey: ['reports', 'revenue-by-tier'], queryFn: async () => (await apiClient.get('/reports/revenue-by-tier')).data })
  const { data: topMembers, isLoading: membersLoading } = useQuery({ queryKey: ['reports', 'top-members'], queryFn: async () => (await apiClient.get('/reports/top-members')).data })
  const { data: packagePopularity, isLoading: packagesLoading } = useQuery({ queryKey: ['reports', 'package-popularity'], queryFn: async () => (await apiClient.get('/reports/package-popularity')).data })

  if (tierLoading || membersLoading || packagesLoading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-5"><ChartSkeleton /><ChartSkeleton /><ChartSkeleton /></div>

  return (
    <div className="space-y-5">
      <FadeUp><h1 className="text-xl font-bold gradient-text">Reports</h1></FadeUp>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FadeUp delay={0.1}>
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4" style={{ color: 'var(--neon)' }} />
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Revenue by Tier</h3>
            </div>
            {revenueByTier?.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revenueByTier}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="tier" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="revenue" fill="var(--neon)" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>No data</p>}
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-4 w-4" style={{ color: 'var(--neon3)' }} />
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Top Members</h3>
            </div>
            {topMembers?.length ? (
              <StaggerContainer className="space-y-2">
                {topMembers.map((m: any, i: number) => (
                  <StaggerItem key={m.member_id}>
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--surface-hover)', border: '1px solid var(--surface-border)' }}>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold" style={{ color: i === 0 ? 'var(--neon)' : 'var(--text-muted)' }}>#{i + 1}</span>
                        <div><p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{m.total_transactions} txns</p></div>
                      </div>
                      <p className="text-sm font-bold" style={{ color: 'var(--neon2)' }}>{formatCurrency(m.total_spent)}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>No data</p>}
          </div>
        </FadeUp>
        <FadeUp delay={0.3}>
          <div className="glass-card p-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4" style={{ color: 'var(--neon2)' }} />
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Package Popularity</h3>
            </div>
            {packagePopularity?.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={packagePopularity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="package_name" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="total_value" fill="var(--neon2)" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>No data</p>}
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
