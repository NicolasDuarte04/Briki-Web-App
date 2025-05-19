import React, { useState, useRef, useEffect } from "react";
import { AuthenticatedLayout, ContentWrapper } from "../components/layout";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Bot, Send, User, Loader2, AlertCircle, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
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
} from "../services/ai-service";
import { useAssistantActions } from "../hooks/use-assistant-actions";
import { useToast } from "../components/ui/use-toast";
import AssistantWidget from "../components/assistant/widgets/AssistantWidget";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { trackEvent, EventCategory } from "../lib/analytics";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={`flex items-start gap-2 max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
          {/* Avatar */}
          {message.sender === "assistant" ? (
            <Avatar className="h-10 w-10 bg-primary/10 ring-2 ring-primary/20">
              <AvatarImage src="/briki-avatar.svg" alt="Briki Assistant" />
              <AvatarFallback>
                <Bot className="h-5 w-5 text-primary" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8 bg-gray-100">
              <AvatarFallback>
                <User className="h-4 w-4 text-gray-600" />
              </AvatarFallback>
            </Avatar>
          )}
          
          {/* Message bubble */}
          <div 
            className={`rounded-2xl px-4 py-2 ${
              isUser 
                ? "bg-primary text-white" 
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
      
      {/* Render widget if available */}
      {message.sender === "assistant" && message.widgetData && (
        <div className="mt-2 ml-10">
          <AssistantWidget data={message.widgetData} />
        </div>
      )}
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
          content: "Hmm, I couldn't get that just now. Want to try rephrasing or ask something else?",
          timestamp: new Date().toISOString(),
          error: true
        };
        
        return [...filtered, errorMessage];
      });
      
      // Show error notification
      toast({
        title: "Assistant Error",
        description: "Failed to get a response from the assistant.",
        variant: "destructive"
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
    <AuthenticatedLayout>
      <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
        {/* Header section with gradient background */}
        <div className="bg-gradient-to-br from-primary/90 to-secondary/90 text-white py-6 sticky top-0 z-10 shadow-md">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.h1 
              className="text-2xl md:text-3xl font-bold tracking-tight mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Briki AI Assistant
            </motion.h1>
            <motion.p 
              className="text-base md:text-lg opacity-90 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Ask anything about insurance. We'll guide you step by step.
            </motion.p>

            {/* Suggested questions */}
            <motion.div 
              className="flex flex-wrap gap-2 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {suggestedQuestions.map((question, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Badge 
                    variant="outline"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/40 cursor-pointer px-3 py-1.5 text-sm"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
        
        {/* Main content with messages */}
        <ContentWrapper variant="white" className="flex-1 pb-28 pt-4">
          <div className="h-full flex flex-col">
            {/* Messages area */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-4 py-4 max-h-[calc(100vh-16rem)] min-h-[300px]"
            >
              {messages.length === 1 ? (
                <div className="flex justify-center mb-8">
                  <div className="text-center max-w-md mx-auto">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5 mx-auto border-2 border-primary/20 shadow-lg">
                      <img src="/briki-avatar.svg" alt="Briki Assistant" className="w-16 h-16" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 mb-3">
                      Welcome to Your Briki Assistant
                    </h3>
                    <p className="text-gray-600 text-sm mb-5">
                      I'm here to help you find the perfect insurance for your needs. I can explain coverage options, compare plans, or guide you through the application process.
                    </p>
                    <p className="text-gray-700 text-sm font-medium">
                      What would you like help with today?
                    </p>
                  </div>
                </div>
              ) : (
                /* Memory panel that appears during conversation */
                Object.keys(userMemory).length > 0 && (
                  <div className="mb-4 mx-auto max-w-md">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center mb-2">
                        <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex justify-between w-full">
                          <span className="text-xs font-medium text-blue-700">Briki remembers:</span>
                          <button 
                            onClick={() => setUserMemory({})} 
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
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
                            <span className="block w-2 h-2 rounded-full bg-blue-400 mt-1.5 mr-2"></span>
                            <span>
                              {userMemory.pet.type && `You have a ${userMemory.pet.age ? `${userMemory.pet.age}-year-old ` : ''}${userMemory.pet.type}`}
                              {userMemory.pet.breed && ` (${userMemory.pet.breed})`}
                            </span>
                          </div>
                        )}
                        {userMemory.travel && (
                          <div className="flex items-start">
                            <span className="block w-2 h-2 rounded-full bg-green-400 mt-1.5 mr-2"></span>
                            <span>
                              {userMemory.travel.destination && `Planning travel to ${userMemory.travel.destination}`}
                              {userMemory.travel.duration && ` for ${userMemory.travel.duration}`}
                            </span>
                          </div>
                        )}
                        {userMemory.vehicle && (
                          <div className="flex items-start">
                            <span className="block w-2 h-2 rounded-full bg-purple-400 mt-1.5 mr-2"></span>
                            <span>
                              {userMemory.vehicle.year && userMemory.vehicle.make && `You have a ${userMemory.vehicle.year} ${userMemory.vehicle.make}`}
                              {userMemory.vehicle.model && ` ${userMemory.vehicle.model}`}
                            </span>
                          </div>
                        )}
                        {userMemory.health && (
                          <div className="flex items-start">
                            <span className="block w-2 h-2 rounded-full bg-red-400 mt-1.5 mr-2"></span>
                            <span>
                              {userMemory.health.age && `You are ${userMemory.health.age} years old`}
                              {userMemory.health.conditions && userMemory.health.conditions.length > 0 && 
                                ` with ${userMemory.health.conditions.join(', ')}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
              
              <AnimatePresence>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messageEndRef} />
              </AnimatePresence>

              {/* Feedback Component */}
              <AnimatePresence>
                {showFeedback && !feedbackSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6 mb-6 mx-auto max-w-md"
                  >
                    <Card className="border-2 border-primary/20 shadow-md">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-2">
                        <CardTitle className="text-lg">How helpful was the assistant?</CardTitle>
                        <CardDescription>Your feedback helps us improve</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex justify-center space-x-2 mb-4">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => {
                                const stars = document.querySelectorAll('.rating-star');
                                stars.forEach((star, idx) => {
                                  if (idx < rating) {
                                    star.classList.add('text-yellow-500');
                                    star.classList.add('fill-yellow-500');
                                  } else {
                                    star.classList.remove('text-yellow-500');
                                    star.classList.remove('fill-yellow-500');
                                  }
                                });
                              }}
                              className="p-2 rounded-full transition-colors hover:bg-gray-100"
                            >
                              <Star className="h-6 w-6 rating-star" />
                            </button>
                          ))}
                        </div>
                        <Textarea
                          placeholder="What did you like or dislike? (optional)"
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          className="resize-none"
                          rows={2}
                        />
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2 pt-0">
                        <Button
                          variant="outline"
                          onClick={() => setShowFeedback(false)}
                        >
                          Maybe Later
                        </Button>
                        <Button
                          onClick={() => {
                            const filledStars = document.querySelectorAll('.rating-star.fill-yellow-500').length;
                            if (filledStars > 0) {
                              handleFeedbackSubmit(filledStars as 1|2|3|4|5);
                            }
                          }}
                          className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                        >
                          Submit Feedback
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Input area (fixed at bottom) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 md:p-4 shadow-xl z-20">
              <div className="container mx-auto max-w-7xl">
                <div className="flex gap-2 items-end">
                  <div className="flex-1 relative">
                    <Textarea
                      className="resize-none min-h-[50px] max-h-[100px] py-3 px-4 rounded-2xl border-gray-300 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 pr-12 shadow-sm"
                      placeholder="Ask me about insurance..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={isSending}
                    />
                    <Button 
                      className="absolute right-2 bottom-2 p-2 h-auto w-auto bg-gradient-to-br from-primary to-secondary text-white hover:opacity-90 transition-all rounded-full shadow-md"
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isSending}
                    >
                      {isSending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContentWrapper>
      </div>
    </AuthenticatedLayout>
  );
}