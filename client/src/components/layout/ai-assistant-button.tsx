
import React from 'react';
import { Bot, SparklesIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Create a separate type that doesn't extend ButtonProps
interface AIAssistantButtonProps {
  buttonVariant?: 'default' | 'link' | 'outline' | 'destructive' | 'secondary' | 'ghost';
  displayVariant?: 'icon' | 'text' | 'fab';
  label?: string;
  className?: string;
  tooltip?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
}

/**
 * Button component to open the AI assistant
 */
export function AIAssistantButton({
  displayVariant = 'icon',
  buttonVariant,
  label = 'AI Assistant',
  className = '',
  tooltip = 'Open AI Assistant',
  size,
  disabled
}: AIAssistantButtonProps) {
  const [, navigate] = useLocation();
  
  if (displayVariant === 'fab') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-40 shadow-glow-lg"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => navigate('/ask-briki')}
              className={cn(
                "h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/90",
                className
              )}
              aria-label={label}
              disabled={disabled}
            >
              <Bot size={24} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">{tooltip}</TooltipContent>
        </Tooltip>
      </motion.div>
    );
  }
  
  if (displayVariant === 'text') {
    return (
      <Button
        onClick={() => navigate('/ask-briki')}
        variant={buttonVariant || "outline"}
        className={cn("gap-2", className)}
        size={size}
        disabled={disabled}
      >
        <SparklesIcon size={16} />
        {label}
      </Button>
    );
  }
  
  // Default icon button
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => navigate('/ask-briki')}
          variant={buttonVariant || "ghost"}
          size={size || "icon"}
          className={className}
          disabled={disabled}
        >
          <Bot size={20} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}