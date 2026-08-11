import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cardsApi } from '@/api/cards'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpCircle } from 'lucide-react'
import { formatDate, getTierName } from '@/utils/formatters'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { TIER_ORDER } from '@/utils/constants'

export default function CardsPage() {
  const [selectedTier, setSelectedTier] = useState('qualifier')

  const { data: cards, isLoading } = useQuery({
    queryKey: ['cards', selectedTier],
    queryFn: () => cardsApi.getByTier(selectedTier),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Card Management</h1>
        <Link to="/cards/upgrade">
          <Button variant="outline">
            <ArrowUpCircle className="h-4 w-4 mr-2" />
            Upgrade Queue
          </Button>
        </Link>
      </div>

      {/* Tier Tabs */}
      <div className="flex gap-2">
        {TIER_ORDER.map((tier) => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTier === tier
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getTierName(tier)}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <Card>
        <CardHeader>
          <CardTitle>{getTierName(selectedTier)} Cards</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner className="py-20" />
          ) : !cards?.length ? (
            <p className="text-center py-8 text-gray-500">No cards in this tier</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Card ID</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Points</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Welcome Bonus</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => (
                    <tr key={card.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-medium">{card.card_id}</td>
                      <td className="px-4 py-3">{card.total_points}</td>
                      <td className="px-4 py-3">
                        <Badge variant={card.status === 'active' ? 'success' : 'secondary'}>
                          {card.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {card.welcome_bonus_issued ? (
                          <Badge variant="success">Issued</Badge>
                        ) : (
                          <Badge variant="warning">Pending</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(card.date_registered)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
