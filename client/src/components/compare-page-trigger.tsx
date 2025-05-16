import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { FileBarChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompareStore } from "@/store/compare-store";

interface ComparePageTriggerProps {
  className?: string;
}

export function ComparePageTrigger({ className }: ComparePageTriggerProps) {
  const { selectedPlans } = useCompareStore();
  const [, navigate] = useLocation();
  
  // Don't show if less than 2 plans selected
  if (selectedPlans.length < 2) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={cn(
          "fixed bottom-4 left-0 right-0 z-50 mx-auto flex justify-center",
          className
        )}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Button
          onClick={() => navigate('/compare-plans')}
          size="lg"
          className="py-6 px-8 rounded-full bg-primary text-white font-medium shadow-lg relative"
        >
          <FileBarChart className="mr-2 h-5 w-5" />
          Comparar 
          <motion.span 
            className="inline-flex items-center justify-center bg-white text-primary rounded-full h-6 w-6 mx-2 font-bold text-sm"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {selectedPlans.length}
          </motion.span>
          {selectedPlans.length === 1 ? 'plan' : 'planes'}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}