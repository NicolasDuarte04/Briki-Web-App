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
      className="mb-6 p-6 bg-gray-50 rounded-2xl"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Bienvenido a Briki!
        </h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Encuentra el seguro perfecto. ¿Por dónde empezamos?
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              className="w-full p-4 h-auto text-left border border-gray-200 hover:border-[#00C7C4] hover:bg-[#00C7C4]/5 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                  <option.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">
                    {option.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {option.description}
                  </p>
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          O simplemente escribe tu pregunta en el campo de abajo
        </p>
      </div>
    </motion.div>
  );
};

export default WelcomeCard;