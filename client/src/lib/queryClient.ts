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
  
  const requestOptions = {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      // Add cache control headers to prevent caching of auth responses
      "Cache-Control": "no-cache",
      "Pragma": "no-cache"
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include" as RequestCredentials,
  };
  
  try {
    const res = await fetch(url, requestOptions);
    console.log(`API response: ${method} ${url} status:`, res.status);
    
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
    
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        }
      });
      
      console.log(`Query response: ${queryKey[0]} status:`, res.status);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log(`Query unauthorized: ${queryKey[0]}`);
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      console.log(`Query data received: ${queryKey[0]}`, 
                  data ? (typeof data === 'object' ? 'object data' : data) : 'no data');
      return data;
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
