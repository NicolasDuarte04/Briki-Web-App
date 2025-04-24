import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileBarChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CompareButtonProps {
  selectedCount: number;
  onCompare: () => void;
  className?: string;
}

export function CompareButton({ 
  selectedCount, 
  onCompare,
  className 
}: CompareButtonProps) {
  // Nothing to compare
  if (selectedCount === 0) return null;

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
          onClick={onCompare}
          size="lg"
          className="py-6 px-8 rounded-full bg-primary text-white font-medium shadow-lg"
        >
          <FileBarChart className="mr-2 h-5 w-5" />
          Comparar {selectedCount} {selectedCount === 1 ? 'plan' : 'planes'}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}