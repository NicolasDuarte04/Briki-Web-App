import React, { useState, useRef, useEffect } from "react";
import { AuthenticatedLayout, ContentWrapper } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { v4 as uuidv4 } from "uuid";
import { askAssistant } from "@/services/ai-service";

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

import { extractJsonFromText, type WidgetData } from "@/components/assistant/AssistantWidget";
import { AssistantWidget } from "@/components/assistant/AssistantWidget";

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  isLoading?: boolean;
  error?: boolean;
  widgetData?: WidgetData | null;
}

// Message bubble component for cleaner structure
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === "user";
  
  // Extract content without JSON for rendering
  let displayContent = message.content;
  if (message.sender === "assistant" && message.widgetData) {
    // Remove the JSON part from the display content
    const jsonMatch = message.content.match(/```json\s*({[\s\S]*?})\s*```/);
    if (jsonMatch && jsonMatch.index !== undefined) {
      displayContent = message.content.substring(0, jsonMatch.index).trim();
    }
  }
  
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
            <Avatar className="h-8 w-8 bg-primary/10">
              <AvatarImage src="/briki-bot-avatar.png" />
              <AvatarFallback>
                <Bot className="h-4 w-4 text-primary" />
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
              <p className="text-sm">{displayContent}</p>
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
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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
    if (!inputMessage.trim() || isSending) return;
    if (inputMessage.length > 500) {
      alert("Please limit your message to 500 characters.");
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
      
      // Check if the response contains structured data in JSON format
      const widgetData = extractJsonFromText(response.response);
      
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
          widgetData: widgetData
        };
        
        return [...filtered, assistantMessage];
      });
    } catch (error) {
      // Handle error - remove loading message and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessageId);
        
        const errorMessage: Message = {
          id: uuidv4(),
          sender: "assistant",
          content: "I'm sorry, I encountered a problem while processing your request. Please try again later.",
          timestamp: new Date().toISOString(),
          error: true
        };
        
        return [...filtered, errorMessage];
      });
      
      // Show error notification
      alert("Error: Failed to get a response from the assistant.");
    } finally {
      setIsSending(false);
    }
  };

  // Handle selecting a suggested question
  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    // Focus on the textarea after setting the question
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col h-full min-h-[calc(100vh-6rem)]">
        {/* Header section with gradient background */}
        <div className="bg-gradient-to-br from-primary/90 to-secondary/90 text-white py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.h1 
              className="text-3xl font-bold tracking-tight mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Briki AI Assistant
            </motion.h1>
            <motion.p 
              className="text-lg opacity-90 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Ask anything about insurance. We'll guide you step by step.
            </motion.p>

            {/* Suggested questions */}
            <motion.div 
              className="flex flex-wrap gap-2 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {suggestedQuestions.map((question, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge 
                    variant="outline"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/40 cursor-pointer px-3 py-2 text-sm"
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
        <ContentWrapper variant="white" className="flex-1 pb-24">
          <div className="h-full flex flex-col">
            {/* Messages area */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 mb-4 overflow-y-auto px-4 py-6 max-h-[calc(100vh-16rem)]"
            >
              {messages.length === 1 && (
                <div className="flex justify-center mb-8">
                  <div className="text-center max-w-md mx-auto">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Bot className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Your Personal Insurance Assistant
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      I can help with insurance plans, coverage details, or how to make a claim. Choose a suggestion or type your own question!
                    </p>
                  </div>
                </div>
              )}
              
              <AnimatePresence>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messageEndRef} />
              </AnimatePresence>
            </div>
            
            {/* Input area (fixed at bottom) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
              <div className="container mx-auto max-w-7xl">
                <div className="flex gap-2">
                  <Textarea
                    className="flex-1 resize-none min-h-[50px] max-h-[150px] p-3 focus:ring-1 focus:ring-primary/30 focus:border-primary/50"
                    placeholder="Type your question here..."
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
                    className="self-end bg-gradient-to-br from-primary to-secondary text-white hover:opacity-90 transition-all shadow-md"
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
        </ContentWrapper>
      </div>
    </AuthenticatedLayout>
  );
}