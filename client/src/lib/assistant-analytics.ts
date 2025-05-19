/**
 * Analytics for the AI Assistant
 * Tracks user interactions with the assistant
 */

// Categories for standardized event tracking
type EventCategory = 'assistant' | 'assistant_action';

/**
 * Track when the assistant button is clicked
 */
export function trackAssistantOpened() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'assistant_opened', {
      event_category: 'assistant',
      event_label: 'Assistant interface opened'
    });
  }
}

/**
 * Track when user sends a message to the assistant
 */
export function trackAssistantRequestSent(message: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    // We don't log the actual message content for privacy reasons
    // Just track that a message was sent
    window.gtag('event', 'message_sent', {
      event_category: 'assistant',
      event_label: 'User message sent'
    });
  }
}

/**
 * Track when assistant responds to the user
 */
export function trackAssistantResponseReceived(message: string, hasAction: boolean) {
  if (typeof window !== 'undefined' && window.gtag) {
    // Again, don't log actual message content
    window.gtag('event', 'response_received', {
      event_category: 'assistant',
      event_label: 'Assistant response received',
      has_action: hasAction ? 'yes' : 'no'
    });
  }
}

/**
 * Track when an error occurs in the assistant
 */
export function trackAssistantError(errorType: 'api_error' | 'client_error', errorMessage: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'assistant_error', {
      event_category: 'assistant',
      event_label: errorType,
      error_message: errorMessage.substring(0, 100) // Truncate for privacy
    });
  }
}

/**
 * Track when a user clicks on an assistant action
 */
export function trackAssistantActionClicked(actionType: string, actionDetail?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'action_clicked', {
      event_category: 'assistant_action',
      event_label: actionType,
      action_detail: actionDetail || 'none'
    });
  }
}

/**
 * Track when the assistant is minimized/closed
 */
export function trackAssistantClosed() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'assistant_closed', {
      event_category: 'assistant',
      event_label: 'Assistant interface closed'
    });
  }
}