import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { sendMessageToAI, getMockResponse, APIMessage } from '@/services/openai-service';
import WelcomeCard from './WelcomeCard';
import { InsurancePlan } from './PlanCard';

// Lazy load the SuggestedPlans component
const SuggestedPlans = lazy(() => import('./SuggestedPlans'));
import { formatUserContext, extractContextFromMessage, isGenericGreeting } from '@/utils/context-utils';

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

const NewBrikiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [userContext, setUserContext] = useState<any>({});
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

    // Hide welcome card on first real message
    setShowWelcomeCard(false);

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
            };
          }
          return {
            role: msg.role,
            content: msg.content,
          };
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
          content: `Contexto acumulado del usuario: ${contextText}. Usa esta información para dar respuestas más personalizadas y recordar planes previamente sugeridos.`
        } as APIMessage);
      }

      // Get AI response with conversation history
      const response = await sendMessageToAI(messageToSend, conversationHistory);

      // Debug logging for data flow analysis
      console.log('🔍 NewBrikiAssistant - AI Response received:', {
        hasMessage: !!response.message,
        hasSuggestedPlans: !!response.suggestedPlans,
        planCount: response.suggestedPlans?.length || 0,
        planNames: response.suggestedPlans?.map(p => p.name) || [],
        fullResponse: response
      });

      // Update loading message with response and memory
      setMessages(prev => 
        prev.map(msg => 
          msg.isLoading 
            ? {
                ...msg,
                id: `assistant-${Date.now()}`,
                content: response.message || response.response || "No pude generar una respuesta.",
                suggestedPlans: response.suggestedPlans || undefined,
                // FIXED: Enhanced plan summary with provider details
                plansSummary: (response.suggestedPlans && response.suggestedPlans.length > 0)
                  ? response.suggestedPlans.map(plan => `${plan.name} (${plan.provider})`).join(', ')
                  : undefined,
                isLoading: false,
              }
            : msg
        )
      );

      // Smart scroll: only if response has plans or is long, and not a greeting
      if (!isGenericGreeting(messageToSend) && 
          ((response.suggestedPlans?.length || 0) > 0 || (response.message?.length || 0) > 200)) {
        scrollToBottom(true);
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.isLoading 
            ? {
                ...msg,
                id: `error-${Date.now()}`,
                content: "Disculpa, hubo un problema procesando tu mensaje. ¿Podrías intentar de nuevo?",
                isLoading: false,
              }
            : msg
        )
      );

      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el asistente. Verifica tu conexión.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    const isWelcome = message.id === 'welcome-msg';

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-6 w-full`}
      >
        <div
          className={`
            max-w-[85%] rounded-3xl p-5 shadow-sm
            ${isUser 
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' 
              : isWelcome
                ? 'bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 text-gray-800 dark:text-gray-200 border-2 border-blue-100 dark:border-blue-800'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
            }
          `}
        >
          {!isUser && (
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <Bot className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Briki</span>
            </div>
          )}
          
          {message.isLoading ? (
            <div className="flex items-center py-2">
              <Loader2 className="h-5 w-5 mr-3 animate-spin text-blue-600" />
              <span className="text-gray-600 dark:text-gray-400">Analizando tu consulta...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed text-base">
              {message.content}
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-400 mt-2 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        {/* Suggested Plans */}
        {!isUser && message.suggestedPlans && message.suggestedPlans.length > 0 && (
          <div className="w-full mt-4">
            <Suspense fallback={<div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-600">Loading plans...</span>
            </div>}>
              <SuggestedPlans plans={message.suggestedPlans} />
            </Suspense>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
              <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            Briki AI Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 ml-14">
            Tu asistente inteligente para encontrar el seguro perfecto
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm shadow-lg z-10 flex items-center"
        >
          ↑ Hay mensajes anteriores
        </motion.div>
      )}
      
      {/* Messages Area */}
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 p-6"
        onScroll={handleScroll}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Card */}
          {showWelcomeCard && messages.length === 1 && (
            <WelcomeCard 
              onQuestionSelect={(question) => {
                setShowWelcomeCard(false);
                handleSendMessage(question);
              }} 
            />
          )}
          
          {/* Messages */}
          {messages.map(renderMessage)}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input Form */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="max-w-4xl mx-auto">
          <div className="flex space-x-4 p-3 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="¿Qué tipo de seguro necesitas? Cuéntame sobre tu situación..."
              disabled={isLoading}
              className="flex-grow text-base py-4 px-6 rounded-xl border-0 bg-transparent focus:ring-0 placeholder:text-gray-400"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
            💡 Menciona tu ubicación, vehículo, mascota o planes de viaje para recomendaciones más precisas
          </p>
        </form>
      </div>
    </div>
  );
};

export default NewBrikiAssistant;