import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { transactionsApi } from '@/api/transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import { TableSkeleton } from '@/components/shared/Skeleton'
import { FadeUp } from '@/components/shared/Motion'
import EmptyState from '@/components/shared/EmptyState'
import { motion } from 'framer-motion'

export default function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['transactions', page, startDate, endDate],
    queryFn: () => transactionsApi.list({ page, limit: 20, start_date: startDate || undefined, end_date: endDate || undefined }),
  })

  return (
    <div className="space-y-5">
      <FadeUp>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-text">Transactions</h1>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>
      </FadeUp>
      <FadeUp delay={0.1}>
        <div className="flex gap-3">
          <div><label className="block text-[10px] font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
          <div><label className="block text-[10px] font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>End Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
          <div className="flex items-end"><Button variant="outline" onClick={() => { setStartDate(''); setEndDate('') }}>Clear</Button></div>
        </div>
      </FadeUp>
      <FadeUp delay={0.2}>
        <div className="glass-card overflow-hidden">
          {isLoading ? <div className="p-5"><TableSkeleton rows={8} /></div> : !data?.items.length ? (
            <EmptyState title="No transactions found" description="Transactions appear once processed" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  {['Date', 'Card ID', 'Member', 'Package', 'Amount', 'Points', 'Discount', 'Staff'].map((h) => (
                    <th key={h} className={`text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider ${['Amount', 'Points', 'Discount'].includes(h) ? 'text-right' : ''}`}
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {data.items.map((tx: any, i: number) => (
                    <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      style={{ borderBottom: '1px solid var(--surface-border)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDateTime(tx.created_at)}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{tx.card_id}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>{tx.member_name || '-'}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>{tx.package_name || '-'}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(tx.amount_to_collect)}</td>
                      <td className="px-4 py-3 text-right"><Badge variant="success">+{tx.points_earned}</Badge></td>
                      <td className="px-4 py-3 text-right">{tx.discount_eligible ? <Badge variant="success">-{formatCurrency(tx.discount_amount)}</Badge> : <span style={{ color: 'var(--text-muted)' }}>-</span>}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{tx.staff_name || '-'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </FadeUp>
      {data && data.pages > 1 && (
        <FadeUp delay={0.3}>
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.total)} of {data.total}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === data.pages}>Next</Button>
            </div>
          </div>
        </FadeUp>
      )}
    </div>
  )
}
