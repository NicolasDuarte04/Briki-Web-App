import { trackEvent, EventCategory } from '@/lib/analytics';

/**
 * Track when a user sends a message to the assistant
 * @param messageLength The length of the message
 * @param isQuestion Whether the message is a question
 */
export function trackMessageSent(messageLength: number, isQuestion: boolean) {
  trackEvent(
    'assistant_message_sent',
    EventCategory.ENGAGEMENT,
    isQuestion ? 'question' : 'statement',
    Math.min(Math.floor(messageLength / 10) * 10, 300) // Bucket message lengths (0-10, 11-20, etc, capped at 300)
  );
}

/**
 * Track when the assistant sends a response
 * @param responseLength The length of the response
 * @param processingTimeMs The time it took to process the request
 * @param hasWidget Whether the response includes a widget
 */
export function trackResponseReceived(
  responseLength: number,
  processingTimeMs: number,
  hasWidget: boolean
) {
  trackEvent(
    'assistant_response_received',
    EventCategory.ENGAGEMENT,
    hasWidget ? 'with_widget' : 'text_only',
    Math.min(Math.floor(processingTimeMs / 100) * 100, 10000) // Bucket processing times (0-100ms, 101-200ms, etc, capped at 10s)
  );

  // Track response length in a separate event
  trackEvent(
    'assistant_response_length',
    EventCategory.PERFORMANCE,
    'characters',
    Math.min(Math.floor(responseLength / 50) * 50, 2000) // Bucket response lengths (0-50, 51-100, etc, capped at 2000)
  );
}

/**
 * Track when a user gives feedback on a response
 * @param isPositive Whether the feedback was positive
 * @param hasComment Whether the user left a comment
 */
export function trackFeedbackGiven(
  isPositive: boolean,
  hasComment: boolean
) {
  trackEvent(
    'assistant_feedback_given',
    EventCategory.ENGAGEMENT,
    isPositive ? 'positive' : 'negative',
    hasComment ? 1 : 0
  );
}

/**
 * Track assistant-initiated actions like opening a quote flow
 * @param actionType The type of action
 * @param actionTarget The target of the action (e.g., the insurance category)
 */
export function trackAssistantAction(
  actionType: string,
  actionTarget: string
) {
  trackEvent(
    `assistant_action_${actionType}`,
    EventCategory.CONVERSION,
    actionTarget
  );
}

/**
 * Track when specific widgets are displayed
 * @param widgetType The type of widget
 * @param widgetContext Additional context about the widget
 */
export function trackWidgetDisplayed(
  widgetType: string,
  widgetContext: string
) {
  trackEvent(
    `assistant_widget_displayed`,
    EventCategory.ENGAGEMENT,
    widgetType
  );
}

/**
 * Track when users interact with widgets
 * @param widgetType The type of widget
 * @param interactionType The type of interaction
 */
export function trackWidgetInteraction(
  widgetType: string,
  interactionType: string
) {
  trackEvent(
    `assistant_widget_interaction`,
    EventCategory.ENGAGEMENT,
    `${widgetType}_${interactionType}`
  );
}