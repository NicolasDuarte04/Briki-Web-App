/**
 * Analytics module for tracking user interactions
 */

// Event categories
export enum EventCategory {
  ENGAGEMENT = 'engagement',
  CONVERSION = 'conversion',
  ERROR = 'error',
  PERFORMANCE = 'performance',
  FEATURE = 'feature',
}

/**
 * Track an event in the analytics system
 * @param eventName Name of the event
 * @param category Category of the event
 * @param label Optional label for the event
 * @param value Optional numeric value associated with the event
 */
export function trackEvent(
  eventName: string,
  category: EventCategory = EventCategory.ENGAGEMENT,
  label?: string,
  value?: number
) {
  // Check if Google Analytics is available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Log to console in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName} (${category})${label ? ` - ${label}` : ''}${value !== undefined ? ` = ${value}` : ''}`);
  }
}

/**
 * Track a page view
 * @param path Path of the page
 */
export function trackPageView(path: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }

  // Log to console in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Page View: ${path}`);
  }
}

/**
 * Track a timing event
 * @param category Category of the timing
 * @param variable Variable being timed
 * @param time Time in milliseconds
 * @param label Optional label for the timing
 */
export function trackTiming(
  category: string,
  variable: string,
  time: number,
  label?: string
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: variable,
      value: time,
      event_category: category,
      event_label: label,
    });
  }

  // Log to console in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Timing - ${category} / ${variable}: ${time}ms${label ? ` (${label})` : ''}`);
  }
}

/**
 * Track an error
 * @param description Description of the error
 * @param fatal Whether the error was fatal
 */
export function trackError(description: string, fatal: boolean = false) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description,
      fatal,
    });
  }

  // Log to console in development environment
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Analytics] Error${fatal ? ' (Fatal)' : ''}: ${description}`);
  }
}