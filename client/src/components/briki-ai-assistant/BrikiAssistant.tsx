import { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Home, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';
import NewPlanCard from './NewPlanCard';
import { useAnalytics } from '../../hooks/use-analytics';
import { RealInsurancePlan } from '../../data/realPlans';
import { useLocation } from 'wouter';
import { apiRequest } from '../../lib/api';

interface Plan extends RealInsurancePlan {
  isRecommended?: boolean;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  plans?: Plan[];
  type?: 'text' | 'plans';
}

interface AIResponse {
  message: string;
  suggestedPlans?: Plan[];
}

const STORAGE_KEY = 'briki_chat_history';
const MAX_PLANS_SHOWN = 4;
const MAX_MESSAGE_WIDTH = 'max-w-[75%]';

const PLACEHOLDER_HINTS = [
  "¿Buscas seguro para tu carro?",
  "¿Vas a viajar? Pregúntame sobre seguros.",
  "¿Tu mascota está asegurada?",
  "¿Necesitas un plan de salud familiar?",
  "¿Quieres comparar coberturas?"
];

interface NoPlansFoundProps {
  onShowAlternatives: () => void;
}

const NoPlansFound: React.FC<NoPlansFoundProps> = ({ onShowAlternatives }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center"
  >
    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium mb-2">
      No se encontraron planes con esas características
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      Podemos explorar otras opciones que podrían interesarte
    </p>
    <Button
      variant="outline"
      onClick={onShowAlternatives}
      className="bg-white dark:bg-gray-800"
    >
      Ver otras opciones
    </Button>
  </motion.div>
);

const PlansLoadingPlaceholder: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4"
  >
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 space-y-4 animate-pulse"
      >
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
        </div>
      </div>
    ))}
  </motion.div>
);

export function BrikiAssistant() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [shouldResetContext, setShouldResetContext] = useState(false);
  const [memory, setMemory] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useAnalytics();
  const [, navigate] = useLocation();
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Persist messages to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Rotate suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((current) => 
        current === PLACEHOLDER_HINTS.length - 1 ? 0 : current + 1
      );
    }, 4000); // Slightly longer interval for better readability
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setIsLoadingPlans(true);

    try {
      const responseData = await apiRequest('/api/ai/chat', {
        method: 'POST',
        data: {
          message: input.trim(),
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          memory: memory,
          resetContext: shouldResetContext
        }
      });

      if (shouldResetContext) {
        setShouldResetContext(false);
      }

      // apiRequest throws on error and returns parsed JSON data directly
      const data: AIResponse & { memory?: any } = responseData;
      
      // Add detailed debug logging
      console.log('[BrikiAI] Full API response:', data);
      console.log('[BrikiAI] suggestedPlans raw:', data.suggestedPlans);
      
      // Update memory state with response
      if (data.memory) {
        setMemory(data.memory);
      }
      
      // Normalize plans to ensure 'features' field exists
      const normalizedPlans: Plan[] = Array.isArray(data.suggestedPlans)
        ? data.suggestedPlans.map((p: any) => ({
            ...p,
            features: p.features || p.benefits || [],
          }))
        : [];

      console.log(
        '📦 Suggested plans received:',
        Array.isArray(data.suggestedPlans)
          ? data.suggestedPlans.length
          : 'Invalid or undefined'
      );
      console.log('[BrikiAI] Normalized plans:', normalizedPlans);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };

      const newMessages = [assistantMessage];
      if (normalizedPlans && normalizedPlans.length > 0) {
        newMessages.push({
          id: (Date.now() + 2).toString(),
          content: '',
          role: 'assistant',
          timestamp: new Date(),
          type: 'plans',
          plans: normalizedPlans,
        });
      }

      setMessages(prev => [...prev, ...newMessages]);
      
      if (normalizedPlans && normalizedPlans.length > 0) {
        trackEvent('ai_recommended_plans', {
          category: 'Assistant',
          action: 'RecommendPlans',
          label: 'AI Assistant',
          value: normalizedPlans.length,
          metadata: {
            count: normalizedPlans.length,
            providers: [...new Set(normalizedPlans.map((p: Plan) => p.provider))].join(',')
          }
        });
      }
    } catch (error) {
      console.error('[BrikiAI] API Error:', error);
      console.error('[BrikiAI] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        apiUrl: import.meta.env.VITE_API_URL || 'Using proxy',
        environment: import.meta.env.MODE
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      let userFriendlyMessage = 'Lo siento, hubo un error al procesar tu solicitud.';
      
      // Check for specific error patterns
      if (errorMessage.includes('did not match the expected pattern')) {
        userFriendlyMessage = 'Error de configuración del servidor. Por favor, contacta al soporte técnico.';
        console.error('[BrikiAI] Pattern match error - likely URL validation issue');
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: `${userFriendlyMessage} Error: ${errorMessage}`,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      }]);
    } finally {
      setIsTyping(false);
      setIsLoadingPlans(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
    setMemory({});
    setShouldResetContext(true);
    sessionStorage.removeItem(STORAGE_KEY);
    trackEvent('chat_reset', {
      category: 'Assistant',
      action: 'Reset',
      label: 'Chat Reset'
    });
  };

  const handlePlanClick = (plan: Plan) => {
    trackEvent('plan_click', {
      category: 'Assistant',
      action: 'PlanClick',
      label: plan.provider,
      metadata: {
      plan_id: plan.id,
      provider: plan.provider,
      isRecommended: plan.isRecommended
      }
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    trackEvent('suggestion_clicked', {
      category: 'Assistant',
      action: 'SuggestionClick',
      label: suggestion
    });
  };

  const handleShowAlternatives = () => {
    setInput("¿Qué otros tipos de seguros me recomiendas?");
    handleSubmit(new Event('submit') as any);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">

      {/* Chat Window */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6 rounded-lg"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center h-full text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full blur-xl" />
              <div className="relative p-6 rounded-full bg-gradient-to-br from-blue-600/5 to-cyan-500/5 dark:from-blue-600/30 dark:to-cyan-500/30 border border-blue-100 dark:border-blue-800">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                    Briki
                  </h2>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Tu asistente de seguros
                  </p>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="max-w-md space-y-6"
            >
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Pregúntame sobre seguros de auto, viaje, salud o mascotas. 
                Estoy aquí para ayudarte a encontrar la mejor protección.
              </p>
              
              <div className="h-[40px] relative">
                <AnimatePresence mode="wait">
                  <motion.button
                    key={currentSuggestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleSuggestionClick(PLACEHOLDER_HINTS[currentSuggestion])}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-lg font-medium cursor-pointer"
                  >
                    {PLACEHOLDER_HINTS[currentSuggestion]}
                  </motion.button>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className={cn(
                  "flex",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}>
                  <div
                    className={cn(
                      MAX_MESSAGE_WIDTH,
                      "rounded-lg px-4 py-2",
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                        : 'bg-white dark:bg-gray-800 shadow-sm border border-blue-100 dark:border-blue-800'
                    )}
                    role={message.role === 'assistant' ? 'status' : 'none'}
                  >
                    {message.content}
                  </div>
                </div>

                {/* Render plans if present */}
                {message.type === 'plans' && (
                  <>
                    {(() => {
                      console.log('[BrikiAI] Rendering message with type=plans:', message.plans?.length, message.plans);
                      return null;
                    })()}
                    {isLoadingPlans ? (
                      <PlansLoadingPlaceholder />
                    ) : message.plans && message.plans.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4"
                  >
                    {message.plans.slice(0, MAX_PLANS_SHOWN).map((plan) => (
                      <NewPlanCard
                        key={plan.id}
                        plan={{
                          id: typeof plan.id === 'string' ? parseInt(plan.id) : plan.id,
                          name: plan.name,
                          category: plan.category,
                          provider: plan.provider,
                          basePrice: plan.basePrice || (plan.price ? parseFloat(plan.price.replace(/[^0-9.-]+/g, '')) : 0),
                          currency: plan.currency || 'COP',
                          benefits: plan.features || [],
                          isExternal: plan.isExternal,
                          externalLink: plan.externalLink
                        }}
                        onViewDetails={(planId) => {
                          handlePlanClick(plan);
                          // Navigate to plan details if needed
                        }}
                        onQuote={(planId) => {
                          handlePlanClick(plan);
                          // Navigate to quote page if needed
                          navigate(`/insurance/${plan.category}/quote?planId=${planId}`);
                        }}
                      />
                    ))}
                  </motion.div>
                    ) : (
                      <NoPlansFound onShowAlternatives={handleShowAlternatives} />
                    )}
                  </>
                )}
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
                role="status"
                aria-label="Briki está escribiendo"
              >
                <div className={cn(
                  MAX_MESSAGE_WIDTH,
                  "bg-white dark:bg-gray-800 rounded-lg px-4 py-2 flex items-center space-x-2 shadow-sm border border-blue-100 dark:border-blue-800"
                )}>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Buscando las mejores opciones...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-lg">
        {/* Reset Button - Absolute Position */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          aria-label="Comenzar nueva conversación"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Comenzar de nuevo
        </Button>

        <div className="max-w-4xl mx-auto pl-44">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={PLACEHOLDER_HINTS[currentSuggestion]}
              maxLength={500}
              rows={1}
              className="flex-1 resize-none bg-gray-50 dark:bg-gray-800 border-0 focus-visible:ring-2 focus-visible:ring-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              aria-label="Mensaje para Briki"
            />
            <Button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-600/25 text-white transition-all disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-cyan-500"
              aria-label="Enviar mensaje"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar mensaje</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BrikiAssistant; 