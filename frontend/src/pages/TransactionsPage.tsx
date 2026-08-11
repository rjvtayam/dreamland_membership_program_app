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
    <div className="space-y-6">
      <FadeUp>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Transactions
          </h1>
          <Button variant="outline" className="border-white/10 text-gray-400 hover:bg-white/5">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="flex gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">End Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="bg-white/5 border-white/10 text-white" />
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={() => { setStartDate(''); setEndDate('') }}
              className="border-white/10 text-gray-400 hover:bg-white/5">
              Clear
            </Button>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="glass-card overflow-hidden">
          {isLoading ? (
            <div className="p-6"><TableSkeleton rows={8} /></div>
          ) : !data?.items.length ? (
            <EmptyState title="No transactions found" description="Transactions will appear here once processed" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Date', 'Card ID', 'Member', 'Package', 'Amount', 'Points', 'Discount', 'Staff'].map((h) => (
                      <th key={h} className={`text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${['Amount', 'Points', 'Discount'].includes(h) ? 'text-right' : ''}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((tx: any, i: number) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-400">{formatDateTime(tx.created_at)}</td>
                      <td className="px-4 py-3 font-mono text-sm text-white">{tx.card_id}</td>
                      <td className="px-4 py-3 text-white">{tx.member_name || '-'}</td>
                      <td className="px-4 py-3 text-white">{tx.package_name || '-'}</td>
                      <td className="px-4 py-3 text-right font-medium text-white">{formatCurrency(tx.amount_to_collect)}</td>
                      <td className="px-4 py-3 text-right">
                        <Badge className="bg-neon-green/20 text-neon-green border border-neon-green/20">+{tx.points_earned}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {tx.discount_eligible ? (
                          <Badge className="bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/20">-{formatCurrency(tx.discount_amount)}</Badge>
                        ) : <span className="text-gray-600">-</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{tx.staff_name || '-'}</td>
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
            <p className="text-sm text-gray-500">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.total)} of {data.total}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}
                className="border-white/10 text-gray-400 hover:bg-white/5">Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === data.pages}
                className="border-white/10 text-gray-400 hover:bg-white/5">Next</Button>
            </div>
          </div>
        </FadeUp>
      )}
    </div>
  )
}
