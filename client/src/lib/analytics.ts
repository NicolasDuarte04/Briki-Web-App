/**
 * Analytics utility for tracking events in the Briki app
 * This module provides simple functions for tracking user interactions
 * and can be expanded to support multiple analytics providers
 */

/**
 * Track a specific event with flexible properties
 * 
 * @param eventName The name of the event to track
 * @param properties Optional properties/dimensions to include with the event
 */
export const trackEvent = (
  eventName: string,
  properties?: Record<string, string | number | boolean> | string | null
) => {
  try {
    // Support for older implementation signature
    let eventProps: Record<string, any> = {};
    
    if (typeof properties === 'string') {
      // Legacy format: Second param was category
      eventProps = { 
        event_category: properties
      };
    } else if (properties && typeof properties === 'object') {
      // New format: Pass properties as an object
      eventProps = properties;
    }
    
    // Check if gtag is available (Google Analytics)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, eventProps);
      console.log('[Analytics] Event tracked:', { eventName, properties: eventProps });
    } else {
      // If no analytics provider is available, log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics] Event (dev):', { eventName, properties: eventProps });
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