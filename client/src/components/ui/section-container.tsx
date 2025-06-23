import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface SectionContainerProps extends HTMLMotionProps<"section"> {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'light' | 'gradient';
  decoration?: 'dots' | 'grid' | 'circles' | 'none';
  customDecoration?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  noPadding?: boolean;
}

const SectionContainer = React.forwardRef<HTMLElement, SectionContainerProps>(
  ({ 
    children, 
    variant = 'default',
    decoration = 'none',
    customDecoration,
    className,
    containerClassName,
    noPadding = false,
    ...props 
  }, ref) => {
    // Background variants
    const backgroundClasses = {
      default: 'bg-white dark:bg-gray-900',
      dark: 'bg-gradient-to-br from-[#0077B6] via-[#0098C1] to-[#00C7C4] text-white',
      light: 'bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
      gradient: 'bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'
    };

    // Decoration patterns
    const decorationPatterns = {
      dots: (
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${variant === 'dark' ? '%23FFFFFF' : '%23000000'}' fill-opacity='0.4'%3E%3Ccircle cx='5' cy='5' r='2'/%3E%3Ccircle cx='35' cy='5' r='2'/%3E%3Ccircle cx='5' cy='35' r='2'/%3E%3Ccircle cx='35' cy='35' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      ),
      grid: (
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${variant === 'dark' ? '%23FFFFFF' : '%23000000'}' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      ),
      circles: (
        <>
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-br from-[#00C7C4]/20 to-[#0077B6]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-[#0077B6]/20 to-[#00C7C4]/20 rounded-full blur-3xl" />
        </>
      ),
      none: null
    };

    const sectionClasses = cn(
      // Base styles
      "relative overflow-hidden",
      
      // Background
      backgroundClasses[variant],
      
      // Padding
      !noPadding && "py-20 sm:py-32 lg:py-40",
      
      className
    );

    const containerClasses = cn(
      // Container styles
      "container relative z-10 mx-auto",
      
      // Responsive padding
      !noPadding && "px-4 sm:px-6 lg:px-8",
      
      containerClassName
    );

    return (
      <motion.section
        ref={ref}
        className={sectionClasses}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        {...props}
      >
        {/* Background decorations */}
        {decoration !== 'none' && decorationPatterns[decoration]}
        
        {/* Custom decoration slot */}
        {customDecoration && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {customDecoration}
          </div>
        )}
        
        {/* Additional gradient overlay for dark variant */}
        {variant === 'dark' && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10" />
        )}
        
        {/* Content container */}
        <div className={containerClasses}>
          {children}
        </div>
      </motion.section>
    );
  }
);

SectionContainer.displayName = 'SectionContainer';

export { SectionContainer }; 