import React from 'react';
import { ScrollSection } from '../ScrollSection';
import { motion } from 'framer-motion';
import { Bot, MessageSquare, Brain } from 'lucide-react';

export const AIExplainer: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const features = [
    {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: 'Asistente Personal',
      description: 'Te guía paso a paso en la elección de tu seguro ideal.'
    },
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: 'Potenciado por GPT-4',
      description: 'Tecnología de punta para entender tus necesidades específicas.'
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      title: 'Recomendaciones Personalizadas',
      description: 'Aprende de tus preferencias para sugerir mejores opciones.'
    }
  ];

  return (
    <ScrollSection id="ai-explainer" onViewportEnter={onViewportEnter} className="bg-muted/50">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Tu asistente personal para elegir seguro.
            </h2>
            <p className="text-xl text-muted-foreground">
              Nuestro sistema con GPT-4 te guía paso a paso y aprende de ti para hacer mejores recomendaciones.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="bg-background p-6 rounded-lg shadow-sm"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4 p-3 bg-primary/10 rounded-lg inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </ScrollSection>
  );
}; 