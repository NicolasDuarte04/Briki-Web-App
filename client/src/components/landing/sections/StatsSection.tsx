import React from 'react';
import { ScrollSection } from '../ScrollSection';
import { motion } from 'framer-motion';

export const StatsSection: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
  const stats = [
    { value: '80+', label: 'planes reales integrados' },
    { value: '1.000+', label: 'preguntas respondidas por la IA' },
    { value: '96%', label: 'de aseguradoras aún operan en papel' },
    { value: '1', label: 'cliente institucional en onboarding' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        duration: 0.6
      }
    }
  };

  return (
    <ScrollSection id="stats" onViewportEnter={onViewportEnter}>
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              className="text-center"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="text-4xl md:text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-lg text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </ScrollSection>
  );
}; 