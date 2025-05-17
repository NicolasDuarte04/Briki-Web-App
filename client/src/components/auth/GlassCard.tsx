import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  className?: string;
  children: React.ReactNode;
}

export function GlassCard({ className, children }: GlassCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden border-0 bg-white/5 backdrop-blur-xl shadow-[0_8px_16px_rgba(0,0,0,0.2)]",
      "before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/10 before:to-transparent before:opacity-30 before:rounded-lg",
      "border border-white/20",
      className
    )}>
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  );
}