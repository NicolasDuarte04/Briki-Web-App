/**
 * Analytics module for Briki
 */

// Define event categories for better organization
export enum EventCategory {
  // User engagement events (clicks, views, etc.)
  ENGAGEMENT = 'engagement',
  
  // User interaction events (form submissions, search, etc.)
  INTERACTION = 'interaction',
  
  // Conversion events (quote completion, plan purchase, etc.)
  CONVERSION = 'conversion',
  
  // Error events (API failures, validation errors, etc.)
  ERROR = 'error',
}

// Initialize Google Analytics when the app loads
export function initAnalytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.warn('Google Analytics Measurement ID not found. Analytics will not be tracked.');
    return;
  }
  
  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);
  
  // Initialize gtag
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
}

// Track page views - useful for single-page applications
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    return;
  }
  
  window.gtag('config', measurementId, {
    page_path: url,
  });
}

// Track events with category support
export function trackEvent(
  action: string,
  category: EventCategory,
  params?: Record<string, any>
) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }
  
  // Basic event tracking
  window.gtag('event', action, {
    event_category: category,
    ...params,
  });
  
  // For debugging in development
  if (import.meta.env.DEV) {
    console.log(`[Analytics] Event: ${action}`, {
      category,
      ...params,
    });
  }
}

// Track errors
export function trackError(
  errorType: string,
  errorMessage: string,
  errorDetails?: Record<string, any>
) {
  trackEvent('error', EventCategory.ERROR, {
    error_type: errorType,
    error_message: errorMessage,
    ...errorDetails,
  });
}

// Declare global type for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}