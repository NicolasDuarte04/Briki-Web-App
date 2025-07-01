import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompareStore } from '../../store/compare-store';
import { Button } from '../ui/button';
import { X, BarChart2 } from 'lucide-react';
import CategoryComparisonTable from './CategoryComparisonTable';

export const MobileComparisonDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { plansToCompare, clearCompare } = useCompareStore();
  const hasPlans = plansToCompare.length > 0;

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {hasPlans && !isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-40 lg:hidden"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full w-14 h-14 shadow-lg relative"
              size="icon"
            >
              <BarChart2 className="h-6 w-6" />
              {plansToCompare.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {plansToCompare.length}
                </span>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 lg:hidden overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Plan Comparison</h2>
                <div className="flex items-center gap-2">
                  {hasPlans && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        clearCompare();
                        setIsOpen(false);
                      }}
                    >
                      Clear All
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {plansToCompare.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Select up to 3 plans to compare.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <CategoryComparisonTable plans={plansToCompare} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 