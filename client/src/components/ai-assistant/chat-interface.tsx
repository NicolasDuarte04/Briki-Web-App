import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, SendHorizonal, X, Trash2, RefreshCw, Lightbulb, Bot } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useAIAssistant, type Message } from '@/hooks/use-ai-assistant';
import { cn } from '@/lib/utils';

/**
 * Component for displaying a single chat message
 */
const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  
  // Format the message content with proper line breaks
  const formattedContent = message.content.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < message.content.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex w-full mb-4 items-start",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex flex-col max-w-[70%] space-y-2", // Narrower message bubbles
          isUser ? "items-end" : "items-start"
        )}
      >
        <div className="flex items-center gap-2">
          {!isUser && (
            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
              <Bot size={16} />
            </div>
          )}
          <Badge variant={isUser ? "outline" : "default"} className="h-6">
            {isUser ? 'You' : 'Briki AI'}
          </Badge>
          {isUser && (
            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
              <MessageSquare size={14} />
            </div>
          )}
        </div>
        
        <div
          className={cn(
            "px-4 py-3 rounded-lg",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-muted rounded-tl-none"
          )}
        >
          <div className="text-sm leading-relaxed">
            {message.content === '...' ? (
              <div className="flex items-center space-x-2">
                <div className="animate-pulse w-2 h-2 bg-current rounded-full"></div>
                <div className="animate-pulse w-2 h-2 bg-current rounded-full animation-delay-200"></div>
                <div className="animate-pulse w-2 h-2 bg-current rounded-full animation-delay-400"></div>
              </div>
            ) : (
              formattedContent
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Empty state component when no messages present
 */
const EmptyState = ({ onStartConversation }: { onStartConversation: (message: string) => void }) => {
  const suggestions = [
    "¿Puedes explicar qué cubre el seguro de viaje?",
    "¿Cuál es la diferencia entre seguro de auto completo y de responsabilidad?",
    "¿Cómo funciona el seguro de mascotas?",
    "¿Qué debo buscar en un plan de seguro de salud?",
    "¿Qué es un deducible en seguros?"
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot size={40} className="text-primary" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Asistente IA de Briki</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Soy tu asistente de seguros. Pregúntame lo que quieras sobre planes de seguros,
          opciones de cobertura o términos de seguros.
        </p>
      </div>
      
      <div className="space-y-3 w-full max-w-md">
        <p className="text-sm font-medium text-foreground/80">Intenta preguntar:</p>
        <div className="grid gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-auto py-2 px-3 text-left text-sm"
              onClick={() => onStartConversation(suggestion)}
            >
              <Lightbulb size={14} className="mr-2 text-primary" />
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ChatInterfaceProps {
  initialPrompt?: string;
  placement?: 'bottom-right' | 'bottom-full' | 'inline';
  className?: string;
  showClose?: boolean;
  onClose?: () => void;
  autoExpand?: boolean;
}

/**
 * Main chat interface component
 */
export default function ChatInterface({
  initialPrompt,
  placement = 'bottom-right',
  className = '',
  showClose = true,
  onClose,
  autoExpand = false
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize the AI assistant
  const {
    messages,
    sendMessage,
    clearMessages,
    isLoading
  } = useAIAssistant({
    systemMessage: "You are Briki AI, a helpful assistant for insurance questions."
  });

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Set focus to input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Submit the message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage(input);
    setInput('');
  };

  // Clear chat history
  const handleClearChat = () => {
    clearMessages();
    toast({
      title: "Chat cleared",
      description: "Your conversation has been cleared.",
    });
  };

  // Toggle the expanded state
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  // Handle initial prompt suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    setIsExpanded(true);
    sendMessage(suggestion);
  };

  // Set positioning based on placement prop
  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-full': 'fixed bottom-0 left-0 right-0 z-50',
    'inline': 'relative w-full'
  };

  return (
    <>
      {/* Floating chat bubble when collapsed */}
      {!isExpanded && placement !== 'inline' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${positionClasses[placement]} shadow-glow-lg`}
        >
          <Button
            onClick={toggleExpanded}
            className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/90 shadow-lg"
            aria-label="Open AI Assistant"
          >
            <Bot size={24} />
          </Button>
        </motion.div>
      )}

      {/* Main chat interface */}
      <AnimatePresence>
        {(isExpanded || placement === 'inline') && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              positionClasses[placement],
              placement === 'inline' ? 'h-[500px]' : 'w-[350px] h-[450px]', // Updated size
              className
            )}
          >
            <Card className="shadow-glow-md border-primary/20 backdrop-blur-sm bg-background/90 flex flex-col h-full overflow-hidden">
              <CardHeader className="px-4 py-3 border-b flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">Briki AI Assistant</h3>
                    <p className="text-xs text-muted-foreground">
                      {isLoading ? 'Thinking...' : 'Ready to help'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {messages.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={handleClearChat}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Clear chat</TooltipContent>
                    </Tooltip>
                  )}
                  
                  {showClose && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={placement !== 'inline' ? toggleExpanded : onClose}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow p-0 overflow-hidden">
                {messages.length === 0 ? (
                  <EmptyState onStartConversation={handleSuggestionClick} />
                ) : (
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
              
              <CardFooter className="p-3 pt-2 border-t">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-grow"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!input.trim() || isLoading}
                    className={isLoading ? 'animate-pulse' : ''}
                  >
                    {isLoading ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <SendHorizonal size={18} />
                    )}
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}