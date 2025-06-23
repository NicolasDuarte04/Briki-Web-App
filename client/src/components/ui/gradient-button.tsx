import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GradientButtonProps extends Omit<HTMLMotionProps<"button">, 'size'> {
  size?: 'base' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

const sizeClasses = {
  base: 'h-11 px-6 text-base',
  lg: 'h-14 px-8 text-base'
};

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ 
    className, 
    size = 'base', 
    loading = false, 
    icon, 
    iconPosition = 'right',
    children,
    variant = 'primary',
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    const baseClasses = cn(
      // Base styles
      "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-60",
      
      // Size classes
      sizeClasses[size],
      
      // Variant styles
      variant === 'primary' && [
        "bg-gradient-to-r from-[#00C7C4] to-[#0077B6] text-white",
        "hover:shadow-lg hover:shadow-[#00C7C4]/25",
        "focus-visible:ring-[#00C7C4]/50",
        "group"
      ],
      
      variant === 'secondary' && [
        "bg-white text-[#0077B6] border-2 border-[#0077B6]/20",
        "hover:bg-gray-50 hover:border-[#0077B6]/30 hover:shadow-md",
        "focus-visible:ring-[#0077B6]/50"
      ],
      
      variant === 'outline' && [
        "bg-transparent text-white border-2 border-white/50",
        "hover:bg-white/10 hover:border-white",
        "focus-visible:ring-white/50"
      ],
      
      className
    );

    const iconElement = loading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : icon ? (
      <span className={cn(
        "transition-transform duration-300",
        variant === 'primary' && "group-hover:translate-x-0.5"
      )}>
        {icon}
      </span>
    ) : null;

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {/* Gradient glow effect for primary variant */}
        {variant === 'primary' && !isDisabled && (
          <span 
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00C7C4] to-[#0077B6] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" 
            aria-hidden="true"
          />
        )}
        
        {/* Button content */}
        <span className="relative flex items-center gap-2">
          {iconElement && iconPosition === 'left' && iconElement}
          {loading ? 'Loading...' : children}
          {iconElement && iconPosition === 'right' && iconElement}
        </span>
      </motion.button>
    );
  }
);

GradientButton.displayName = 'GradientButton';

export { GradientButton }; 