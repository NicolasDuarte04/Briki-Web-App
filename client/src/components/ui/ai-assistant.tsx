import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIAssistantIcon } from "@/components/icons/futuristic-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, Volume2, X } from "lucide-react";

// Define context-aware tips for different pages
export const getTravelInsuranceTips = [
  "Consider your destination's healthcare costs when selecting coverage limits.",
  "Adventure activities like skiing or scuba diving may require additional coverage.",
  "Pre-existing conditions might need special coverage - check policy details.",
  "Trip cancellation protection can save you thousands on expensive trips.",
  "Multi-trip policies might be more economical for frequent travelers."
];

export const getAutoInsuranceTips = [
  "Bundling auto with other policies can save you up to 15% on premiums.",
  "Higher deductibles lower your premium but increase out-of-pocket costs if you file a claim.",
  "Many insurers offer discounts for safe driving histories and anti-theft devices.",
  "Consider gap insurance if your car is leased or financed.",
  "Usage-based insurance might save you money if you're a low-mileage driver."
];

export const getHealthInsuranceTips = [
  "Balance monthly premiums against deductibles and out-of-pocket maximums.",
  "Check if your preferred doctors and hospitals are in-network.",
  "Consider prescription drug coverage if you take regular medications.",
  "HSA-compatible plans offer tax advantages for healthcare savings.",
  "Review coverage for specialized services you might need, like therapy or maternity care."
];

export const getPetInsuranceTips = [
  "Insure your pet when they're young to avoid pre-existing condition limitations.",
  "Check if the policy covers breed-specific conditions that your pet might be prone to.",
  "Annual wellness coverage can help manage routine care costs.",
  "Review waiting periods before coverage begins for different conditions.",
  "Some policies offer multi-pet discounts for households with multiple animals."
];

export const getTripFormTips = [
  "Enter your exact travel dates to get the most accurate coverage options.",
  "Adding your medical conditions helps us find plans with appropriate coverage.",
  "Select your coverage priorities to see plans tailored to your specific needs.",
  "The number of travelers affects your total premium - add everyone who needs coverage.",
  "International trips typically require higher medical coverage limits."
];

export const getComparisonTips = [
  "Compare deductibles across plans - lower deductibles mean higher premiums.",
  "Look for emergency evacuation coverage when traveling to remote destinations.",
  "Pre-existing condition coverage varies widely between insurance providers.",
  "Check if the plan covers adventure activities if you plan to participate in them.",
  "Some plans offer 'cancel for any reason' coverage for maximum flexibility."
];

export const getCheckoutTips = [
  "Double-check all your personal information to ensure accurate coverage.",
  "Policy documents will be sent to the email address you provide.",
  "Your coverage begins at 12:01 AM on your selected start date.",
  "Save your policy number in a secure, accessible location for claims.",
  "Add additional travelers now to avoid complications later."
];

interface AIAssistantProps {
  tips: string[];
  delay?: number;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  autoShow?: boolean;
  contextAware?: boolean;
  formData?: any; // For contextual awareness of form data
  onUserQuery?: (query: string) => void; // Callback for user queries
  helpMode?: boolean; // For help button mode
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  tips,
  delay = 2000,
  position = "bottom-right",
  autoShow = true,
  contextAware = false,
  formData,
  onUserQuery,
  helpMode = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showVoiceSupport, setShowVoiceSupport] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'assistant' | 'user', content: string}[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Check if speech recognition is supported
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setShowVoiceSupport(true);
    }
  }, []);
  
  // Positioning classes
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };
  
  // Auto-show assistant after delay
  useEffect(() => {
    if (autoShow) {
      timeoutRef.current = setTimeout(() => {
        setIsExpanded(true);
        // Add initial message
        if (chatHistory.length === 0) {
          setChatHistory([{ 
            role: 'assistant', 
            content: "Hi there! I'm your Briki AI assistant. How can I help you with your insurance needs today?" 
          }]);
        }
      }, delay);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoShow, delay, chatHistory.length]);
  
  // Context-aware tips based on form data
  useEffect(() => {
    if (contextAware && formData) {
      // Example: If destination is set to a tropical location, suggest relevant tips
      if (formData.destination && ['mexico', 'thailand', 'bali', 'caribbean'].includes(formData.destination.toLowerCase())) {
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: "I notice you're traveling to a tropical destination. Consider adding coverage for water activities and emergency medical evacuation." 
        }]);
      }
      
      // If medical conditions are indicated
      if (formData.hasMedicalConditions === 'yes') {
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: "Since you have pre-existing medical conditions, look for plans that offer coverage for pre-existing conditions or a pre-existing condition waiver." 
        }]);
      }
    }
  }, [contextAware, formData]);
  
  // Typing effect
  useEffect(() => {
    if (isExpanded && tips.length > 0) {
      const currentTipText = tips[currentTip];
      let index = 0;
      setIsTyping(true);
      setTypedText("");
      
      const typingInterval = setInterval(() => {
        if (index < currentTipText.length) {
          setTypedText((prev) => prev + currentTipText.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 30);
      
      return () => clearInterval(typingInterval);
    }
  }, [isExpanded, currentTip, tips]);
  
  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  // Handle voice recognition
  const toggleVoiceRecognition = () => {
    if (!showVoiceSupport) return;
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const startListening = () => {
    setIsListening(true);
    
    // Using window.webkitSpeechRecognition for broader compatibility
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserQuery(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };
  
  const stopListening = () => {
    setIsListening(false);
    // Stop the recognition process
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.stop();
    }
  };
  
  // Handle user query submission
  const handleQuerySubmit = () => {
    if (!userQuery.trim()) return;
    
    // Add user query to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: userQuery }]);
    
    // Process user query
    if (onUserQuery) {
      onUserQuery(userQuery);
    } else {
      // If no callback is provided, add a default response
      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: getDefaultResponse(userQuery) 
        }]);
      }, 500);
    }
    
    // Clear input field
    setUserQuery("");
  };
  
  // Generate default responses based on query keywords
  const getDefaultResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('travel') || lowerQuery.includes('trip')) {
      return "Our travel insurance plans offer comprehensive coverage for medical emergencies, trip cancellations, and lost baggage. Would you like to see some options?";
    } else if (lowerQuery.includes('medical') || lowerQuery.includes('health')) {
      return "Health insurance is essential for covering medical expenses. We offer plans with varying levels of coverage and deductibles. What specific health concerns do you have?";
    } else if (lowerQuery.includes('car') || lowerQuery.includes('auto') || lowerQuery.includes('vehicle')) {
      return "Our auto insurance plans provide coverage for accidents, theft, and liability. Do you need full coverage or just liability insurance?";
    } else if (lowerQuery.includes('pet') || lowerQuery.includes('dog') || lowerQuery.includes('cat')) {
      return "Pet insurance helps cover veterinary costs. We offer plans for accidents, illnesses, and preventive care. What type of pet do you have?";
    } else if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('expensive')) {
      return "Insurance prices vary based on coverage level, deductibles, and personal factors. I can help you find the most cost-effective option for your needs.";
    } else if (lowerQuery.includes('help') || lowerQuery.includes('how')) {
      return "I'm here to help you navigate insurance options. You can ask about specific coverage types, costs, or how to choose the right plan for your needs.";
    } else {
      return "Thanks for your question. I'd be happy to help you find the right insurance coverage. Could you provide more details about what you're looking for?";
    }
  };
  
  // Text-to-speech for accessibility
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]}`}>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg max-w-md w-full backdrop-blur-lg"
            style={{
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5), 0 8px 10px -6px rgba(59, 130, 246, 0.3)"
            }}
          >
            <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-700 flex items-center">
              <AIAssistantIcon className="h-10 w-10" isActive={true} />
              <div className="ml-3">
                <h3 className="text-white font-medium text-base">Briki AI Assistant</h3>
                <p className="text-blue-100 text-xs">Your intelligent insurance guide</p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="ml-auto text-white hover:text-blue-200 transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Close assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Chat container */}
            <div 
              ref={chatContainerRef}
              className="p-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
              style={{ 
                background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
                backdropFilter: "blur(12px)"
              }}
            >
              {/* Display chat history */}
              {chatHistory.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex items-start space-x-3 mb-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="bg-primary/10 p-2 rounded-full">
                      <AIAssistantIcon className="h-6 w-6" isActive={true} />
                    </div>
                  )}
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-2xl p-3 max-w-[80%] ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white ml-auto' 
                        : 'bg-gray-800/60 text-white border border-border'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.role === 'assistant' && (
                      <button 
                        onClick={() => speakText(message.content)}
                        className="mt-1 text-blue-300 hover:text-blue-200 transition-colors text-xs flex items-center"
                        aria-label="Listen to message"
                      >
                        <Volume2 className="h-3 w-3 mr-1" />
                        Listen
                      </button>
                    )}
                  </motion.div>
                </div>
              ))}
              
              {/* Tips section */}
              {tips.length > 0 && (
                <div className="mt-2 p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/30">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <motion.p
                        key={currentTip}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-blue-100"
                      >
                        {isTyping ? (
                          <>
                            {typedText}
                            <span className="ml-1 inline-block w-1.5 h-4 bg-primary animate-pulse"></span>
                          </>
                        ) : (
                          typedText
                        )}
                      </motion.p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-1">
                      {tips.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentTip(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentTip ? "bg-primary" : "bg-gray-600"
                          }`}
                          aria-label={`Tip ${index + 1}`}
                        />
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentTip((prev) => (prev === 0 ? tips.length - 1 : prev - 1))}
                        className="text-blue-300 hover:text-blue-200 transition-colors text-xs flex items-center"
                        disabled={isTyping}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentTip((prev) => (prev === tips.length - 1 ? 0 : prev + 1))}
                        className="text-blue-300 hover:text-blue-200 transition-colors text-xs flex items-center"
                        disabled={isTyping}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input area */}
            <div className="p-3 border-t border-gray-700 bg-gray-900/60">
              <div className="flex space-x-2">
                <Input
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
                  placeholder="Ask me anything about insurance..."
                  className="flex-1 bg-gray-800/80 border-gray-700 text-white focus-visible:ring-blue-500"
                />
                {showVoiceSupport && (
                  <Button
                    onClick={toggleVoiceRecognition}
                    variant="outline"
                    size="icon"
                    className={`${isListening ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300'} border-gray-700 hover:bg-gray-700`}
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
                  </Button>
                )}
                <Button
                  onClick={handleQuerySubmit}
                  variant="default"
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-400">
                  Briki AI is designed to assist with insurance questions, but may not have all answers.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white p-3 rounded-full shadow-lg hover:shadow-blue-500/20"
            onClick={() => setIsExpanded(true)}
            aria-label="Open AI Assistant"
            style={{
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
              background: "linear-gradient(135deg, #3B82F6, #2563EB)"
            }}
          >
            <AIAssistantIcon className="h-8 w-8" isActive={helpMode} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};