import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, XIcon, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { ApiStatusCheck } from './api-status-check';
import { useToast } from '@/hooks/use-toast';
import { Message, UserMemory } from '@/types/assistant';
import { aiService } from '@/services/ai-service';
import { useAssistantActions } from '@/hooks/use-assistant-actions';
import { trackMessageSent, trackResponseReceived, trackFeedbackGiven } from '@/lib/assistant-analytics';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  userMemory?: UserMemory;
  isMinimized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
}

export function ChatInterface({
  userMemory,
  isMinimized = false,
  onClose,
  onMinimize,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { processAction } = useAssistantActions();

  // Add welcome message when the component mounts
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = aiService.generateMessage(
        'assistant',
        "Hello! I'm your Briki insurance assistant. How can I help you today?"
      );
      setMessages([welcomeMessage]);
    }
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !isApiAvailable) return;

    // Create user message
    const userMessage = aiService.generateMessage('user', inputValue);
    
    // Track the user message for analytics
    trackMessageSent(inputValue.length, inputValue.endsWith('?'));
    
    // Create loading message
    const loadingMessage = aiService.generateMessage(
      'assistant',
      'Thinking...',
      true
    );
    
    // Update state
    setMessages([...messages, userMessage, loadingMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Get response from AI
    try {
      const startTime = Date.now();
      const response = await aiService.getAssistantResponse(
        inputValue,
        messages.filter(msg => !msg.isLoading), // Filter out any loading messages
        userMemory
      );
      const responseTime = Date.now() - startTime;
      
      // Track the response for analytics
      trackResponseReceived(
        response.text.length,
        responseTime,
        !!response.widgetData
      );
      
      // Replace loading message with actual response
      const assistantMessage = aiService.generateMessage(
        'assistant',
        response.text,
        false,
        false,
        response.widgetData
      );
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === loadingMessage.id ? assistantMessage : msg
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      // Replace loading message with error message
      const errorMsg = aiService.generateMessage(
        'assistant',
        `I'm having trouble connecting to my services right now. Please try again later. ${errorMessage}`,
        false,
        true
      );
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === loadingMessage.id ? errorMsg : msg
        )
      );
      
      toast({
        title: 'Error',
        description: 'There was a problem getting a response from the assistant.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard input (send on Enter, but allow Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle giving feedback on a message
  const handleFeedback = (messageId: string, isPositive: boolean) => {
    // Implement feedback mechanism here
    trackFeedbackGiven(isPositive, false);
    
    toast({
      title: 'Feedback Recorded',
      description: `Thank you for your ${isPositive ? 'positive' : 'negative'} feedback.`,
      variant: isPositive ? 'default' : 'destructive',
    });
  };

  // Render message bubbles
  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    
    return (
      <div
        key={message.id}
        className={cn(
          'flex w-full mb-4',
          isUser ? 'justify-end' : 'justify-start'
        )}
      >
        <div
          className={cn(
            'max-w-[80%] rounded-lg p-3',
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white'
              : message.error
                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
          )}
        >
          {message.isLoading ? (
            <div className="flex items-center space-x-2">
              <Spinner size="sm" />
              <span>Thinking...</span>
            </div>
          ) : (
            <>
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {/* Show widget if available */}
              {message.widgetData && (
                <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-700 rounded">
                  {/* Widget content would go here */}
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {message.widgetData.type} widget
                  </p>
                </div>
              )}
              
              {/* Show feedback buttons for assistant messages */}
              {!isUser && !message.error && (
                <div className="flex justify-end mt-2 gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full hover:bg-green-100 dark:hover:bg-green-900"
                    onClick={() => handleFeedback(message.id, true)}
                  >
                    <ThumbsUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                    onClick={() => handleFeedback(message.id, false)}
                  >
                    <ThumbsDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  if (isMinimized) {
    return null;
  }

  return (
    <Card className="w-full h-full max-h-[600px] flex flex-col overflow-hidden shadow-lg border-0">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3">
        <h3 className="font-medium">Briki AI Assistant</h3>
        <div className="flex gap-2">
          {onMinimize && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-indigo-700/50"
              onClick={onMinimize}
            >
              <span className="sr-only">Minimize</span>
              <span className="h-1 w-4 bg-white rounded-full block"></span>
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-indigo-700/50"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* API Status Check */}
      <ApiStatusCheck onStatusChange={setIsApiAvailable} />

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {/* Input Area */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700">
        {isApiAvailable ? (
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              className="shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : <SendIcon className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <div className="text-center text-amber-600 dark:text-amber-500 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
            The AI service is temporarily unavailable. Please try again later.
          </div>
        )}
      </div>
    </Card>
  );
}