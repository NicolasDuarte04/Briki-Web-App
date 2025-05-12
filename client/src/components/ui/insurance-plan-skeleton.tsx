import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface InsurancePlanSkeletonProps {
  count?: number;
  showFooter?: boolean;
  cardClassName?: string;
}

/**
 * Skeleton loading component for insurance plans
 */
export function InsurancePlanSkeleton({
  count = 1,
  showFooter = true,
  cardClassName = '',
}: InsurancePlanSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card 
          key={index} 
          className={`overflow-hidden ${cardClassName} bg-background/80 backdrop-blur-sm border-primary/20 shadow-glow-sm transition-all duration-300`}
        >
          <CardHeader className="p-4 pb-0 flex justify-between">
            <div className="space-y-2 w-3/4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </CardHeader>
          
          <CardContent className="p-4 pt-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </CardContent>
          
          {showFooter && (
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 rounded-full mr-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-9 w-28 rounded-md" />
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}

/**
 * Skeleton loading component for insurance plan details
 */
export function InsurancePlanDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-12 w-32 rounded-md" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20 shadow-glow-sm">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20 shadow-glow-sm">
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20 shadow-glow-sm">
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Skeleton loading component for provider status
 */
export function ProviderStatusSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="bg-background/80 backdrop-blur-sm border-primary/20 shadow-glow-sm flex overflow-hidden">
          <div className="w-2 h-full bg-gray-200 animate-pulse rounded-l" />
          <div className="p-4 flex-1">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}