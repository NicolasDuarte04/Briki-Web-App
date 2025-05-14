import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  gradientType?: 'primary' | 'secondary' | 'auto' | 'pet' | 'health' | 'travel';
}

/**
 * Modern gradient button with animations and loading states
 * Inspired by Stripe and Apple design patterns
 */
export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    loadingText = 'Loading...',
    icon,
    gradientType = 'primary',
    className, 
    children,
    ...props 
  }, ref) => {
    
    const getGradient = () => {
      switch (gradientType) {
        case 'secondary':
          return 'linear-gradient(135deg, #00C2FF, #38BDF8)';
        case 'auto':
          return 'linear-gradient(135deg, #4F6AFF, #33C1FF)';
        case 'pet':
          return 'linear-gradient(135deg, #6E59FF, #A289FF)';
        case 'health':
          return 'linear-gradient(135deg, #F43F5E, #FB7185)';
        case 'travel':
          return 'linear-gradient(135deg, #4C6EFF, #5F9FFF)';
        default:
          return 'linear-gradient(135deg, #4C6EFF, #5F9FFF)';
      }
    };
    
    const getSizeClass = () => {
      switch (size) {
        case 'sm': return 'text-sm py-2 px-3';
        case 'lg': return 'text-lg py-4 px-8';
        default: return 'py-3 px-5';
      }
    };
    
    // Base classes for different variants
    let baseClasses = '';
    
    if (variant === 'primary') {
      baseClasses = 'text-white shadow-md hover:shadow-lg active:shadow-sm relative overflow-hidden';
    } else if (variant === 'secondary') {
      baseClasses = 'bg-white/10 backdrop-blur-sm border border-white/20 text-primary hover:bg-white/20 shadow-sm';
    } else if (variant === 'outline') {
      baseClasses = 'bg-transparent border border-primary/30 text-primary hover:border-primary/70 hover:bg-primary/5';
    } else if (variant === 'ghost') {
      baseClasses = 'bg-transparent hover:bg-primary/5 text-primary hover:text-primary-foreground';
    }
    
    return (
      <Button
        ref={ref}
        className={cn(
          'font-medium rounded-xl relative transition-all',
          getSizeClass(),
          baseClasses,
          isLoading && 'opacity-90 pointer-events-none',
          className
        )}
        style={variant === 'primary' ? {
          background: getGradient(),
          boxShadow: '0 2px 5px rgba(76, 110, 255, 0.2)'
        } : {}}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {variant === 'primary' && (
          <span className="absolute inset-0 overflow-hidden rounded-xl">
            <span 
              className="absolute -left-[100%] top-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:animate-shimmer" 
              style={{ 
                animation: 'none',
                transition: 'transform 1s ease',
                transform: 'translateX(-100%)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(100%)';
              }}
              onAnimationEnd={(e) => {
                e.currentTarget.style.transform = 'translateX(-100%)';
              }}
            />
          </span>
        )}
        
        <span className="flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <svg 
                className="animate-spin h-4 w-4 mr-1.5" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {loadingText}
            </>
          ) : (
            <>
              {icon && <span className="mr-1.5">{icon}</span>}
              {children}
            </>
          )}
        </span>
      </Button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export default GradientButton;