import React, { useState, useRef, useEffect } from "react";
import { AuthenticatedLayout, ContentWrapper } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { v4 as uuidv4 } from "uuid";

// Sample questions that users might ask
const suggestedQuestions = [
  "What's the best plan for my 8-year-old dog?",
  "Explain what a deductible is",
  "Compare two pet insurance plans",
  "How does travel insurance work?",
  "Do I need rental car coverage?",
  "What health insurance covers pre-existing conditions?"
];

// Sample initial assistant greeting
const initialGreeting = {
  id: uuidv4(),
  sender: "assistant" as const,
  content: "Hi! I'm Briki. Ask me anything about insurance plans, coverage, or claims and I'll guide you through it.",
  timestamp: new Date().toISOString()
};

// Sample assistant responses based on topics (to simulate intelligence)
const sampleResponses = {
  default: "I understand your question. Let me provide some information that might help you make an informed decision about insurance coverage.",
  deductible: "A deductible is the amount you pay for covered healthcare services before your insurance plan starts to pay. For example, with a $2,000 deductible, you pay the first $2,000 of covered services yourself. After you pay your deductible, you usually pay only a copayment or coinsurance for covered services, and your insurance pays the rest.",
  travel: "Travel insurance protects you from financial risks while traveling, such as trip cancellation, medical emergencies, lost luggage, and travel delays. When you purchase a policy, you select the coverage types and limits you need. If an incident occurs during your trip, you file a claim with documentation, and the insurance company reimburses you for covered expenses up to your policy limits.",
  pet: "Pet insurance helps cover veterinary costs when your pet gets sick or injured. Most plans reimburse 70-90% of eligible vet bills after you meet your deductible. Plans typically cover accidents, illnesses, surgeries, medications, and sometimes wellness care. For an 8-year-old dog, look for a policy with good coverage for age-related conditions and consider the premium increases as your pet ages.",
  compare: "When comparing insurance plans, consider these key factors: 1) Premium cost vs. coverage benefits, 2) Deductible amounts, 3) Coverage limits and exclusions, 4) Network restrictions, 5) Customer service reputation, and 6) Claim process efficiency. I recommend creating a spreadsheet to compare these factors side by side for each plan you're considering.",
  rental: "Rental car coverage through your auto insurance or credit card may already protect you, but there are gaps to consider. If your personal auto policy includes collision and comprehensive coverage, it typically extends to rental cars. However, you might want supplemental coverage for: loss of use charges, diminished value claims, or international rentals. Check your existing policy before making a decision.",
  preexisting: "Health insurance plans that cover pre-existing conditions include all Affordable Care Act (ACA) marketplace plans, employer plans, Medicare, and Medicaid. Insurance companies can no longer deny you coverage or charge you more because of pre-existing conditions. However, short-term health plans and some non-ACA plans may still exclude or limit coverage for pre-existing conditions."
};

// Helper function to get a relevant response based on the user's query
function getSimulatedResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("deductible")) return sampleResponses.deductible;
  if (lowerQuery.includes("travel")) return sampleResponses.travel;
  if (lowerQuery.includes("pet") || lowerQuery.includes("dog")) return sampleResponses.pet;
  if (lowerQuery.includes("compare")) return sampleResponses.compare;
  if (lowerQuery.includes("rental")) return sampleResponses.rental;
  if (lowerQuery.includes("pre-existing") || lowerQuery.includes("preexisting")) return sampleResponses.preexisting;
  
  return sampleResponses.default;
}

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  isLoading?: boolean;
}

// Message bubble component for cleaner structure
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === "user";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
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
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {message.isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              <p className="text-sm">Thinking...</p>
            </div>
          ) : (
            <p className="text-sm">{message.content}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function AIAssistantScreen() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([initialGreeting]);
  const [isSending, setIsSending] = useState(false);
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || isSending) return;
    
    setIsSending(true);
    
    // Add user message
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
    
    // Add the loading indicator after a small delay to simulate network request
    setTimeout(() => {
      setMessages(prev => [...prev, loadingMessage]);
    }, 500);
    
    // Simulate assistant response time
    setTimeout(() => {
      // Remove loading message and add real response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessageId);
        
        // Generate a contextual response based on the user's question
        const responseContent = getSimulatedResponse(inputMessage);
        
        const assistantMessage: Message = {
          id: uuidv4(),
          sender: "assistant",
          content: responseContent,
          timestamp: new Date().toISOString()
        };
        
        return [...filtered, assistantMessage];
      });
      
      setIsSending(false);
    }, 2000);
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