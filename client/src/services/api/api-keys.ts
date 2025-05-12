/**
 * This module handles the secure retrieval and management of API keys for insurance providers
 */

import { INSURANCE_PROVIDERS, ProviderConfig } from './insurance-providers';

// Interface for storing API key information
interface ApiKeyInfo {
  provider: string;
  key: string;
  expiresAt?: number; // Unix timestamp
}

// In-memory storage for API keys
// In a production environment, this would be stored in a secure backend
// and accessed via environment variables or secure vaults
const API_KEYS: Record<string, ApiKeyInfo> = {};

/**
 * Initialize provider with API key
 * @param provider Provider name
 * @param apiKey API key
 * @param expirationMinutes Minutes until expiration (optional)
 */
export const setProviderApiKey = (
  provider: string,
  apiKey: string,
  expirationMinutes?: number
): void => {
  API_KEYS[provider] = {
    provider,
    key: apiKey,
    expiresAt: expirationMinutes 
      ? Date.now() + (expirationMinutes * 60 * 1000)
      : undefined
  };
};

/**
 * Get API key for a provider
 * @param provider Provider name
 * @returns API key if found and not expired, otherwise null
 */
export const getProviderApiKey = (provider: string): string | null => {
  const keyInfo = API_KEYS[provider];
  
  if (!keyInfo) {
    return null;
  }
  
  // Check if key is expired
  if (keyInfo.expiresAt && keyInfo.expiresAt < Date.now()) {
    delete API_KEYS[provider];
    return null;
  }
  
  return keyInfo.key;
};

/**
 * Revoke API key for a provider
 * @param provider Provider name
 */
export const revokeProviderApiKey = (provider: string): void => {
  delete API_KEYS[provider];
};

/**
 * Initialize provider configuration with API key
 * @param provider Provider configuration
 * @returns Updated provider configuration with API key
 */
export const initializeProviderWithApiKey = (provider: ProviderConfig): ProviderConfig => {
  const apiKey = getProviderApiKey(provider.name);
  
  if (!apiKey) {
    return provider;
  }
  
  return {
    ...provider,
    apiKey
  };
};

/**
 * Get all provider configurations with their API keys
 * @returns Array of provider configurations with API keys
 */
export const getProvidersWithApiKeys = (): ProviderConfig[] => {
  return INSURANCE_PROVIDERS.map(initializeProviderWithApiKey);
};

/**
 * Check if all required API keys are set
 * @returns Object with status and missing providers
 */
export const checkRequiredApiKeys = (): { 
  ready: boolean; 
  missingProviders: string[] 
} => {
  const missingProviders = INSURANCE_PROVIDERS
    .filter(provider => provider.authType !== 'none')
    .filter(provider => !getProviderApiKey(provider.name))
    .map(provider => provider.name);
  
  return {
    ready: missingProviders.length === 0,
    missingProviders
  };
};