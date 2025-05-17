import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "relative rounded-2xl p-6 backdrop-blur-lg bg-black/30 border border-white/10 shadow-xl", 
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;