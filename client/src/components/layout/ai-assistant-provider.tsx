import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackAssistantOpened, trackAssistantClosed } from '@/lib/assistant-analytics';
import { ChatInterface } from '@/components/ai-assistant/chat-interface';
import { checkAPIStatus } from '@/services/ai-service';
import { UserMemory } from '@/types/assistant';

// Interface for the context value
interface AIAssistantContextValue {
  isOpen: boolean;
  openAssistant: (source: 'floating_button' | 'navbar' | 'auto') => void;
  closeAssistant: () => void;
  isAvailable: boolean;
  userMemory: UserMemory;
  updateUserMemory: (newMemory: Partial<UserMemory>) => void;
}

// Create the context with a default value
const AIAssistantContext = createContext<AIAssistantContextValue>({
  isOpen: false,
  openAssistant: () => {},
  closeAssistant: () => {},
  isAvailable: false,
  userMemory: {},
  updateUserMemory: () => {},
});

// Hook for using the AI Assistant context
export const useAIAssistant = () => useContext(AIAssistantContext);

interface AIAssistantProviderProps {
  children: React.ReactNode;
}

export function AIAssistantProvider({ children }: AIAssistantProviderProps) {
  // State for the AI Assistant
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [userMemory, setUserMemory] = useState<UserMemory>({});
  const [openTime, setOpenTime] = useState<number | null>(null);
  const [messageCount, setMessageCount] = useState<number>(0);
  const [location] = useLocation();

  // Check if the API is available when the component mounts
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const available = await checkAPIStatus();
        setIsAvailable(available);
      } catch (error) {
        console.error('Error checking API availability:', error);
        setIsAvailable(false);
      }
    };

    checkAvailability();
  }, []);

  // Track when the assistant is opened
  useEffect(() => {
    if (isOpen) {
      const now = Date.now();
      setOpenTime(now);
    } else if (openTime !== null) {
      const duration = Date.now() - openTime;
      trackAssistantClosed(duration, messageCount);
      setOpenTime(null);
    }
  }, [isOpen, openTime, messageCount]);

  // Reset message count when the assistant is closed
  useEffect(() => {
    if (!isOpen) {
      setMessageCount(0);
    }
  }, [isOpen]);

  // Handle opening the assistant
  const openAssistant = (source: 'floating_button' | 'navbar' | 'auto') => {
    if (!isOpen && isAvailable) {
      setIsOpen(true);
      trackAssistantOpened(source);
    }
  };

  // Handle closing the assistant
  const closeAssistant = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  // Handle updating user memory
  const updateUserMemory = (newMemory: Partial<UserMemory>) => {
    setUserMemory((prev) => ({
      ...prev,
      ...newMemory,
    }));
  };

  // Check current path to see if we should extract info for user memory
  useEffect(() => {
    // Extract category from URL path
    const extractCategoryFromPath = () => {
      const pathParts = location.split('/');
      const categoryIndex = pathParts.findIndex((part) => part === 'insurance');
      
      if (categoryIndex !== -1 && pathParts.length > categoryIndex + 1) {
        const category = pathParts[categoryIndex + 1];
        if (['travel', 'auto', 'pet', 'health'].includes(category)) {
          return category as 'travel' | 'auto' | 'pet' | 'health';
        }
      }
      
      return null;
    };

    const category = extractCategoryFromPath();
    if (category) {
      updateUserMemory({ 
        lastViewedCategory: category 
      });
    }
  }, [location]);

  // Create the context value
  const contextValue: AIAssistantContextValue = {
    isOpen,
    openAssistant,
    closeAssistant,
    isAvailable,
    userMemory,
    updateUserMemory,
  };

  return (
    <AIAssistantContext.Provider value={contextValue}>
      {children}
      
      {/* Render the chat interface when open */}
      {isAvailable && (
        <ChatInterface
          isOpen={isOpen}
          onClose={closeAssistant}
          userMemory={userMemory}
        />
      )}
    </AIAssistantContext.Provider>
  );
}