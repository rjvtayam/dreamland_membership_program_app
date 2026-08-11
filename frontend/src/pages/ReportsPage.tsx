import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/utils/formatters'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function ReportsPage() {
  const { data: revenueByTier, isLoading: tierLoading } = useQuery({
    queryKey: ['reports', 'revenue-by-tier'],
    queryFn: async () => {
      const { data } = await apiClient.get('/reports/revenue-by-tier')
      return data
    },
  })

  const { data: topMembers, isLoading: membersLoading } = useQuery({
    queryKey: ['reports', 'top-members'],
    queryFn: async () => {
      const { data } = await apiClient.get('/reports/top-members')
      return data
    },
  })

  const { data: packagePopularity, isLoading: packagesLoading } = useQuery({
    queryKey: ['reports', 'package-popularity'],
    queryFn: async () => {
      const { data } = await apiClient.get('/reports/package-popularity')
      return data
    },
  })

  if (tierLoading || membersLoading || packagesLoading) {
    return <LoadingSpinner className="mt-20" />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Tier */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Tier</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByTier && revenueByTier.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByTier}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tier" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenue" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-8 text-gray-500">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Top Members */}
        <Card>
          <CardHeader>
            <CardTitle>Top Members by Spending</CardTitle>
          </CardHeader>
          <CardContent>
            {topMembers && topMembers.length > 0 ? (
              <div className="space-y-3">
                {topMembers.map((member: any, index: number) => (
                  <div key={member.member_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-400">{index + 1}</span>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.total_transactions} transactions</p>
                      </div>
                    </div>
                    <p className="font-bold">{formatCurrency(member.total_spent)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Package Popularity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Package Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            {packagePopularity && packagePopularity.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={packagePopularity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="package_name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="total_value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-8 text-gray-500">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
