import React from "react";
import { MessageCircleQuestion } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface InteractiveQuestionsProps {
  questions: string[];
  onQuestionClick: (response: string) => void;
}

interface QuestionOption {
  question: string;
  options?: string[];
}

// Smart parsing of questions to extract interactive options
function parseQuestionOptions(question: string): QuestionOption {
  const agePatterns = {
    pet: {
      regex: /edad.*mascota/i,
      options: ["Menos de 1 año", "1-5 años", "6-10 años", "Más de 10 años"]
    },
    human: {
      regex: /qué edad tienes/i,
      options: ["18-25 años", "26-35 años", "36-50 años", "Más de 50 años"]
    }
  };
  
  const genderPattern = {
    regex: /género|masculino|femenino/i,
    options: ["Hombre", "Mujer", "Prefiero no decir"]
  };
  
  const locationPattern = {
    regex: /país|ciudad|dónde|registrado/i,
    options: ["Colombia", "México", "Perú", "Chile", "Argentina"]
  };
  
  const vehicleTypePattern = {
    regex: /tipo de vehículo/i,
    options: ["Carro", "Moto"]
  };
  
  const petTypePattern = {
    regex: /tipo de mascota/i,
    options: ["Perro", "Gato", "Otro"]
  };
  
  // Check patterns
  for (const [key, pattern] of Object.entries(agePatterns)) {
    if (pattern.regex.test(question)) {
      return { question, options: pattern.options };
    }
  }
  
  if (genderPattern.regex.test(question)) {
    return { question, options: genderPattern.options };
  }
  
  if (locationPattern.regex.test(question)) {
    return { question, options: locationPattern.options };
  }
  
  if (vehicleTypePattern.regex.test(question)) {
    return { question, options: vehicleTypePattern.options };
  }
  
  if (petTypePattern.regex.test(question)) {
    return { question, options: petTypePattern.options };
  }
  
  // Default: no predefined options
  return { question };
}

const InteractiveQuestions: React.FC<InteractiveQuestionsProps> = ({ 
  questions, 
  onQuestionClick 
}) => {
  const parsedQuestions = questions.map(parseQuestionOptions);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/60 my-6 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircleQuestion className="text-blue-600 w-5 h-5" />
            <span className="text-blue-900 font-medium text-sm">
              Para darte las mejores opciones, necesito saber:
            </span>
          </div>
          
          <div className="space-y-4">
            {parsedQuestions.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">{item.question}</p>
                
                {item.options ? (
                  <div className="flex flex-wrap gap-2">
                    {item.options.map((option, optIdx) => (
                      <motion.button
                        key={optIdx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onQuestionClick(option)}
                        className="px-4 py-2 text-sm bg-white hover:bg-blue-50 
                                 text-gray-700 hover:text-blue-700 rounded-full 
                                 border border-gray-300 hover:border-blue-400 
                                 transition-all duration-200 shadow-sm"
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    Por favor responde en el chat
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InteractiveQuestions; 