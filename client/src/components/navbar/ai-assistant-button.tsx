import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIAssistant } from '@/components/layout/ai-assistant-provider';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';
import { trackEvent, EventCategory } from '@/lib/analytics';

interface AIAssistantButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AIAssistantButton({
  variant = 'outline',
  size = 'md',
  className
}: AIAssistantButtonProps) {
  const { isAvailable, openAssistant } = useAIAssistant();
  const [location] = useLocation();

  // Only show the button on certain pages
  // We don't need the assistant on the assistant page itself or certain utility pages
  const shouldShowButton = () => {
    const excludedPaths = [
      '/assistant',
      '/login',
      '/signup',
      '/forgot-password',
      '/reset-password',
    ];
    
    return isAvailable && !excludedPaths.some(path => location === path);
  };

  if (!shouldShowButton()) return null;

  const handleClick = () => {
    trackEvent('navbar_assistant_open', EventCategory.ENGAGEMENT, 'navbar_button');
    openAssistant();
  };

  const sizeClasses = {
    sm: 'h-8 px-2',
    md: 'h-10 px-3',
    lg: 'h-12 px-4',
  };

  return (
    <Button
      variant={variant}
      className={cn(
        "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700",
        "text-white border-0",
        sizeClasses[size],
        "transition-all duration-300 flex items-center gap-2",
        className
      )}
      onClick={handleClick}
      aria-label="Open AI Assistant"
    >
      <Bot className="h-4 w-4" />
      <span>Ask Assistant</span>
    </Button>
  );
}