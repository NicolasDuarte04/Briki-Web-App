import React from 'react';
import { ScrollSection } from '../ScrollSection';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC<{ onViewportEnter?: () => void }> = ({ onViewportEnter }) => {
  const testimonials = [
    {
      quote: "Nunca había entendido mis opciones de seguro tan fácilmente.",
      author: "María G.",
      role: "Emprendedora"
    },
    {
      quote: "Briki me mostró opciones que mi corredor ni conocía.",
      author: "Carlos R.",
      role: "Profesional Independiente"
    },
    {
      quote: "Por fin alguien que hace los seguros comprensibles.",
      author: "Ana M.",
      role: "Gerente de Operaciones"
    }
  ];

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
    <ScrollSection id="testimonials" onViewportEnter={onViewportEnter} className="bg-muted/50">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-12 text-center"
          variants={itemVariants}
        >
          Lo que dicen nuestros usuarios
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <motion.div 
              key={i} 
              className="bg-background p-6 rounded-lg shadow-sm"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 text-lg italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {testimonial.author[0]}
                </div>
                <div className="ml-3">
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </ScrollSection>
  );
}; 