import { Bot, X } from 'lucide-react';
import { useAIAssistant } from './ai-assistant-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingAssistantButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export function FloatingAssistantButton({
  position = 'bottom-right',
  className
}: FloatingAssistantButtonProps) {
  const { isOpen, isAvailable, toggleAssistant } = useAIAssistant();

  if (!isAvailable) return null;

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <Button
      onClick={toggleAssistant}
      className={cn(
        'fixed z-50 shadow-lg transition-all duration-300 transform hover:scale-105',
        isOpen ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700',
        positionClasses[position],
        'w-12 h-12 p-0 rounded-full flex items-center justify-center',
        className
      )}
      aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
    >
      {isOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Bot className="h-5 w-5" />
      )}
    </Button>
  );
}