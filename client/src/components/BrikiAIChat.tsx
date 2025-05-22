import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bot, MessageCircle, Shield } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, UserIntentType } from '@/types/chat';
import PlanRecommendationCard from './PlanRecommendationCard';
import AssistantRecommendationModule from './AssistantRecommendationModule';
import { assistantService } from '@/services/assistantService';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/lib/navigation';

interface BrikiAIChatProps {
  initialMessages?: ChatMessage[];
  demoMode?: boolean;
  hideChatInput?: boolean;
}

export default function BrikiAIChat({ 
  initialMessages = [], 
  demoMode = false,
  hideChatInput = false
}: BrikiAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { navigate } = useNavigation();
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isProcessing || demoMode) return;
    
    // Create and add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };
    
    // Create a placeholder for assistant response
    const tempAssistantMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'assistant',
      content: '',
      isLoading: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage, tempAssistantMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    try {
      // Process message with AI service (this will connect to backend in production)
      const response = await assistantService.processMessage({
        message: userMessage.content,
        previousMessages: messages
      });
      
      // Create final assistant message with response data
      const assistantMessage: ChatMessage = {
        id: tempAssistantMessage.id,
        sender: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        detectedIntent: response.detectedIntent,
        isLoading: false
      };
      
      // Add recommendation widget if plans are provided
      if (response.plans && response.plans.length > 0) {
        assistantMessage.widget = {
          type: 'plans',
          plans: response.plans,
          ctaText: `Ver todos los planes de ${getCategoryName(response.detectedIntent)}`,
          ctaLink: `/${response.detectedIntent.split('_')[0]}/plans`
        };
      }
      
      // Add follow-up recommendations if provided
      if (response.followUpRecommendations) {
        assistantMessage.widget = {
          type: 'follow-up-recommendation',
          mainPlan: response.followUpRecommendations.mainPlan,
          relatedPlans: response.followUpRecommendations.relatedPlans
        };
      }
      
      // Update messages, replacing the loading placeholder
      setMessages(prev => 
        prev.map(m => m.id === tempAssistantMessage.id ? assistantMessage : m)
      );
      
    } catch (error) {
      // Handle error
      const errorMessage: ChatMessage = {
        id: tempAssistantMessage.id,
        sender: 'assistant',
        content: 'Lo siento, he tenido un problema procesando tu mensaje. Por favor intenta de nuevo.',
        timestamp: new Date().toISOString(),
        isLoading: false
      };
      
      setMessages(prev => 
        prev.map(m => m.id === tempAssistantMessage.id ? errorMessage : m)
      );
      
      console.error('Error processing message:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Helper to get friendly category name from intent
  const getCategoryName = (intent: UserIntentType): string => {
    switch (intent) {
      case 'auto_insurance': return 'auto';
      case 'travel_insurance': return 'viaje';
      case 'health_insurance': return 'salud';
      case 'pet_insurance': return 'mascotas';
      case 'home_insurance': return 'hogar';
      default: return 'seguro';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Chat Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="flex items-center">
          <Bot className="h-6 w-6 mr-2 text-white" />
          <h3 className="font-semibold text-white">Briki AI Assistant</h3>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="p-5 bg-gray-50 dark:bg-gray-900 h-[600px] overflow-y-auto">
        <div className="space-y-8">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div 
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                layout
              >
                {message.sender === 'user' ? (
                  <div className="flex justify-end mb-4">
                    <div className="bg-blue-600 rounded-2xl py-3 px-4 shadow-sm max-w-xs md:max-w-md">
                      <p className="text-white leading-relaxed">{message.content}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ml-3 flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm">
                      <MessageCircle className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mr-3 flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm">
                        <span className="text-white font-bold text-xs">B</span>
                      </div>
                      
                      {message.isLoading ? (
                        <motion.div 
                          className="bg-white dark:bg-gray-800 rounded-2xl py-3 px-4 shadow-sm max-w-xs md:max-w-md border border-gray-100 dark:border-gray-700"
                          initial={{ opacity: 1 }}
                          animate={{ 
                            opacity: [1, 0.7, 1],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                          }}
                        >
                          <div className="flex space-x-2">
                            <motion.div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                            />
                            <motion.div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                            />
                            <motion.div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                            />
                          </div>
                        </motion.div>
                      ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl py-3 px-4 shadow-sm max-w-xs md:max-w-md border border-gray-100 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{message.content}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Plan recommendations widget */}
                    {!message.isLoading && message.widget?.type === 'plans' && (
                      <div className="ml-[54px] space-y-4">
                        {message.widget.plans.map((plan, planIndex) => (
                          <PlanRecommendationCard
                            key={planIndex}
                            {...plan}
                            delay={0.2 + (planIndex * 0.1)}
                          />
                        ))}
                        
                        {/* CTA button */}
                        {message.widget.ctaText && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 + (message.widget.plans.length * 0.1) + 0.3 }}
                            className="text-center mt-2"
                          >
                            <Button
                              onClick={() => message.widget?.ctaLink ? navigate(message.widget.ctaLink) : null}
                              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 transition-opacity"
                            >
                              {message.widget.ctaText}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    )}
                    
                    {/* Follow-up recommendations */}
                    {!message.isLoading && message.widget?.type === 'follow-up-recommendation' && (
                      <AssistantRecommendationModule
                        mainPlan={message.widget.mainPlan}
                        relatedPlans={message.widget.relatedPlans}
                        title={message.widget.title}
                        subtitle={message.widget.subtitle}
                      />
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Chat Input */}
      {!hideChatInput && (
        <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta de seguros..."
              className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-full py-3 px-4 outline-none text-gray-700 dark:text-gray-300"
              disabled={isProcessing || demoMode}
            />
            <button
              onClick={handleSendMessage}
              disabled={inputValue.trim() === '' || isProcessing || demoMode}
              className={`ml-3 bg-gradient-to-r from-blue-600 to-cyan-500 h-10 w-10 rounded-full flex items-center justify-center text-white ${
                inputValue.trim() === '' || isProcessing || demoMode
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-90 transition-opacity'
              }`}
              aria-label="Enviar mensaje"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          
          {demoMode && (
            <p className="text-sm text-center mt-4 text-gray-500 dark:text-gray-400">
              Inicia sesión para hacer tus propias preguntas y obtener recomendaciones personalizadas.
            </p>
          )}
        </div>
      )}
    </div>
  );
}