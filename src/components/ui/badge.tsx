import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        pink: "border-transparent bg-cms-pink/10 text-cms-pink",
        purple: "border-transparent bg-cms-purple/10 text-cms-purple",
        blue: "border-transparent bg-cms-blue/10 text-cms-blue",
        success: "border-transparent bg-green-100 text-green-700",
        warning: "border-transparent bg-amber-100 text-amber-700",
        gold: "border-transparent bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900",
        silver: "border-transparent bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800",
        bronze: "border-transparent bg-gradient-to-r from-amber-600 to-orange-500 text-amber-100",
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
