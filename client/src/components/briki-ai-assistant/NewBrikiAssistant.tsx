import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { GradientButton } from '../ui';
import { Input } from '../ui/input';
import { Loader2, Send, Bot, RefreshCw, CornerDownLeft, X, Info } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '../../hooks/use-toast';
import { apiRequest } from '../../lib/api';
import { sendMessageToAI } from '../../services/openai-service';
// import type { APIMessage, AIResponse, AssistantMemory } from '@/types/chat';
import WelcomeCard from './WelcomeCard';
import { InsurancePlan } from './NewPlanCard';
import SuggestedQuestions from './SuggestedQuestions';
import InteractiveQuestions from './InteractiveQuestions';
import { detectInsuranceCategory, hasSufficientContext, canShowPlans } from '../../../../shared/context-utils';
import { extractContextFromMessage } from "../../utils/context-utils";
import ChatBubble from './ChatBubble';
import ConversationContainer from './ConversationContainer';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/use-auth';
import { useCompareStore } from '../../store/compare-store';
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
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [missingInfo, setMissingInfo] = useState<string[]>([]);
  const [shownPlanIds, setShownPlanIds] = useState<Set<number>>(new Set());
  
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
    setShownPlanIds(new Set());
    setCurrentCategory(null);
    setMissingInfo([]);
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
      console.log('🔍 DEBUG - Plans assignment:', {
        rawResponse: response,
        hasMessage: !!(response.message || response.response),
        hasSuggestedPlans: !!response.suggestedPlans,
        planCount: response.suggestedPlans?.length || 0,
        planNames: response.suggestedPlans?.map((p: InsurancePlan) => p.name) || [],
        shouldHaveShownPlans: shouldRequestPlans,
        fullResponse: JSON.stringify(response, null, 2)
      });

      // Manejar preguntas sugeridas si falta contexto
      if (response.needsMoreContext && Array.isArray(response.suggestedQuestions) && response.suggestedQuestions.length > 0) {
        setPendingQuestions(response.suggestedQuestions);
        setShowEmptyState('fallback');
      } else {
        setPendingQuestions([]); // Limpiar preguntas si ya no hay
      }
      
      // Update context summary chip data
      if (response.category && response.category !== 'general') {
        setCurrentCategory(response.category);
        if (response.needsMoreContext && response.missingInfo) {
          setMissingInfo(response.missingInfo);
        } else {
          setMissingInfo([]);
        }
      }

      // Inside handleSendMessage, after getting AI response
      console.log('🔍 AI Response:', {
        rawResponse: response,
        hasPlans: !!response.suggestedPlans,
        planCount: response.suggestedPlans?.length || 0,
        plans: response.suggestedPlans
      });

      // Only show plans if context is sufficient
      const finalSuggestedPlans = (!response.needsMoreContext && response.suggestedPlans) ? response.suggestedPlans : [];

      // Filter out already shown plans
      const newPlans = finalSuggestedPlans.filter((plan: InsurancePlan) => !shownPlanIds.has(plan.id));
      
      // Update shown plan IDs
      if (newPlans.length > 0) {
        const newShownIds = new Set(shownPlanIds);
        newPlans.forEach((plan: InsurancePlan) => newShownIds.add(plan.id));
        setShownPlanIds(newShownIds);
      }

      console.log('✅ Final plans state:', {
        plans: newPlans,
        count: newPlans.length,
        firstPlan: newPlans[0],
        needsMoreContext: response.needsMoreContext,
        blockedPlans: response.needsMoreContext && response.suggestedPlans?.length > 0,
        alreadyShownCount: finalSuggestedPlans.length - newPlans.length
      });

      // Update loading message with response and memory
      setMessages((prev: Message[]) => {
        const newMessages = prev.map(msg => 
          msg.isLoading 
            ? {
                ...msg,
                id: `assistant-${Date.now()}`,
                content: response.message || response.response || "No pude generar una respuesta.",
                suggestedPlans: newPlans,
                isLoading: false,
                timestamp: new Date(),
                plansSummary: (newPlans && newPlans.length > 0) 
                  ? `Mostré ${newPlans.length} planes de ${response.category || 'seguros'}` 
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
      console.error('Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack,
        name: (error as Error).name
      });
      
      // Show the actual error message to help debug
      const errorMessage = (error as Error).message || "No pude procesar tu mensaje. Por favor intenta de nuevo.";
      
      toast({
        title: "Error",
        description: errorMessage,
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

              {/* Context Summary Chip */}
              {currentCategory && currentCategory !== 'general' && (
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-blue-50 to-green-50 rounded-full px-4 py-2 shadow-sm border border-blue-200">
                    <Info className="w-3 h-3 text-blue-600" />
                    <span className="font-medium">
                      Detectado: <span className="text-blue-700">{currentCategory}</span>
                      {missingInfo.length > 0 && (
                        <>
                          {' | '}
                          <span className="text-orange-600">Falta: {missingInfo.join(', ')}</span>
                        </>
                      )}
                      {userContext && Object.keys(userContext).length > 0 && (
                        <>
                          {' | '}
                          <span className="text-green-600">
                            {(() => {
                              // Build context summary based on category
                              const contextParts = [];
                              if (currentCategory === 'auto' && userContext.vehicle) {
                                const v = userContext.vehicle;
                                if (v.make) contextParts.push(v.make);
                                if (v.model) contextParts.push(v.model);
                                if (v.year) contextParts.push(v.year);
                              } else if (currentCategory === 'pet') {
                                if (userContext.petType) contextParts.push(userContext.petType);
                                if (userContext.petAge) contextParts.push(`${userContext.petAge} años`);
                                if (userContext.petBreed) contextParts.push(userContext.petBreed);
                              } else if (currentCategory === 'travel') {
                                if (userContext.destination) contextParts.push(`a ${userContext.destination}`);
                                if (userContext.duration) contextParts.push(userContext.duration);
                                if (userContext.travelers) contextParts.push(`${userContext.travelers} viajeros`);
                              } else if (currentCategory === 'health') {
                                if (userContext.age) contextParts.push(`${userContext.age} años`);
                                if (userContext.gender) contextParts.push(userContext.gender);
                              }
                              return contextParts.join(' ');
                            })()}
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Interactive questions block */}
              {pendingQuestions.length > 0 && (
                <InteractiveQuestions 
                  questions={pendingQuestions}
                  onQuestionClick={(response) => {
                    handleSendMessage(response);
                  }}
                />
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
      
      {/* Floating Action Button for reset */}
      {messages.length > 1 && (
        <motion.button
          className="fixed bottom-6 right-6 bg-red-500 rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-red-600 transition-all duration-200 z-50"
          onClick={handleReset}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <RefreshCw className="w-5 h-5 text-white" />
        </motion.button>
      )}
    </div>
  );
};

export default NewBrikiAssistant;