import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/formatters"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-neon-purple/30 bg-neon-purple/15 text-neon-purple",
        secondary: "border-white/10 bg-white/5 text-gray-400",
        destructive: "border-red-500/30 bg-red-500/15 text-red-400",
        outline: "text-gray-400 border-white/10",
        success: "border-neon-green/30 bg-neon-green/15 text-neon-green",
        warning: "border-neon-gold/30 bg-neon-gold/15 text-neon-gold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
