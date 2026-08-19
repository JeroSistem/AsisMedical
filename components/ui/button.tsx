import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39b8fd]/40 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#0F172A] text-white hover:opacity-90",
        destructive:
          "bg-[#ba1a1a] text-white hover:bg-[#ba1a1a]/90",
        outline:
          "border border-slate-200 bg-white text-[#0F172A] hover:bg-slate-50",
        secondary:
          "border border-slate-200 bg-white text-[#0F172A] hover:bg-slate-50",
        ghost: "hover:bg-slate-100 text-[#0F172A]",
        link: "text-[#006591] underline-offset-4 hover:underline",
        accent:
          "bg-[#39b8fd] text-[#004666] hover:opacity-90 font-semibold",
      },
      size: {
        default: "h-9 px-4 py-2 text-[13px]",
        sm: "h-8 rounded px-3 text-[12px]",
        lg: "h-10 rounded px-6 text-[14px]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
