import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cardsApi } from '@/api/cards'
import { transactionsApi } from '@/api/transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, CreditCard, Check } from 'lucide-react'
import { formatCurrency, getTierColor, getTierName } from '@/utils/formatters'
import { TOKEN_PACKAGES, DISCOUNT_THRESHOLD } from '@/utils/constants'
import type { CardLookup } from '@/types'
import toast from 'react-hot-toast'

export default function POSPage() {
  const [cardId, setCardId] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [cardInfo, setCardInfo] = useState<CardLookup | null>(null)
  const [loading, setLoading] = useState(false)

  const queryClient = useQueryClient()

  // Lookup card
  const handleLookup = async () => {
    if (!cardId.trim()) {
      toast.error('Please enter a card ID')
      return
    }
    setLoading(true)
    try {
      const result = await cardsApi.lookup(cardId)
      setCardInfo(result)
      setSelectedPackage(null)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Card not found')
      setCardInfo(null)
    } finally {
      setLoading(false)
    }
  }

  // Process transaction
  const transactionMutation = useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: (data) => {
      toast.success(`Transaction successful! Amount: ${formatCurrency(Number(data.amount_to_collect))}`)
      // Reset form
      setCardId('')
      setSelectedPackage(null)
      setNotes('')
      setCardInfo(null)
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Transaction failed')
    },
  })

  const handleConfirm = () => {
    if (!cardInfo || !selectedPackage) return
    transactionMutation.mutate({
      card_id: cardInfo.card_id,
      token_package_id: selectedPackage,
      notes: notes || undefined,
    })
  }

  // Calculate preview
  const selectedPkg = TOKEN_PACKAGES.find((p) => p.id === selectedPackage)
  const discountEligible = selectedPkg ? selectedPkg.cash_value >= DISCOUNT_THRESHOLD : false
  const discountPercent = cardInfo?.discount_percent || 0
  const discountAmount = discountEligible ? (selectedPkg!.cash_value * discountPercent) / 100 : 0
  const amountToCollect = selectedPkg ? selectedPkg.cash_value - discountAmount : 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Lookup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Card Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Card ID (e.g., DLA-Q-000001)"
                value={cardId}
                onChange={(e) => setCardId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                className="font-mono"
              />
              <Button onClick={handleLookup} disabled={loading}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {cardInfo && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{cardInfo.member_name}</span>
                  <Badge className={getTierColor(cardInfo.tier)}>
                    {getTierName(cardInfo.tier)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Card ID</p>
                    <p className="font-mono">{cardInfo.card_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Points</p>
                    <p>{cardInfo.total_points}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Discount</p>
                    <p>{cardInfo.discount_percent}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="capitalize">{cardInfo.status}</p>
                  </div>
                </div>
                {cardInfo.ready_to_upgrade && (
                  <div className="p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
                    This member is ready to upgrade!
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Package Selection & Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Select Package</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Package Grid */}
            <div className="grid grid-cols-2 gap-3">
              {TOKEN_PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedPackage === pkg.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium">{pkg.name}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(pkg.cash_value)}</p>
                  <p className="text-xs text-purple-600">{pkg.points_earned} pts</p>
                </button>
              ))}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <Input
                placeholder="Add any notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Transaction Summary */}
            {selectedPkg && cardInfo && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <h4 className="font-medium">Transaction Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Package</span>
                    <span>{selectedPkg.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash Value</span>
                    <span>{formatCurrency(selectedPkg.cash_value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Points to Earn</span>
                    <span>{selectedPkg.points_earned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount Eligible</span>
                    <span>{discountEligible ? 'Yes (≥₱150)' : 'No'}</span>
                  </div>
                  {discountEligible && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discountPercent}%)</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Amount to Collect</span>
                    <span>{formatCurrency(amountToCollect)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleConfirm}
              disabled={!cardInfo || !selectedPackage || transactionMutation.isPending}
            >
              {transactionMutation.isPending ? (
                'Processing...'
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Confirm Transaction
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
