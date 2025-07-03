import React from 'react';
import { ScrollSection } from '../ScrollSection';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

export const ProductDemoPanel: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
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

  const insuranceCompanies = [
    'SURA', 'MAPFRE', 'Bolívar', 'Pax Assistance'
  ];

  return (
    <ScrollSection id="product-demo" onViewportEnter={onViewportEnter}>
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Explora planes reales en tiempo real.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Compara coberturas, precios y beneficios desde aseguradoras como SURA, MAPFRE, Bolívar, Pax Assistance y más.
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-muted rounded-lg p-8"
          >
            <div className="grid grid-cols-2 gap-4">
              {insuranceCompanies.map((company, i) => (
                <motion.div
                  key={company}
                  className="bg-background p-4 rounded-lg shadow-sm flex items-center gap-3"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Building2 className="h-6 w-6 text-primary" />
                  <span className="font-medium">{company}</span>
                </motion.div>
              ))}
            </div>
            <motion.div 
              className="mt-6 bg-primary/10 rounded-lg p-6"
              variants={itemVariants}
            >
              <div className="space-y-3">
                <div className="h-2 bg-primary/20 rounded w-3/4" />
                <div className="h-2 bg-primary/20 rounded w-1/2" />
                <div className="h-2 bg-primary/20 rounded w-2/3" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </ScrollSection>
  );
}; 