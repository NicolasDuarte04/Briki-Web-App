import React from 'react';
import { ScrollSection } from '../ScrollSection';
import { Button } from '../../ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const FinalCTA: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
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

  return (
    <ScrollSection id="cta" onViewportEnter={onViewportEnter} className="bg-gradient-to-t from-background to-background/80">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="text-center max-w-3xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6"
            variants={itemVariants}
          >
            ¿Listo para encontrar tu seguro ideal?
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            variants={itemVariants}
          >
            Es gratis y sin compromiso.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="min-w-[200px] h-12 text-lg group"
                onClick={() => window.location.href = '/ask-briki-ai'}
              >
                Probar el asistente ahora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div 
            className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground"
            variants={containerVariants}
          >
            <motion.div 
              className="flex items-center gap-2"
              variants={itemVariants}
            >
              <span className="text-sm">✓ Sin costo</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              variants={itemVariants}
            >
              <span className="text-sm">✓ Sin registro</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              variants={itemVariants}
            >
              <span className="text-sm">✓ Respuesta inmediata</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </ScrollSection>
  );
}; 