import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = forwardRef<
  ComponentRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close asChild>
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn('fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm', className)}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      {...props}
    />
  </DialogPrimitive.Close>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = forwardRef<
  ComponentRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'border-border bg-card no-hover-lift text-card-foreground fixed z-[1000] grid w-full max-w-lg gap-4 rounded-2xl border p-6 shadow-lg',
        'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        // Constrain height while allowing inner content to manage overflow
        'max-h-[90vh]',
        'focus-visible:outline-none',
        className
      )}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
const DialogTitle = forwardRef<
  ComponentRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg leading-none font-semibold tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = forwardRef<
  ComponentRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
