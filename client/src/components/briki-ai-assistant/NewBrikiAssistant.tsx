import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { sendMessageToAI, getMockResponse, APIMessage } from '@/services/openai-service';
import WelcomeCard from './WelcomeCard';
import { InsurancePlan } from './NewPlanCard';
import SuggestedQuestions from './SuggestedQuestions';
import { detectInsuranceCategory, hasSufficientContext } from '@shared/context-utils';
import { extractContextFromMessage } from "@/utils/context-utils";

// Lazy load the SuggestedPlans component
const SuggestedPlans = lazy(() => import('./SuggestedPlans'));

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  suggestedPlans?: InsurancePlan[];
  // NEW: Add summary for memory
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

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input;
    if (!messageToSend.trim()) return;

    setShowWelcomeCard(false);
    setPendingQuestions([]);

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
            const planDetails = msg.suggestedPlans.map(plan => 
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
      const response = await sendMessageToAI(messageToSend, conversationHistory);

      // Debug logging for data flow analysis
      console.log('🔍 NewBrikiAssistant - AI Response received:', {
        hasMessage: !!(response.message || response.response),
        hasSuggestedPlans: !!response.suggestedPlans,
        planCount: response.suggestedPlans?.length || 0,
        planNames: response.suggestedPlans?.map(p => p.name) || [],
        shouldHaveShownPlans: shouldRequestPlans,
        fullResponse: response
      });

      // Manejar preguntas sugeridas si falta contexto
      if (response.needsMoreContext && Array.isArray(response.suggestedQuestions) && response.suggestedQuestions.length > 0) {
        setPendingQuestions(response.suggestedQuestions);
      } else {
        setPendingQuestions([]); // Limpiar preguntas si ya no hay
      }

      // Trust backend decision - if plans are returned, show them
      const finalSuggestedPlans = response.suggestedPlans;

      // Update loading message with response and memory
      setMessages(prev => 
        prev.map(msg => 
          msg.isLoading 
            ? {
                ...msg,
                id: `assistant-${Date.now()}`,
                content: response.message || response.response || "No pude generar una respuesta.",
                suggestedPlans: finalSuggestedPlans || [],
                isLoading: false,
                timestamp: new Date(),
                plansSummary: (finalSuggestedPlans && finalSuggestedPlans.length > 0) 
                  ? `Mostré ${finalSuggestedPlans.length} planes de ${response.category || 'seguros'}` 
                  : undefined
              }
            : msg
        )
      );

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

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">Briki AI</h3>
            <p className="text-xs text-blue-100">Tu asistente personal de seguros</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-white">En línea</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {showWelcomeCard && <WelcomeCard onSendMessage={handleSendMessage} />}

          {/* Bloque de preguntas sugeridas antes de SuggestedPlans */}
          {pendingQuestions.length > 0 && (
            <SuggestedQuestions questions={pendingQuestions} />
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-auto'
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Pensando...</span>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {/* Mostrar SuggestedPlans solo si el mensaje del asistente tiene planes */}
                    {message.role === 'assistant' && message.suggestedPlans && message.suggestedPlans.length > 0 && (
                      <ScrollArea className="mt-3 max-h-80 pr-3">
                        <Suspense fallback={<div>Cargando planes...</div>}>
                          <SuggestedPlans plans={message.suggestedPlans} />
                        </Suspense>
                      </ScrollArea>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Enhanced Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta sobre seguros..."
              disabled={isLoading}
              className="flex-1 pr-12 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-900"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {input.length}/500
            </div>
          </div>
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Briki está escribiendo...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewBrikiAssistant;