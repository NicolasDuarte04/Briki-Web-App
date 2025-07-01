import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GradientCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outline';
  glassEffect?: boolean;
  hoverEffect?: boolean;
  noPadding?: boolean;
}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ 
    className, 
    children, 
    header,
    footer,
    variant = 'default',
    glassEffect = true,
    hoverEffect = true,
    noPadding = false,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      // Base styles
      "relative overflow-hidden rounded-2xl transition-all duration-300",
      
      // Glass effect
      glassEffect && [
        "backdrop-blur-md",
        variant === 'default' && "bg-white/80 dark:bg-gray-900/80",
        variant === 'elevated' && "bg-white/90 dark:bg-gray-900/90",
        variant === 'outline' && "bg-white/60 dark:bg-gray-900/60"
      ],
      
      // Border styles
      variant === 'default' && "border border-gray-200/50 dark:border-gray-700/50",
      variant === 'elevated' && "border border-gray-200/30 dark:border-gray-700/30 shadow-xl",
      variant === 'outline' && "border-2 border-gradient-to-r from-[#00C7C4]/20 to-[#0077B6]/20",
      
      // Hover effects
      hoverEffect && [
        "hover:shadow-2xl hover:shadow-[#00C7C4]/10",
        variant === 'default' && "hover:border-gray-200/70 dark:hover:border-gray-700/70",
        variant === 'elevated' && "hover:-translate-y-1",
        variant === 'outline' && "hover:border-[#00C7C4]/30"
      ],
      
      // Focus styles
      "focus-within:ring-2 focus-within:ring-[#00C7C4]/20 focus-within:ring-offset-2",
      
      className
    );

    const contentClasses = cn(
      !noPadding && "p-6",
      "relative z-10"
    );

    return (
      <motion.div
        ref={ref}
        className={baseClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={hoverEffect ? { scale: 1.02 } : {}}
        transition={{ 
          duration: 0.3,
          scale: { type: "spring", stiffness: 300, damping: 20 }
        }}
        {...props}
      >
        {/* Gradient border effect for outline variant */}
        {variant === 'outline' && (
          <div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00C7C4] to-[#0077B6] opacity-10" 
            aria-hidden="true"
          />
        )}
        
        {/* Subtle gradient overlay for depth */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#00C7C4]/5 via-transparent to-[#0077B6]/5 pointer-events-none" 
          aria-hidden="true"
        />
        
        {/* Header slot */}
        {header && (
          <div className={cn(
            "relative z-10 border-b border-gray-200/50 dark:border-gray-700/50",
            !noPadding && "px-6 py-4"
          )}>
            {header}
          </div>
        )}
        
        {/* Main content */}
        <div className={contentClasses}>
          {children}
        </div>
        
        {/* Footer slot */}
        {footer && (
          <div className={cn(
            "relative z-10 border-t border-gray-200/50 dark:border-gray-700/50",
            !noPadding && "px-6 py-4"
          )}>
            {footer}
          </div>
        )}
        
        {/* Hover glow effect */}
        {hoverEffect && (
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00C7C4]/10 to-[#0077B6]/10 blur-xl" />
          </motion.div>
        )}
      </motion.div>
    );
  }
);

GradientCard.displayName = 'GradientCard';

export { GradientCard }; 