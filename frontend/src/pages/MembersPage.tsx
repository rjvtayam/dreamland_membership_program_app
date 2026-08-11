import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { membersApi } from '@/api/members'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Eye } from 'lucide-react'
import { formatDate, getTierColor, getTierName } from '@/utils/formatters'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import EmptyState from '@/components/shared/EmptyState'

export default function MembersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['members', search, page],
    queryFn: () => membersApi.list({ search, page, limit: 20 }),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <Link to="/members/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Register Member
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="pl-10"
        />
      </div>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingSpinner className="py-20" />
          ) : !data?.items.length ? (
            <EmptyState
              title="No members found"
              description={search ? "Try a different search term" : "Register your first member to get started"}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Contact</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Current Tier</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Registered</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((member) => (
                      <tr key={member.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{member.name}</td>
                        <td className="px-6 py-4 text-gray-600">{member.contact_number}</td>
                        <td className="px-6 py-4 text-gray-600">{member.email || '-'}</td>
                        <td className="px-6 py-4">
                          {member.current_tier ? (
                            <Badge className={getTierColor(member.current_tier)}>
                              {getTierName(member.current_tier)}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">No card</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(member.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/members/${member.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
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
            Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.total)} of {data.total} members
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === data.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
