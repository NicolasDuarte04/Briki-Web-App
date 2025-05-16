/**
 * Analytics utility for tracking events in the Briki app
 * This module provides simple functions for tracking user interactions
 * and can be expanded to support multiple analytics providers
 */

// Track a specific event
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  try {
    // Check if gtag is available (Google Analytics)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
      
      console.log('[Analytics] Event tracked:', { action, category, label, value });
    } else {
      // If no analytics provider is available, log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics] Event (dev):', { action, category, label, value });
      }
    }
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
  }
};

// Track a page view
export const trackPageView = (url: string) => {
  try {
    // Check if gtag is available (Google Analytics)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const gaId = (window as any).GA_MEASUREMENT_ID;
      if (gaId) {
        (window as any).gtag('config', gaId, {
          page_path: url,
        });
        console.log('[Analytics] Page view tracked:', url);
      }
    } else {
      // If no analytics provider is available, log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics] Page view (dev):', url);
      }
    }
  } catch (error) {
    console.error('[Analytics] Error tracking page view:', error);
  }
};