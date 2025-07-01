import { AnonymousUserData } from '../contexts/anonymous-user-context';
import { User } from '../contexts/AuthContext';

/**
 * Handles migration of anonymous user data to authenticated user account
 * @param anonymousData The anonymous user data to migrate
 * @param user The authenticated user to migrate data to
 * @returns A promise that resolves when migration is complete
 */
export async function migrateAnonymousDataToUser(
  anonymousData: AnonymousUserData,
  user: User
): Promise<boolean> {
  try {
    // Skip if no valuable data to migrate
    if (!anonymousData.tempQuoteData && !anonymousData.preferences) {
      return false;
    }
    
    // Prepare the data payload
    const migrationPayload = {
      anonymousId: anonymousData.anonymousId,
      userId: user.id,
      quoteData: anonymousData.tempQuoteData || null,
      preferences: anonymousData.preferences || null,
      createdAt: anonymousData.createdAt,
      lastActive: anonymousData.lastActive
    };
    
    // Send data to API
    const response = await fetch('/api/users/migrate-anonymous-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(migrationPayload),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Failed to migrate anonymous data:', error);
    return false;
  }
}

/**
 * Clears anonymous user data after successful migration
 * @returns void
 */
export function clearAnonymousData(): void {
  const keys = [
    'briki-anonymous-id',
    'briki-anonymous-data'
  ];
  
  // Find any additional keys that match the pattern
  if (typeof localStorage !== 'undefined') {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('briki-anon-')) {
        keys.push(key);
      }
    });
    
    // Clear all anonymous data
    keys.forEach(key => localStorage.removeItem(key));
  }
}

/**
 * Retrieves a public quote by its tracking ID
 * Useful for anonymous users to access their quotes later
 * @param quoteTrackingId The tracking ID for the quote
 * @returns The quote data or null if not found
 */
export async function retrievePublicQuote(quoteTrackingId: string): Promise<any> {
  try {
    const response = await fetch(`/api/quotes/public/${quoteTrackingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.quote || null;
  } catch (error) {
    console.error('Failed to retrieve public quote:', error);
    return null;
  }
}

/**
 * Generates a short tracking ID for anonymous quotes
 * @returns A unique tracking ID
 */
export function generateQuoteTrackingId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 6);
  return `${timestamp}-${randomPart}`;
}

/**
 * Determines whether anonymous data is valuable enough to migrate
 * @param anonymousData The anonymous user data to evaluate
 * @returns Boolean indicating if data should be migrated
 */
export function shouldMigrateAnonymousData(anonymousData: AnonymousUserData): boolean {
  // Check if there's quote data
  const hasQuoteData = !!anonymousData.tempQuoteData && (
    !!anonymousData.tempQuoteData.tripInfo ||
    !!anonymousData.tempQuoteData.quoteParams ||
    (anonymousData.tempQuoteData.selectedPlans || []).length > 0
  );
  
  // Check if there are preferences
  const hasPreferences = !!anonymousData.preferences && (
    !!anonymousData.preferences.language ||
    !!anonymousData.preferences.currency ||
    (anonymousData.preferences.recentSearches || []).length > 0
  );
  
  return hasQuoteData || hasPreferences;
}