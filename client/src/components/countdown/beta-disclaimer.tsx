import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

export function BetaDisclaimer() {
  const [isDismissed, setIsDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div 
          className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/90 backdrop-blur-sm border-b border-yellow-600/30 shadow-md"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-background shrink-0" />
              <p className="text-sm text-background font-medium pr-4">
                You are exploring the Beta version of Briki. Some features may be under development. Payments are currently disabled during this phase.
              </p>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-yellow-600/40 hover:bg-yellow-600">
                      <Info className="h-3.5 w-3.5 text-background" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    This version of Briki is for testing purposes only. Payments are disabled, and some features may not function as intended. Full functionality will be available upon official launch.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-background hover:bg-yellow-600/30" 
              onClick={() => setIsDismissed(true)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}