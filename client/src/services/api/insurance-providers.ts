/**
 * INSURANCE PROVIDER INTEGRATION INFRASTRUCTURE
 * 
 * This file defines the interface for interacting with multiple
 * insurance provider APIs, with country-specific support and 
 * standardized error handling for the multi-category marketplace.
 */

// Supported countries for insurance providers
export type SupportedCountry = 'CO' | 'MX' | 'US' | 'CA' | 'BR' | 'AR' | 'CL' | 'PE';

// Insurance categories
import { InsuranceCategory } from "@shared/schema";

// Authentication types
export type AuthType = 'apiKey' | 'bearer' | 'oauth' | 'none';

// Provider response format
export type ProviderResponseFormat = 'json' | 'xml' | 'binary';

// Standardized API error
export interface ApiError {
  provider: string;
  message: string;
  statusCode?: number;
  retryable?: boolean;
  timestamp: string;
  details?: {
    requiresConfiguration?: boolean;
    rateLimit?: boolean;
    quotaExceeded?: boolean;
    serverError?: boolean;
    errorCode?: string;
    errorResponse?: any;
  };
}

// Provider configuration
export interface ProviderConfig {
  name: string;
  apiBase: string;
  supportedCountries: SupportedCountry[];
  supportedCategories: InsuranceCategory[];
  requiresApiKey: boolean;
  authType: AuthType;
  responseFormat: ProviderResponseFormat;
  headers?: Record<string, string>;
  requestThrottling?: {
    maxRequests: number;
    perTimeWindow: number; // milliseconds
  };
  endpoints: {
    plans?: string;
    planDetails?: string;
    quote?: string;
    purchase?: string;
    status?: string;
  };
}

/**
 * Configuration for all insurance providers
 */
export const INSURANCE_PROVIDERS: ProviderConfig[] = [
  // TRAVEL INSURANCE PROVIDERS
  {
    name: 'WorldNomads',
    apiBase: 'https://api.worldnomads.com/v2',
    supportedCountries: ['CO', 'MX', 'US', 'CA'],
    supportedCategories: ['travel'],
    requiresApiKey: true,
    authType: 'apiKey',
    responseFormat: 'json',
    requestThrottling: {
      maxRequests: 100,
      perTimeWindow: 60000 // 1 minute
    },
    endpoints: {
      plans: '/plans',
      planDetails: '/plans/{id}',
      quote: '/quote',
      purchase: '/purchase',
      status: '/status'
    }
  },
  {
    name: 'Allianz',
    apiBase: 'https://api.allianz-assistance.com/v3',
    supportedCountries: ['CO', 'MX', 'US', 'CA', 'BR', 'AR'],
    supportedCategories: ['travel', 'auto'],
    requiresApiKey: true,
    authType: 'bearer',
    responseFormat: 'json',
    requestThrottling: {
      maxRequests: 150,
      perTimeWindow: 60000 // 1 minute
    },
    endpoints: {
      plans: '/products',
      planDetails: '/products/{id}',
      quote: '/quotes',
      purchase: '/policies',
      status: '/health'
    }
  },
  {
    name: 'SafetyWing',
    apiBase: 'https://api.safetywing.com/v1',
    supportedCountries: ['CO', 'MX', 'US', 'CA', 'BR', 'AR', 'CL', 'PE'],
    supportedCategories: ['travel', 'health'],
    requiresApiKey: true,
    authType: 'bearer',
    responseFormat: 'json',
    endpoints: {
      plans: '/products',
      planDetails: '/products/{id}',
      quote: '/quotes',
      purchase: '/policies',
      status: '/system/status'
    }
  },
  {
    name: 'GeoBlue',
    apiBase: 'https://api.geo-blue.com/v2',
    supportedCountries: ['CO', 'MX', 'US'],
    supportedCategories: ['travel', 'health'],
    requiresApiKey: true,
    authType: 'apiKey',
    responseFormat: 'json',
    endpoints: {
      plans: '/insurance-plans',
      planDetails: '/insurance-plans/{id}',
      quote: '/quotes',
      purchase: '/purchase',
      status: '/ping'
    }
  },
  {
    name: 'AXA',
    apiBase: 'https://api.axa-assistance.com/v2',
    supportedCountries: ['CO', 'MX', 'BR', 'AR', 'CL'],
    supportedCategories: ['travel', 'auto', 'health'],
    requiresApiKey: true,
    authType: 'bearer',
    responseFormat: 'json',
    requestThrottling: {
      maxRequests: 120,
      perTimeWindow: 60000 // 1 minute
    },
    endpoints: {
      plans: '/products',
      planDetails: '/products/{id}',
      quote: '/quotes',
      purchase: '/policies',
      status: '/status'
    }
  },
  
  // AUTO INSURANCE PROVIDERS
  {
    name: 'ProgressiveAuto',
    apiBase: 'https://api.progressive.com/v2',
    supportedCountries: ['MX', 'US'],
    supportedCategories: ['auto'],
    requiresApiKey: true,
    authType: 'apiKey',
    responseFormat: 'json',
    endpoints: {
      plans: '/auto-plans',
      planDetails: '/auto-plans/{id}',
      quote: '/auto-quote',
      purchase: '/auto-purchase',
      status: '/health'
    }
  },
  {
    name: 'LibertyMutual',
    apiBase: 'https://api.libertymutual.com/v3',
    supportedCountries: ['CO', 'MX', 'US'],
    supportedCategories: ['auto', 'health'],
    requiresApiKey: true,
    authType: 'oauth',
    responseFormat: 'json',
    endpoints: {
      plans: '/plans',
      planDetails: '/plans/{id}',
      quote: '/quotes',
      purchase: '/purchase',
      status: '/status'
    }
  },
  
  // PET INSURANCE PROVIDERS
  {
    name: 'Figo',
    apiBase: 'https://api.figopetinsurance.com/v1',
    supportedCountries: ['US', 'CA'],
    supportedCategories: ['pet'],
    requiresApiKey: true,
    authType: 'apiKey',
    responseFormat: 'json',
    endpoints: {
      plans: '/pet-plans',
      planDetails: '/pet-plans/{id}',
      quote: '/pet-quote',
      purchase: '/pet-purchase',
      status: '/system/status'
    }
  },
  {
    name: 'HealthyPaws',
    apiBase: 'https://api.healthypawspetinsurance.com/v2',
    supportedCountries: ['US'],
    supportedCategories: ['pet'],
    requiresApiKey: true,
    authType: 'bearer',
    responseFormat: 'json',
    endpoints: {
      plans: '/plans',
      planDetails: '/plans/{id}',
      quote: '/quotes',
      purchase: '/enrollment',
      status: '/status'
    }
  },
  
  // HEALTH INSURANCE PROVIDERS
  {
    name: 'Cigna',
    apiBase: 'https://api.cigna.com/v1',
    supportedCountries: ['US', 'MX'],
    supportedCategories: ['health'],
    requiresApiKey: true,
    authType: 'oauth',
    responseFormat: 'json',
    endpoints: {
      plans: '/health-plans',
      planDetails: '/health-plans/{id}',
      quote: '/quotes',
      purchase: '/enrollment',
      status: '/status'
    }
  },
  {
    name: 'Bupa',
    apiBase: 'https://api.bupaglobal.com/v2',
    supportedCountries: ['CO', 'MX', 'BR', 'CL', 'PE'],
    supportedCategories: ['health'],
    requiresApiKey: true,
    authType: 'bearer',
    responseFormat: 'json',
    endpoints: {
      plans: '/health-plans',
      planDetails: '/health-plans/{id}',
      quote: '/quotes',
      purchase: '/applications',
      status: '/status'
    }
  },
  {
    name: 'Colmena',
    apiBase: 'https://api.colmenaseguros.com/v1',
    supportedCountries: ['CO'],
    supportedCategories: ['health', 'auto'],
    requiresApiKey: true,
    authType: 'apiKey',
    responseFormat: 'json',
    endpoints: {
      plans: '/plans',
      planDetails: '/plans/{id}',
      quote: '/quotes',
      purchase: '/purchase',
      status: '/status'
    }
  }
];

/**
 * Generic type for an insurance plan from any provider
 */
export interface InsurancePlan {
  id: string;
  provider: string;
  category: InsuranceCategory;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    frequency?: 'one-time' | 'monthly' | 'annual';
  };
  coverage: {
    general: {
      amount: number;
      currency: string;
    };
    details: Record<string, any>;
  };
  benefits: string[];
  restrictions?: string[];
  countries: SupportedCountry[];
  rating?: number;
  popularityScore?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Create standardized error object for API failures
 */
export function createApiError(
  provider: string,
  message: string,
  options: Partial<ApiError> = {}
): ApiError {
  return {
    provider,
    message,
    timestamp: new Date().toISOString(),
    ...options
  };
}

/**
 * Utility to check if a provider is available for a specific country and category
 */
export function isProviderAvailable(
  provider: ProviderConfig,
  country: SupportedCountry,
  category: InsuranceCategory
): boolean {
  return (
    provider.supportedCountries.includes(country) &&
    provider.supportedCategories.includes(category)
  );
}

/**
 * Get all providers that support a specific category and country
 */
export function getProvidersForCategoryAndCountry(
  category: InsuranceCategory,
  country: SupportedCountry
): ProviderConfig[] {
  return INSURANCE_PROVIDERS.filter(provider => 
    isProviderAvailable(provider, country, category)
  );
}

/**
 * Utility function to get a provider configuration by name
 */
export function getProviderByName(name: string): ProviderConfig | undefined {
  return INSURANCE_PROVIDERS.find(provider => provider.name === name);
}