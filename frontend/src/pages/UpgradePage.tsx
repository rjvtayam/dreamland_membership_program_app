import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cardsApi } from '@/api/cards'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpCircle } from 'lucide-react'
import { getTierName } from '@/utils/formatters'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function UpgradePage() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: upgrades, isLoading } = useQuery({
    queryKey: ['cards', 'ready-for-upgrade'],
    queryFn: cardsApi.getReadyForUpgrade,
  })

  const upgradeMutation = useMutation({
    mutationFn: cardsApi.upgrade,
    onSuccess: (data) => {
      toast.success(`Card upgraded to ${getTierName(data.tier)}! New card: ${data.card_id}`)
      queryClient.invalidateQueries({ queryKey: ['cards'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setSelectedCard(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Upgrade failed')
    },
  })

  const handleUpgrade = () => {
    if (selectedCard) {
      upgradeMutation.mutate(selectedCard)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Upgrade Queue</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-yellow-500" />
            Ready to Upgrade ({upgrades?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner className="py-20" />
          ) : !upgrades?.length ? (
            <EmptyState
              title="No upgrades pending"
              description="All members are at their current tier"
            />
          ) : (
            <div className="space-y-3">
              {upgrades.map((upgrade: any) => (
                <div
                  key={upgrade.card_id}
                  className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{upgrade.member_name}</p>
                      <p className="text-sm text-gray-500 font-mono">{upgrade.card_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge className="bg-gray-200 text-gray-800">
                        {getTierName(upgrade.tier)}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">{upgrade.total_points} pts</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedCard(upgrade.card_id)}
                    >
                      <ArrowUpCircle className="h-4 w-4 mr-1" />
                      Upgrade
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!selectedCard}
        title="Confirm Card Upgrade"
        message={`Are you sure you want to upgrade card ${selectedCard}? This will create a new card with points carried forward.`}
        confirmLabel="Upgrade Card"
        onConfirm={handleUpgrade}
        onCancel={() => setSelectedCard(null)}
      />
    </div>
  )
}
