import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ChatInterface } from '@/components/ai-assistant';
import ApiStatusCheck from '@/components/ai-assistant/api-status-check';
import { Badge } from '@/components/ui/badge';
import { MessageSquareDashed, Bot } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { trackEvent, EventCategory } from '@/lib/analytics';

interface AIAssistantContextType {
  isOpen: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  isApiAvailable: boolean | null;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

interface AIAssistantProviderProps {
  children: ReactNode;
}

export const AIAssistantProvider: React.FC<AIAssistantProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Handle API availability changes
  const handleApiStatusChange = (isAvailable: boolean) => {
    setIsApiAvailable(isAvailable);
    
    // Show a toast message when the API status changes to unavailable
    if (!isAvailable) {
      toast({
        title: "AI Assistant Limited",
        description: "Our AI service is experiencing issues. Basic features remain available.",
        variant: "warning",
        duration: 5000
      });
      
      // Track this event
      trackEvent(
        'ai_assistant_unavailable',
        EventCategory.ERROR,
        'api_unavailable'
      );
    }
  };

  // When the component mounts, check if we should auto-open the assistant
  useEffect(() => {
    // You could add logic to auto-open based on user preferences or other factors
    const shouldAutoOpen = false; // Default to closed
    if (shouldAutoOpen) {
      setIsOpen(true);
    }
  }, []);

  // Assistant control functions
  const openAssistant = () => {
    setIsOpen(true);
    trackEvent('assistant_opened', EventCategory.ENGAGEMENT);
  };
  
  const closeAssistant = () => {
    setIsOpen(false);
    trackEvent('assistant_closed', EventCategory.ENGAGEMENT);
  };
  
  const toggleAssistant = () => {
    setIsOpen(prev => {
      const newState = !prev;
      trackEvent(
        newState ? 'assistant_opened' : 'assistant_closed', 
        EventCategory.ENGAGEMENT
      );
      return newState;
    });
  };

  return (
    <AIAssistantContext.Provider 
      value={{ 
        isOpen, 
        openAssistant, 
        closeAssistant, 
        toggleAssistant,
        isApiAvailable
      }}
    >
      {/* Hidden API status check that updates the state but doesn't show UI */}
      <ApiStatusCheck 
        onStatusChange={handleApiStatusChange}
        showIndicator={false} 
      />
      
      {/* Rest of the app */}
      {children}
      
      {/* AI Assistant interface */}
      {isApiAvailable !== false ? (
        <ChatInterface
          placement="floating"
          autoExpand={isOpen}
          showClose={true}
          onClose={closeAssistant}
        />
      ) : (
        // Fallback for when API is unavailable
        isOpen && (
          <div className="fixed bottom-6 right-6 w-[350px] bg-white rounded-xl shadow-xl border border-gray-200 z-50">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-gray-500" />
                <h3 className="font-medium">Briki Assistant</h3>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Limited Mode
              </Badge>
            </div>
            <div className="p-6 text-center">
              <MessageSquareDashed className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <h4 className="text-base font-medium mb-1">AI Assistant Unavailable</h4>
              <p className="text-sm text-gray-500 mb-4">
                Our AI service is currently unavailable. We're working to restore full functionality.
              </p>
              <p className="text-xs text-gray-400 mb-4">
                You can still use all other Briki features and we'll have the assistant back online soon.
              </p>
              <button 
                className="w-full py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                onClick={closeAssistant}
              >
                Close
              </button>
            </div>
          </div>
        )
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