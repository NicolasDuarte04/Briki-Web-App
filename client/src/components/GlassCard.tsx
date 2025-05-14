import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import '@/styles/design-system.css';

export type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'elevated';
  hover?: 'none' | 'lift' | 'glow';
  onClick?: () => void;
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className = '', variant = 'default', hover = 'none', onClick }, ref) => {
    // Base style variants
    const baseStyles = {
      default: 'bg-opacity-70 backdrop-blur-md border border-white/30',
      subtle: 'bg-opacity-40 backdrop-blur-sm border border-white/20',
      elevated: 'bg-opacity-80 backdrop-blur-lg border border-white/40 shadow-lg',
    };

    // Hover animation variants
    const hoverVariants = {
      none: {},
      lift: {
        rest: { y: 0, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' },
        hover: { y: -8, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' },
      },
      glow: {
        rest: { 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' 
        },
        hover: { 
          boxShadow: '0 0 25px rgba(255, 255, 255, 0.5), 0 0 10px rgba(80, 120, 255, 0.4)' 
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        className={`glass-card ${baseStyles[variant]} ${className}`}
        initial={hover !== 'none' ? 'rest' : undefined}
        whileHover={hover !== 'none' ? 'hover' : undefined}
        variants={hoverVariants[hover]}
        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;