import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "./components/ui/toaster";
// import ComparePlansDebug from "./pages/compare-plans-debug"; // Module doesn't exist
import './index.css';

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Simple standalone app that only renders the compare plans page
// This bypasses complex auth systems and layouts
function StandaloneCompare() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <div>Compare Plans Debug - Module Not Found</div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

// Mount the app to the DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StandaloneCompare />
  </React.StrictMode>
);