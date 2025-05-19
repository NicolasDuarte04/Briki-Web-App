import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquareText } from 'lucide-react';
import { useAIAssistant } from '@/components/layout/ai-assistant-provider';

export function AIAssistantButton() {
  const { isAvailable, isOpen, openAssistant } = useAIAssistant();

  if (!isAvailable) {
    return null;
  }

  return (
    <Button
      onClick={() => openAssistant('navbar')}
      variant="ghost"
      size="sm"
      className={`flex items-center gap-2 ${
        isOpen ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50 hover:text-blue-600'
      }`}
      aria-label="AI Assistant"
    >
      <MessageSquareText className="h-4 w-4" />
      <span className="hidden md:inline">Assistant</span>
    </Button>
  );
}