import { EventCategory } from '../constants/analytics';
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

// Track events with additional parameters support
type EventParams = Record<string, any>;

export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number | EventParams
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  // Check if value is an object (for additional parameters)
  if (typeof value === 'object') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      ...value
    });
  } else {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom company dashboard events
export const trackPlanUpload = (planCount: number, category: string) => {
  trackEvent('plan_upload', EventCategory.CompanyDashboard, category, planCount);
};

export const trackPlanView = (planId: string, planName: string) => {
  trackEvent('plan_view', EventCategory.PlanManagement, planName);
};

export const trackAnalyticsDashboardView = (companyId: number) => {
  trackEvent('analytics_dashboard_view', EventCategory.CompanyDashboard, `company_${companyId}`);
};

export const trackMarketplaceView = (companyId: number) => {
  trackEvent('marketplace_view', EventCategory.Marketplace, `company_${companyId}`);
};

/**
 * Tracks AI assistant plan interactions.
 * @param eventType - The type of interaction ('shown', 'clicked', 'purchased').
 * @param plan - The insurance plan object.
 * @param userId - Optional user ID.
 */
export const logPlanAnalytics = (
  eventType: 'plan_shown' | 'plan_clicked' | 'plan_purchased',
  plan: any,
  userId?: string | null
) => {
  const eventName = `assistant_${eventType}`;
  const metadata = {
    planId: plan.id,
    providerName: plan.provider,
    price: plan.basePrice || plan.price,
    category: plan.category,
    userId: userId || 'anonymous',
  };

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'AI Assistant',
      event_label: plan.name,
      ...metadata,
    });
  } else {
    console.log(`[Analytics] Event: ${eventName}`, metadata);
  }
};