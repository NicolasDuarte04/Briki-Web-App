/**
 * Enhanced API utilities for making requests to the backend
 */

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
    const res = await fetch(url, requestOptions);
    
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
      return await res.json();
    }
    
    return res;
  } catch (err) {
    console.error(`API error: ${options.method} ${url}`, err);
    throw err;
  }
}