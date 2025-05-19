import { useState, useRef, useEffect } from 'react';
import { Send, ArrowDown, User, Bot, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { AIMessage, AIResponse } from '@/types/assistant';
import { sendMessageToAssistant, getAssistantSuggestions, submitAssistantFeedback } from '@/services/ai-service';
import { useAssistantActions } from '@/hooks/use-assistant-actions';
import { trackMessageSent, trackResponseReceived, trackFeedbackGiven } from '@/lib/assistant-analytics';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  onClose: () => void;
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'positive' | 'negative' | null>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { processAction } = useAssistantActions();

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Hello! I\'m your Briki Insurance Assistant. I can help you understand insurance options, explain terms, and guide you through our plans. How can I assist you today?',
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSuggestions([]);
    setIsLoading(true);

    // Track user message in analytics
    trackMessageSent(userMessage.content.length, userMessage.content.includes('?'));

    try {
      const startTime = Date.now();
      
      // Format messages for the API
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      messageHistory.push({
        role: userMessage.role,
        content: userMessage.content
      });

      // Get response from AI
      const response = await sendMessageToAssistant(messageHistory);
      
      const processingTime = Date.now() - startTime;

      // Process any actions from the AI
      if (response.action) {
        const actionResult = processAction(response.action);
        if (actionResult) {
          response.message += `\n\n_${actionResult}_`;
        }
      }

      // Create assistant message
      const assistantMessage: AIMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        widgetData: response.widgetData
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Track response in analytics
      trackResponseReceived(
        assistantMessage.content.length,
        processingTime,
        !!assistantMessage.widgetData
      );
    } catch (error) {
      console.error('Error sending message to assistant:', error);
      
      // Create error message
      const errorMessage: AIMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date().toISOString(),
        error: true
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get a response from the assistant',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

    // If input is long enough and not loading, get suggestions
    if (value.trim().length > 3 && !isLoading) {
      try {
        const suggestions = await getAssistantSuggestions(value.trim());
        setSuggestions(suggestions);
      } catch (error) {
        console.error('Error getting suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle key press events in the input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Use a suggestion
  const useSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Give feedback on a message
  const giveFeedback = async (messageId: string, type: 'positive' | 'negative') => {
    if (feedbackGiven[messageId]) return;

    try {
      await submitAssistantFeedback(messageId, type);
      setFeedbackGiven(prev => ({
        ...prev,
        [messageId]: type
      }));
      
      // Track feedback in analytics
      trackFeedbackGiven(type === 'positive', false);
      
      toast({
        title: 'Thank you!',
        description: 'Your feedback helps us improve.',
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Briki AI Assistant</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
          aria-label="Close Assistant"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900">
        {messages.map(message => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            giveFeedback={giveFeedback}
            feedbackGiven={feedbackGiven[message.id]}
          />
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 animate-pulse mb-4 ml-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
              <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0s" }} />
              <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 pt-2 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-sm"
                onClick={() => useSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-end gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="resize-none min-h-[60px] max-h-[120px]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 flex-shrink-0"
            size="icon"
            aria-label="Send message"
          >
            {isLoading ? <Spinner size="sm" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Press Enter to send, Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: AIMessage;
  giveFeedback: (messageId: string, type: 'positive' | 'negative') => void;
  feedbackGiven: 'positive' | 'negative' | null | undefined;
}

function MessageBubble({ message, giveFeedback, feedbackGiven }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isError = !!message.error;
  
  return (
    <div 
      className={cn(
        "mb-4 max-w-[85%]",
        isUser ? "ml-auto" : "mr-auto"
      )}
    >
      <div className="flex items-start gap-2">
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex-shrink-0 flex items-center justify-center">
            <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
          </div>
        )}
        
        <Card
          className={cn(
            "p-3",
            isUser 
              ? "bg-indigo-500 text-white" 
              : isError 
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" 
                : "bg-white dark:bg-slate-800"
          )}
        >
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
          
          {/* Widget Data would be rendered here */}
          {message.widgetData && (
            <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-700 rounded-md">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(message.widgetData, null, 2)}
              </pre>
            </div>
          )}
          
          {/* Message timestamp */}
          <div className="text-xs mt-2 opacity-70 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </Card>
        
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      
      {/* Feedback buttons for assistant messages */}
      {!isUser && !isError && (
        <div className="flex items-center gap-2 mt-1 ml-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6",
                  feedbackGiven === 'positive' && "text-green-500"
                )}
                onClick={() => giveFeedback(message.id, 'positive')}
                disabled={feedbackGiven !== undefined}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This was helpful</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6",
                  feedbackGiven === 'negative' && "text-red-500"
                )}
                onClick={() => giveFeedback(message.id, 'negative')}
                disabled={feedbackGiven !== undefined}
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This wasn't helpful</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}