import React from 'react';
import { ScrollSection } from '../ScrollSection';
import { Button } from '../../ui/button';
import { motion } from 'framer-motion';

export const HeroSection: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };

  return (
    <ScrollSection id="hero" onViewportEnter={onViewportEnter} className="bg-gradient-to-b from-background to-background/80">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
            variants={itemVariants}
          >
            La forma más fácil de entender y cotizar seguros.
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            variants={itemVariants}
          >
            Briki es el primer asistente con IA para comparar planes reales de salud, auto, viaje, hogar y vida.
          </motion.p>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="min-w-[200px] h-12 text-lg"
              onClick={() => window.location.href = '/ask-briki-ai'}
            >
              Probar el asistente
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </ScrollSection>
  );
}; 