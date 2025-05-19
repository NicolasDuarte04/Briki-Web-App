/**
 * Analytics utility module for tracking events
 */

// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export enum EventCategory {
  ENGAGEMENT = 'engagement',
  CONVERSION = 'conversion',
  ACTION = 'action',
  ERROR = 'error',
  CONTENT = 'content',
  NAVIGATION = 'navigation'
}

interface EventMetadata {
  [key: string]: any;
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
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
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
};

/**
 * Track an event in the analytics system
 * @param eventName Name of the event to track
 * @param category Category of the event (engagement, conversion, etc.)
 * @param label Optional label for additional context
 * @param value Optional numeric value associated with the event
 * @param metadata Optional additional metadata as key-value pairs
 */
export function trackEvent(
  eventName: string,
  category: EventCategory,
  label?: string,
  value?: number,
  metadata?: EventMetadata
): void {
  // Google Analytics tracking
  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: category,
      event_label: label,
      value: value,
      ...metadata
    });
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', {
      eventName,
      category,
      label,
      value,
      metadata
    });
  }
}