import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, AlertTriangle } from 'lucide-react';
import { useAIAssistant } from '@/components/layout/ai-assistant-provider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AIAssistantButtonProps {
  variant?: 'icon' | 'full';
  className?: string;
}

/**
 * Button component that toggles the AI Assistant visibility
 * Renders differently based on API availability state
 */
export const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ 
  variant = 'icon',
  className = ''
}) => {
  const { toggleAssistant, isApiAvailable } = useAIAssistant();
  
  // If the API availability is still being checked (null), show loading state
  if (isApiAvailable === null) {
    return (
      <Button
        variant="ghost"
        size={variant === 'icon' ? 'icon' : 'default'}
        disabled
        className={`relative ${className}`}
      >
        <Bot className="h-5 w-5 text-muted-foreground animate-pulse" />
        {variant === 'full' && <span className="ml-2">AI Assistant</span>}
      </Button>
    );
  }
  
  // Render the button differently based on API availability
  if (isApiAvailable === false) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={variant === 'icon' ? 'icon' : 'default'}
              onClick={toggleAssistant}
              className={`relative ${className}`}
            >
              <Bot className="h-5 w-5 text-amber-500" />
              {variant === 'full' && <span className="ml-2">AI Assistant</span>}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500">
                  <AlertTriangle className="h-3 w-3 text-white" />
                </span>
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">AI Assistant (Limited Mode)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Normal state when API is available
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={variant === 'icon' ? 'icon' : 'default'}
            onClick={toggleAssistant}
            className={`relative hover:bg-primary/10 ${className}`}
          >
            <Bot className="h-5 w-5 text-primary" />
            {variant === 'full' && <span className="ml-2">AI Assistant</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">Ask Briki Assistant</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AIAssistantButton;