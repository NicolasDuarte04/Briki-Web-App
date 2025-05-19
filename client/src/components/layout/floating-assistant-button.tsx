import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquareIcon } from 'lucide-react';
import { useAIAssistant } from './ai-assistant-provider';
import { trackEvent, EventCategory } from '@/lib/analytics';

interface FloatingAssistantButtonProps {
  className?: string;
}

export function FloatingAssistantButton({ className = '' }: FloatingAssistantButtonProps) {
  const { isOpen, openAssistant } = useAIAssistant();

  const handleClick = () => {
    // Track the event when user opens the assistant
    trackEvent('assistant_button_clicked', EventCategory.ENGAGEMENT);
    
    // Open the assistant
    openAssistant();
  };

  // Don't show the button if the assistant is already open
  if (isOpen) {
    return null;
  }

  return (
    <Button
      onClick={handleClick}
      className={`fixed bottom-4 right-4 z-40 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 p-0 flex items-center justify-center ${className}`}
      aria-label="Open AI Assistant"
    >
      <div className="relative">
        <MessageSquareIcon className="h-6 w-6 text-white" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </div>
    </Button>
  );
}