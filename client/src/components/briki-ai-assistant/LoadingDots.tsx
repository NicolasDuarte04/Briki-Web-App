import React from 'react';
import { motion } from 'framer-motion';

const LoadingDots: React.FC = () => {
  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [-3, 3, -3],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex items-center space-x-1.5 px-4 py-2">
      <motion.div
        variants={dotVariants}
        initial="initial"
        animate="animate"
        className="w-2 h-2 bg-gray-400 rounded-full"
      />
      <motion.div
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
        className="w-2 h-2 bg-gray-400 rounded-full"
      />
      <motion.div
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
        className="w-2 h-2 bg-gray-400 rounded-full"
      />
    </div>
  );
};

export default LoadingDots; 