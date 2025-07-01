import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { INSURANCE_PROVIDERS, ApiError } from '../api/insurance-providers';
import { apiRequest } from '../../lib/queryClient';

/**
 * Centralized cache keys for insurance data
 */
export const CACHE_KEYS = {
  // All insurance plans across all providers
  allPlans: ['/api/insurance/plans'], 
  
  // Plans filtered by category + criteria
  filteredPlans: (category: string, criteria: Record<string, any>) => 
    ['/api/insurance/plans', category, criteria],
  
  // Plans from a specific provider
  plansByProvider: (provider: string) => ['/api/insurance/plans', 'provider', provider],
  
  // Provider configuration status
  providerConfig: ['/api/insurance/providers/config'],
  
  // Provider API health status
  providerStatus: ['/api/insurance/providers/status'],
  
  // Plan detail by ID
  planDetail: (id: string) => ['/api/insurance/plans', id],
  
  // API errors by provider
  planErrors: ['/api/insurance/errors'],
};

/**
 * Hook to fetch all insurance plans across providers
 */
export function useAllInsurancePlans(category?: string) {
  return useQuery({
    queryKey: category ? 
      ['/api/insurance/plans', category] : 
      CACHE_KEYS.allPlans,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch insurance plans by specific provider
 */
export function useProviderPlans(providerName: string) {
  return useQuery({
    queryKey: CACHE_KEYS.plansByProvider(providerName),
    // Provider-specific endpoints
    queryFn: () => apiRequest('GET', `/api/insurance/providers/${providerName}/plans`),
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch insurance plans filtered by criteria
 */
export function useFilteredInsurancePlans(
  category: string,
  criteria: Record<string, any>,
  enabled = true
) {
  return useQuery({
    queryKey: CACHE_KEYS.filteredPlans(category, criteria),
    queryFn: () => apiRequest(
      'POST', 
      `/api/insurance/${category}/search`, 
      { criteria }
    ),
    refetchOnWindowFocus: false,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch travel insurance plans for a specific trip
 */
export function usePlansForTrip(tripDetails: any, enabled = true) {
  return useQuery({
    queryKey: ['api/insurance/travel', tripDetails],
    queryFn: () => apiRequest(
      'POST',
      '/api/insurance/travel/search',
      { criteria: tripDetails }
    ),
    refetchOnWindowFocus: false,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch detailed information about a specific plan
 */
export function useInsurancePlanDetail(planId: string, enabled = true) {
  return useQuery({
    queryKey: CACHE_KEYS.planDetail(planId),
    queryFn: () => apiRequest('GET', `/api/insurance/plans/${planId}`),
    refetchOnWindowFocus: false,
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to check provider API status
 */
export function useProviderStatus() {
  return useQuery({
    queryKey: CACHE_KEYS.providerStatus,
    queryFn: () => apiRequest('GET', '/api/insurance/providers/status'),
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds - status should update frequently
  });
}

/**
 * Hook to check provider configuration status
 */
export function useProviderConfig() {
  return useQuery({
    queryKey: CACHE_KEYS.providerConfig,
    queryFn: () => apiRequest('GET', '/api/insurance/providers/config'),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to track API errors by provider
 */
export function usePlanErrors() {
  const queryClient = useQueryClient();
  
  const setError = (provider: string, error: ApiError) => {
    const currentErrors = queryClient.getQueryData<Record<string, ApiError>>(
      CACHE_KEYS.planErrors
    ) || {};
    
    queryClient.setQueryData(
      CACHE_KEYS.planErrors, 
      { ...currentErrors, [provider]: error }
    );
  };
  
  const clearError = (provider: string) => {
    const currentErrors = queryClient.getQueryData<Record<string, ApiError>>(
      CACHE_KEYS.planErrors
    ) || {};
    
    if (currentErrors[provider]) {
      const { [provider]: _, ...rest } = currentErrors;
      queryClient.setQueryData(CACHE_KEYS.planErrors, rest);
    }
  };
  
  const clearAllErrors = () => {
    queryClient.setQueryData(CACHE_KEYS.planErrors, {});
  };
  
  return {
    errors: queryClient.getQueryData<Record<string, ApiError>>(CACHE_KEYS.planErrors) || {},
    setError,
    clearError,
    clearAllErrors,
  };
}

/**
 * Hook to configure a provider API key
 */
export function useConfigureProvider() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      provider, 
      apiKey, 
      extraConfig = {} 
    }: { 
      provider: string; 
      apiKey: string; 
      extraConfig?: Record<string, any>;
    }) => {
      return apiRequest('POST', '/api/insurance/providers/configure', {
        provider,
        apiKey,
        ...extraConfig
      });
    },
    onSuccess: () => {
      // Invalidate provider configuration cache
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.providerConfig });
      
      // Also invalidate provider status, as it might have changed
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.providerStatus });
      
      // Clear errors for the configured provider
      const errors = queryClient.getQueryData<Record<string, ApiError>>(
        CACHE_KEYS.planErrors
      ) || {};
      
      // We don't know which provider was configured without tracking mutation variables
      // So this is a simplification - in real app would track which provider was configured
      queryClient.setQueryData(CACHE_KEYS.planErrors, {});
    }
  });
}

/**
 * Hook to refresh provider data - useful if there was an error
 */
export function useRefreshProviderData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ provider }: { provider?: string }) => {
      const endpoint = provider ? 
        `/api/insurance/providers/${provider}/refresh` : 
        '/api/insurance/providers/refresh';
      
      return apiRequest('POST', endpoint);
    },
    onSuccess: (_, variables) => {
      if (variables.provider) {
        // Invalidate just this provider's data
        queryClient.invalidateQueries({ 
          queryKey: CACHE_KEYS.plansByProvider(variables.provider) 
        });
        
        // Clear errors for this provider
        const errors = queryClient.getQueryData<Record<string, ApiError>>(
          CACHE_KEYS.planErrors
        ) || {};
        
        if (errors[variables.provider]) {
          const { [variables.provider]: _, ...rest } = errors;
          queryClient.setQueryData(CACHE_KEYS.planErrors, rest);
        }
      } else {
        // Invalidate all provider data
        queryClient.invalidateQueries({ queryKey: ['/api/insurance'] });
        
        // Clear all errors
        queryClient.setQueryData(CACHE_KEYS.planErrors, {});
      }
      
      // Always refresh provider status
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.providerStatus });
    }
  });
}

/**
 * Hook to invalidate the plans cache
 */
export function useInvalidatePlansCache() {
  const queryClient = useQueryClient();
  
  return {
    invalidateAllPlans: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.allPlans });
    },
    invalidatePlansByCategory: (category: string) => {
      queryClient.invalidateQueries({ queryKey: ['/api/insurance/plans', category] });
    },
    invalidatePlansByProvider: (provider: string) => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.plansByProvider(provider) });
    },
    invalidateFilteredPlans: (category: string, criteria: Record<string, any>) => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.filteredPlans(category, criteria) });
    },
    invalidatePlanDetail: (planId: string) => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.planDetail(planId) });
    },
    invalidateAllProviderData: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/insurance'] });
    }
  };
}