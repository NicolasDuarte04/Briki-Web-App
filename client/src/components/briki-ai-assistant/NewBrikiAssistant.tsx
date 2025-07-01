import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { GradientButton } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Bot, RefreshCw, CornerDownLeft, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { sendMessageToAI } from '@/services/openai-service';
// import type { APIMessage, AIResponse, AssistantMemory } from '@/types/chat';
import WelcomeCard from './WelcomeCard';
import { InsurancePlan } from './NewPlanCard';
import SuggestedQuestions from './SuggestedQuestions';
import { detectInsuranceCategory, hasSufficientContext } from '@shared/context-utils';
import { extractContextFromMessage } from "@/utils/context-utils";
import ChatBubble from './ChatBubble';
import ConversationContainer from './ConversationContainer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useCompareStore } from '@/store/compare-store';
import { AssistantEmptyState } from './AssistantEmptyState';
import { ComparisonSidebar } from '../comparison/ComparisonSidebar';

// Lazy load the SuggestedPlans component
const SuggestedPlans = lazy(() => import('./SuggestedPlans'));

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  suggestedPlans?: InsurancePlan[];
  plansSummary?: string;
}

// NEW: Context validation helpers to align with backend logic
interface ContextRequirements {
  travel: string[];
  pet: string[];
  auto: string[];
  health: string[];
}

const REQUIRED_CONTEXT: ContextRequirements = {
  travel: ['destination', 'duration', 'travelers'],
  pet: ['petType', 'age', 'breed'],
  auto: ['brand', 'model', 'year'],
  health: ['age', 'familySize', 'conditions']
};

// NEW: Check if message should trigger plan recommendations (aligned with backend logic)
function shouldShowInsurancePlans(message: string, userContext: any, conversationHistory: Message[]): boolean {
  const lowerMessage = message.toLowerCase().trim();

  // Clear intent patterns that indicate readiness for plan recommendations
  const strongIntentPatterns = [
    /quiero (ver|conocer|comparar) planes/,
    /muestra.*planes/,
    /recomienda.*plan/,
    /necesito.*seguro/,
    /busco.*seguro/,
    /qué planes.*tienes/,
    /opciones.*seguro/,
  ];

  const hasStrongIntent = strongIntentPatterns.some(pattern => pattern.test(lowerMessage));

  const allUserText = [
    ...conversationHistory.filter(msg => msg.role === 'user').map(msg => msg.content),
    message
  ].join(' ').toLowerCase();
  const category = detectInsuranceCategory(message);

  if (hasStrongIntent && hasSufficientContext(allUserText, category)) {
    return true;
  }

  // Conservative keyword-based detection with context requirement
  const insuranceKeywords = ["seguro", "insurance", "protección", "cobertura", "plan", "póliza"];
  const categoryKeywords = ["viaje", "auto", "mascota", "salud", "travel", "car", "pet", "health"];
  const actionKeywords = ["necesito", "busco", "quiero", "need", "want", "looking"];

  const hasInsuranceKeyword = insuranceKeywords.some((keyword) => message.includes(keyword));
  const hasCategoryKeyword = categoryKeywords.some((keyword) => message.includes(keyword));
  const hasActionKeyword = actionKeywords.some((keyword) => message.includes(keyword));

  // Only show plans if we have clear intent AND sufficient context
  return hasInsuranceKeyword && 
         hasCategoryKeyword && 
         hasActionKeyword && 
         hasSufficientContext(allUserText, category);
}

// Minimal shape of messages sent to backend
type APIMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const NewBrikiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [userContext, setUserContext] = useState<any>({});
  const [pendingQuestions, setPendingQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isAfterReset, setIsAfterReset] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState<'welcome' | 'no-plans' | 'fallback' | null>('welcome');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const plansToCompare = useCompareStore(state => state.plansToCompare);

  // Suggested prompts
  const suggestedPrompts = [
    "I bought a Vespa in Bogotá, what insurance do you recommend?",
    "Traveling to Europe in July, need travel insurance",
    "My Golden Retriever needs pet insurance",
    "Looking for health insurance for a family of 4"
  ];

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome-msg',
      role: 'assistant',
      content: '¡Hola! Soy Briki, tu asistente personal de seguros. Estoy aquí para ayudarte a encontrar la protección perfecta para lo que más te importa.',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Handle scroll indicator
  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollIndicator(!isNearBottom && scrollTop > 200);
  };

  // Smart scroll function - only when needed
  const scrollToBottom = (force = false) => {
    if (!messagesEndRef.current) return;

    // Only scroll if user is near bottom or if forced
    if (force || !showScrollIndicator) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }, 100);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setUserContext({});
    setIsLoading(false);
    setPendingQuestions([]);
    setIsAfterReset(true);
    setShowEmptyState('welcome');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    toast({
      title: "Conversación reiniciada",
      description: "Puedes empezar de nuevo.",
    });
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input;
    if (!messageToSend.trim()) return;

    setShowWelcomeCard(false);
    setPendingQuestions([]);
    setShowEmptyState(null);

    // Accumulate context across multiple turns - preserve all previous context
    const newContext = extractContextFromMessage(messageToSend, userContext);
    const mergedContext = { ...userContext, ...newContext };
    setUserContext(mergedContext);

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageToSend,
      timestamp: new Date(),
    };

    // Create loading message
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // FIXED: Check if we should show plans based on context sufficiency
      const currentMessages = [...messages, userMessage];
      const allUserText = [
        ...currentMessages.filter(msg => msg.role === 'user').map(msg => msg.content),
      ].join(' ');
      const category = detectInsuranceCategory(messageToSend);
      const sufficientContext = hasSufficientContext(allUserText, category);
      const shouldRequestPlans = shouldShowInsurancePlans(messageToSend, mergedContext, currentMessages);

      console.log('🔍 Context Analysis:', {
        message: messageToSend,
        category: category,
        hasSufficientContext: sufficientContext,
        shouldShowPlans: shouldRequestPlans,
        contextData: mergedContext
      });

      // Enhanced conversation history with plan memory preservation
      const conversationHistory: APIMessage[] = messages
        .filter(msg => !msg.isLoading && msg.id !== 'welcome-msg')
        .map(msg => {
          if (msg.role === 'assistant' && msg.suggestedPlans && msg.suggestedPlans.length > 0) {
            // Include detailed plan context for memory with proper formatting
            const planDetails = msg.suggestedPlans.map((plan: InsurancePlan) => 
              `${plan.name} de ${plan.provider} por ${plan.basePrice} ${plan.currency}`
            ).join(', ');

            return {
              role: msg.role,
              content: `${msg.content}\n\n[Planes previamente recomendados: ${planDetails}]`
            } as APIMessage;
          }
          return {
            role: msg.role,
            content: msg.content,
          } as APIMessage;
        });

      // Enhanced context injection - preserve accumulated user context
      const contextEntries = Object.entries(mergedContext).filter(([_, value]) => value);
      if (contextEntries.length > 0) {
        const contextText = contextEntries.map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            // Format nested objects better for AI context
            const formattedObject = Object.entries(value as Record<string, any>)
              .filter(([_, v]) => v)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ');
            return `${key}: {${formattedObject}}`;
          }
          return `${key}: ${value}`;
        }).join(', ');

        conversationHistory.unshift({
          role: 'system',
          content: `Contexto acumulado del usuario: ${contextText}. ${shouldRequestPlans ? 'El usuario tiene suficiente contexto para ver planes.' : 'El usuario necesita más contexto antes de mostrar planes.'}`
        } as APIMessage);
      }

      // Get AI response with conversation history
      const response = await sendMessageToAI(messageToSend, conversationHistory, mergedContext, isAfterReset);

      // Debug logging for data flow analysis
      console.log('DEBUG - Plans assignment:', {
        rawResponse: response,
        hasMessage: !!(response.message || response.response),
        hasSuggestedPlans: !!response.suggestedPlans,
        planCount: response.suggestedPlans?.length || 0,
        planNames: response.suggestedPlans?.map((p: InsurancePlan) => p.name) || [],
        shouldHaveShownPlans: shouldRequestPlans,
        fullResponse: response
      });

      // Manejar preguntas sugeridas si falta contexto
      if (response.needsMoreContext && Array.isArray(response.suggestedQuestions) && response.suggestedQuestions.length > 0) {
        setPendingQuestions(response.suggestedQuestions);
        setShowEmptyState('fallback');
      } else {
        setPendingQuestions([]); // Limpiar preguntas si ya no hay
      }

      // Inside handleSendMessage, after getting AI response
      console.log('🔍 AI Response:', {
        rawResponse: response,
        hasPlans: !!response.suggestedPlans,
        planCount: response.suggestedPlans?.length || 0,
        plans: response.suggestedPlans
      });

      // Trust backend decision - if plans are returned, show them
      const finalSuggestedPlans = response.suggestedPlans || [];

      console.log('✅ Final plans state:', {
        plans: finalSuggestedPlans,
        count: finalSuggestedPlans.length,
        firstPlan: finalSuggestedPlans[0]
      });

      // Update loading message with response and memory
      setMessages((prev: Message[]) => {
        const newMessages = prev.map(msg => 
          msg.isLoading 
            ? {
                ...msg,
                id: `assistant-${Date.now()}`,
                content: response.message || response.response || "No pude generar una respuesta.",
                suggestedPlans: finalSuggestedPlans,
                isLoading: false,
                timestamp: new Date(),
                plansSummary: (finalSuggestedPlans && finalSuggestedPlans.length > 0) 
                  ? `Mostré ${finalSuggestedPlans.length} planes de ${response.category || 'seguros'}` 
                  : undefined
              }
            : msg
        );
        console.log('🔄 Updated messages:', newMessages.map(m => ({
          id: m.id,
          hasPlans: !!m.suggestedPlans,
          planCount: m.suggestedPlans?.length || 0
        })));
        return newMessages;
      });

      if (response.memory) {
        setUserContext((prev: any) => ({ ...prev, ...response.memory }));
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No pude procesar tu mensaje. Por favor intenta de nuevo.",
        variant: "destructive",
      });

      // Remove loading message and show error
      setMessages(prev => prev.filter(msg => !msg.isLoading));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  // Input area component
  const inputArea = (
    <div className="space-y-4">
      {/* Prompt Chips */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap gap-2 mb-4"
        >
          {suggestedPrompts.map((prompt, index) => (
            <motion.button
              key={index}
              onClick={() => setInput(prompt)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-2 text-sm bg-gray-100 rounded-full hover:bg-blue-100 transition duration-200 ease-in cursor-pointer"
            >
              {prompt}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Input Field */}
      <div className="flex gap-3 items-end bg-white">
        <div className="flex-1 relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about insurance..."
            disabled={isLoading}
            className="flex-1 pr-12 py-4 text-base rounded-2xl border-2 border-gray-200 focus:border-[#00C7C4] focus:ring-4 focus:ring-[#00C7C4]/10 transition-all duration-200 bg-white shadow-sm"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
            {input.length}/500
          </div>
        </div>
        <GradientButton
          onClick={() => handleSendMessage()}
          disabled={isLoading || !input.trim()}
          size="lg"
          loading={isLoading}
          icon={!isLoading && <Send className="h-5 w-5" />}
          className="rounded-2xl px-6 shadow-sm"
        >
          {isLoading ? "Sending..." : "Send"}
        </GradientButton>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-gray-50">
      <div className="flex flex-col flex-1">
        <div className="relative flex-1 flex flex-col h-full max-h-full bg-white rounded-lg shadow-sm border m-4">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="text-base font-semibold text-gray-800">Asistente Briki</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Comenzar de nuevo
              </Button>
              {plansToCompare.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => {
                  // Implement the logic to open the comparison sidebar
                }}>
                  Comparar Planes
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <ConversationContainer
              className="h-full max-h-[700px] lg:max-h-[800px] mx-auto max-w-5xl"
              input={inputArea}
            >
              {showWelcomeCard && <WelcomeCard onSendMessage={handleSendMessage} />}

              {/* Suggested questions block */}
              {pendingQuestions.length > 0 && (
                <SuggestedQuestions questions={pendingQuestions} />
              )}

              {/* Messages */}
              {messages.map((message) => {
                console.log("🔍 Rendering message:", {
                  id: message.id,
                  role: message.role,
                  hasSuggestedPlans: !!message.suggestedPlans,
                  planCount: message.suggestedPlans?.length || 0,
                  isLoading: message.isLoading
                });
                return (
                  <ChatBubble
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    isLoading={message.isLoading}
                    timestamp={message.timestamp}
                  >
                    {/* Show SuggestedPlans if message has plans */}
                    {message.role === 'assistant' && message.suggestedPlans && message.suggestedPlans.length > 0 && (
                      <ScrollArea className="mt-4 max-h-96">
                        {(() => {
                          console.log('📦 Rendering SuggestedPlans component for message:', message.id, 'with', message.suggestedPlans.length, 'plans');
                          return null;
                        })()}
                        <Suspense fallback={
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2].map((i) => (
                              <div key={i} className="h-60 w-full animate-pulse rounded-2xl bg-gray-100" />
                            ))}
                          </div>
                        }>
                          <SuggestedPlans plans={message.suggestedPlans} />
                        </Suspense>
                      </ScrollArea>
                    )}
                  </ChatBubble>
                );
              })}

              {showEmptyState && (
                <AssistantEmptyState
                  type={showEmptyState}
                  onAction={(query) => {
                    if (inputRef.current) {
                      inputRef.current.value = query;
                      handleSendMessage(query);
                    }
                  }}
                />
              )}
            </ConversationContainer>
          </ScrollArea>

          {/* Removed duplicate bottom input field to avoid two input boxes */}
        </div>
      </div>
    </div>
  );
};

export default NewBrikiAssistant;