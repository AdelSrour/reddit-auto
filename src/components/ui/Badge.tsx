import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: ReactNode;
}

export function Badge({
  variant = 'default',
  children,
  className,
  ...props
}: BadgeProps): React.ReactNode {
  const variants = {
    success: 'bg-accent text-accent-foreground',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-destructive/10 text-destructive',
    info: 'bg-primary/10 text-primary',
    default: 'bg-muted text-muted-foreground',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
