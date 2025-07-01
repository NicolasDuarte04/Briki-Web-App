/**
 * Enhanced API utilities for making requests to the backend
 */
import { getApiUrl, isCrossOrigin } from './api-config';

// Get the auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Handle API responses that aren't OK
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || res.statusText;
    } catch (e) {
      errorMessage = await res.text() || res.statusText;
    }
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

/**
 * Make an API request to the server
 * 
 * @param url - API endpoint to call
 * @param options - Request options including method, data, etc.
 */
export async function apiRequest(url: string, options: {
  method: string;
  data?: any;
  headers?: Record<string, string>;
} = { method: 'GET' }) {
  
  // Get token from localStorage for authenticated requests
  const token = getAuthToken();
  
  const requestOptions = {
    method: options.method,
    headers: {
      ...(options.data ? { "Content-Type": "application/json" } : {}),
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.data ? JSON.stringify(options.data) : undefined,
  };
  
  try {
    // Use the API configuration to get the full URL
    const fullUrl = getApiUrl(url);
    
    // Add detailed logging for production debugging
    console.log('[API Request] Details:', {
      originalUrl: url,
      fullUrl: fullUrl,
      method: options.method,
      hasData: !!options.data,
      isCrossOrigin: isCrossOrigin,
      apiBaseUrl: import.meta.env.VITE_API_URL || 'Not set (using proxy)',
      environment: import.meta.env.MODE
    });
    
    // Add credentials for cross-origin requests
    const fetchOptions = {
      ...requestOptions,
      ...(isCrossOrigin ? { credentials: 'include' as RequestCredentials } : {})
    };
    
    const res = await fetch(fullUrl, fetchOptions);
    
    // Handle unauthorized responses
    if (res.status === 401) {
      // Clear token if it's invalid
      if (token) {
        localStorage.removeItem('auth_token');
      }
    }
    
    await throwIfResNotOk(res);
    
    // Check if the response contains a JSON body
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      // Clone the response so we can read it twice if needed
      const clonedResponse = res.clone();
      try {
        const jsonData = await res.json();
        return jsonData;
      } catch (jsonError) {
        console.error(`JSON parsing error for ${url}:`, jsonError);
        // Try to get the raw text from cloned response
        try {
          const responseText = await clonedResponse.text();
          console.error('Raw response text:', responseText);
          console.error('Response text length:', responseText.length);
          console.error('First 200 chars:', responseText.substring(0, 200));
        } catch (textError) {
          console.error('Could not read response text:', textError);
        }
        console.error('Response headers:', res.headers);
        console.error('Response status:', res.status);
        throw new Error(`Invalid JSON response: ${(jsonError as Error).message}`);
      }
    }
    
    return res;
  } catch (err) {
    console.error(`API error: ${options.method} ${url}`, err);
    throw err;
  }
}