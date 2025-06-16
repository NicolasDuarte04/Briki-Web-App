import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Car, Plane, Heart, Stethoscope } from 'lucide-react';

interface WelcomeCardProps {
  onSendMessage: (message: string) => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ onSendMessage }) => {
  const quickOptions = [
    {
      icon: Car,
      title: 'Seguro de Auto',
      question: 'Necesito un seguro para mi vehículo',
      description: 'Protección completa para tu automóvil',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Plane,
      title: 'Seguro de Viaje', 
      question: 'Voy a viajar y necesito seguro de viaje',
      description: 'Cobertura para tus aventuras',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Heart,
      title: 'Seguro de Mascota',
      question: 'Mi mascota necesita seguro veterinario',
      description: 'Cuidado veterinario para tu compañero',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Stethoscope,
      title: 'Seguro de Salud',
      question: 'Busco un seguro de salud',
      description: 'Atención médica cuando la necesites',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8 p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          ¡Bienvenido a Briki!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
          Estoy aquí para ayudarte a encontrar el seguro perfecto. ¿Por dónde quieres empezar?
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickOptions.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Button
              onClick={() => onSendMessage(option.question)}
              variant="outline"
              className="w-full p-6 h-auto text-left border-2 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          O simplemente escribe tu pregunta en el campo de abajo
        </p>
      </div>
    </motion.div>
  );
};

export default WelcomeCard;