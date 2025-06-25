import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquareWarning, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="space-y-4">
      {/* Main fallback card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-muted/50 border-muted">
          <CardContent className="flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="p-3 bg-background rounded-full shadow-sm">{config.icon}</div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">{config.title}</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {config.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Suggestion buttons in separate container */}
      {onAction && config.actions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-3"
        >
          <p className="text-xs text-muted-foreground text-center font-medium">
            Prueba con estas sugerencias:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {config.actions.map((action) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                onClick={() => onAction(action)}
                className="text-xs h-auto py-2 px-3 rounded-full hover:bg-primary/5 transition-colors"
              >
                {action}
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}; 