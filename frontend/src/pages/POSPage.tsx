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
    try { const r = await cardsApi.lookup(cardId); setCardInfo(r); setSelectedPackage(null) }
    catch (e: any) { toast.error(e.response?.data?.detail || 'Card not found'); setCardInfo(null) }
    finally { setLoading(false) }
  }

  const txMutation = useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: (d) => { toast.success(`Success! Collect ${formatCurrency(Number(d.amount_to_collect))}`); setCardId(''); setSelectedPackage(null); setNotes(''); setCardInfo(null); queryClient.invalidateQueries({ queryKey: ['dashboard'] }) },
    onError: (e: any) => toast.error(e.response?.data?.detail || 'Failed'),
  })

  const handleConfirm = () => { if (cardInfo && selectedPackage) txMutation.mutate({ card_id: cardInfo.card_id, token_package_id: selectedPackage, notes: notes || undefined }) }
  const selectedPkg = TOKEN_PACKAGES.find((p) => p.id === selectedPackage)
  const discountEligible = selectedPkg ? selectedPkg.cash_value >= DISCOUNT_THRESHOLD : false
  const discountPercent = cardInfo?.discount_percent || 0
  const discountAmount = discountEligible ? (selectedPkg!.cash_value * discountPercent) / 100 : 0
  const amountToCollect = selectedPkg ? selectedPkg.cash_value - discountAmount : 0

  return (
    <div className="space-y-5">
      <FadeUp><h1 className="text-xl font-bold gradient-text">Point of Sale</h1></FadeUp>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FadeUp delay={0.1}>
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Card Lookup</h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="DLA-Q-000001" value={cardId} className="font-mono"
                  onChange={(e) => setCardId(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && handleLookup()} />
                <Button onClick={handleLookup} disabled={loading} className="text-white border-0"
                  style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {cardInfo && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl space-y-2.5" style={{ background: 'var(--surface-hover)', border: '1px solid var(--surface-border)' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{cardInfo.member_name}</span>
                    <Badge className={getTierColor(cardInfo.tier)}>{getTierName(cardInfo.tier)}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[{ l: 'Card ID', v: cardInfo.card_id, mono: true }, { l: 'Points', v: String(cardInfo.total_points) },
                      { l: 'Discount', v: `${cardInfo.discount_percent}%` }, { l: 'Status', v: cardInfo.status, cap: true }].map((i) => (
                      <div key={i.l}><p style={{ color: 'var(--text-muted)' }}>{i.l}</p>
                        <p className={`${i.mono ? 'font-mono' : ''} ${i.cap ? 'capitalize' : ''}`} style={{ color: 'var(--text-primary)' }}>{i.v}</p></div>
                    ))}
                  </div>
                  {cardInfo.ready_to_upgrade && <div className="p-2 rounded-lg text-xs" style={{ background: 'rgba(var(--neon3-rgb),0.1)', color: 'var(--neon3)', border: '1px solid rgba(var(--neon3-rgb),0.15)' }}>Ready to upgrade!</div>}
                </motion.div>
              )}
            </div>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--neon2), var(--neon3))' }}>
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Select Package</h3>
            </div>
            <div className="space-y-4">
              <StaggerContainer className="grid grid-cols-2 gap-2.5">
                {TOKEN_PACKAGES.map((pkg) => (
                  <StaggerItem key={pkg.id}>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className="p-3.5 rounded-xl border-2 text-left transition-all w-full"
                      style={{
                        borderColor: selectedPackage === pkg.id ? 'var(--neon)' : 'var(--surface-border)',
                        background: selectedPackage === pkg.id ? 'rgba(var(--neon-rgb),0.08)' : 'var(--surface-hover)',
                      }}>
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{pkg.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{formatCurrency(pkg.cash_value)}</p>
                      <p className="text-xs" style={{ color: 'var(--neon2)' }}>{pkg.points_earned} pts</p>
                    </motion.button>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              <Input placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
              {selectedPkg && cardInfo && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl space-y-1.5 text-sm" style={{ background: 'var(--surface-hover)', border: '1px solid var(--surface-border)' }}>
                  {[{ l: 'Package', v: selectedPkg.name }, { l: 'Cash Value', v: formatCurrency(selectedPkg.cash_value) },
                    { l: 'Points', v: String(selectedPkg.points_earned) }, { l: 'Discount Eligible', v: discountEligible ? 'Yes' : 'No' }].map((i) => (
                    <div key={i.l} className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>{i.l}</span><span style={{ color: 'var(--text-primary)' }}>{i.v}</span></div>
                  ))}
                  {discountEligible && <div className="flex justify-between" style={{ color: 'var(--neon2)' }}><span>Discount ({discountPercent}%)</span><span>-{formatCurrency(discountAmount)}</span></div>}
                  <div className="flex justify-between font-bold text-lg pt-2" style={{ borderTop: '1px solid var(--surface-border)' }}>
                    <span style={{ color: 'var(--text-primary)' }}>Total</span><span className="gradient-text">{formatCurrency(amountToCollect)}</span>
                  </div>
                </motion.div>
              )}
              <Button className="w-full h-11 font-semibold text-white border-0"
                style={{ background: 'linear-gradient(135deg, var(--neon2), var(--neon))' }}
                onClick={handleConfirm} disabled={!cardInfo || !selectedPackage || txMutation.isPending}>
                {txMutation.isPending ? 'Processing...' : <><Check className="h-4 w-4 mr-2" /> Confirm Transaction</>}
              </Button>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
