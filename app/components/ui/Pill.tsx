import { cn } from '~/lib/utils';
import type { ReactNode } from 'react';

interface PillProps {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Pill({ children, active, disabled, className, onClick }: PillProps) {
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      disabled={onClick ? disabled : undefined}
      className={cn(
        'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
        active
          ? 'bg-accent/15 text-accent border-accent/40'
          : 'bg-transparent text-text-secondary border-border hover:border-border-hover hover:text-text-primary',
        disabled && 'opacity-40 cursor-not-allowed line-through',
        onClick && !disabled && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </Component>
  );
}
