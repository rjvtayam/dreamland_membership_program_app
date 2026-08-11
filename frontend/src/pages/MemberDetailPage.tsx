import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { membersApi } from '@/api/members'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { formatDate, getTierColor, getTierName } from '@/utils/formatters'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { TIER_THRESHOLDS } from '@/utils/constants'

export default function MemberDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: member, isLoading } = useQuery({
    queryKey: ['member', id],
    queryFn: () => membersApi.getById(Number(id)),
    enabled: !!id,
  })

  if (isLoading) return <LoadingSpinner className="mt-20" />
  if (!member) return <div className="text-center py-20">Member not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
          <p className="text-gray-500">{member.contact_number}</p>
        </div>
      </div>

      {/* Member Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{member.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-medium">{member.contact_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{member.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">{formatDate(member.created_at)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Cards ({member.cards?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {member.cards && member.cards.length > 0 ? (
              <div className="space-y-3">
                {member.cards.map((card: any) => {
                  const threshold = TIER_THRESHOLDS[card.tier as keyof typeof TIER_THRESHOLDS]
                  const readyToUpgrade = threshold !== null && card.total_points >= threshold

                  return (
                    <div
                      key={card.id}
                      className={`p-4 rounded-lg border ${
                        card.status === 'active' ? 'bg-white' : 'bg-gray-50 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge className={getTierColor(card.tier)}>
                            {getTierName(card.tier)}
                          </Badge>
                          <div>
                            <p className="font-mono font-medium">{card.card_id}</p>
                            <p className="text-sm text-gray-500">
                              {card.total_points} points | {card.status}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {card.status === 'active' && readyToUpgrade && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Ready to Upgrade
                            </Badge>
                          )}
                          {card.previous_card_id && (
                            <p className="text-xs text-gray-400 mt-1">
                              Previous: {card.previous_card_id}
                            </p>
                          )}
                        </div>
                      </div>
                      {card.status === 'active' && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm text-gray-500 mb-1">
                            <span>Progress to next tier</span>
                            <span>{card.total_points} / {threshold || 'Max'}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min(100, (card.total_points / (threshold || card.total_points)) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No cards found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
