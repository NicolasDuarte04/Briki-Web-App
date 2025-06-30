import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { BrikiAssistant } from '@/components/ai-assistant';

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

// Routes where the floating assistant should not appear
const EXCLUDED_PATHS = [
  '/ask-briki-ai',
  '/ask-briki',
  '/copilot/ask'
];

export function AIAssistantProvider({ children }: AIAssistantProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const openAssistant = () => setIsOpen(true);
  const closeAssistant = () => setIsOpen(false);
  const toggleAssistant = () => setIsOpen(!isOpen);

  // Check if we should show the assistant on the current route
  const shouldShowAssistant = !EXCLUDED_PATHS.some(path => location.startsWith(path));

  return (
    <AIAssistantContext.Provider value={{ isOpen, openAssistant, closeAssistant, toggleAssistant }}>
      {children}
      {shouldShowAssistant && (
        <div className={`fixed bottom-4 right-4 z-50 ${isOpen ? 'w-96 h-[600px]' : 'w-auto h-auto'}`}>
          <BrikiAssistant />
        </div>
      )}
    </AIAssistantContext.Provider>
  );
}

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
}

export default AIAssistantProvider;