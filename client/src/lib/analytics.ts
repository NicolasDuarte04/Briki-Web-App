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

// Track events
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
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