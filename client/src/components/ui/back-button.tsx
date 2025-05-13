import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/use-navigation';

interface BackButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function BackButton({ 
  className = '',
  variant = 'ghost',
  size = 'icon'
}: BackButtonProps) {
  const { goBack } = useNavigation();
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      className={`rounded-full bg-background/80 backdrop-blur-sm border border-primary/20 shadow-glow-sm hover:text-primary transition-colors ${className}`}
      onClick={goBack}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
}