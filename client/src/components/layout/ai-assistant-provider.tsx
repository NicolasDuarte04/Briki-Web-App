import React, { createContext, useContext, ReactNode } from 'react';

interface AIAssistantContextType {
  // Minimal context for compatibility - all actions now route to /ask-briki
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

interface AIAssistantProviderProps {
  children: ReactNode;
}

export const AIAssistantProvider: React.FC<AIAssistantProviderProps> = ({ children }) => {
  return (
    <AIAssistantContext.Provider value={{}}>
      {children}
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