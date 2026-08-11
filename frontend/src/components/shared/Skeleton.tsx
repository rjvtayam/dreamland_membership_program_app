import { cn } from '@/utils/formatters'

interface SkeletonProps { className?: string }

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton-shimmer rounded-lg", className)} />
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card p-4 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-14" />
      <Skeleton className="h-2 w-16" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2.5">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3.5 flex-1" />
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-3">
      <Skeleton className="h-4 w-32" />
      <div className="space-y-2"><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="glass-card p-5 space-y-3">
      <Skeleton className="h-4 w-36" />
      <div className="flex items-end gap-2 h-40">
        {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="flex-1" />)}
      </div>
    </div>
  )
}
