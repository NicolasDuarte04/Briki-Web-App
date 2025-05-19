/**
 * Utility for making API requests to the backend
 */

/**
 * Make an API request with proper error handling
 * @param url The URL to request
 * @param options Request options
 * @returns The response data
 */
export async function apiRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Accept': 'application/json',
      },
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    // Check if response is empty (204 No Content)
    if (response.status === 204) {
      return null;
    }

    // Parse JSON response
    return await response.json();
  } catch (error) {
    // Re-throw with improved message
    if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw new Error('Unknown API request error');
  }
}

/**
 * Make a GET request
 * @param url The URL to request
 * @param options Additional request options
 * @returns The response data
 */
export async function apiGet(url: string, options: Omit<RequestInit, 'method'> = {}) {
  return apiRequest(url, { ...options, method: 'GET' });
}

/**
 * Make a POST request
 * @param url The URL to request
 * @param data The data to send
 * @param options Additional request options
 * @returns The response data
 */
export async function apiPost(url: string, data: any, options: Omit<RequestInit, 'method' | 'body'> = {}) {
  return apiRequest(url, {
    ...options,
    method: 'POST',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Make a PUT request
 * @param url The URL to request
 * @param data The data to send
 * @param options Additional request options
 * @returns The response data
 */
export async function apiPut(url: string, data: any, options: Omit<RequestInit, 'method' | 'body'> = {}) {
  return apiRequest(url, {
    ...options,
    method: 'PUT',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Make a DELETE request
 * @param url The URL to request
 * @param options Additional request options
 * @returns The response data
 */
export async function apiDelete(url: string, options: Omit<RequestInit, 'method'> = {}) {
  return apiRequest(url, { ...options, method: 'DELETE' });
}