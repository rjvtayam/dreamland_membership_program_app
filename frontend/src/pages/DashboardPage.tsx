import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'
import { Users, CreditCard, DollarSign, ArrowUpCircle, ShoppingCart, TrendingUp, Activity } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { StatCardSkeleton } from '@/components/shared/Skeleton'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/Motion'
import { motion } from 'framer-motion'

const PIE_COLORS = ['#a855f7', '#22d3ee', '#f59e0b', '#ec4899']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3" style={{ border: '1px solid var(--surface-border)' }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-sm font-bold gradient-text">{formatCurrency(Number(payload[0].value))}</p>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
  })
  const { data: tierDistribution } = useQuery({
    queryKey: ['dashboard', 'tier-distribution'],
    queryFn: dashboardApi.getTierDistribution,
  })
  const { data: revenue } = useQuery({
    queryKey: ['dashboard', 'revenue'],
    queryFn: () => dashboardApi.getRevenue(7),
  })
  const { data: upgradeAlerts } = useQuery({
    queryKey: ['dashboard', 'upgrade-alerts'],
    queryFn: dashboardApi.getUpgradeAlerts,
  })

  const statCards = [
    { title: 'Total Members', value: stats?.total_members || 0, icon: Users, gradient: 'var(--stat-gradient-1)', iconGradient: 'var(--stat-icon-1)' },
    { title: 'Active Cards', value: stats?.active_cards || 0, icon: CreditCard, gradient: 'var(--stat-gradient-2)', iconGradient: 'var(--stat-icon-2)' },
    { title: 'Revenue Today', value: formatCurrency(stats?.total_revenue_today || 0), icon: DollarSign, gradient: 'var(--stat-gradient-3)', iconGradient: 'var(--stat-icon-3)' },
    { title: 'Transactions', value: stats?.total_transactions_today || 0, icon: ShoppingCart, gradient: 'var(--stat-gradient-4)', iconGradient: 'var(--stat-icon-4)' },
    { title: 'Pending Upgrades', value: stats?.pending_upgrades || 0, icon: ArrowUpCircle, gradient: 'var(--stat-gradient-5)', iconGradient: 'var(--stat-icon-5)' },
  ]

  return (
    <div className="space-y-5">
      <FadeUp>
        <h1 className="text-xl font-bold gradient-text">Dashboard</h1>
      </FadeUp>

      {/* Stats Row */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {statCards.map((stat) => (
            <StaggerItem key={stat.title}>
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="stat-card glass-card p-4 cursor-default"
              >
                <div className="stat-card absolute inset-0 rounded-[var(--radius)]"
                  style={{ background: stat.gradient }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      {stat.title}
                    </p>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: stat.iconGradient }}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Main Content: Chart + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart - spans 2 cols */}
        <FadeUp delay={0.2} className="lg:col-span-2">
          <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" style={{ color: 'var(--neon)' }} />
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Revenue Overview
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {['Day', 'Week', 'Month'].map((period) => (
                  <button key={period} className="px-3 py-1 rounded-lg text-[11px] font-medium transition-colors"
                    style={{
                      background: period === 'Week' ? 'rgba(var(--neon-rgb), 0.12)' : 'transparent',
                      color: period === 'Week' ? 'var(--neon)' : 'var(--text-muted)',
                    }}>
                    {period}
                  </button>
                ))}
              </div>
            </div>
            {revenue && revenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenue}>
                  <defs>
                    <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--neon)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--neon)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--neon)"
                    strokeWidth={2}
                    fill="url(#gradientRevenue)"
                    className="chart-glow"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-sm"
                style={{ color: 'var(--text-muted)' }}>
                No revenue data yet
              </div>
            )}
          </div>
        </FadeUp>

        {/* Right Panel - Upgrades + Tier Distribution */}
        <FadeUp delay={0.3} className="space-y-5">
          {/* Tier Distribution */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Member Tiers
            </h3>
            {tierDistribution && tierDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={tierDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="count"
                    stroke="transparent"
                  >
                    {tierDistribution.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[140px] flex items-center justify-center text-xs"
                style={{ color: 'var(--text-muted)' }}>
                No data
              </div>
            )}
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-2">
              {tierDistribution?.map((tier: any, i: number) => (
                <div key={tier.tier} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-[10px] capitalize" style={{ color: 'var(--text-muted)' }}>{tier.tier}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ready to Upgrade */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4" style={{ color: 'var(--neon3)' }} />
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Ready to Upgrade ({upgradeAlerts?.length || 0})
              </h3>
            </div>
            {upgradeAlerts && upgradeAlerts.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {upgradeAlerts.map((alert: any) => (
                  <motion.div
                    key={alert.card_id}
                    whileHover={{ x: 3 }}
                    className="flex items-center justify-between p-2.5 rounded-xl transition-colors"
                    style={{ background: 'var(--surface-hover)', border: '1px solid var(--surface-border)' }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
                        {alert.member_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{alert.member_name}</p>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{alert.card_id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium capitalize" style={{ color: 'var(--neon)' }}>{alert.tier}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{alert.total_points} pts</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-xs py-6" style={{ color: 'var(--text-muted)' }}>
                All members at current tier
              </p>
            )}
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
