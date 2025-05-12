import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { InsurancePlanSkeleton } from '@/components/ui/insurance-plan-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading state for insurance plans with animated skeleton elements
 */
export default function LoadingInsurancePlans() {
  return (
    <div className="space-y-8">
      {/* Animated header skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-full max-w-md" />
      </motion.div>
      
      {/* Filter skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20 shadow-glow-sm mb-8">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Result count skeleton */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex justify-between items-center"
      >
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-32" />
      </motion.div>
      
      {/* Plan skeletons with staggered animation */}
      <div className="grid grid-cols-1 gap-6">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.3 + (i * 0.1) // Staggered delay
            }}
          >
            <InsurancePlanSkeleton />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * Loading state specifically for API connection setup screen
 */
export function LoadingApiSetup() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Skeleton className="h-7 w-64 mb-2" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="p-4 rounded-lg border border-yellow-200 bg-yellow-50"
      >
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-yellow-200" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-4 w-full max-w-md mt-2" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Skeleton className="h-5 w-32 mb-3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + (i * 0.05) }}
              className="px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg flex justify-between items-center"
            >
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}