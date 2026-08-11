import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'
import { Users, CreditCard, DollarSign, ArrowUpCircle, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { StatCardSkeleton } from '@/components/shared/Skeleton'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/Motion'
import { motion } from 'framer-motion'

const COLORS = ['#a855f7', '#22d3ee', '#f59e0b', '#ec4899']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-neon-purple/20">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-bold text-neon-cyan">{formatCurrency(Number(payload[0].value))}</p>
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
    { title: 'Total Members', value: stats?.total_members || 0, icon: Users, color: 'from-neon-purple to-neon-blue', glow: 'rgba(168,85,247,0.15)' },
    { title: 'Active Cards', value: stats?.active_cards || 0, icon: CreditCard, color: 'from-neon-cyan to-neon-blue', glow: 'rgba(34,211,238,0.15)' },
    { title: 'Revenue Today', value: formatCurrency(stats?.total_revenue_today || 0), icon: DollarSign, color: 'from-neon-green to-neon-cyan', glow: 'rgba(16,185,129,0.15)' },
    { title: 'Transactions Today', value: stats?.total_transactions_today || 0, icon: ShoppingCart, color: 'from-neon-gold to-neon-pink', glow: 'rgba(245,158,11,0.15)' },
    { title: 'Pending Upgrades', value: stats?.pending_upgrades || 0, icon: ArrowUpCircle, color: 'from-neon-pink to-neon-purple', glow: 'rgba(236,72,153,0.15)' },
  ]

  return (
    <div className="space-y-6">
      <FadeUp>
        <h1 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
      </FadeUp>

      {/* Stats Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <StaggerItem key={stat.title}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="glass-card p-5 relative overflow-hidden group cursor-default"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at center, ${stat.glow}, transparent 70%)` }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.title}</p>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <FadeUp delay={0.2}>
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Revenue (Last 7 Days)
            </h3>
            {revenue && revenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,247,0.08)" />
                  <XAxis dataKey="date" stroke="#4b5563" fontSize={12} />
                  <YAxis stroke="#4b5563" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {revenue.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-600 text-sm">
                No revenue data yet
              </div>
            )}
          </div>
        </FadeUp>

        {/* Tier Distribution */}
        <FadeUp delay={0.3}>
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Members by Tier
            </h3>
            {tierDistribution && tierDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tierDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tier, count }) => `${tier}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    stroke="rgba(8,11,22,0.8)"
                    strokeWidth={2}
                  >
                    {tierDistribution.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-600 text-sm">
                No member data yet
              </div>
            )}
          </div>
        </FadeUp>
      </div>

      {/* Upgrade Alerts */}
      {upgradeAlerts && upgradeAlerts.length > 0 && (
        <FadeUp delay={0.4}>
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4 text-neon-gold" />
              Ready to Upgrade ({upgradeAlerts.length})
            </h3>
            <StaggerContainer className="space-y-3">
              {upgradeAlerts.map((alert: any) => (
                <StaggerItem key={alert.card_id}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-neon-gold/5 border border-neon-gold/10 hover:border-neon-gold/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-white">{alert.member_name}</p>
                      <p className="text-sm text-gray-500 font-mono">{alert.card_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neon-gold capitalize">{alert.tier} → Next Tier</p>
                      <p className="text-sm text-gray-500">{alert.total_points} pts</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeUp>
      )}
    </div>
  )
}
