import { cn } from '~/lib/utils';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'accent' | 'new';

const variantStyles: Record<BadgeVariant, string> = {
  default:  'bg-bg-tertiary text-text-secondary border-border',
  success:  'bg-success/10 text-success border-success/20',
  warning:  'bg-warning/10 text-warning border-warning/20',
  error:    'bg-error/10 text-error border-error/20',
  accent:   'bg-accent/10 text-accent border-accent/20',
  new:      'bg-accent text-white border-transparent',
};

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
