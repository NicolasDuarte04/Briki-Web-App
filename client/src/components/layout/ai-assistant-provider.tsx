import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { ChatInterface } from '@/components/ai-assistant';

interface AIAssistantContextType {
  isOpen: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

interface AIAssistantProviderProps {
  children: ReactNode;
}

export const AIAssistantProvider: React.FC<AIAssistantProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  // Paths where the floating assistant should NOT be shown
  const EXCLUDED_PATHS = ['/ask-briki', '/copilot/ask'];

  const shouldShowAssistant = !EXCLUDED_PATHS.includes(location);

  const openAssistant = () => setIsOpen(true);
  const closeAssistant = () => setIsOpen(false);
  const toggleAssistant = () => setIsOpen(prev => !prev);

  return (
    <AIAssistantContext.Provider 
      value={{ 
        isOpen, 
        openAssistant, 
        closeAssistant, 
        toggleAssistant 
      }}
    >
      {children}
      {shouldShowAssistant && (
        <ChatInterface
          placement="floating"
          autoExpand={isOpen}
          showClose={true}
          onClose={closeAssistant}
        />
      )}
    </AIAssistantContext.Provider>
  );
};

export const useAIAssistant = (): AIAssistantContextType => {
  const context = useContext(AIAssistantContext);

  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }

  return context;
};

export default AIAssistantProvider;