import { queryClient } from "@/lib/queryClient";
import { InsurancePlan } from "@shared/schema";

// Provider API configuration
export interface ProviderConfig {
  name: string;
  baseUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
  authType: 'apiKey' | 'bearer' | 'oauth' | 'none';
  mapping: Record<string, string>; // Maps provider fields to our schema
  rateLimitPerMinute?: number;
  timeout?: number; // ms
}

// List of all insurance providers
export const INSURANCE_PROVIDERS: ProviderConfig[] = [
  {
    name: "GeoBlue",
    baseUrl: "https://api.geo-blue.com/v2",
    authType: "apiKey",
    mapping: {
      id: "plan_id",
      name: "plan_name",
      basePrice: "base_premium",
      medicalCoverage: "medical_coverage_amount",
      tripCancellation: "cancellation_coverage"
    },
    rateLimitPerMinute: 100,
    timeout: 10000
  },
  {
    name: "WorldNomads",
    baseUrl: "https://api.worldnomads.com/v3",
    authType: "bearer",
    mapping: {
      id: "product_id",
      name: "product_name",
      basePrice: "premium",
      medicalCoverage: "emergency_medical_coverage",
      tripCancellation: "trip_cancellation_coverage"
    },
    rateLimitPerMinute: 80,
    timeout: 12000
  },
  {
    name: "Allianz",
    baseUrl: "https://travel-api.allianz.com/v2",
    authType: "oauth",
    mapping: {
      id: "planId",
      name: "planName",
      basePrice: "premium",
      medicalCoverage: "medicalLimit",
      tripCancellation: "cancellationCoverage"
    },
    rateLimitPerMinute: 120,
    timeout: 8000
  },
  {
    name: "AXA",
    baseUrl: "https://api.axa-assistance.com/insurance/v3",
    authType: "bearer",
    mapping: {
      id: "plan_identifier",
      name: "plan_title",
      basePrice: "cost",
      medicalCoverage: "medical_emergency_coverage",
      tripCancellation: "cancellation_reimbursement"
    },
    rateLimitPerMinute: 90,
    timeout: 15000
  },
  {
    name: "Trawick",
    baseUrl: "https://api.trawickinternational.com/v1",
    authType: "apiKey",
    mapping: {
      id: "plan_code",
      name: "plan_title",
      basePrice: "premium_amount",
      medicalCoverage: "medical_limit",
      tripCancellation: "trip_cancellation_limit"
    },
    rateLimitPerMinute: 60,
    timeout: 10000
  },
  {
    name: "IMG",
    baseUrl: "https://api.internationalmedicalgroup.com/v2",
    authType: "apiKey",
    mapping: {
      id: "product_code",
      name: "product_name",
      basePrice: "premium_amount",
      medicalCoverage: "medical_maximum",
      tripCancellation: "trip_interruption"
    },
    rateLimitPerMinute: 70,
    timeout: 12000
  },
  {
    name: "TravelGuard",
    baseUrl: "https://api.travelguard.com/v3",
    authType: "oauth",
    mapping: {
      id: "policy_id",
      name: "policy_name",
      basePrice: "total_premium",
      medicalCoverage: "medical_expense_limit",
      tripCancellation: "trip_cancellation_coverage"
    },
    rateLimitPerMinute: 80,
    timeout: 10000
  },
  {
    name: "SafetyWing",
    baseUrl: "https://api.safetywing.com/v1",
    authType: "bearer",
    mapping: {
      id: "product_id",
      name: "product_name",
      basePrice: "base_price",
      medicalCoverage: "medical_coverage",
      tripCancellation: "trip_interruption"
    },
    rateLimitPerMinute: 100,
    timeout: 8000
  },
  {
    name: "HTH",
    baseUrl: "https://api.hthtravelinsurance.com/v2",
    authType: "apiKey",
    mapping: {
      id: "plan_id",
      name: "plan_name",
      basePrice: "premium",
      medicalCoverage: "medical_maximum",
      tripCancellation: "trip_cancellation"
    },
    rateLimitPerMinute: 60,
    timeout: 15000
  },
  {
    name: "Seven Corners",
    baseUrl: "https://api.sevencorners.com/v2",
    authType: "oauth",
    mapping: {
      id: "plan_id",
      name: "plan_name",
      basePrice: "total_price",
      medicalCoverage: "medical_coverage_amount",
      tripCancellation: "trip_cancellation_amount"
    },
    rateLimitPerMinute: 80,
    timeout: 12000
  },
  {
    name: "Berkshire Hathaway",
    baseUrl: "https://api.bhtp.com/v1",
    authType: "bearer",
    mapping: {
      id: "plan_code",
      name: "plan_title",
      basePrice: "plan_price",
      medicalCoverage: "medical_limit",
      tripCancellation: "cancellation_amount"
    },
    rateLimitPerMinute: 90,
    timeout: 10000
  },
  {
    name: "InsureMyTrip",
    baseUrl: "https://api.insuremytrip.com/v2",
    authType: "apiKey",
    mapping: {
      id: "quote_id",
      name: "policy_name",
      basePrice: "premium_amount",
      medicalCoverage: "medical_coverage_limit",
      tripCancellation: "trip_cost_protection"
    },
    rateLimitPerMinute: 100,
    timeout: 12000
  }
];

// API response error type
export interface ApiError {
  statusCode: number;
  message: string;
  providerName: string;
  retryable: boolean;
  timestamp: Date;
}

// Provider rate limiting tracker
const rateLimitTracker: Record<string, {
  requestCount: number;
  resetTime: number;
}> = {};

// Helper to check if a provider is rate limited
const isRateLimited = (provider: ProviderConfig): boolean => {
  const now = Date.now();
  const tracker = rateLimitTracker[provider.name];
  
  // If no tracker exists or the reset time has passed, create a new tracker
  if (!tracker || tracker.resetTime < now) {
    rateLimitTracker[provider.name] = {
      requestCount: 0,
      resetTime: now + 60000 // Reset after 1 minute
    };
    return false;
  }
  
  // Check if rate limit is exceeded
  return tracker.requestCount >= (provider.rateLimitPerMinute || 100);
};

// Increment the rate limit counter for a provider
const incrementRateLimit = (provider: ProviderConfig): void => {
  const tracker = rateLimitTracker[provider.name];
  if (tracker) {
    tracker.requestCount += 1;
  }
};

// Data normalization function
export const normalizeProviderData = (
  providerData: any, 
  mapping: Record<string, string>
): Partial<InsurancePlan> => {
  const normalizedData: Partial<InsurancePlan> = {};
  
  // Map each field from provider format to our schema
  Object.entries(mapping).forEach(([ourField, theirField]) => {
    // Handle nested properties with dot notation (e.g., "coverage.medical")
    if (theirField.includes('.')) {
      const parts = theirField.split('.');
      let value = providerData;
      
      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = value[part];
        } else {
          value = undefined;
          break;
        }
      }
      
      if (value !== undefined) {
        normalizedData[ourField as keyof InsurancePlan] = value;
      }
    } 
    // Handle direct property mapping
    else if (providerData && theirField in providerData) {
      normalizedData[ourField as keyof InsurancePlan] = providerData[theirField];
    }
  });
  
  return normalizedData;
};

// Authentication header builder
const getAuthHeaders = async (provider: ProviderConfig): Promise<HeadersInit> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...provider.headers
  };
  
  switch (provider.authType) {
    case 'apiKey':
      if (provider.apiKey) {
        headers['X-API-Key'] = provider.apiKey;
      } else {
        throw new Error(`API key required for ${provider.name} but not provided`);
      }
      break;
    
    case 'bearer':
      // In a real implementation, this would retrieve or refresh tokens as needed
      // For now, we'll assume the bearer token is in the provider.apiKey
      if (provider.apiKey) {
        headers['Authorization'] = `Bearer ${provider.apiKey}`;
      } else {
        throw new Error(`Bearer token required for ${provider.name} but not provided`);
      }
      break;
      
    case 'oauth':
      // For OAuth, we'd typically have a more complex flow to retrieve tokens
      // This is simplified for this implementation
      if (provider.apiKey) {
        headers['Authorization'] = `OAuth ${provider.apiKey}`;
      } else {
        throw new Error(`OAuth token required for ${provider.name} but not provided`);
      }
      break;
  }
  
  return headers;
};

// Retry logic for failed requests
const retryRequest = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  backoff = 2
): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    // Don't retry if we're out of retries or the error is not retryable
    if (retries <= 0 || (error.retryable === false)) {
      throw error;
    }
    
    // Wait for the specified delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry with backoff
    return retryRequest(fn, retries - 1, delay * backoff, backoff);
  }
};

// Fetch plans from a specific provider
export const fetchProviderPlans = async (
  provider: ProviderConfig,
  tripData: any
): Promise<InsurancePlan[]> => {
  try {
    // Check rate limiting
    if (isRateLimited(provider)) {
      throw {
        statusCode: 429,
        message: `Rate limit exceeded for ${provider.name}`,
        providerName: provider.name,
        retryable: true,
        timestamp: new Date()
      } as ApiError;
    }
    
    // Increment rate limit counter
    incrementRateLimit(provider);
    
    // Build authentication headers
    const headers = await getAuthHeaders(provider);
    
    // Set up request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), provider.timeout || 10000);
    
    // Make the API request with retry logic
    const response = await retryRequest(async () => {
      try {
        const res = await fetch(`${provider.baseUrl}/plans`, {
          method: 'POST',
          headers,
          body: JSON.stringify(tripData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw {
            statusCode: res.status,
            message: errorData.message || `Error from ${provider.name}: ${res.statusText}`,
            providerName: provider.name,
            retryable: res.status >= 500 || res.status === 429,
            timestamp: new Date()
          } as ApiError;
        }
        
        return await res.json();
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw {
            statusCode: 408,
            message: `Request to ${provider.name} timed out`,
            providerName: provider.name,
            retryable: true,
            timestamp: new Date()
          } as ApiError;
        }
        throw error;
      }
    });
    
    // Normalize the data
    const plans = Array.isArray(response.plans) ? response.plans : [response];
    return plans.map((plan: Record<string, any>) => ({
      ...normalizeProviderData(plan, provider.mapping),
      provider: provider.name
    })) as InsurancePlan[];
  } catch (error: any) {
    console.error(`Error fetching from ${provider.name}:`, error);
    throw error;
  }
};

// Fetch all provider plans in parallel with error handling
export const fetchAllProviderPlans = async (tripData: any): Promise<{
  plans: InsurancePlan[];
  errors: Record<string, ApiError>;
}> => {
  const results = await Promise.allSettled(
    INSURANCE_PROVIDERS.map(provider => fetchProviderPlans(provider, tripData))
  );
  
  const plans: InsurancePlan[] = [];
  const errors: Record<string, ApiError> = {};
  
  results.forEach((result, index) => {
    const providerName = INSURANCE_PROVIDERS[index].name;
    
    if (result.status === 'fulfilled') {
      plans.push(...result.value);
    } else {
      errors[providerName] = result.reason as ApiError;
    }
  });
  
  return { plans, errors };
};

// Validate a plan's data integrity
export const validatePlan = (plan: Partial<InsurancePlan>): boolean => {
  // Check if required fields exist and are of the correct type
  const requiredFields: (keyof InsurancePlan)[] = ['id', 'name', 'basePrice', 'provider'];
  
  for (const field of requiredFields) {
    if (plan[field] === undefined || plan[field] === null) {
      console.warn(`Plan is missing required field: ${field}`, plan);
      return false;
    }
  }
  
  // Validate numeric fields
  const numericFields: (keyof InsurancePlan)[] = ['basePrice', 'medicalCoverage', 'emergencyEvacuation'];
  
  for (const field of numericFields) {
    if (plan[field] !== undefined && typeof plan[field] !== 'number') {
      console.warn(`Plan field ${field} should be a number`, plan);
      return false;
    }
  }
  
  return true;
};

// Prefetch and cache providers data
export const prefetchProvidersData = async (tripData: any): Promise<void> => {
  try {
    const { plans } = await fetchAllProviderPlans(tripData);
    
    // Store in cache
    queryClient.setQueryData(['/api/plans'], 
      plans.filter(plan => validatePlan(plan))
    );
  } catch (error) {
    console.error('Failed to prefetch provider data:', error);
  }
};