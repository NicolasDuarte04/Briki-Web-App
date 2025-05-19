import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useAIAssistant } from './ai-assistant-provider';

export function FloatingAssistantButton() {
  const { isAvailable, isOpen, openAssistant } = useAIAssistant();

  // Don't render if the assistant is not available or already open
  if (!isAvailable || isOpen) {
    return null;
  }

  return (
    <Button
      onClick={() => openAssistant('floating_button')}
      className="fixed right-4 bottom-4 z-40 shadow-lg rounded-full p-3 h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      aria-label="Open AI Assistant"
    >
      <MessageSquare className="w-6 h-6 text-white" />
    </Button>
  );
}