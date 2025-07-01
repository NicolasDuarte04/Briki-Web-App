import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent } from "../ui/card";

// Lazy load the actual PlanCard component
const PlanCard = lazy(() => import("./PlanCard"));

interface LazyPlanCardProps {
  planId: string;
  title: string;
  provider: string;
  price: number;
  description?: string;
  features?: string[];
  badge?: string;
  rating: string;
  onSelect: () => void;
  onCompare: () => void;
  isSelected: boolean;
  isComparing: boolean;
  className?: string;
}

// Loading skeleton for plan cards
function PlanCardSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="p-6 space-y-4">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        {/* Price skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Features skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}

export function LazyPlanCard(props: LazyPlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={props.className}
    >
      <Suspense fallback={<PlanCardSkeleton />}>
        <PlanCard {...props} />
      </Suspense>
    </motion.div>
  );
}

export default LazyPlanCard;