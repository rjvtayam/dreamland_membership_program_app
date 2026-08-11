import * as React from "react"
import { cn } from "@/utils/formatters"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--surface-border)',
          color: 'var(--text-primary)',
          // @ts-ignore
          '--tw-ring-color': 'var(--neon)',
        } as React.CSSProperties}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
