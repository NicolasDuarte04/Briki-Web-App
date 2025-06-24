import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquareWarning, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssistantEmptyStateProps {
  type: 'welcome' | 'no-plans' | 'fallback';
  onAction?: (query: string) => void;
}

const stateConfig = {
  welcome: {
    icon: <Sparkles className="h-12 w-12 text-blue-500" />,
    title: '¿Cómo puedo ayudarte hoy?',
    description: 'Puedes pedirme que busque planes, explique términos o compare opciones.',
    actions: ['Cotizar seguro de auto para Mazda 3', '¿Qué es un deducible?', 'Compara planes de salud'],
  },
  'no-plans': {
    icon: <SearchX className="h-12 w-12 text-gray-400" />,
    title: 'No encontramos planes con esos criterios',
    description: 'Intenta ajustar tu búsqueda o sé más específico sobre lo que necesitas.',
    actions: ['Muéstrame todos los seguros de viaje', 'Busco un seguro de salud económico'],
  },
  fallback: {
    icon: <MessageSquareWarning className="h-12 w-12 text-amber-500" />,
    title: 'No entendí del todo tu solicitud',
    description: '¿Puedes reformular tu pregunta? A veces, dar más detalles ayuda mucho.',
    actions: ['¿Qué cubre un seguro de auto?', 'Explícame las diferencias entre planes de mascotas'],
  },
};

export const AssistantEmptyState: React.FC<AssistantEmptyStateProps> = ({ type, onAction }) => {
  const config = stateConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center text-center p-6 space-y-4"
    >
      <div className="p-3 bg-gray-100 rounded-full">{config.icon}</div>
      <div className="space-y-1">
        <p className="font-semibold text-gray-800">{config.title}</p>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">{config.description}</p>
      </div>
      {onAction && config.actions && (
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {config.actions.map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              onClick={() => onAction(action)}
              className="text-xs h-auto py-1.5"
            >
              {action}
            </Button>
          ))}
        </div>
      )}
    </motion.div>
  );
}; 