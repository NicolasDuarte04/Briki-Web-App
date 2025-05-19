import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquareIcon } from 'lucide-react';
import { useAIAssistant } from '@/components/layout/ai-assistant-provider';
import { trackEvent, EventCategory } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface AIAssistantButtonProps {
  variant?: 'default' | 'icon' | 'outline';
  className?: string;
}

export function AIAssistantButton({ 
  variant = 'default',
  className = '',
}: AIAssistantButtonProps) {
  const { isOpen, openAssistant } = useAIAssistant();

  const handleClick = () => {
    // Track when the user clicks the assistant button in the navbar
    trackEvent('assistant_navbar_button_clicked', EventCategory.ENGAGEMENT);
    
    // Open the assistant
    openAssistant();
  };

  // Render based on variant
  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={cn('p-0 h-9 w-9', className)}
        aria-label="AI Assistant"
      >
        <MessageSquareIcon className="h-5 w-5" />
      </Button>
    );
  }

  if (variant === 'outline') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        className={cn('gap-2', className)}
      >
        <MessageSquareIcon className="h-4 w-4" />
        <span>Assistant</span>
      </Button>
    );
  }

  // Default variant
  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleClick}
      className={cn(
        'gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
        className
      )}
    >
      <MessageSquareIcon className="h-4 w-4" />
      <span>Assistant</span>
    </Button>
  );
}