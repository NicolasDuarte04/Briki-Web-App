import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Heart, Plane, Shield, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface FloatingPromptsProps {
  isActiveConversation: boolean;
  hasPlans: boolean;
  currentCategory?: string;
  onPromptClick: (prompt: string) => void;
  className?: string;
}

const prompts = [
  {
    id: 'auto',
    icon: Car,
    text: '¿Buscas seguro para tu carro?',
    color: 'from-blue-500 to-blue-600',
    query: 'Necesito un seguro para mi vehículo'
  },
  {
    id: 'pet',
    icon: Heart,
    text: '¿Tu mascota está asegurada?',
    color: 'from-pink-500 to-pink-600',
    query: 'Mi mascota necesita seguro veterinario'
  },
  {
    id: 'travel',
    icon: Plane,
    text: '¿Planeas viajar pronto?',
    color: 'from-green-500 to-green-600',
    query: 'Voy a viajar y necesito seguro de viaje'
  },
  {
    id: 'health',
    icon: Shield,
    text: '¿Necesitas cobertura médica?',
    color: 'from-purple-500 to-purple-600',
    query: 'Busco un seguro de salud'
  }
];

export const FloatingPrompts: React.FC<FloatingPromptsProps> = ({
  isActiveConversation,
  hasPlans,
  currentCategory,
  onPromptClick,
  className
}) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Hide prompts during active conversations or when plans are shown
  const shouldHide = isActiveConversation || hasPlans || isDismissed;
  
  // Rotate through prompts every 5 seconds
  useEffect(() => {
    if (shouldHide) return;
    
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [shouldHide]);
  
  // Filter out the current category to avoid redundant prompts
  const filteredPrompts = prompts.filter(p => p.id !== currentCategory);
  const currentPrompt = filteredPrompts[currentPromptIndex % filteredPrompts.length];
  
  if (!currentPrompt) return null;
  
  return (
    <AnimatePresence>
      {!shouldHide && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className={cn(
            "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40",
            "max-w-md w-full mx-4",
            className
          )}
        >
          <div className="relative">
            {/* Dismiss button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute -top-2 -right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
              aria-label="Cerrar sugerencias"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            
            {/* Prompt card */}
            <motion.div
              key={currentPrompt.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <Button
                onClick={() => onPromptClick(currentPrompt.query)}
                className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
                variant="ghost"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-r flex items-center justify-center",
                    currentPrompt.color,
                    "group-hover:scale-110 transition-transform duration-200"
                  )}>
                    <currentPrompt.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                      {currentPrompt.text}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      Haz clic para explorar opciones
                    </p>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
              </Button>
            </motion.div>
            
            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {filteredPrompts.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                    index === (currentPromptIndex % filteredPrompts.length)
                      ? "bg-blue-600 dark:bg-blue-400"
                      : "bg-gray-300 dark:bg-gray-600"
                  )}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 