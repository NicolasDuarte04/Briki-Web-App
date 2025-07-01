/**
 * API Configuration
 * Handles API URL for both development and production environments
 */

// Get API URL from environment or use default
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Construct full API URL
 * In development, uses proxy (empty base URL)
 * In production, uses full URL from environment
 */
export function getApiUrl(endpoint: string): string {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // If no base URL, return endpoint as-is (uses Vite proxy in dev)
  if (!API_BASE_URL) {
    return normalizedEndpoint;
  }
  
  // Otherwise, construct full URL
  return `${API_BASE_URL}${normalizedEndpoint}`;
}

/**
 * Check if we're in production mode
 */
export const isProduction = import.meta.env.PROD;

/**
 * Check if API is configured for cross-origin requests
 */
export const isCrossOrigin = Boolean(API_BASE_URL); 