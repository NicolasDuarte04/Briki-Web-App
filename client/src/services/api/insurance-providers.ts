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
  endpointPath?: string; // Custom endpoint path, defaults to "/plans"
  responseFormat?: 'standard' | 'nested' | 'array'; // How the response is structured
  supportedCountries?: string[]; // Countries this provider supports
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
    timeout: 10000,
    responseFormat: 'nested',
    endpointPath: '/quotes/travel',
    supportedCountries: ['US', 'CA', 'MX', 'CO']
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
    timeout: 12000,
    responseFormat: 'standard',
    endpointPath: '/insurance/quotes',
    supportedCountries: ['US', 'CA', 'GB', 'AU', 'NZ', 'DE', 'FR', 'ES', 'MX', 'CO']
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
    timeout: 8000,
    responseFormat: 'nested',
    endpointPath: '/quotes',
    supportedCountries: ['US', 'CA', 'MX', 'BR', 'CO', 'DE', 'ES', 'FR', 'IT', 'GB']
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
    timeout: 15000,
    responseFormat: 'standard',
    endpointPath: '/travel/quotes',
    supportedCountries: ['US', 'CA', 'FR', 'ES', 'IT', 'DE', 'GB', 'MX', 'CO', 'BR']
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
    timeout: 10000,
    responseFormat: 'array',
    endpointPath: '/quote/travel',
    supportedCountries: ['US', 'CA', 'MX', 'CO', 'BR']
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
    timeout: 12000,
    responseFormat: 'nested',
    endpointPath: '/quotes/travel',
    supportedCountries: ['US', 'CA', 'MX', 'BR', 'CO', 'AR', 'CL']
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
    timeout: 10000,
    responseFormat: 'standard',
    endpointPath: '/quotes/policies',
    supportedCountries: ['US', 'CA', 'MX', 'GB']
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
    timeout: 8000,
    responseFormat: 'standard',
    endpointPath: '/trip/quotes',
    supportedCountries: ['US', 'CA', 'NO', 'SE', 'DK', 'FI', 'GB', 'DE', 'FR', 'ES', 'IT', 'MX', 'CO', 'BR']
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
    timeout: 15000,
    responseFormat: 'nested',
    endpointPath: '/quotes',
    supportedCountries: ['US', 'CA', 'MX', 'CO']
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
    timeout: 12000,
    responseFormat: 'nested',
    endpointPath: '/travel/quotes',
    supportedCountries: ['US', 'CA', 'MX', 'CO', 'BR']
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
    timeout: 10000,
    responseFormat: 'standard',
    endpointPath: '/quotes',
    supportedCountries: ['US', 'CA']
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
    timeout: 12000,
    responseFormat: 'array',
    endpointPath: '/quotes/compare',
    supportedCountries: ['US', 'CA', 'MX', 'CO', 'BR', 'AR', 'CL', 'EC', 'PE', 'UY', 'PY', 'BO', 'VE']
  }
];

// API response error type
export interface ApiError {
  statusCode: number;
  message: string;
  providerName: string;
  retryable: boolean;
  timestamp: Date;
  details?: Record<string, any>; // Additional error details
}

// Provider rate limiting tracker
const rateLimitTracker: Record<string, {
  requestCount: number;
  resetTime: number;
}> = {};

// Get the appropriate endpoint for a provider
const getProviderEndpoint = (provider: ProviderConfig, tripData: any): string => {
  // Use custom endpoint path if specified, otherwise use default "/plans"
  const endpointPath = provider.endpointPath || '/plans';
  
  // Special case handling for certain providers
  switch (provider.name) {
    case 'Allianz': 
      // Allianz uses a country-specific endpoint
      const countryCode = tripData.destination?.substring(0, 2)?.toLowerCase() || 'us';
      return `${provider.baseUrl}/${countryCode}${endpointPath}`;
      
    case 'WorldNomads':
      // WorldNomads includes trip duration in URL
      const duration = calculateTripDuration(tripData.departureDate, tripData.returnDate);
      return `${provider.baseUrl}${endpointPath}?duration=${duration}`;
      
    case 'HTH':
      // HTH has a specific endpoint for international travel
      return tripData.origin !== tripData.destination 
        ? `${provider.baseUrl}/international${endpointPath}`
        : `${provider.baseUrl}/domestic${endpointPath}`;
        
    default:
      return `${provider.baseUrl}${endpointPath}`;
  }
};

// Format trip data according to provider requirements
const formatTripDataForProvider = (provider: ProviderConfig, tripData: any): Record<string, any> => {
  // Base data structure all providers use
  const baseFormattedData = {
    destination: tripData.destination,
    origin: tripData.origin,
    departure_date: tripData.departureDate,
    return_date: tripData.returnDate,
    travelers: tripData.travelers,
    trip_cost: tripData.tripCost
  };
  
  // Provider-specific formatting
  switch (provider.name) {
    case 'GeoBlue':
      return {
        ...baseFormattedData,
        trip_details: {
          destination_country: tripData.destination,
          origin_country: tripData.origin,
          start_date: tripData.departureDate,
          end_date: tripData.returnDate,
          traveler_count: tripData.travelers,
          estimated_cost: tripData.tripCost
        }
      };
      
    case 'Allianz':
      return {
        tripInfo: {
          destination: tripData.destination,
          departFrom: tripData.origin,
          departureDate: tripData.departureDate,
          returnDate: tripData.returnDate,
          travelers: Number(tripData.travelers),
          tripCost: Number(tripData.tripCost || 0)
        }
      };
      
    case 'TravelGuard':
      // TravelGuard requires traveler age information
      return {
        ...baseFormattedData,
        traveler_ages: new Array(Number(tripData.travelers))
          .fill(35) // Default age if not provided
      };
      
    default:
      return baseFormattedData;
  }
};

// Calculate trip duration in days
const calculateTripDuration = (departureDate: string, returnDate: string): number => {
  try {
    const start = new Date(departureDate);
    const end = new Date(returnDate);
    const durationMs = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));
  } catch (error) {
    console.error('Error calculating trip duration:', error);
    return 7; // Default to 7 days if calculation fails
  }
};

// Handle provider-specific error responses
const handleProviderSpecificErrors = (provider: ProviderConfig, response: Response): ApiError | null => {
  // Handle special error cases for specific providers
  switch (provider.name) {
    case 'Allianz':
      // Allianz sometimes returns 200 with error in the body
      if (response.status === 200 && response.headers.get('X-Error-Code')) {
        return {
          statusCode: 400,
          message: `Allianz error: ${response.headers.get('X-Error-Message') || 'Unknown error'}`,
          providerName: provider.name,
          retryable: false,
          timestamp: new Date(),
          details: { 
            errorCode: response.headers.get('X-Error-Code'),
            errorType: response.headers.get('X-Error-Type')
          }
        };
      }
      break;
      
    case 'TravelGuard':
      // TravelGuard sometimes uses custom error headers
      if (!response.ok && response.headers.get('X-TG-Error')) {
        return {
          statusCode: response.status,
          message: response.headers.get('X-TG-Error-Message') || `TravelGuard error`,
          providerName: provider.name,
          retryable: response.status >= 500,
          timestamp: new Date()
        };
      }
      break;
  }
  
  return null;
};

// Extract plans from provider response based on their format
const extractProviderPlans = (provider: ProviderConfig, response: any): Array<Record<string, any>> => {
  // If the response is null or undefined, return an empty array
  if (!response) return [];
  
  // Extract plans based on provider's response format
  switch (provider.responseFormat) {
    case 'nested':
      // Handle nested response format (e.g., response.data.products)
      if (response.data?.products) return response.data.products;
      if (response.data?.plans) return response.data.plans;
      if (response.results?.plans) return response.results.plans;
      break;
      
    case 'array':
      // Response is directly an array of plans
      if (Array.isArray(response)) return response;
      break;
      
    default:
      // Standard format, look in common locations
      if (Array.isArray(response.plans)) return response.plans;
      if (Array.isArray(response.products)) return response.products;
      if (Array.isArray(response.quotes)) return response.quotes;
      if (Array.isArray(response.options)) return response.options;
      
      // If we can't find a plans array, but the response looks like a single plan,
      // wrap it in an array
      if (response.id || response.name || response.price) return [response];
  }
  
  console.warn(`Could not extract plans from ${provider.name} response:`, response);
  return [];
};

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
  
  // Set defaults if missing or normalize formats for consistency
  
  // Ensure numeric fields
  if (normalizedData.basePrice !== undefined) {
    if (typeof normalizedData.basePrice === 'string') {
      // Remove currency symbols and commas
      const cleanedValue = (normalizedData.basePrice as string)
        .replace(/[$€£,]/g, '')
        .trim();
      
      const parsed = parseFloat(cleanedValue);
      if (!isNaN(parsed)) {
        normalizedData.basePrice = parsed;
      }
    }
  }
  
  // Normalize medical coverage
  if (normalizedData.medicalCoverage !== undefined) {
    if (typeof normalizedData.medicalCoverage === 'string') {
      // Handle dollar amounts like "$100,000" or text like "Up to $1,000,000"
      const matches = (normalizedData.medicalCoverage as string)
        .match(/\$?([0-9,]+)(?:\s*(?:USD|EUR|GBP))?/);
      
      if (matches && matches[1]) {
        const parsedValue = parseFloat(matches[1].replace(/,/g, ''));
        if (!isNaN(parsedValue)) {
          normalizedData.medicalCoverage = parsedValue;
        }
      }
    }
  }
  
  // Normalize trip cancellation
  if (normalizedData.tripCancellation !== undefined) {
    if (typeof normalizedData.tripCancellation === 'number') {
      // If it's a dollar amount, keep as is
      // Do nothing
    } else if (typeof normalizedData.tripCancellation === 'string') {
      // Check if it contains a number with a currency symbol
      const matches = (normalizedData.tripCancellation as string)
        .match(/\$?([0-9,]+)(?:\s*(?:USD|EUR|GBP))?/);
      
      if (matches && matches[1]) {
        const parsedValue = parseFloat(matches[1].replace(/,/g, ''));
        if (!isNaN(parsedValue)) {
          // If it's a numeric amount, convert to string representation
          normalizedData.tripCancellation = `Up to $${parsedValue.toLocaleString()}`;
        }
      } else {
        // Text descriptions like "100% of trip cost" are kept as is
        // If it doesn't contain any identifiable amount, normalize the format
        if (!(normalizedData.tripCancellation as string).toLowerCase().includes('up to')) {
          normalizedData.tripCancellation = (normalizedData.tripCancellation as string).trim();
        }
      }
    }
  } else {
    // Default value if missing
    normalizedData.tripCancellation = "Not covered";
  }
  
  // For baggage protection
  if (normalizedData.baggageProtection === undefined) {
    normalizedData.baggageProtection = 0; // Default to 0 if not provided
  }
  
  // For adventure activities
  if (normalizedData.adventureActivities === undefined) {
    normalizedData.adventureActivities = false; // Default to false if not provided
  }
  
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
        timestamp: new Date(),
        details: { rateLimitReset: rateLimitTracker[provider.name]?.resetTime }
      } as ApiError;
    }
    
    // Increment rate limit counter
    incrementRateLimit(provider);
    
    // Check if provider API key is present
    if ((provider.authType !== 'none') && !provider.apiKey) {
      throw {
        statusCode: 401,
        message: `API key missing for ${provider.name}`,
        providerName: provider.name,
        retryable: false,
        timestamp: new Date(),
        details: { requiresConfiguration: true }
      } as ApiError;
    }
    
    // Build authentication headers
    const headers = await getAuthHeaders(provider);
    
    // Set up request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), provider.timeout || 10000);
    
    // Determine endpoint based on provider - some providers use different endpoints
    const endpoint = getProviderEndpoint(provider, tripData);
    
    // Make the API request with retry logic
    const response = await retryRequest(async () => {
      try {
        // Prepare request body with provider-specific formatting
        const formattedTripData = formatTripDataForProvider(provider, tripData);
        
        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(formattedTripData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Check for provider-specific error handling
        const customError = handleProviderSpecificErrors(provider, res);
        if (customError) throw customError;
        
        if (!res.ok) {
          // Attempt to parse error response
          const errorData = await res.json().catch(() => ({}));
          
          throw {
            statusCode: res.status,
            message: errorData.message || `Error from ${provider.name}: ${res.statusText}`,
            providerName: provider.name,
            retryable: res.status >= 500 || res.status === 429,
            timestamp: new Date(),
            details: errorData
          } as ApiError;
        }
        
        const responseData = await res.json();
        // Log successful response for debugging
        console.debug(`${provider.name} API response:`, 
          JSON.stringify(responseData).substring(0, 200) + '...');
        
        return responseData;
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
    }, provider.authType === 'oauth' ? 2 : 3); // Fewer retries for OAuth to avoid token issues
    
    // Extract and normalize the data with provider-specific extraction
    const plans = extractProviderPlans(provider, response);
    
    // Apply normalization and validation
    const normalizedPlans = plans
      .map((plan: Record<string, any>) => {
        const normalizedPlan = {
          ...normalizeProviderData(plan, provider.mapping),
          provider: provider.name
        } as InsurancePlan;
        
        // Apply basic validation during normalization
        return normalizedPlan;
      })
      .filter(validatePlan); // Remove invalid plans
      
    console.log(`Successfully fetched ${normalizedPlans.length} plans from ${provider.name}`);
    return normalizedPlans;
  } catch (error: any) {
    // Enhanced error logging with details
    console.error(`Error fetching from ${provider.name}:`, error);
    // Ensure the error has the ApiError format
    if (!error.providerName) {
      error = {
        statusCode: error.statusCode || 500,
        message: error.message || `Unknown error from ${provider.name}`,
        providerName: provider.name,
        retryable: error.retryable !== undefined ? error.retryable : true,
        timestamp: new Date()
      };
    }
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
    if (plan[field] === undefined || plan[field] === null || plan[field] === '') {
      console.warn(`Plan is missing required field: ${field}`, plan);
      return false;
    }
  }
  
  // Validate numeric fields
  const numericFields: (keyof InsurancePlan)[] = [
    'basePrice', 
    'medicalCoverage', 
    'emergencyEvacuation', 
    'baggageProtection',
    'rentalCarCoverage'
  ];
  
  for (const field of numericFields) {
    if (plan[field] !== undefined) {
      // Convert string numbers to actual numbers if needed
      if (typeof plan[field] === 'string') {
        const parsed = parseFloat(plan[field] as string);
        if (!isNaN(parsed)) {
          (plan[field] as any) = parsed;
        } else {
          console.warn(`Plan field ${field} contains invalid number: ${plan[field]}`, plan);
          return false;
        }
      } else if (typeof plan[field] !== 'number') {
        console.warn(`Plan field ${field} should be a number`, plan);
        return false;
      }
      
      // Ensure numeric fields are positive
      if ((plan[field] as number) < 0) {
        console.warn(`Plan field ${field} should be positive: ${plan[field]}`, plan);
        return false;
      }
    }
  }
  
  // Validate boolean fields
  const booleanFields: (keyof InsurancePlan)[] = ['adventureActivities'];
  
  for (const field of booleanFields) {
    if (plan[field] !== undefined) {
      // Convert string booleans to actual booleans if needed
      if (typeof plan[field] === 'string') {
        const value = (plan[field] as string).toLowerCase();
        if (value === 'true' || value === 'yes' || value === '1') {
          (plan[field] as any) = true;
        } else if (value === 'false' || value === 'no' || value === '0') {
          (plan[field] as any) = false;
        } else {
          console.warn(`Plan field ${field} contains invalid boolean: ${plan[field]}`, plan);
          return false;
        }
      } else if (typeof plan[field] !== 'boolean') {
        console.warn(`Plan field ${field} should be a boolean`, plan);
        return false;
      }
    }
  }
  
  // Validate name is reasonable (some APIs return very long names)
  if (typeof plan.name === 'string' && plan.name.length > 200) {
    plan.name = plan.name.substring(0, 197) + '...';
  }
  
  // Sanitize provider name
  if (typeof plan.provider === 'string') {
    const providerMatch = INSURANCE_PROVIDERS.find(
      p => p.name.toLowerCase() === plan.provider?.toString().toLowerCase()
    );
    
    if (providerMatch) {
      plan.provider = providerMatch.name; // Use exact casing from provider config
    }
  }
  
  // For missing country, default to "all"
  if (!plan.country) {
    plan.country = "all";
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