/**
 * API Configuration
 * Handles API URL for both development and production environments
 */

// Get API URL from environment or use default
const rawApiUrl = import.meta.env.VITE_API_URL || '';

// Clean and validate the API URL
export const API_BASE_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : ''; // Remove trailing slashes

// Log configuration for debugging
if (import.meta.env.MODE === 'production') {
  console.log('[API Config] Production mode detected');
  console.log('[API Config] Raw API URL:', rawApiUrl);
  console.log('[API Config] Cleaned API URL:', API_BASE_URL);
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Construct full API URL with validation
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
  
  // Construct full URL
  const fullUrl = `${API_BASE_URL}${normalizedEndpoint}`;
  
  // Validate in production
  if (import.meta.env.MODE === 'production' && !isValidUrl(fullUrl)) {
    console.error('[API Config] Invalid URL constructed:', fullUrl);
    console.error('[API Config] Base URL:', API_BASE_URL);
    console.error('[API Config] Endpoint:', normalizedEndpoint);
    throw new Error(`Invalid API URL pattern: ${fullUrl}`);
  }
  
  return fullUrl;
}

/**
 * Check if we're in production mode
 */
export const isProduction = import.meta.env.PROD;

/**
 * Check if API is configured for cross-origin requests
 */
export const isCrossOrigin = Boolean(API_BASE_URL); 