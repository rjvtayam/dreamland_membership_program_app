import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cardsApi } from '@/api/cards'
import { transactionsApi } from '@/api/transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, CreditCard, Check, ShoppingCart } from 'lucide-react'
import { formatCurrency, getTierColor, getTierName } from '@/utils/formatters'
import { TOKEN_PACKAGES, DISCOUNT_THRESHOLD } from '@/utils/constants'
import type { CardLookup } from '@/types'
import toast from 'react-hot-toast'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/Motion'
import { motion } from 'framer-motion'

export default function POSPage() {
  const [cardId, setCardId] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [cardInfo, setCardInfo] = useState<CardLookup | null>(null)
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleLookup = async () => {
    if (!cardId.trim()) { toast.error('Please enter a card ID'); return }
    setLoading(true)
    try {
      const result = await cardsApi.lookup(cardId)
      setCardInfo(result)
      setSelectedPackage(null)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Card not found')
      setCardInfo(null)
    } finally { setLoading(false) }
  }

  const transactionMutation = useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: (data) => {
      toast.success(`Transaction successful! Amount: ${formatCurrency(Number(data.amount_to_collect))}`)
      setCardId(''); setSelectedPackage(null); setNotes(''); setCardInfo(null)
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error: any) => toast.error(error.response?.data?.detail || 'Transaction failed'),
  })

  const handleConfirm = () => {
    if (!cardInfo || !selectedPackage) return
    transactionMutation.mutate({ card_id: cardInfo.card_id, token_package_id: selectedPackage, notes: notes || undefined })
  }

  const selectedPkg = TOKEN_PACKAGES.find((p) => p.id === selectedPackage)
  const discountEligible = selectedPkg ? selectedPkg.cash_value >= DISCOUNT_THRESHOLD : false
  const discountPercent = cardInfo?.discount_percent || 0
  const discountAmount = discountEligible ? (selectedPkg!.cash_value * discountPercent) / 100 : 0
  const amountToCollect = selectedPkg ? selectedPkg.cash_value - discountAmount : 0

  return (
    <div className="space-y-6">
      <FadeUp>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          Point of Sale
        </h1>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Lookup */}
        <FadeUp delay={0.1}>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-white">Card Lookup</h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Card ID (e.g., DLA-Q-000001)"
                  value={cardId}
                  onChange={(e) => setCardId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  className="font-mono bg-white/5 border-white/10 focus:border-neon-purple/50 text-white placeholder:text-gray-700"
                />
                <Button onClick={handleLookup} disabled={loading}
                  className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-purple/80 hover:to-neon-cyan/80 text-white border-0">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {cardInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-white/[0.03] border border-neon-purple/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{cardInfo.member_name}</span>
                    <Badge className={`${getTierColor(cardInfo.tier)} border-0`}>{getTierName(cardInfo.tier)}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      { label: 'Card ID', value: cardInfo.card_id, mono: true },
                      { label: 'Total Points', value: cardInfo.total_points },
                      { label: 'Discount', value: `${cardInfo.discount_percent}%` },
                      { label: 'Status', value: cardInfo.status, capitalize: true },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-gray-600 text-xs">{item.label}</p>
                        <p className={`text-white ${item.mono ? 'font-mono' : ''} ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {cardInfo.ready_to_upgrade && (
                    <div className="p-2 rounded-lg bg-neon-gold/10 text-neon-gold text-xs border border-neon-gold/20">
                      This member is ready to upgrade!
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </FadeUp>

        {/* Package Selection & Summary */}
        <FadeUp delay={0.2}>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-white">Select Package</h3>
            </div>
            <div className="space-y-4">
              <StaggerContainer className="grid grid-cols-2 gap-3">
                {TOKEN_PACKAGES.map((pkg) => (
                  <StaggerItem key={pkg.id}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPackage === pkg.id
                          ? 'border-neon-purple bg-neon-purple/10 neon-glow'
                          : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                      }`}
                    >
                      <p className="font-medium text-white text-sm">{pkg.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatCurrency(pkg.cash_value)}</p>
                      <p className="text-xs text-neon-cyan mt-0.5">{pkg.points_earned} pts</p>
                    </motion.button>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Notes (Optional)</label>
                <Input
                  placeholder="Add any notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-neon-purple/50 text-white placeholder:text-gray-700"
                />
              </div>

              {selectedPkg && cardInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-white/[0.03] border border-neon-purple/10 space-y-2"
                >
                  <h4 className="font-medium text-white text-sm">Transaction Summary</h4>
                  <div className="space-y-1.5 text-sm">
                    {[
                      { label: 'Package', value: selectedPkg.name },
                      { label: 'Cash Value', value: formatCurrency(selectedPkg.cash_value) },
                      { label: 'Points to Earn', value: String(selectedPkg.points_earned) },
                      { label: 'Discount Eligible', value: discountEligible ? 'Yes (≥₱150)' : 'No' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="text-white">{item.value}</span>
                      </div>
                    ))}
                    {discountEligible && (
                      <div className="flex justify-between text-neon-green">
                        <span>Discount ({discountPercent}%)</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                      <span className="text-white">Amount to Collect</span>
                      <span className="text-neon-cyan">{formatCurrency(amountToCollect)}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <Button
                className="w-full bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80 text-white border-0 h-12 font-semibold"
                onClick={handleConfirm}
                disabled={!cardInfo || !selectedPackage || transactionMutation.isPending}
              >
                {transactionMutation.isPending ? 'Processing...' : (
                  <><Check className="h-5 w-5 mr-2" /> Confirm Transaction</>
                )}
              </Button>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
