import { useQuery, useQueryClient, useMutation, UseQueryOptions } from '@tanstack/react-query';
import { InsurancePlan, Trip } from '@shared/schema';
import { fetchAllProviderPlans, validatePlan, ApiError } from '../api/insurance-providers';
import { getProvidersWithApiKeys, checkRequiredApiKeys } from '../api/api-keys';

// Cache key definitions
export const CACHE_KEYS = {
  allPlans: ['/api/plans'] as const,
  planById: (id: string | number) => ['/api/plans', id] as const,
  plansByProvider: (provider: string) => ['/api/plans', 'provider', provider] as const,
  plansByTrip: (tripId: string | number) => ['/api/plans', 'trip', tripId] as const,
  planErrors: ['/api/plans', 'errors'] as const,
};

// Cache time configuration (in milliseconds)
export const CACHE_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 60 * 60 * 1000, // 1 hour
  retryDelay: 1000, // 1 second
  retryCount: 3,
};

/**
 * Hook to fetch and cache all insurance plans for a trip
 */
export const usePlansForTrip = (tripData: Trip, options?: UseQueryOptions<InsurancePlan[]>) => {
  const queryClient = useQueryClient();
  
  return useQuery<InsurancePlan[], Error, InsurancePlan[]>({
    queryKey: CACHE_KEYS.plansByTrip(tripData.id),
    queryFn: async () => {
      // Check if we have the necessary API keys
      const apiKeyStatus = checkRequiredApiKeys();
      
      if (!apiKeyStatus.ready) {
        throw new Error(`Missing API keys for providers: ${apiKeyStatus.missingProviders.join(', ')}`);
      }
      
      const providerConfigs = getProvidersWithApiKeys();
      
      // Get normalized trip data for API requests
      const normalizedTripData = {
        destination: tripData.destination,
        origin: tripData.countryOfOrigin,
        departureDate: tripData.departureDate,
        returnDate: tripData.returnDate,
        travelers: tripData.travelers,
        tripCost: tripData.estimatedCost || 0,
      };
      
      // Fetch all provider plans
      const { plans, errors } = await fetchAllProviderPlans(normalizedTripData);
      
      // Store errors in cache for reference
      queryClient.setQueryData(
        CACHE_KEYS.planErrors, 
        errors
      );
      
      // Filter out invalid plans
      const validPlans = plans.filter(validatePlan);
      
      // Cache plans by provider for quicker filtering
      providerConfigs.forEach(provider => {
        const providerPlans = validPlans.filter(plan => plan.provider === provider.name);
        
        if (providerPlans.length > 0) {
          queryClient.setQueryData(
            CACHE_KEYS.plansByProvider(provider.name),
            providerPlans
          );
        }
      });
      
      // Cache each plan individually
      validPlans.forEach(plan => {
        queryClient.setQueryData(
          CACHE_KEYS.planById(plan.id),
          plan
        );
      });
      
      return validPlans;
    },
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.cacheTime,
    retry: CACHE_CONFIG.retryCount,
    retryDelay: CACHE_CONFIG.retryDelay,
    ...options,
  });
};

/**
 * Hook to fetch and cache a specific insurance plan by ID
 */
export const usePlanById = (planId: string | number, options?: UseQueryOptions<InsurancePlan>) => {
  return useQuery<InsurancePlan, Error, InsurancePlan>({
    queryKey: CACHE_KEYS.planById(planId),
    queryFn: async () => {
      // Try to get from cache first
      const queryClient = useQueryClient();
      const cachedPlan = queryClient.getQueryData<InsurancePlan>(CACHE_KEYS.planById(planId));
      
      if (cachedPlan) {
        return cachedPlan;
      }
      
      // If not in cache, fetch from server
      const response = await fetch(`/api/plans/${planId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch plan with ID ${planId}`);
      }
      
      const plan = await response.json();
      return plan;
    },
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.cacheTime,
    ...options,
  });
};

/**
 * Hook to get API errors that occurred during plan fetching
 */
export const usePlanErrors = () => {
  return useQuery<Record<string, ApiError>>({
    queryKey: CACHE_KEYS.planErrors,
    queryFn: async () => {
      // This will typically be populated by usePlansForTrip
      // but we provide an empty object as fallback
      return {};
    },
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.cacheTime,
  });
};

/**
 * Hook to invalidate caches when user changes filters or refreshes
 */
export const useInvalidatePlansCache = () => {
  const queryClient = useQueryClient();
  
  // For TanStack Query v5, we need to always pass a variable to mutations
  return useMutation({
    mutationFn: async (options: { tripId?: string | number } = {}) => {
      const { tripId } = options;
      
      if (tripId) {
        // Invalidate only the specified trip's plans
        await queryClient.invalidateQueries({
          queryKey: CACHE_KEYS.plansByTrip(tripId),
        });
      } else {
        // Invalidate all plans
        await queryClient.invalidateQueries({
          queryKey: CACHE_KEYS.allPlans,
        });
      }
      
      return true;
    }
  });
};