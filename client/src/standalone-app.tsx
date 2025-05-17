import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import './index.css';

// Create a new standalone QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Simple standalone component for demonstration
function SimpleComparePage() {
  const [selectedPlans, setSelectedPlans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch plans from localStorage on mount
  React.useEffect(() => {
    try {
      const data = localStorage.getItem('briki-compare-plans');
      if (data) {
        const parsed = JSON.parse(data);
        const plans = parsed.state && parsed.state.selectedPlans ? parsed.state.selectedPlans : [];
        setSelectedPlans(plans);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      setLoading(false);
    }
  }, []);

  // Function to clear all plans
  const clearPlans = () => {
    try {
      const data = localStorage.getItem('briki-compare-plans');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.state) {
          parsed.state.selectedPlans = [];
          localStorage.setItem('briki-compare-plans', JSON.stringify(parsed));
          setSelectedPlans([]);
        }
      }
    } catch (error) {
      console.error('Error clearing plans:', error);
    }
  };

  // Format price as currency
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return 'Not specified';
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <a href="/insurance/travel" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Plans
            </a>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Plan Comparison Tool
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              Compare different insurance plans side by side
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all selected plans?')) {
                clearPlans();
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-4 sm:mt-0"
            disabled={selectedPlans.length === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Clear All Plans
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Comparison Status
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Details about currently selected plans
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-gray-50 px-4 py-5 sm:px-6 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Selected Plans</h3>
                <p className="mt-1 flex items-center">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                    {selectedPlans.length}
                  </span>
                  <span>plans selected</span>
                </p>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:px-6 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Plan Categories</h3>
                <div className="mt-1">
                  {selectedPlans.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(selectedPlans.map((plan: any) => plan.category))).map((category) => (
                        <span key={category as string} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {category}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No plans selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedPlans.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {selectedPlans.map((plan: any) => (
              <div key={plan.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {plan.name || 'Plan ' + plan.id}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Category: {plan.category || 'Unknown'} • ID: {plan.id}
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Provider</h4>
                      <p className="mt-1 text-sm text-gray-900">{plan.provider || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Price</h4>
                      <p className="mt-1 text-sm text-gray-900">{formatPrice(plan.price)}</p>
                    </div>
                    {plan.description && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Description</h4>
                        <p className="mt-1 text-sm text-gray-900">{plan.description}</p>
                      </div>
                    )}
                    {plan.features && plan.features.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Features</h4>
                        <ul className="mt-1 space-y-1">
                          {plan.features.map((feature: string, index: number) => (
                            <li key={index} className="text-sm text-gray-900 flex">
                              <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white shadow overflow-hidden sm:rounded-lg py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No plans selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select plans from the insurance pages to compare them here.
            </p>
            <div className="mt-6">
              <a href="/insurance/travel" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Browse Insurance Plans
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main standalone app component
function StandaloneApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleComparePage />
      <Toaster />
    </QueryClientProvider>
  );
}

// Mount the app to the DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StandaloneApp />
  </React.StrictMode>
);