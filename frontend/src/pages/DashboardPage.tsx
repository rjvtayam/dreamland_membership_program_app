import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CreditCard, DollarSign, ArrowUpCircle, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const COLORS = ['#9CA3AF', '#C0C0C0', '#FFD700', '#1F2937']

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

  if (statsLoading) return <LoadingSpinner className="mt-20" />

  const statCards = [
    { title: 'Total Members', value: stats?.total_members || 0, icon: Users, color: 'text-blue-600' },
    { title: 'Active Cards', value: stats?.active_cards || 0, icon: CreditCard, color: 'text-purple-600' },
    { title: 'Revenue Today', value: formatCurrency(stats?.total_revenue_today || 0), icon: DollarSign, color: 'text-green-600' },
    { title: 'Transactions Today', value: stats?.total_transactions_today || 0, icon: ShoppingCart, color: 'text-orange-600' },
    { title: 'Pending Upgrades', value: stats?.pending_upgrades || 0, icon: ArrowUpCircle, color: 'text-yellow-600' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {revenue && revenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenue" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No revenue data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tier Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Members by Tier</CardTitle>
          </CardHeader>
          <CardContent>
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
                  >
                    {tierDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No member data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Alerts */}
      {upgradeAlerts && upgradeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-yellow-500" />
              Ready to Upgrade ({upgradeAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upgradeAlerts.map((alert) => (
                <div
                  key={alert.card_id}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <div>
                    <p className="font-medium">{alert.member_name}</p>
                    <p className="text-sm text-gray-500">{alert.card_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium capitalize">{alert.tier} → Next Tier</p>
                    <p className="text-sm text-gray-500">{alert.total_points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
