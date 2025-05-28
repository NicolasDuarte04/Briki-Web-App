import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

interface OptimizedQueryOptions {
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  retryDelay?: number;
  maxRetries?: number;
}

export function useOptimizedQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions = {}
) {
  const queryClient = useQueryClient();

  const defaultOptions = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    maxRetries: 3,
    ...options
  };

  const query = useQuery({
    queryKey,
    queryFn,
    ...defaultOptions
  });

  // Prefetch related data
  const prefetchRelated = useCallback((relatedKey: string[], relatedFn: () => Promise<any>) => {
    queryClient.prefetchQuery({
      queryKey: relatedKey,
      queryFn: relatedFn,
      staleTime: defaultOptions.staleTime,
      cacheTime: defaultOptions.cacheTime
    });
  }, [queryClient, defaultOptions.staleTime, defaultOptions.cacheTime]);

  // Invalidate cache
  const invalidateCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  // Update cache manually
  const updateCache = useCallback((updater: (oldData: T | undefined) => T) => {
    queryClient.setQueryData(queryKey, updater);
  }, [queryClient, queryKey]);

  return {
    ...query,
    prefetchRelated,
    invalidateCache,
    updateCache
  };
}

// Performance monitoring hook
export function usePerformanceMonitor() {
  const queryClient = useQueryClient();

  const getQueryStats = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    return {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.isActive()).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      cacheSize: JSON.stringify(cache).length
    };
  }, [queryClient]);

  const clearStaleQueries = useCallback(() => {
    queryClient.getQueryCache().clear();
  }, [queryClient]);

  return {
    getQueryStats,
    clearStaleQueries
  };
}