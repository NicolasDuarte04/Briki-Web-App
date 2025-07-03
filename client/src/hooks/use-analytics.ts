import { useEffect } from 'react';
import { useNavigation } from '../lib/navigation';
import { initGA, trackPageView, trackEvent } from '../lib/analytics';
import { EventCategory } from '../constants/analytics';

export function useAnalytics() {
  const { location } = useNavigation();

  useEffect(() => {
    // Initialize GA if not already done
    if (typeof window !== 'undefined' && !window.gtag && import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
    }
  }, []);

  useEffect(() => {
    // Track page views
    trackPageView(location);
    
    // Track specific page categories
    if (location.startsWith('/insurance/')) {
      const category = location.split('/')[2];
      trackEvent('insurance_category_view', EventCategory.Navigation, category);
    } else if (location === '/ask-briki-ai') {
      trackEvent('ai_assistant_opened', EventCategory.AIAssistant, 'main_page');
    } else if (location.startsWith('/company')) {
      trackEvent('company_section_view', EventCategory.CompanyDashboard, location);
    }
  }, [location]);
}

// Export additional tracking functions for AI Assistant
export const trackAIAssistantEvent = (action: string, label?: string, value?: any) => {
  trackEvent(action, EventCategory.AIAssistant, label, value);
};

// Track plan interactions
export const trackPlanInteraction = (action: 'view' | 'compare' | 'quote' | 'purchase', planId: string, planName: string, provider: string) => {
  trackEvent(`plan_${action}`, EventCategory.PlanManagement, planName, {
    plan_id: planId,
    provider: provider,
    timestamp: new Date().toISOString()
  });
};

// Track conversion funnel
export const trackConversionStep = (step: 'landing' | 'category_select' | 'plan_view' | 'quote_start' | 'quote_complete' | 'purchase') => {
  trackEvent('conversion_funnel', EventCategory.Conversion, step, {
    step_number: ['landing', 'category_select', 'plan_view', 'quote_start', 'quote_complete', 'purchase'].indexOf(step) + 1
  });
}; 