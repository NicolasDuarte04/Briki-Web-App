import React from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  onViewportEnter?: () => void;
}

export const ScrollSection: React.FC<ScrollSectionProps> = ({
  id,
  children,
  className = '',
  onViewportEnter
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });

  React.useEffect(() => {
    if (isInView && onViewportEnter) {
      onViewportEnter();
    }
  }, [isInView, onViewportEnter]);

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`min-h-screen flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.section>
  );
}; 