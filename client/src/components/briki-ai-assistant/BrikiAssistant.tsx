import { useState } from 'react';
import { Send, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';
import { trackAIAssistantEvent } from '../../hooks/use-analytics';
import { useLocation } from 'wouter';
import { useChatLogic } from '../../hooks/useChatLogic';
import { useToast } from '../../hooks/use-toast';
import { ChatBubble } from './ChatBubble';

export function BrikiAssistant() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const {
    messages,
    input,
    isTyping,
    isUploadingDocument,
    currentSuggestion,
    placeholderHints,
    messagesEndRef,
    setInput,
    sendMessage,
    resetChat,
    sendMessageWithDocument,
  } = useChatLogic();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageWithDocument();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Track message sent
    trackAIAssistantEvent('message_sent', input.substring(0, 50), {
      message_length: input.length
    });
    sendMessageWithDocument();
  };

  const handleReset = () => {
    trackAIAssistantEvent('chat_reset');
    resetChat();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    trackAIAssistantEvent('suggestion_clicked', suggestion);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Briki AI</h1>
                <p className="text-sm text-white/90">Tu asistente inteligente de seguros</p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Empezar de nuevo
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.length === 0 ? (
            <motion.div 
              className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="relative p-8 rounded-full bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border border-blue-200">
                  <Sparkles className="w-16 h-16 text-blue-600" />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="max-w-md space-y-4"
              >
                <h2 className="text-2xl font-semibold text-gray-900">
                  ¿En qué puedo ayudarte hoy?
                </h2>
                <p className="text-gray-600">
                  Pregúntame sobre seguros de auto, viaje, salud o mascotas. 
                  Estoy aquí para ayudarte a encontrar la mejor protección.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                  {[
                    { icon: "🚗", text: "Seguro de auto", query: "Necesito un seguro para mi auto" },
                    { icon: "✈️", text: "Seguro de viaje", query: "Voy a viajar y necesito un seguro" },
                    { icon: "🏥", text: "Seguro de salud", query: "Busco un plan de salud familiar" },
                    { icon: "🐾", text: "Seguro de mascota", query: "Quiero asegurar a mi mascota" }
                  ].map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      onClick={() => {
                        setInput(suggestion.query);
                        sendMessageWithDocument();
                      }}
                      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left group"
                    >
                      <span className="text-2xl">{suggestion.icon}</span>
                      <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                        {suggestion.text}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "flex",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-6 py-4",
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' 
                        : 'bg-white border border-gray-200 shadow-sm'
                    )}>
                      <ChatBubble
                        role={message.role}
                        content={message.content}
                        type={message.type}
                        metadata={message.metadata}
                        suggestions={message.suggestions}
                        onSuggestionClick={handleSuggestionClick}
                        timestamp={message.timestamp}
                      />
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">
                          Briki está escribiendo...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={messages.length === 0 ? placeholderHints[currentSuggestion] : "Escribe tu mensaje..."}
                className="resize-none bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl min-h-[56px] max-h-[200px] pr-4"
                rows={1}
                disabled={isTyping || isUploadingDocument}
              />
            </div>
            <Button
              type="submit"
              disabled={(!input.trim()) || isTyping || isUploadingDocument}
              className="h-[56px] px-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
            >
              {isTyping || isUploadingDocument ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BrikiAssistant; 