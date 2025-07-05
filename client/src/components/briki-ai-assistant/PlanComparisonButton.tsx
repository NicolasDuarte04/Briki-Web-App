import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { GitCompareArrows } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PlanComparisonButtonProps {
  selectedCount: number;
  onClick: () => void;
  className?: string;
}

export const PlanComparisonButton: React.FC<PlanComparisonButtonProps> = ({
  selectedCount,
  onClick,
  className
}) => {
  const isVisible = selectedCount >= 2;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn("fixed bottom-24 right-4 z-50", className)}
        >
          <Button
            onClick={onClick}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            <GitCompareArrows className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            Comparar {selectedCount} planes
          </Button>
          
          {/* Pulse animation for attention */}
          <div className="absolute inset-0 -z-10 animate-pulse">
            <div className="h-full w-full bg-blue-500/20 rounded-lg blur-xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlanComparisonButton; 