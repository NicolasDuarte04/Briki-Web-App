import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`API request: ${method} ${url}`, data);
  
  // Get any existing cookies
  const cookies = document.cookie;
  console.log(`Cookies before ${method} ${url}:`, cookies);
  
  const requestOptions = {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      // Add cache control headers to prevent caching of auth responses
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "Accept": "application/json",
      // Explicitly indicate we want to support authentication cookies
      "X-Requested-With": "XMLHttpRequest"
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include" as RequestCredentials,
    mode: 'cors' as RequestMode,
  };
  
  try {
    const res = await fetch(url, requestOptions);
    console.log(`API response: ${method} ${url} status:`, res.status);
    
    // Check for and log Set-Cookie headers
    const setCookieHeader = res.headers.get('set-cookie');
    if (setCookieHeader) {
      console.log(`Set-Cookie header received from ${method} ${url}:`, setCookieHeader);
    }
    
    // Log cookies after response
    setTimeout(() => {
      console.log(`Cookies after ${method} ${url}:`, document.cookie);
    }, 100);
    
    await throwIfResNotOk(res);
    return res;
  } catch (err) {
    console.error(`API error: ${method} ${url}`, err);
    throw err;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    console.log(`Query request: ${queryKey[0]}`);
    
    // Get any existing cookies
    const cookies = document.cookie;
    console.log(`Cookies before query ${queryKey[0]}:`, cookies);
    
    try {
      // Use the apiRequest function to ensure consistent headers
      const res = await fetch(queryKey[0] as string, {
        method: 'GET',
        credentials: "include",
        mode: 'cors' as RequestMode,
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      
      console.log(`Query response: ${queryKey[0]} status:`, res.status);
      
      // Log cookies after response
      setTimeout(() => {
        console.log(`Cookies after query ${queryKey[0]}:`, document.cookie);
      }, 100);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log(`Query unauthorized: ${queryKey[0]}`);
        return null;
      }

      await throwIfResNotOk(res);
      
      try {
        const data = await res.json();
        console.log(`Query data received: ${queryKey[0]}`, 
                  data ? (typeof data === 'object' ? 'object data' : data) : 'no data');
        return data;
      } catch (parseError) {
        console.error(`Error parsing JSON from ${queryKey[0]}:`, parseError);
        return null;
      }
    } catch (err) {
      console.error(`Query error: ${queryKey[0]}`, err);
      throw err;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
