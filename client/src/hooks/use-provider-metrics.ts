import { useState, useEffect } from 'react';
import { INSURANCE_PROVIDERS, ApiError } from '@/services/api/insurance-providers';
import { useQueryClient } from '@tanstack/react-query';
import { CACHE_KEYS } from '@/services/caching/insurance-cache';

interface ProviderMetric {
  provider: string;
  status: 'online' | 'offline' | 'error' | 'unknown';
  responseTime: number | null;
  errorRate: number; // 0-100%
  availability: number; // 0-100%
  lastCheck: Date;
  errorDetails?: ApiError;
  planCount: number;
}

/**
 * Hook to track and analyze provider performance metrics
 */
export function useProviderMetrics() {
  const [metrics, setMetrics] = useState<Record<string, ProviderMetric>>({});
  const [summaryStats, setSummaryStats] = useState({
    totalProviders: INSURANCE_PROVIDERS.length,
    availableProviders: 0,
    errorProviders: 0,
    avgResponseTime: 0,
    totalPlansAvailable: 0,
    lastUpdated: new Date(),
  });
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Get current errors from cache
    const errorData = queryClient.getQueryData<Record<string, ApiError>>(
      CACHE_KEYS.planErrors
    ) || {};
    
    // Get provider status from cache
    const statusData = queryClient.getQueryData<Record<string, any>>(
      CACHE_KEYS.providerStatus
    ) || {};
    
    // Build metrics for each provider
    const newMetrics: Record<string, ProviderMetric> = {};
    let availableCount = 0;
    let errorCount = 0;
    let totalResponseTime = 0;
    let validResponseTimes = 0;
    let totalPlans = 0;
    
    INSURANCE_PROVIDERS.forEach(provider => {
      const hasError = !!errorData[provider.name];
      const status = hasError ? 'error' : 
        (statusData[provider.name]?.status || 'unknown');
      
      // Get plan count from cache
      const plans = queryClient.getQueryData<any[]>(
        CACHE_KEYS.plansByProvider(provider.name)
      ) || [];
      
      // Calculate theoretical availability based on status history
      // In real implementation, this would use historic data
      const availability = status === 'online' ? 100 : 
        status === 'error' ? 20 : 
        status === 'offline' ? 0 : 50;
      
      // Use latency from status data or default to null
      const responseTime = statusData[provider.name]?.latency || null;
      
      // Add to metrics
      newMetrics[provider.name] = {
        provider: provider.name,
        status: status as any,
        responseTime,
        errorRate: hasError ? 100 : 0, // In real app, calculate from history
        availability,
        lastCheck: new Date(statusData[provider.name]?.lastChecked || new Date()),
        errorDetails: errorData[provider.name],
        planCount: plans.length
      };
      
      // Update summary stats
      if (status === 'online') {
        availableCount++;
      }
      if (status === 'error') {
        errorCount++;
      }
      if (responseTime !== null) {
        totalResponseTime += responseTime;
        validResponseTimes++;
      }
      totalPlans += plans.length;
    });
    
    // Set metrics
    setMetrics(newMetrics);
    
    // Update summary stats
    setSummaryStats({
      totalProviders: INSURANCE_PROVIDERS.length,
      availableProviders: availableCount,
      errorProviders: errorCount,
      avgResponseTime: validResponseTimes > 0 ? totalResponseTime / validResponseTimes : 0,
      totalPlansAvailable: totalPlans,
      lastUpdated: new Date()
    });
  }, [queryClient]);
  
  return {
    metrics,
    summaryStats,
    getMetricByProvider: (provider: string) => metrics[provider],
    getProvidersWithStatus: (status: 'online' | 'offline' | 'error' | 'unknown') => 
      Object.values(metrics).filter(m => m.status === status),
  };
}