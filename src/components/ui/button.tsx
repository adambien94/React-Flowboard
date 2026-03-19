import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fb-accent)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--fb-accent)] text-white hover:bg-[var(--fb-accent-2)]",
        secondary:
          "bg-[var(--fb-bg4)] text-[var(--fb-text-muted)] border border-[var(--fb-border)] hover:bg-[var(--fb-bg3)]",
        outline:
          "border border-[var(--fb-border)] text-[var(--fb-text-muted)] hover:bg-[var(--fb-bg3)] hover:text-[var(--fb-text)]",
        ghost:
          "bg-transparent text-[var(--fb-text-muted)] hover:bg-[var(--fb-bg3)] hover:text-[var(--fb-text)]",
        danger:
          "bg-[rgba(255,92,92,0.1)] text-[var(--fb-red)] border border-[rgba(255,92,92,0.2)] hover:bg-[rgba(255,92,92,0.18)]",
        link: "text-[var(--fb-text-muted)] underline-offset-4 hover:text-[var(--fb-text)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };

