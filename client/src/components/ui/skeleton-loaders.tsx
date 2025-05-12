import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

/**
 * Skeleton for insurance plan cards
 */
export function PlanCardSkeleton() {
  return (
    <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-primary/10 p-4 shadow-glow-sm overflow-hidden">
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        
        <div className="pt-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full mt-2" />
          <Skeleton className="h-5 w-1/2 mt-2" />
        </div>
        
        <div className="flex justify-between items-center pt-4">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of plan card skeletons
 */
export function PlanGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <PlanCardSkeleton key={index} />
      ))}
    </motion.div>
  );
}

/**
 * Skeleton for plan details
 */
export function PlanDetailsSkeleton() {
  return (
    <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-primary/10 p-6 shadow-glow-sm">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-12 w-20 rounded-full" />
      </div>
      
      <div className="mt-8 space-y-5">
        <div>
          <Skeleton className="h-5 w-24 mb-2" />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          </div>
        </div>
        
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
        
        <div className="pt-4 flex justify-end">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for comparison table
 */
export function ComparisonTableSkeleton({ columns = 3 }: { columns?: number }) {
  return (
    <div className="overflow-hidden bg-background/80 backdrop-blur-sm rounded-xl border border-primary/10 shadow-glow-sm">
      <div className="p-4 border-b border-primary/10">
        <Skeleton className="h-6 w-48" />
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Feature names column */}
          <div className="space-y-6">
            <Skeleton className="h-5 w-24" />
            
            <div className="space-y-4 ml-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-32" />
              ))}
            </div>
          </div>
          
          {/* Plan columns */}
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <div key={columnIndex} className="space-y-6">
              <Skeleton className="h-5 w-full" />
              
              <div className="space-y-4 ml-2">
                {Array.from({ length: 6 }).map((_, rowIndex) => (
                  <Skeleton key={rowIndex} className="h-4 w-20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Animated loading bar for the top of page
 */
export function TopProgressBar({ 
  isLoading,
  className
}: { 
  isLoading: boolean;
  className?: string;
}) {
  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden bg-primary/20", 
        className
      )}
    >
      {isLoading && (
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ 
            width: ["0%", "40%", "60%", "80%", "100%"],
          }}
          transition={{ 
            times: [0, 0.4, 0.7, 0.9, 1],
            duration: 2, 
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      )}
    </div>
  );
}