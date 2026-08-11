import { useQuery } from '@tanstack/react-query'
import { settingsApi } from '@/api/settings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function SettingsPage() {
  const { data: tiers, isLoading: tiersLoading } = useQuery({
    queryKey: ['settings', 'tiers'],
    queryFn: settingsApi.getTiers,
  })

  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ['settings', 'packages'],
    queryFn: settingsApi.getPackages,
  })

  if (tiersLoading || packagesLoading) return <LoadingSpinner className="mt-20" />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tier Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tiers?.map((tier) => (
                <div key={tier.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium capitalize">{tier.tier_name}</h3>
                    <Badge>{tier.discount_percent}% discount</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p>Points Required</p>
                      <p className="font-medium">{tier.points_required.toLocaleString()}</p>
                    </div>
                    <div>
                      <p>Welcome Bonus</p>
                      <p className="font-medium">{tier.welcome_bonus_tokens} tokens</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Token Packages */}
        <Card>
          <CardHeader>
            <CardTitle>Token Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {packages?.map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{pkg.name}</p>
                    <p className="text-sm text-gray-500">
                      ₱{pkg.cash_value} = {pkg.points_earned} points
                    </p>
                  </div>
                  <Badge variant={pkg.is_active ? 'success' : 'secondary'}>
                    {pkg.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
