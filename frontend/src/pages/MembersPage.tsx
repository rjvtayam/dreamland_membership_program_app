import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { membersApi } from '@/api/members'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Eye } from 'lucide-react'
import { formatDate, getTierColor, getTierName } from '@/utils/formatters'
import { TableSkeleton } from '@/components/shared/Skeleton'
import { FadeUp } from '@/components/shared/Motion'
import EmptyState from '@/components/shared/EmptyState'
import { motion } from 'framer-motion'

export default function MembersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['members', search, page],
    queryFn: () => membersApi.list({ search, page, limit: 20 }),
  })

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Members
            </span>
          </h1>
          <Link to="/members/new">
            <Button className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-purple/80 hover:to-neon-cyan/80 text-white border-0">
              <Plus className="h-4 w-4 mr-2" />
              Register Member
            </Button>
          </Link>
        </div>
      </FadeUp>

      {/* Search */}
      <FadeUp delay={0.1}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-10 bg-white/5 border-white/10 focus:border-neon-purple/50 text-white placeholder:text-gray-700"
          />
        </div>
      </FadeUp>

      {/* Members Table */}
      <FadeUp delay={0.2}>
        <div className="glass-card overflow-hidden">
          {isLoading ? (
            <div className="p-6"><TableSkeleton rows={8} /></div>
          ) : !data?.items.length ? (
            <EmptyState
              title="No members found"
              description={search ? "Try a different search term" : "Register your first member to get started"}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Tier</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((member, i) => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-white">{member.name}</td>
                      <td className="px-6 py-4 text-gray-400">{member.contact_number}</td>
                      <td className="px-6 py-4 text-gray-400">{member.email || '-'}</td>
                      <td className="px-6 py-4">
                        {member.current_tier ? (
                          <Badge className={`${getTierColor(member.current_tier)} border-0`}>
                            {getTierName(member.current_tier)}
                          </Badge>
                        ) : (
                          <span className="text-gray-600">No card</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400">{formatDate(member.created_at)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/members/${member.id}`}>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </FadeUp>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <FadeUp delay={0.3}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.total)} of {data.total} members
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}
                className="border-white/10 text-gray-400 hover:bg-white/5">
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === data.pages}
                className="border-white/10 text-gray-400 hover:bg-white/5">
                Next
              </Button>
            </div>
          </div>
        </FadeUp>
      )}
    </div>
  )
}
