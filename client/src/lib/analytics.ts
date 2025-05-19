// No duplicate enum needed as there's one below

// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
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
  
  console.log('Google Analytics initialized with ID:', measurementId);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
  
  console.log('Page view tracked:', url);
};

// Track event categories
export enum EventCategory {
  USER = 'user',
  ENGAGEMENT = 'engagement',
  CONVERSION = 'conversion',
  INSURANCE = 'insurance',
  NAVIGATION = 'navigation',
  QUOTE = 'quote',
  ERROR = 'error'
}

// Track events with optional parameters
export const trackEvent = (
  action: string, 
  category: EventCategory | string, 
  label?: string, 
  value?: number,
  additionalParams?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const eventParams = {
    event_category: category,
    event_label: label,
    value: value,
    ...additionalParams
  };
  
  window.gtag('event', action, eventParams);
  console.log('Event tracked:', { action, category, label, value, ...additionalParams });
};