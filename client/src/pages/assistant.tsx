import React, { useState, useRef, useEffect } from "react";
import { AuthenticatedLayout, ContentWrapper } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample questions that users might ask
const suggestedQuestions = [
  "What's the best plan for my 8-year-old dog?",
  "Explain what a deductible is",
  "Compare two pet insurance plans",
  "How does travel insurance work?",
  "Do I need rental car coverage?",
  "What health insurance covers pre-existing conditions?"
];

// Sample initial conversation for demonstration
const initialMessages = [
  {
    sender: "assistant",
    message: "Hi! I'm Briki. Ask me anything about insurance plans, coverage, or claims and I'll guide you through it.",
    timestamp: new Date(Date.now() - 60000).toISOString()
  },
  {
    sender: "user",
    message: "What is a deductible?",
    timestamp: new Date(Date.now() - 45000).toISOString()
  },
  {
    sender: "assistant",
    message: "A deductible is the amount you pay for covered healthcare services before your insurance plan starts to pay. For example, with a $2,000 deductible, you pay the first $2,000 of covered services yourself. After you pay your deductible, you usually pay only a copayment or coinsurance for covered services, and your insurance pays the rest.",
    timestamp: new Date(Date.now() - 30000).toISOString()
  },
  {
    sender: "user",
    message: "How does travel insurance work?",
    timestamp: new Date(Date.now() - 15000).toISOString()
  },
  {
    sender: "assistant",
    message: "Travel insurance protects you from financial risks while traveling, such as trip cancellation, medical emergencies, lost luggage, and travel delays. When you purchase a policy, you select the coverage types and limits you need. If an incident occurs during your trip, you file a claim with documentation, and the insurance company reimburses you for covered expenses up to your policy limits.",
    timestamp: new Date().toISOString()
  }
];

interface Message {
  sender: "user" | "assistant";
  message: string;
  timestamp: string;
}

export default function AIAssistantScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle selecting a suggested question
  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
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
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                      {/* Avatar */}
                      {msg.sender === "assistant" ? (
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
                          msg.sender === "assistant" 
                            ? "bg-gray-100 text-gray-800" 
                            : "bg-primary text-white"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  </motion.div>
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
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        // In Phase 3, this will actually send the message
                      }
                    }}
                  />
                  <Button 
                    className="self-end bg-gradient-to-br from-primary to-secondary text-white hover:opacity-90 transition-all shadow-md"
                  >
                    <Send className="h-5 w-5" />
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