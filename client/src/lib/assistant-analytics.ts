import { trackEvent, EventCategory } from './analytics';
import { v4 as uuidv4 } from 'uuid';

// Define specific event types for the AI Assistant
export enum AssistantEventType {
  // User interaction events
  USER_MESSAGE_SENT = 'user_message_sent',
  SUGGESTED_PROMPT_CLICKED = 'suggested_prompt_clicked',
  MEMORY_CLEARED = 'memory_cleared',
  
  // Assistant response events
  ASSISTANT_MESSAGE_SENT = 'assistant_message_sent',
  ASSISTANT_ACTION_TRIGGERED = 'assistant_action_triggered',
  
  // Feature usage events
  QUOTE_FLOW_LAUNCHED = 'quote_flow_launched_by_ai',
  GLOSSARY_TERM_OPENED = 'glossary_term_opened',
  VISUAL_EXPLAINER_DISPLAYED = 'visual_explainer_displayed',
  PLAN_RECOMMENDATION_SHOWN = 'plan_recommendation_shown',
  
  // Session lifecycle events
  SESSION_STARTED = 'assistant_session_started',
  SESSION_ENDED = 'assistant_session_ended'
}

// Storage key for the session ID
const SESSION_ID_KEY = 'briki_assistant_session_id';

/**
 * Generate or retrieve a persistent session ID for the assistant interaction
 */
export const getAssistantSessionId = (): string => {
  // Check if we already have a session ID in localStorage
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  
  // If no session ID exists, create one and store it
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  
  return sessionId;
};

/**
 * Reset the assistant session ID 
 * Call this when starting a new distinct session
 */
export const resetAssistantSessionId = (): string => {
  const newSessionId = uuidv4();
  localStorage.setItem(SESSION_ID_KEY, newSessionId);
  return newSessionId;
};

/**
 * Track an assistant-related event with appropriate metadata
 * This is non-blocking and won't interfere with app flow
 */
export const trackAssistantEvent = (
  eventType: AssistantEventType,
  metadata: Record<string, any> = {}
): void => {
  // Get or create session ID
  const sessionId = getAssistantSessionId();
  
  // Add timestamp and session ID to all events
  const enrichedMetadata = {
    ...metadata,
    timestamp: new Date().toISOString(),
    sessionId
  };
  
  // Track the event using the general tracking function
  // This is non-blocking as the trackEvent implementation doesn't return a Promise
  trackEvent(
    eventType,
    EventCategory.ENGAGEMENT,
    metadata.label || eventType,
    undefined,
    enrichedMetadata
  );
  
  // For development and testing, also log to console
  if (process.env.NODE_ENV !== 'production') {
    console.log('Assistant Event:', { 
      type: eventType,
      ...enrichedMetadata
    });
  }
};

/**
 * Start tracking an assistant session
 * Call this when the assistant page is first loaded
 */
export const startAssistantSession = (metadata: Record<string, any> = {}): void => {
  // Reset the session ID for a fresh session
  resetAssistantSessionId();
  
  // Track session start event
  trackAssistantEvent(AssistantEventType.SESSION_STARTED, metadata);
};

/**
 * End tracking an assistant session
 * Call this when the user leaves the assistant page
 */
export const endAssistantSession = (metadata: Record<string, any> = {}): void => {
  trackAssistantEvent(AssistantEventType.SESSION_ENDED, metadata);
};

/**
 * Track when a user sends a message to the assistant
 */
export const trackUserMessage = (message: string, metadata: Record<string, any> = {}): void => {
  // Don't include the full message content in analytics for privacy
  // Just include length and a sanitized content flag
  trackAssistantEvent(AssistantEventType.USER_MESSAGE_SENT, {
    ...metadata,
    messageLength: message.length,
    hasContent: message.trim().length > 0,
    // For topic analysis, we could add NLP-based categorization here
  });
};

/**
 * Track when the assistant sends a response
 */
export const trackAssistantResponse = (
  responseLength: number, 
  hasWidgets: boolean,
  hasAction: boolean,
  metadata: Record<string, any> = {}
): void => {
  trackAssistantEvent(AssistantEventType.ASSISTANT_MESSAGE_SENT, {
    ...metadata,
    responseLength,
    hasWidgets,
    hasAction
  });
};

/**
 * Track when an assistant action is triggered (e.g., navigation)
 */
export const trackAssistantAction = (
  actionType: string,
  metadata: Record<string, any> = {}
): void => {
  trackAssistantEvent(AssistantEventType.ASSISTANT_ACTION_TRIGGERED, {
    ...metadata,
    actionType
  });
};

/**
 * Track when a suggested prompt is clicked
 */
export const trackSuggestedPromptClick = (
  promptText: string,
  metadata: Record<string, any> = {}
): void => {
  trackAssistantEvent(AssistantEventType.SUGGESTED_PROMPT_CLICKED, {
    ...metadata,
    promptText
  });
};

/**
 * Track when a glossary term is displayed
 */
export const trackGlossaryTermDisplay = (
  term: string,
  metadata: Record<string, any> = {}
): void => {
  trackAssistantEvent(AssistantEventType.GLOSSARY_TERM_OPENED, {
    ...metadata,
    term
  });
};

/**
 * Track when a visual explainer is displayed
 */
export const trackVisualExplainerDisplay = (
  title: string,
  metadata: Record<string, any> = {}
): void => {
  trackAssistantEvent(AssistantEventType.VISUAL_EXPLAINER_DISPLAYED, {
    ...metadata,
    title
  });
};

/**
 * Track when a quote flow is launched from the assistant
 */
export const trackQuoteFlowLaunch = (
  category: string,
  metadata: Record<string, any> = {}
): void => {
  trackAssistantEvent(AssistantEventType.QUOTE_FLOW_LAUNCHED, {
    ...metadata,
    category
  });
};