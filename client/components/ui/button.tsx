import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'outline' && 'bg-transparent border border-input hover:bg-accent hover:text-accent-foreground',
          variant === 'ghost' && 'bg-transparent hover:bg-accent hover:text-accent-foreground',
          variant === 'link' && 'bg-transparent underline-offset-4 hover:underline text-primary',
          size === 'default' && 'h-10 py-2 px-4',
          size === 'sm' && 'h-9 px-3 rounded-md',
          size === 'lg' && 'h-11 px-8 rounded-md',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
