import React from 'react';
import { cn } from '@/lib/utils';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  darkMode?: boolean;
};

/**
 * Glass-morphism card component with optional hover effects
 * Provides a modern, translucent card with backdrop blur
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  darkMode = false
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border backdrop-blur-xl transition-all',
        hoverEffect && 'hover:-translate-y-1 duration-300',
        darkMode 
          ? 'bg-[rgba(22,25,37,0.75)] border-[rgba(76,110,255,0.2)]' 
          : 'bg-[rgba(255,255,255,0.8)] border-[rgba(255,255,255,0.4)]',
        className
      )}
      style={{
        boxShadow: darkMode 
          ? '0 10px 30px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)' 
          : '0 10px 30px rgba(76, 110, 255, 0.08), 0 4px 10px rgba(0, 0, 0, 0.03)'
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;