import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIAssistantIcon } from "@/components/icons/futuristic-icons";

interface AIAssistantProps {
  tips: string[];
  delay?: number;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  autoShow?: boolean;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  tips,
  delay = 2000,
  position = "bottom-right",
  autoShow = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
      }, delay);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoShow, delay]);
  
  // Typing effect
  useEffect(() => {
    if (isExpanded) {
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
  
  // Cycle through tips
  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };
  
  // Previous tip
  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
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
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg max-w-xs w-full"
          >
            <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-700 flex items-center">
              <AIAssistantIcon className="h-10 w-10" isActive={true} />
              <div className="ml-3">
                <h3 className="text-white font-medium text-sm">Briki AI Assistant</h3>
                <p className="text-blue-100 text-xs">Helping you find the best insurance</p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="ml-auto text-white hover:text-blue-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="min-h-[80px] flex items-center">
                <p className="text-sm text-foreground">
                  {typedText}
                  {isTyping && <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse" />}
                </p>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={prevTip}
                  disabled={tips.length <= 1}
                  className="text-xs text-muted-foreground hover:text-primary disabled:opacity-50 transition-colors"
                >
                  Previous tip
                </button>
                <button
                  onClick={nextTip}
                  disabled={tips.length <= 1}
                  className="text-xs text-muted-foreground hover:text-primary disabled:opacity-50 transition-colors"
                >
                  Next tip
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className="bg-primary rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
            style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
          >
            <AIAssistantIcon className="h-8 w-8" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// Example tips based on different insurance categories
export const getTravelInsuranceTips = () => [
  "Consider your destination's healthcare costs when selecting coverage limits.",
  "Adventure activities like skiing or scuba diving may require additional coverage.",
  "Pre-existing conditions might need special coverage - check policy details.",
  "Trip cancellation protection can save you thousands on expensive trips.",
  "Multi-trip policies might be more economical for frequent travelers."
];

export const getAutoInsuranceTips = () => [
  "Bundling auto with other policies can save you up to 15% on premiums.",
  "Higher deductibles lower your premium but increase out-of-pocket costs if you file a claim.",
  "Many insurers offer discounts for safe driving histories and anti-theft devices.",
  "Consider gap insurance if your car is leased or financed.",
  "Usage-based insurance might save you money if you're a low-mileage driver."
];

export const getPetInsuranceTips = () => [
  "Insure your pet when they're young to avoid pre-existing condition limitations.",
  "Check if the policy covers breed-specific conditions that your pet might be prone to.",
  "Annual wellness coverage can help manage routine care costs.",
  "Review waiting periods before coverage begins for different conditions.",
  "Some policies offer multi-pet discounts for households with multiple animals."
];

export const getHealthInsuranceTips = () => [
  "Balance monthly premiums against deductibles and out-of-pocket maximums.",
  "Check if your preferred doctors and hospitals are in-network.",
  "Consider prescription drug coverage if you take regular medications.",
  "HSA-compatible plans offer tax advantages for healthcare savings.",
  "Review coverage for specialized services you might need, like therapy or maternity care."
];