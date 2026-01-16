import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold tracking-tight transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 active:scale-[0.97] hover:scale-[1.02]",
  {
    variants: {
      variant: {
        default:
          'bg-zinc-900 text-zinc-50 border border-white/5 shadow-xl shadow-zinc-950/10 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:border-none',
        destructive:
          'bg-red-500 text-white shadow-sm hover:bg-red-600 border border-red-400/20',
        outline:
          'border border-zinc-200 bg-white shadow-xs hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
        secondary:
          'bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700 border border-transparent dark:border-white/5',
        ghost:
          'hover:bg-zinc-100/80 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-zinc-100 text-zinc-500 dark:text-zinc-400',
        link: 'text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400',
        indigo:
          'bg-linear-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 border-t border-white/10 transition-all duration-200',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-9 rounded-lg gap-1.5 px-3 text-xs',
        lg: 'h-13 rounded-2xl px-8 text-base tracking-normal',
        icon: 'size-10 rounded-lg',
        'icon-sm': 'size-8 rounded-md',
        'icon-lg': 'size-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
