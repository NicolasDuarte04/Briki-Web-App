import React, { useState, useRef, useEffect } from "react";
import { AuthenticatedLayout } from "../components/layout";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Bot, Send, User, Loader2, AlertCircle, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { v4 as uuidv4 } from "uuid";
import { 
  askAssistant, 
  AssistantWidgetType,
  GlossaryWidgetData,
  VisualComparisonWidgetData,
  AssistantActionType,
  NavigateToQuoteFlowAction,
  OpenComparisonToolAction,
  FilterPlanResultsAction
} from "../services/ai-service";
import { useAssistantActions } from "../hooks/use-assistant-actions";
import { useToast } from "../components/ui/use-toast";
import AssistantWidget from "../components/assistant/widgets/AssistantWidget";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { trackEvent } from "../lib/analytics";
import { EventCategory } from "../constants/analytics";
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
} from "../lib/assistant-analytics";

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

// Message bubble component for cleaner structure
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === "user";
  
  // The content is already cleaned by the AI service, so no need to strip JSON
  let displayContent = message.content;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-5"
    >
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={`flex items-start gap-2 max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
          {/* Avatar */}
          {message.sender === "assistant" ? (
            <Avatar className="h-8 w-8 bg-primary/5 shrink-0">
              <AvatarImage src="/briki-avatar.svg" alt="Briki Assistant" />
              <AvatarFallback>
                <Bot className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8 bg-gray-100 shrink-0">
              <AvatarFallback>
                <User className="h-4 w-4 text-gray-600" />
              </AvatarFallback>
            </Avatar>
          )}
          
          {/* Message bubble */}
          <div 
            className={`rounded-2xl px-4 py-2 ${
              isUser 
                ? "bg-primary/10 text-gray-800" 
                : message.error 
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {message.isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <p className="text-sm">Thinking...</p>
              </div>
            ) : message.error ? (
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{displayContent}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm">{displayContent}</p>
                {message.widgetData && (
                  <div className="mt-3">
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

export default function AIAssistantScreen() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([initialGreeting]);
  const [isSending, setIsSending] = useState(false);
  const [userMemory, setUserMemory] = useState<UserMemory>({});
  const [actionPending, setActionPending] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState("");
  const { processAction } = useAssistantActions();
  const { toast } = useToast();
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize analytics session when component mounts
  useEffect(() => {
    // Start tracking the assistant session
    startAssistantSession({
      initialMessages: messages.length,
      memoryState: Object.keys(userMemory).length > 0
    });
    
    // End tracking when component unmounts
    return () => {
      endAssistantSession({
        totalMessages: messages.length,
        userMessages: messages.filter(m => m.sender === "user").length,
        assistantMessages: messages.filter(m => m.sender === "assistant").length,
        memoryUsed: Object.keys(userMemory).length > 0
      });
    };
  }, []);
  
  // Show feedback prompt after multiple user interactions
  useEffect(() => {
    // Only show feedback after 3 or more user messages and not already submitted
    const userMessageCount = messages.filter(m => m.sender === "user").length;
    if (userMessageCount >= 3 && !feedbackSubmitted && !showFeedback) {
      setShowFeedback(true);
    }
  }, [messages, feedbackSubmitted, showFeedback]);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
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
    
    // Pet insurance context
    const petTypeMatch = lastUserMessage.match(/my\s+(\w+)\s+(?:pet|dog|cat|bird|hamster)/i);
    if (petTypeMatch) {
      setUserMemory(prev => ({
        ...prev,
        pet: {
          ...prev.pet,
          type: petTypeMatch[1].toLowerCase()
        }
      }));
    }
    
    const petAgeMatch = lastUserMessage.match(/(\d+)[\s-]year[\s-]old\s+(?:pet|dog|cat|bird|hamster)/i);
    if (petAgeMatch) {
      setUserMemory(prev => ({
        ...prev,
        pet: {
          ...prev.pet,
          age: parseInt(petAgeMatch[1])
        }
      }));
    }
    
    // Travel context
    const travelMatch = lastUserMessage.match(/(?:trip|travel|going)\s+to\s+(\w+)/i);
    if (travelMatch) {
      setUserMemory(prev => ({
        ...prev,
        travel: {
          ...prev.travel,
          destination: travelMatch[1]
        }
      }));
    }
    
    const travelDurationMatch = lastUserMessage.match(/(?:for|duration|stay(?:ing)?)\s+(?:of\s+)?(\d+)\s+(?:days|weeks|months)/i);
    if (travelDurationMatch) {
      setUserMemory(prev => ({
        ...prev,
        travel: {
          ...prev.travel,
          duration: `${travelDurationMatch[1]} ${travelDurationMatch[2] || 'days'}`
        }
      }));
    }
    
    // Vehicle context
    const vehicleMatch = lastUserMessage.match(/(?:my|have a|drive a|own a)\s+(\d{4})\s+(\w+)/i);
    if (vehicleMatch) {
      setUserMemory(prev => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          year: parseInt(vehicleMatch[1]),
          make: vehicleMatch[2]
        }
      }));
    }
    
    // Health context
    const healthConditionMatch = lastUserMessage.match(/(diabetes|heart disease|asthma|allergy|cancer|arthritis)/gi);
    if (healthConditionMatch) {
      const conditions = Array.from(new Set(healthConditionMatch.map(c => c.toLowerCase())));
      setUserMemory(prev => ({
        ...prev,
        health: {
          ...prev.health,
          conditions: [...(prev.health?.conditions || []), ...conditions]
        }
      }));
    }
    
    const ageMatch = lastUserMessage.match(/(?:i am|i'm)\s+(\d+)(?:\s+years old|\s+year old)?/i);
    if (ageMatch) {
      setUserMemory(prev => ({
        ...prev,
        health: {
          ...prev.health,
          age: parseInt(ageMatch[1])
        }
      }));
    }
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
            hasError: assistantMessage.error,
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
      
      // Track the error event using the regular tracking method
      trackEvent(
        'assistant_error',
        EventCategory.ERROR,
        'API Error',
        undefined,
        {
          sessionId: uuidv4(),
          errorType: 'api_error',
          messageLength: inputMessage.trim().length,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      );
      
      // Handle error - remove loading message and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessageId);
        
        const errorMessage: Message = {
          id: uuidv4(),
          sender: "assistant",
          content: "I'm sorry, but I encountered an error processing your request. Please try again.",
          timestamp: new Date().toISOString(),
          error: true
        };
        
        return [...filtered, errorMessage];
      });
    } finally {
      setIsSending(false);
    }
  };

  // Handle selecting a suggested question
  const handleSuggestedQuestion = (question: string) => {
    // Track when a user clicks on a suggested question
    trackSuggestedPromptClick(question, {
      conversationLength: messages.length,
      source: 'suggestion_chip'
    });
    
    setInputMessage(question);
    // Focus on the textarea after setting the question
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };
  
  // Handle user feedback submission
  const handleFeedbackSubmit = (rating: 1 | 2 | 3 | 4 | 5) => {
    // Track the feedback event with analytics
    trackEvent(
      'assistant_feedback_submitted',
      EventCategory.ENGAGEMENT,
      'Feedback submitted',
      rating,
      {
        comment: feedbackComment,
        conversationLength: messages.length,
        userMessages: messages.filter(m => m.sender === "user").length,
        assistantMessages: messages.filter(m => m.sender === "assistant").length
      }
    );
    
    // Update UI state
    setFeedbackSubmitted(true);
    setShowFeedback(false);
    
    // Thank the user
    toast({
      title: "Thank you for your feedback!",
      description: "Your input helps us improve the assistant.",
      duration: 3000
    });
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Centered Briki logo at top */}
      <div className="py-6 flex justify-center bg-white border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center"
        >
          <img src="/briki-avatar.svg" alt="Briki" className="w-8 h-8 mr-3" />
          <h1 className="text-xl font-semibold text-gray-800">briki</h1>
        </motion.div>
      </div>
      
      {/* Messages container - only this part scrolls */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-0 py-6 mx-auto w-full max-w-2xl"
      >
        {messages.length === 1 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-2xl font-medium text-gray-800 mb-6 mt-8">
              Ask anything about insurance
            </h2>
            
            {/* Suggested questions in a grid layout */}
            <div className="grid grid-cols-1 gap-3 w-full max-w-md mb-10">
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="text-left p-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            {/* Memory panel */}
            {Object.keys(userMemory).length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 mx-auto max-w-lg"
              >
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                  <div className="flex items-center mb-2">
                    <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex justify-between w-full">
                      <span className="text-xs font-medium text-primary">Briki remembers:</span>
                      <button 
                        onClick={() => setUserMemory({})} 
                        className="text-xs text-primary/80 hover:text-primary flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 grid gap-1">
                    {userMemory.pet && (
                      <div className="flex items-start">
                        <span className="block w-2 h-2 rounded-full bg-primary/60 mt-1.5 mr-2"></span>
                        <span>
                          {userMemory.pet.type && `You have a ${userMemory.pet.age ? `${userMemory.pet.age}-year-old ` : ''}${userMemory.pet.type}`}
                          {userMemory.pet.breed && ` (${userMemory.pet.breed})`}
                        </span>
                      </div>
                    )}
                    {userMemory.travel && (
                      <div className="flex items-start">
                        <span className="block w-2 h-2 rounded-full bg-primary/60 mt-1.5 mr-2"></span>
                        <span>
                          {userMemory.travel.destination && `Planning travel to ${userMemory.travel.destination}`}
                          {userMemory.travel.duration && ` for ${userMemory.travel.duration}`}
                        </span>
                      </div>
                    )}
                    {userMemory.vehicle && (
                      <div className="flex items-start">
                        <span className="block w-2 h-2 rounded-full bg-primary/60 mt-1.5 mr-2"></span>
                        <span>
                          {userMemory.vehicle.make && `You drive a ${userMemory.vehicle.year ? `${userMemory.vehicle.year} ` : ''}${userMemory.vehicle.make}`}
                          {userMemory.vehicle.model && ` ${userMemory.vehicle.model}`}
                        </span>
                      </div>
                    )}
                    {userMemory.health && (
                      <div className="flex items-start">
                        <span className="block w-2 h-2 rounded-full bg-primary/60 mt-1.5 mr-2"></span>
                        <span>
                          {userMemory.health.age && `You are ${userMemory.health.age} years old`}
                          {userMemory.health.conditions && userMemory.health.conditions.length > 0 && ` with ${userMemory.health.conditions.join(', ')}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
        
        {/* Conversation messages */}
        {messages.filter(m => !(m.sender === "assistant" && m === messages[0])).map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {/* Feedback card that appears after multiple interactions */}
        <AnimatePresence>
          {showFeedback && !feedbackSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="my-6 mx-auto max-w-md"
            >
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">How am I doing?</CardTitle>
                  <CardDescription className="text-xs">Your feedback helps me improve</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => {
                          document.querySelectorAll('.rating-star').forEach((el, i) => {
                            if (i + 1 <= rating) {
                              el.classList.add('fill-yellow-500');
                            } else {
                              el.classList.remove('fill-yellow-500');
                            }
                          });
                        }}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className="h-5 w-5 rating-star text-gray-300" />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="What did you like or dislike? (optional)"
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="resize-none text-sm"
                    rows={2}
                  />
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-0">
                  <Button
                    variant="outline"
                    onClick={() => setShowFeedback(false)}
                    className="text-xs h-8"
                  >
                    Later
                  </Button>
                  <Button
                    onClick={() => {
                      const filledStars = document.querySelectorAll('.rating-star.fill-yellow-500').length;
                      if (filledStars > 0) {
                        handleFeedbackSubmit(filledStars as 1|2|3|4|5);
                      }
                    }}
                    className="bg-primary text-white hover:bg-primary/90 text-xs h-8"
                  >
                    Submit
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Invisible element to scroll to */}
        <div ref={messageEndRef} className="h-32" />
      </div>
      
      {/* Fixed input area at bottom */}
      <div className="py-5 px-4 bg-white border-t border-gray-100 w-full">
        <div className="max-w-2xl mx-auto relative">
          <Textarea
            className="resize-none w-full rounded-full border-gray-200 py-3 pl-5 pr-12 shadow-sm focus:ring-1 focus:ring-primary focus:border-primary/50"
            placeholder="Ask anything about insurance..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isSending}
            rows={1}
          />
          <Button 
            className="absolute right-2 bottom-2 p-2 h-8 w-8 bg-primary text-white hover:bg-primary/90 transition-all rounded-full"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isSending}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}