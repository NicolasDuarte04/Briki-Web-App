import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChatInterface } from '@/components/ai-assistant/chat-interface';
import { ApiStatusCheck } from '@/components/ai-assistant/api-status-check';
import { aiService } from '@/services/ai-service';
import { UserMemory } from '@/types/assistant';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantContextType {
  isOpen: boolean;
  isMinimized: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleMinimize: () => void;
  userMemory: UserMemory;
  updateUserMemory: (newMemory: Partial<UserMemory>) => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

interface AIAssistantProviderProps {
  children: React.ReactNode;
}

export function AIAssistantProvider({ children }: AIAssistantProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [userMemory, setUserMemory] = useState<UserMemory>({});
  const [apiAvailable, setApiAvailable] = useState<boolean>(true);
  const [location] = useLocation();
  const { toast } = useToast();

  // Close assistant when navigating to a new page
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(true);
    }
  }, [location]);

  // Check API availability on mount
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const available = await aiService.checkAvailability();
        setApiAvailable(available);
      } catch (error) {
        setApiAvailable(false);
      }
    };

    checkAvailability();
  }, []);

  const openAssistant = () => {
    if (!apiAvailable) {
      toast({
        title: 'AI Assistant Unavailable',
        description: 'The AI assistant is currently unavailable. Please try again later.',
        variant: 'destructive',
      });
      return;
    }
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeAssistant = () => {
    setIsOpen(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const updateUserMemory = (newMemory: Partial<UserMemory>) => {
    setUserMemory(prev => ({
      ...prev,
      ...newMemory,
    }));
  };

  const contextValue: AIAssistantContextType = {
    isOpen,
    isMinimized,
    openAssistant,
    closeAssistant,
    toggleMinimize,
    userMemory,
    updateUserMemory,
  };

  return (
    <AIAssistantContext.Provider value={contextValue}>
      {children}
      
      {isOpen && (
        <div 
          className={`fixed bottom-4 right-4 z-50 w-[400px] max-w-[calc(100vw-2rem)] transition-all duration-300 ease-in-out ${
            isMinimized ? 'h-12 shadow-md' : 'max-h-[80vh]'
          }`}
        >
          {isMinimized ? (
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-md shadow-md cursor-pointer flex items-center justify-between"
              onClick={toggleMinimize}
            >
              <span className="font-medium">Briki AI Assistant</span>
              <span className="text-xs opacity-70">Click to expand</span>
            </div>
          ) : (
            <ChatInterface 
              userMemory={userMemory}
              onClose={closeAssistant}
              onMinimize={toggleMinimize}
            />
          )}
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