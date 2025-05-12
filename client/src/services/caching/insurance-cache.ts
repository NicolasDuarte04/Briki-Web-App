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
  providerStatus: ['/api/providers', 'status'] as const,
  providerStatusByName: (provider: string) => ['/api/providers', 'status', provider] as const,
  plansByCountry: (country: string) => ['/api/plans', 'country', country] as const,
  planFilters: ['/api/plans', 'filters'] as const
};

// Cache time configuration (in milliseconds)
export const CACHE_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 60 * 60 * 1000, // 1 hour
  retryDelay: 1000, // 1 second
  retryCount: 3,
  providerStatusStaleTime: 30 * 1000, // 30 seconds for provider status
  errorCacheTime: 15 * 60 * 1000, // 15 minutes for error caching
  prefetchDelay: 2000, // delay before prefetching related data
};

/**
 * Hook to fetch and cache all insurance plans for a trip
 */
export const usePlansForTrip = (tripData: Trip, options?: UseQueryOptions<InsurancePlan[]>) => {
  const queryClient = useQueryClient();
  
  return useQuery<InsurancePlan[], Error, InsurancePlan[]>({
    queryKey: CACHE_KEYS.plansByTrip(tripData.id),
    queryFn: async () => {
      try {
        // Check if we have the necessary API keys
        const apiKeyStatus = checkRequiredApiKeys();
      
        if (!apiKeyStatus.ready) {
          // Store the missing providers in the error cache
          queryClient.setQueryData(
            CACHE_KEYS.planErrors, 
            apiKeyStatus.missingProviders.reduce((acc, provider) => {
              acc[provider] = {
                statusCode: 401,
                message: `API key missing for ${provider}`,
                providerName: provider,
                retryable: false,
                timestamp: new Date(),
                details: { requiresConfiguration: true }
              };
              return acc;
            }, {} as Record<string, ApiError>)
          );
          
          throw new Error(`Missing API keys for providers: ${apiKeyStatus.missingProviders.join(', ')}`);
        }
        
        const providerConfigs = getProvidersWithApiKeys();
        
        // Check if there are no providers with API keys
        if (providerConfigs.length === 0) {
          throw new Error('No provider API keys configured. Please set up at least one provider.');
        }
        
        // Get normalized trip data for API requests
        const normalizedTripData = {
          destination: tripData.destination,
          origin: tripData.countryOfOrigin,
          departureDate: tripData.departureDate,
          returnDate: tripData.returnDate,
          travelers: tripData.travelers,
          tripCost: tripData.estimatedCost || 0,
        };
        
        // Check for valid trip dates
        if (new Date(normalizedTripData.departureDate) > new Date(normalizedTripData.returnDate)) {
          throw new Error('Departure date cannot be after return date');
        }
        
        // Log the start of the data fetching process
        console.log(`Fetching insurance plans for trip to ${normalizedTripData.destination}`);
        
        // Fetch all provider plans
        const { plans, errors } = await fetchAllProviderPlans(normalizedTripData);
        
        // Store errors in cache for reference with appropriate expiration
        queryClient.setQueryData(
          CACHE_KEYS.planErrors, 
          errors
        );
        
        // Log how many plans we got and how many errors
        console.log(`Received ${plans.length} plans with ${Object.keys(errors).length} provider errors`);
        
        // Filter out invalid plans and log why they're invalid
        const validPlans = plans.filter(plan => {
          const isValid = validatePlan(plan);
          if (!isValid) {
            console.warn(`Invalid plan filtered out:`, plan);
          }
          return isValid;
        });
        
        // If every provider returned an error, throw a comprehensive error
        if (Object.keys(errors).length === providerConfigs.length && validPlans.length === 0) {
          throw new Error('All providers failed to return valid plans. Check network connection or API keys.');
        }
        
        // Cache plans by provider for quicker filtering
        const providerPlanMap = new Map<string, InsurancePlan[]>();
        const countryPlanMap = new Map<string, InsurancePlan[]>();
        
        validPlans.forEach(plan => {
          // Group by provider
          if (!providerPlanMap.has(plan.provider)) {
            providerPlanMap.set(plan.provider, []);
          }
          providerPlanMap.get(plan.provider)?.push(plan);
          
          // Group by country
          const country = plan.country || 'all';
          if (!countryPlanMap.has(country)) {
            countryPlanMap.set(country, []);
          }
          countryPlanMap.get(country)?.push(plan);
          
          // Cache each plan individually
          queryClient.setQueryData(
            CACHE_KEYS.planById(plan.id),
            plan
          );
        });
        
        // Cache plans by provider and country
        providerPlanMap.forEach((plans, provider) => {
          queryClient.setQueryData(
            CACHE_KEYS.plansByProvider(provider),
            plans
          );
        });
        
        countryPlanMap.forEach((plans, country) => {
          queryClient.setQueryData(
            CACHE_KEYS.plansByCountry(country),
            plans
          );
        });
        
        // Store filter options for UI
        const filterOptions = {
          providers: Array.from(providerPlanMap.keys()),
          countries: Array.from(countryPlanMap.keys()),
          minPrice: Math.min(...validPlans.map(p => p.basePrice)),
          maxPrice: Math.max(...validPlans.map(p => p.basePrice)),
          timestamp: new Date()
        };
        
        queryClient.setQueryData(CACHE_KEYS.planFilters, filterOptions);
        
        // Prefetch provider status after a delay to avoid overwhelming the network
        setTimeout(() => {
          queryClient.prefetchQuery({
            queryKey: CACHE_KEYS.providerStatus,
            queryFn: async () => {
              // This would be populated by a separate provider status check
              return providerConfigs.reduce((acc, provider) => {
                acc[provider.name] = {
                  status: errors[provider.name] ? 'error' : 'online',
                  latency: Math.floor(Math.random() * 500), // In a real app, this would be actual latency
                  lastChecked: new Date(),
                  errorDetails: errors[provider.name]
                };
                return acc;
              }, {} as Record<string, any>);
            },
            staleTime: CACHE_CONFIG.providerStatusStaleTime
          });
        }, CACHE_CONFIG.prefetchDelay);
        
        return validPlans;
      } catch (error) {
        console.error('Error in usePlansForTrip:', error);
        throw error;
      }
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
    gcTime: CACHE_CONFIG.errorCacheTime,
  });
};

/**
 * Hook to get plans filtered by provider
 */
export const usePlansByProvider = (
  providerName: string,
  options?: UseQueryOptions<InsurancePlan[]>
) => {
  const queryClient = useQueryClient();
  
  return useQuery<InsurancePlan[], Error, InsurancePlan[]>({
    queryKey: CACHE_KEYS.plansByProvider(providerName),
    queryFn: async () => {
      // Try to get from cache first
      const cachedPlans = queryClient.getQueryData<InsurancePlan[]>(
        CACHE_KEYS.plansByProvider(providerName)
      );
      
      if (cachedPlans && cachedPlans.length > 0) {
        return cachedPlans;
      }
      
      // If not in cache, fetch from all plans and filter
      const allPlans = queryClient.getQueryData<InsurancePlan[]>(
        CACHE_KEYS.allPlans
      );
      
      if (allPlans) {
        const filteredPlans = allPlans.filter(
          plan => plan.provider === providerName
        );
        
        // Cache the filtered results
        if (filteredPlans.length > 0) {
          queryClient.setQueryData(
            CACHE_KEYS.plansByProvider(providerName),
            filteredPlans
          );
        }
        
        return filteredPlans;
      }
      
      // If no plans in cache, try fetching provider-specific plans from API
      try {
        const response = await fetch(`/api/plans/provider/${providerName}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch plans for provider ${providerName}`);
        }
        
        const plans = await response.json();
        
        // Validate and prepare plans before caching
        const validPlans = plans.filter(validatePlan);
        
        // Cache the valid plans
        queryClient.setQueryData(
          CACHE_KEYS.plansByProvider(providerName),
          validPlans
        );
        
        return validPlans;
      } catch (error) {
        console.error(`Error fetching plans for provider ${providerName}:`, error);
        throw error;
      }
    },
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.cacheTime,
    ...options,
  });
};

/**
 * Hook to get provider status information
 */
export const useProviderStatus = () => {
  return useQuery({
    queryKey: CACHE_KEYS.providerStatus,
    queryFn: async () => {
      try {
        // In a real application, this would make an API call to check provider status
        // Here we're assuming it was populated by usePlansForTrip
        const queryClient = useQueryClient();
        const cachedStatus = queryClient.getQueryData(CACHE_KEYS.providerStatus);
        
        if (cachedStatus) {
          return cachedStatus;
        }
        
        // If not cached, fetch provider status from API or create based on errors
        const errorData = queryClient.getQueryData<Record<string, ApiError>>(
          CACHE_KEYS.planErrors
        ) || {};
        
        // Get all provider configs
        const providers = getProvidersWithApiKeys();
        
        // Create status for each provider
        return providers.reduce((acc, provider) => {
          acc[provider.name] = {
            status: errorData[provider.name] ? 'error' : 'unknown',
            latency: null,
            lastChecked: new Date(),
            errorDetails: errorData[provider.name] || null
          };
          return acc;
        }, {} as Record<string, any>);
      } catch (error) {
        console.error('Error getting provider status:', error);
        return {};
      }
    },
    staleTime: CACHE_CONFIG.providerStatusStaleTime,
    gcTime: CACHE_CONFIG.cacheTime,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

/**
 * Hook to invalidate caches when user changes filters or refreshes
 */
export const useInvalidatePlansCache = () => {
  const queryClient = useQueryClient();
  
  // For TanStack Query v5, we need to always pass a variable to mutations
  return useMutation({
    mutationFn: async (options: { 
      tripId?: string | number;
      providerId?: string;
      clearErrors?: boolean;
      forceRefresh?: boolean;
      country?: string;
    } = {}) => {
      try {
        const { tripId, providerId, clearErrors, forceRefresh, country } = options;
        
        console.log('Invalidating cache with options:', options);
        
        // Record cache invalidation timing for performance monitoring
        const startTime = performance.now();
        
        if (forceRefresh) {
          // Force-refresh all data by invalidating everything
          console.log('Force refreshing all insurance data');
          
          // Clear error cache if requested
          if (clearErrors) {
            queryClient.setQueryData(CACHE_KEYS.planErrors, {});
            console.log('Cleared error cache');
          }
          
          // Invalidate all cached data
          await queryClient.invalidateQueries({
            predicate: (query) => {
              // Only invalidate plan-related queries
              return query.queryKey[0] === '/api/plans' || 
                     query.queryKey[0] === '/api/providers';
            }
          });
          
          console.log('All insurance data cache invalidated');
        } else if (tripId) {
          // Invalidate only the specified trip's plans
          console.log(`Invalidating cache for trip ID: ${tripId}`);
          await queryClient.invalidateQueries({
            queryKey: CACHE_KEYS.plansByTrip(tripId),
          });
        } else if (providerId) {
          // Invalidate only the specified provider's plans
          console.log(`Invalidating cache for provider: ${providerId}`);
          await queryClient.invalidateQueries({
            queryKey: CACHE_KEYS.plansByProvider(providerId),
          });
          
          // Also invalidate the provider status
          await queryClient.invalidateQueries({
            queryKey: CACHE_KEYS.providerStatusByName(providerId),
          });
        } else if (country) {
          // Invalidate only plans for a specific country
          console.log(`Invalidating cache for country: ${country}`);
          await queryClient.invalidateQueries({
            queryKey: CACHE_KEYS.plansByCountry(country),
          });
        } else {
          // Invalidate all plans but preserve provider status
          console.log('Invalidating all plan caches');
          await queryClient.invalidateQueries({
            queryKey: CACHE_KEYS.allPlans,
          });
        }
        
        // Measure and log performance
        const endTime = performance.now();
        console.log(`Cache invalidation completed in ${Math.round(endTime - startTime)}ms`);
        
        return true;
      } catch (error) {
        console.error('Error during cache invalidation:', error);
        throw error;
      }
    }
  });
};