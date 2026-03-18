import { cn } from '~/lib/utils';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent hover:bg-accent-hover text-white border-transparent shadow-sm shadow-accent/20 hover:shadow-accent/30',
  secondary:
    'bg-transparent hover:bg-bg-tertiary text-text-primary border-border hover:border-border-hover',
  ghost:
    'bg-transparent hover:bg-bg-tertiary text-text-secondary hover:text-text-primary border-transparent',
  destructive:
    'bg-error/10 hover:bg-error/20 text-error border-error/30 hover:border-error/50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs gap-1.5 rounded-md',
  md: 'px-6 py-3 text-sm gap-2 rounded-lg',
  lg: 'px-8 py-4 text-base gap-2.5 rounded-lg',
};

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  as?: ElementType;
}

export function Button<T extends ElementType = 'button'>({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  as,
  className,
  children,
  disabled,
  ...props
}: ButtonProps & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps>) {
  const Component = as ?? 'button';

  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center font-medium border transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-0.5 shrink-0"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
      )}
      {children}
    </Component>
  );
}
