import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Loader2, AlertCircle, Star, X, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { v4 as uuidv4 } from "uuid";
import { 
  askAssistant, 
  parseWidgetData, 
  AssistantWidgetType,
  GlossaryWidgetData,
  VisualComparisonWidgetData,
  AssistantActionType,
  NavigateToQuoteFlowAction,
  OpenComparisonToolAction,
  FilterPlanResultsAction
} from "@/services/ai-service";
import { useAssistantActions } from "@/hooks/use-assistant-actions";
import { useToast } from "@/components/ui/use-toast";
import AssistantWidget from "@/components/assistant/widgets/AssistantWidget";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { trackEvent } from "@/lib/analytics";
import { EventCategory } from "@/constants/analytics";
import { 
  startAssistantSession, 
  endAssistantSession,
  trackUserMessage,
  trackAssistantResponse,
  trackAssistantAction,
  trackSuggestedPromptClick,
  trackGlossaryTermDisplay,
  trackVisualExplainerDisplay,
  trackQuoteFlowLaunch
} from "@/lib/assistant-analytics";

// Insurance-related suggested questions to assist users
const suggestedQuestions = [
  "What's the best plan for my 8-year-old dog?",
  "Explain what a deductible is",
  "Compare two pet insurance plans",
  "How does travel insurance work?",
  "Do I need rental car coverage?",
  "What health insurance covers pre-existing conditions?"
];

// Initial greeting message from the assistant
const initialGreeting = {
  id: uuidv4(),
  sender: "assistant" as const,
  content: "Hi! I'm Briki. Ask me anything about insurance plans, coverage, or claims and I'll guide you through it.",
  timestamp: new Date().toISOString()
};

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  isLoading?: boolean;
  error?: boolean;
  widgetData?: AssistantWidgetType | null;
}

// Message bubble component with improved styling
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === "user";
  
  // The content is already cleaned by the AI service, so no need to strip JSON
  let displayContent = message.content;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-5"
    >
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
          {/* Avatar */}
          {message.sender === "assistant" ? (
            <Avatar className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-white/25 shadow-md">
              <AvatarImage src="/briki-avatar.svg" alt="Briki Assistant" />
              <AvatarFallback>
                <Bot className="h-5 w-5 text-white" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-9 w-9 bg-gradient-to-br from-emerald-500 to-teal-600 ring-2 ring-white/20 shadow-md">
              <AvatarFallback>
                <User className="h-4 w-4 text-white" />
              </AvatarFallback>
            </Avatar>
          )}
          
          {/* Message bubble */}
          <div 
            className={`rounded-2xl px-5 py-3 shadow-sm ${
              isUser 
                ? "bg-gradient-to-r from-primary to-blue-600 text-white font-medium" 
                : message.error 
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-gray-100 text-gray-800 border border-gray-200/80"
            }`}
          >
            {message.isLoading ? (
              <div className="flex items-center gap-2 py-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <p className="text-sm text-gray-500">Thinking...</p>
              </div>
            ) : message.error ? (
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{displayContent}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm leading-relaxed">{displayContent}</p>
                {message.widgetData && (
                  <div className="mt-4">
                    <AssistantWidget data={message.widgetData} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Interface for memory context
interface UserMemory {
  pet?: {
    type?: string;
    age?: number;
    breed?: string;
    conditions?: string[];
  };
  travel?: {
    destination?: string;
    duration?: string;
    date?: string;
    travelers?: number;
    activities?: string[];
  };
  vehicle?: {
    make?: string;
    model?: string;
    year?: number;
    value?: string;
  };
  health?: {
    age?: number;
    conditions?: string[];
    medications?: string[];
  };
}

interface ChatInterfaceProps {
  placement?: "floating" | "inline";
  autoExpand?: boolean;
  showClose?: boolean;
  onClose?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  placement = "floating",
  autoExpand = false,
  showClose = true,
  onClose
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([initialGreeting]);
  const [isSending, setIsSending] = useState(false);
  const [userMemory, setUserMemory] = useState<UserMemory>({});
  const [actionPending, setActionPending] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [feedbackComment, setFeedbackComment] = useState("");
  const { processAction } = useAssistantActions();
  const { toast } = useToast();
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Initialize analytics session when component mounts
  useEffect(() => {
    if (isExpanded) {
      // Start tracking the assistant session
      startAssistantSession({
        initialMessages: messages.length,
        memoryState: Object.keys(userMemory).length > 0
      });
    }
    
    // End tracking when component unmounts
    return () => {
      if (isExpanded) {
        endAssistantSession({
          totalMessages: messages.length,
          userMessages: messages.filter(m => m.sender === "user").length,
          assistantMessages: messages.filter(m => m.sender === "assistant").length,
          memoryUsed: Object.keys(userMemory).length > 0
        });
      }
    };
  }, [isExpanded]);
  
  // Auto-scroll to the bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, isExpanded]);
  
  // Focus the textarea when expanded
  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isExpanded]);

  // Extract and update user context from messages
  useEffect(() => {
    // Only process if there are messages
    if (messages.length <= 1) return;
    
    // Only process user messages
    const userMessages = messages.filter(m => m.sender === "user");
    if (userMessages.length === 0) return;
    
    // Get the most recent user message
    const lastUserMessage = userMessages[userMessages.length - 1].content.toLowerCase();
    
    // Extract context based on patterns
    // ... (context extraction logic)
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending a message to the OpenAI API
  const handleSendMessage = async () => {
    // Input validation
    if (!inputMessage.trim() || isSending || actionPending) return;
    if (inputMessage.length > 500) {
      toast({
        title: "Message too long",
        description: "Please limit your message to 500 characters.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    // Add user message to the chat
    const userMessage: Message = {
      id: uuidv4(),
      sender: "user",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Track user message analytics
    trackUserMessage(userMessage.content, {
      messageId: userMessage.id,
      memoryContext: Object.keys(userMemory).length > 0,
      conversationLength: messages.length
    });
    
    // Clear input field
    setInputMessage("");
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    
    // Add loading message
    const loadingMessageId = uuidv4();
    const loadingMessage: Message = {
      id: loadingMessageId,
      sender: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      isLoading: true
    };
    
    // Show loading indicator
    setMessages(prev => [...prev, loadingMessage]);
    
    try {
      // Call the API with user message and memory context
      const response = await askAssistant(userMessage.content, userMemory);
      
      // Remove loading message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessageId);
        
        // Create the assistant's response message
        const assistantMessage: Message = {
          id: uuidv4(),
          sender: "assistant",
          content: response.response,
          timestamp: new Date().toISOString(),
          error: !!response.error,
          widgetData: response.widgetData
        };
        
        // Track assistant response analytics
        trackAssistantResponse(
          assistantMessage.content.length,
          !!assistantMessage.widgetData,
          !!response.action,
          {
            messageId: assistantMessage.id,
            hasError: assistantMessage.error || false,
            widgetType: assistantMessage.widgetData?.type || null
          }
        );
        
        // Track specific widget types if they exist
        if (assistantMessage.widgetData) {
          if (assistantMessage.widgetData.type === 'show_glossary') {
            trackGlossaryTermDisplay(
              (assistantMessage.widgetData as GlossaryWidgetData).term,
              { messageId: assistantMessage.id }
            );
          } else if (assistantMessage.widgetData.type === 'show_comparison') {
            trackVisualExplainerDisplay(
              (assistantMessage.widgetData as VisualComparisonWidgetData).title,
              { messageId: assistantMessage.id }
            );
          }
        }
        
        return [...filtered, assistantMessage];
      });
      
      // Process any action from the assistant response
      if (response.action) {
        // Add a small delay to allow the user to read the message before action is processed
        setActionPending(true);
        
        // Track the assistant action for analytics
        trackAssistantAction(response.action.type, {
          actionCategory: (response.action as NavigateToQuoteFlowAction | OpenComparisonToolAction | FilterPlanResultsAction)?.category || null,
          conversationLength: messages.length,
          hasCustomMessage: !!response.action.message
        });
        
        // For specific action types, track more detailed analytics
        if (response.action.type === 'navigate_to_quote_flow') {
          const quoteAction = response.action as NavigateToQuoteFlowAction;
          trackQuoteFlowLaunch(
            quoteAction.category,
            { 
              source: 'assistant',
              hasPreloadData: 'preload' in response.action && !!response.action.preload
            }
          );
        }
        
        // Show a notification that action is being performed
        toast({
          title: "Assistant Action",
          description: response.action.message || "I'm taking the action you requested...",
          duration: 3000
        });
        
        // Execute the action with a small delay for better UX
        setTimeout(() => {
          try {
            const success = processAction(response.action || null);
            
            if (!success) {
              toast({
                title: "Action Failed",
                description: "I couldn't complete that action, but I can still help with your questions.",
                variant: "destructive",
                duration: 3000
              });
            }
          } catch (error) {
            console.error("Error processing action:", error);
            toast({
              title: "Action Error",
              description: "There was a problem completing the requested action.",
              variant: "destructive",
              duration: 3000
            });
          } finally {
            setActionPending(false);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Assistant response error:", error);
      
      // Track the error event
      trackEvent(
        'assistant_error',
        EventCategory.Assistant,
        'API Error',
        undefined
      );
      
      // Remove loading message and show error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessageId);
        
        // Create an error message
        const errorMessage: Message = {
          id: uuidv4(),
          sender: "assistant",
          content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
          timestamp: new Date().toISOString(),
          error: true
        };
        
        return [...filtered, errorMessage];
      });
    } finally {
      setIsSending(false);
    }
  };

  // Handle suggested question click
  const handleSuggestedQuestionClick = (question: string) => {
    // Track this event
    trackSuggestedPromptClick(question, { 
      source: 'assistant', 
      position: suggestedQuestions.indexOf(question)
    });
    
    setInputMessage(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Toggle the assistant expansion state
  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  // Handle the enter key for sending messages
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle textarea input changes, auto-resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    
    // Auto-resize logic
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  // Get memory items for display
  const getMemoryItems = () => {
    const items: { key: string; value: string }[] = [];
    
    if (userMemory.pet?.type) {
      items.push({ key: "Pet Type", value: userMemory.pet.type });
    }
    if (userMemory.pet?.age) {
      items.push({ key: "Pet Age", value: `${userMemory.pet.age} years` });
    }
    if (userMemory.travel?.destination) {
      items.push({ key: "Travel To", value: userMemory.travel.destination });
    }
    if (userMemory.vehicle?.make) {
      items.push({ key: "Vehicle", value: `${userMemory.vehicle.year} ${userMemory.vehicle.make}` });
    }
    if (userMemory.health?.age) {
      items.push({ key: "Age", value: `${userMemory.health.age} years` });
    }
    
    return items;
  };

  // All assistant interactions now route to /ask-briki - no floating UI needed

  // Chat interface component
  const chatContainer = (
    <AnimatePresence>
      {(isExpanded || placement === "inline") && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`bg-card rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden flex flex-col ${
            placement === "floating" 
              ? "fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] z-50" 
              : "w-full h-full"
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-white/20 ring-2 ring-white/20">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Briki Assistant</h3>
                <p className="text-xs text-white/80">Ask me about insurance</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {showClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose || toggleExpand}
                  className="h-8 w-8 text-white/90 hover:bg-white/10 rounded-full"
                >
                  {placement === "floating" ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <X className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          </div>
          
          {/* Messages container */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white"
          >
            {/* Memory display */}
            {Object.keys(userMemory).length > 0 && (
              <div className="mb-4 bg-blue-50 rounded-xl p-3 border border-blue-100">
                <div className="flex items-center text-sm text-blue-700 mb-2 font-medium">
                  <Star className="h-4 w-4 mr-1" /> Briki remembers:
                </div>
                <div className="flex flex-wrap gap-2">
                  {getMemoryItems().map((item, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="bg-white border-blue-200 text-blue-800 px-2 py-1 text-xs"
                    >
                      {item.key}: {item.value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Messages */}
            <div className="space-y-1">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              
              <div ref={messageEndRef} />
            </div>
          </div>
          
          {/* Suggested questions */}
          {messages.length < 3 && (
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="cursor-pointer bg-white hover:bg-primary/5 transition-colors"
                    onClick={() => handleSuggestedQuestionClick(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Input area */}
          <div className="p-3 border-t bg-white">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="resize-none min-h-[50px] max-h-[120px] py-3 px-4 rounded-2xl border-gray-300 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 pr-12 shadow-sm"
                disabled={isSending || actionPending}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isSending || actionPending}
                className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-white"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Only inline placement supported - floating functionality removed
  return chatContainer;
};

export default ChatInterface;