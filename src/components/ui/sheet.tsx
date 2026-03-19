import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[100] bg-black/50 offcanvas-backdrop show",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

export type SheetContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  side?: "left" | "right" | "top" | "bottom";
  withOverlay?: boolean;
};

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", withOverlay = true, className, children, ...props }, ref) => (
  <SheetPortal>
    {withOverlay ? <SheetOverlay /> : null}
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-[101] bg-transparent",
        side === "left" && "left-0 top-0 h-full offcanvas offcanvas-start",
        side === "right" && "right-0 top-0 h-full offcanvas offcanvas-end",
        side === "top" && "left-0 top-0 w-full offcanvas",
        side === "bottom" && "left-0 bottom-0 w-full offcanvas",
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

