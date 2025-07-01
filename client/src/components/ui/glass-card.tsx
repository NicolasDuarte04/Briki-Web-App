import React from 'react';
import { cn } from '../../lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'light' | 'dark' | 'auth';
  hover?: string;
  disableMotion?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  variant = 'default',
  hover,
  disableMotion = false,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'light':
        return "bg-white/20 border-white/30";
      case 'dark':
        return "bg-black/20 border-white/10";
      case 'auth':
        return "bg-white/5 border-white/20 shadow-[0_8px_16px_rgba(0,0,0,0.2)] before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/10 before:to-transparent before:opacity-30 before:rounded-lg";
      default:
        return "bg-white/10 border-white/20";
    }
  };

  const hoverStyles = hover ? `hover:${hover}` : '';
  
  return (
    <div 
      className={cn(
        "relative backdrop-blur-lg rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] overflow-hidden transition-all duration-300",
        getVariantStyles(),
        hoverStyles,
        variant === 'auth' ? 'border-0' : 'border',
        className
      )}
      {...props}
    >
      {variant !== 'auth' && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-30"></div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassCard;