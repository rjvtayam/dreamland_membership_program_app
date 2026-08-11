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
    <div className="space-y-5">
      <FadeUp>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-text">Members</h1>
          <Link to="/members/new">
            <Button className="text-white border-0" style={{ background: 'linear-gradient(135deg, var(--neon), var(--neon2))' }}>
              <Plus className="h-4 w-4 mr-2" /> Register Member
            </Button>
          </Link>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          <Input placeholder="Search by name or phone..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-10" />
        </div>
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="glass-card overflow-hidden">
          {isLoading ? (
            <div className="p-5"><TableSkeleton rows={8} /></div>
          ) : !data?.items.length ? (
            <EmptyState title="No members found"
              description={search ? "Try a different search term" : "Register your first member to get started"} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                    {['Name', 'Contact', 'Email', 'Current Tier', 'Registered', ''].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((member, i) => (
                    <motion.tr key={member.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="transition-colors" style={{ borderBottom: '1px solid var(--surface-border)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-5 py-3.5 font-medium" style={{ color: 'var(--text-primary)' }}>{member.name}</td>
                      <td className="px-5 py-3.5" style={{ color: 'var(--text-secondary)' }}>{member.contact_number}</td>
                      <td className="px-5 py-3.5" style={{ color: 'var(--text-secondary)' }}>{member.email || '-'}</td>
                      <td className="px-5 py-3.5">
                        {member.current_tier ? (
                          <Badge className={getTierColor(member.current_tier)}>{getTierName(member.current_tier)}</Badge>
                        ) : <span style={{ color: 'var(--text-muted)' }}>No card</span>}
                      </td>
                      <td className="px-5 py-3.5" style={{ color: 'var(--text-secondary)' }}>{formatDate(member.created_at)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <Link to={`/members/${member.id}`}>
                          <Button variant="ghost" size="sm">
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

      {data && data.pages > 1 && (
        <FadeUp delay={0.3}>
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.total)} of {data.total}
            </p>
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
