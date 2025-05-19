/**
 * Analytics utility module for tracking events
 */

export enum EventCategory {
  ENGAGEMENT = 'engagement',
  CONVERSION = 'conversion',
  ACTION = 'action',
  ERROR = 'error',
  CONTENT = 'content'
}

interface EventMetadata {
  [key: string]: any;
}

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
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', {
      eventName,
      category,
      label,
      value,
      metadata
    });
  }
}