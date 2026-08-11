import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { transactionsApi } from '@/api/transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import EmptyState from '@/components/shared/EmptyState'

export default function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', page, startDate, endDate],
    queryFn: () =>
      transactionsApi.list({
        page,
        limit: 20,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      }),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button variant="outline" onClick={() => { setStartDate(''); setEndDate(''); }}>
            Clear
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingSpinner className="py-20" />
          ) : !data?.items.length ? (
            <EmptyState
              title="No transactions found"
              description="Transactions will appear here once processed"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Card ID</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Member</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Package</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Points</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Discount</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Staff</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((tx: any) => (
                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{formatDateTime(tx.created_at)}</td>
                      <td className="px-4 py-3 font-mono text-sm">{tx.card_id}</td>
                      <td className="px-4 py-3">{tx.member_name || '-'}</td>
                      <td className="px-4 py-3">{tx.package_name || '-'}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(tx.amount_to_collect)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant="success">+{tx.points_earned}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {tx.discount_eligible ? (
                          <Badge variant="success">-{formatCurrency(tx.discount_amount)}</Badge>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{tx.staff_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.total)} of {data.total}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === data.pages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
