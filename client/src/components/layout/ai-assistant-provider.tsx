import React, { createContext, useContext, useState, useCallback } from 'react';
import { ChatInterface } from '@/components/ai-assistant';

// Context type definition
interface AIAssistantContextType {
  isOpen: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
}

// Create context with default values
const AIAssistantContext = createContext<AIAssistantContextType>({
  isOpen: false,
  openAssistant: () => {},
  closeAssistant: () => {},
  toggleAssistant: () => {}
});

// Hook to use the AI Assistant context
export const useAIAssistantUI = () => useContext(AIAssistantContext);

interface AIAssistantProviderProps {
  children: React.ReactNode;
  initialOpen?: boolean;
}

/**
 * Provider component that makes the AI assistant available throughout the app
 */
export function AIAssistantProvider({ 
  children, 
  initialOpen = false 
}: AIAssistantProviderProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const openAssistant = useCallback(() => setIsOpen(true), []);
  const closeAssistant = useCallback(() => setIsOpen(false), []);
  const toggleAssistant = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <AIAssistantContext.Provider value={{ 
      isOpen, 
      openAssistant, 
      closeAssistant, 
      toggleAssistant 
    }}>
      {children}
      <ChatInterface 
        autoExpand={isOpen} 
        onClose={closeAssistant} 
      />
    </AIAssistantContext.Provider>
  );
}