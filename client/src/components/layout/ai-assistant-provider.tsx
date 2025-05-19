import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { ChatInterface } from '@/components/ai-assistant/chat-interface';
import { APIStatusCheck } from '@/components/ai-assistant/api-status-check';
import { checkOpenAIStatus } from '@/services/ai-service';
import { trackEvent, EventCategory } from '@/lib/analytics';

// Context type definition
interface AIAssistantContextType {
  isOpen: boolean;
  isAvailable: boolean;
  toggleAssistant: () => void;
  openAssistant: () => void;
  closeAssistant: () => void;
}

// Default context state
const defaultContext: AIAssistantContextType = {
  isOpen: false,
  isAvailable: false,
  toggleAssistant: () => {},
  openAssistant: () => {},
  closeAssistant: () => {},
};

// Create context
const AIAssistantContext = createContext<AIAssistantContextType>(defaultContext);

// Custom hook to use the AI Assistant
export const useAIAssistant = () => useContext(AIAssistantContext);

// Provider props
interface AIAssistantProviderProps {
  children: ReactNode;
}

// Pages where the assistant should not be available
const EXCLUDED_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/profile/edit',
  '/legal/terms',
  '/legal/privacy',
];

export function AIAssistantProvider({ children }: AIAssistantProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  const [isApiChecked, setIsApiChecked] = useState(false);
  const [location] = useLocation();

  // Check if the assistant should be available on the current page
  const isAvailable = !EXCLUDED_PATHS.includes(location) && isApiAvailable;

  // Check API status on initial load
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const status = await checkOpenAIStatus();
        setIsApiAvailable(status.available);
      } catch (error) {
        console.error('Error checking API status:', error);
        setIsApiAvailable(false);
      } finally {
        setIsApiChecked(true);
      }
    };

    if (!isApiChecked) {
      checkApiStatus();
    }
  }, [isApiChecked]);

  // Automatically close the assistant when navigating to a new page
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [location]);

  // Toggle assistant visibility
  const toggleAssistant = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    // Track the toggle event
    trackEvent(
      newState ? 'assistant_opened' : 'assistant_closed', 
      EventCategory.ENGAGEMENT,
      'toggle_button'
    );
  };

  // Open the assistant
  const openAssistant = () => {
    if (!isOpen) {
      setIsOpen(true);
      trackEvent('assistant_opened', EventCategory.ENGAGEMENT, 'explicit_open');
    }
  };

  // Close the assistant
  const closeAssistant = () => {
    if (isOpen) {
      setIsOpen(false);
      trackEvent('assistant_closed', EventCategory.ENGAGEMENT, 'explicit_close');
    }
  };

  return (
    <AIAssistantContext.Provider
      value={{
        isOpen,
        isAvailable,
        toggleAssistant,
        openAssistant,
        closeAssistant,
      }}
    >
      {children}

      {/* API Status Check Component */}
      {!isApiChecked && <APIStatusCheck />}
      
      {/* Assistant Dialog */}
      {isOpen && isAvailable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-950 rounded-lg shadow-xl w-full max-w-xl h-[80vh] overflow-hidden flex flex-col">
            <ChatInterface onClose={closeAssistant} />
          </div>
        </div>
      )}
    </AIAssistantContext.Provider>
  );
}