import React from 'react';
import { ScrollSection } from '../ScrollSection';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, LayoutDashboard } from 'lucide-react';

export const PDFSummaryAnimation: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
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
    <ScrollSection id="pdf-summary" onViewportEnter={onViewportEnter} className="bg-muted/50">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6"
            variants={itemVariants}
          >
            ¿Planes en PDF? Briki los entiende por ti.
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground mb-12"
            variants={itemVariants}
          >
            Convertimos folletos confusos en comparaciones fáciles de entender, en segundos.
          </motion.p>
          
          <motion.div 
            className="relative w-full max-w-2xl mx-auto h-96"
            variants={itemVariants}
          >
            {/* Animation container */}
            <div className="absolute inset-0 flex items-center justify-between px-12">
              {/* PDF Side */}
              <motion.div 
                className="w-64 h-80 bg-background rounded-lg shadow-lg p-6 flex flex-col items-center justify-center"
                initial={{ x: 0 }}
                whileInView={{ x: -20 }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2
                }}
              >
                <FileText className="w-16 h-16 text-primary mb-4" />
                <div className="w-full space-y-2">
                  <div className="h-2 bg-muted-foreground/20 rounded w-full" />
                  <div className="h-2 bg-muted-foreground/20 rounded w-3/4" />
                  <div className="h-2 bg-muted-foreground/20 rounded w-1/2" />
                </div>
              </motion.div>

              {/* Arrow */}
              <motion.div
                animate={{ x: [-10, 10, -10] }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2
                }}
              >
                <ArrowRight className="w-8 h-8 text-primary" />
              </motion.div>

              {/* Cards Side */}
              <motion.div 
                className="w-64 h-80 bg-background rounded-lg shadow-lg p-6 flex flex-col items-center justify-center"
                initial={{ x: 0 }}
                whileInView={{ x: 20 }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2
                }}
              >
                <LayoutDashboard className="w-16 h-16 text-primary mb-4" />
                <div className="w-full space-y-4">
                  <div className="h-16 bg-primary/10 rounded-lg" />
                  <div className="h-16 bg-primary/10 rounded-lg" />
                  <div className="h-16 bg-primary/10 rounded-lg" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </ScrollSection>
  );
}; 